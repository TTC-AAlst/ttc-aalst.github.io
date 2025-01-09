/* eslint-disable arrow-body-style */
import request from 'superagent';
import moment from 'moment';
import t from '../locales';
import { IMatch } from '../models/model-interfaces';
import { config, devUrl } from '../config';

const LogRequestTimes = false;

export function getUrl(path, appendApi = true) {
  if (path[0] !== '/') {
    console.error('HttpClient: path passed should start with a /');
  }
  if (path.substring(0, 5) === '/api/') {
    console.error('HttpClient: path passed should not be prefixed with /api');
  }
  if (appendApi) {
    // eslint-disable-next-line no-param-reassign
    path = `/api${path}`;
  }

  return window.location.hostname !== 'localhost'
    ? `${config.backend}${path}`
    : `${devUrl}${path}`;
}

function bearer(req) {
  const token = localStorage.getItem('token');
  if (token) {
    req.set('Authorization', `Bearer ${token}`);
  }
}

const HttpClient = {
  download: (path: string) => request.get(getUrl(path)).accept('json').use(bearer),
  get: <T>(path: string, qs?: any): Promise<T> => {
    const fullUrl = `GET ${qs ? `${path}?${new URLSearchParams(qs).toString()}` : path}`;
    return (async () => {
      if (LogRequestTimes) {
        console.time(fullUrl);
      }

      const response = await request
        .get(getUrl(path))
        .query(qs)
        .use(bearer)
        .accept('application/json');

      if (LogRequestTimes) {
        console.timeEnd(fullUrl);
      }

      return response.body;
    })();
  },
  post: <T>(url: string, data?: any): Promise<T> => {
    const fullUrl = `POST ${url}`;
    return (async () => {
      if (LogRequestTimes) {
        console.time(fullUrl);
      }

      const response = await request
        .post(getUrl(url))
        .send(data)
        .use(bearer)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');

      if (LogRequestTimes) {
        console.timeEnd(fullUrl);
      }

      return response.body;
    })();
  },
  upload: (file: File, type = 'temp', typeId = 0) => new Promise<{fileName?: string}>((resolve, reject) => {
    const req = request
      .post(getUrl('/upload'))
      .accept('application/json')
      .use(bearer)
      .field('uploadType', type)
      .field('uploadTypeId', typeId)
      .attach('file', file);

    req.end((err, res) => {
      if (err || !res.ok) {
        console.error('/upload FAIL', err || '', res); // eslint-disable-line
        reject();
      } else {
        resolve(res.body);
      }
    });
  }),
  uploadImage: (imageBase64: string, dataId: number, type: string) => new Promise((resolve, reject) => {
    request
      .post(getUrl('/upload/image'))
      .send({image: imageBase64, dataId, type})
      .use(bearer)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        if (err || !res.ok) {
          console.error('/upload/image', err || '', res); // eslint-disable-line
          reject();
        } else {
          resolve(res.body);
        }
      });
  }),
};

function b64ToBlob(b64Data: string, contentType = '', sliceSize = 512) {
  contentType = contentType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  const byteCharacters = atob(b64Data);
  const byteArrays = [] as Uint8Array[];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

function downloadExcel(respBody: string, fileName: string, addTimestampToFileName = false) {
  const blob = b64ToBlob(respBody);
  if (addTimestampToFileName) {
    fileName += ` ${moment().format('YYYY-MM-DD')}.xlsx`;
  }

  const link = document.createElement('a');
  link.download = fileName;
  link.href = URL.createObjectURL(blob);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
}


export const downloadPlayersExcel = async (fileName: string): Promise<void> => {
  const res = await HttpClient.download('/players/ExcelExport');
  downloadExcel(res.body, fileName, true);
};


export const downloadScoresheetExcel = (match: IMatch) => {
  return HttpClient.download(`/matches/ExcelScoresheet/${match.id}`).then(res => {
    // fileName: '{frenoyId} Sporta {teamCode} vs {theirClub} {theirTeam}.xlsx',
    const fileName = t('comp.scoresheetFileName', {
      frenoyId: match.frenoyMatchId.replace('/', '-'),
      teamCode: match.getTeam().teamCode,
      theirClub: match.getOpponentClub()?.name,
      theirTeam: match.opponent.teamCode,
    });

    downloadExcel(res.body, fileName);
  });
};

export const downloadTeamsExcel = (fileName: string) => {
  return HttpClient.download('/teams/ExcelExport').then(res => {
    downloadExcel(res.body, fileName, true);
  });
};

export default HttpClient;
