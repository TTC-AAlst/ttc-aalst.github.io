import moment from 'moment';
import t from '../locales';
import { IMatch } from '../models/model-interfaces';
import { config, devUrl, isDev } from '../config';

const LogRequestTimes = false;

export function getUrl(path, appendApi = true) {
  if (path[0] !== '/') {
    console.error('HttpClient: path passed should start with a /');
  }
  if (path.substring(0, 5) === '/api/') {
    console.error('HttpClient: path passed should not be prefixed with /api');
  }
  if (appendApi) {
    path = `/api${path}`;
  }

  return isDev()
    ? `${devUrl}${path}`
    : `${config.backend}${path}`;
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? {Authorization: `Bearer ${token}`} : {};
}

const HttpClient = {
  get: <T>(path: string, qs?: any): Promise<T> => {
    let url = getUrl(path);
    if (qs) {
      url += `?${new URLSearchParams(qs).toString()}`;
    }
    const fullUrl = `GET ${qs ? `${path}?${new URLSearchParams(qs).toString()}` : path}`;
    return (async () => {
      if (LogRequestTimes) {
        console.time(fullUrl);
      }

      const response = await fetch(url, {
        headers: {Accept: 'application/json', ...authHeaders()},
      });

      if (LogRequestTimes) {
        console.timeEnd(fullUrl);
      }

      return response.json();
    })();
  },
  post: <T>(url: string, data?: any): Promise<T> => {
    const fullUrl = `POST ${url}`;
    return (async () => {
      if (LogRequestTimes) {
        console.time(fullUrl);
      }

      const response = await fetch(getUrl(url), {
        method: 'POST',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json', ...authHeaders()},
        body: data !== undefined ? JSON.stringify(data) : undefined,
      });

      if (LogRequestTimes) {
        console.timeEnd(fullUrl);
      }

      return response.json();
    })();
  },
  upload: async (file: File, type = 'temp', typeId = 0): Promise<{fileName?: string}> => {
    const formData = new FormData();
    formData.append('uploadType', type);
    formData.append('uploadTypeId', String(typeId));
    formData.append('file', file);

    const response = await fetch(getUrl('/upload'), {
      method: 'POST',
      headers: {Accept: 'application/json', ...authHeaders()},
      body: formData,
    });

    if (!response.ok) {
      console.error('/upload FAIL', response.status, response.statusText);
      throw new Error(`Upload failed: ${response.status}`);
    }

    return response.json();
  },
  uploadImage: async (imageBase64: string, dataId: number, type: string): Promise<any> => {
    const response = await fetch(getUrl('/upload/image'), {
      method: 'POST',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json', ...authHeaders()},
      body: JSON.stringify({image: imageBase64, dataId, type}),
    });

    if (!response.ok) {
      console.error('/upload/image', response.status, response.statusText);
      throw new Error(`Image upload failed: ${response.status}`);
    }

    return response.json();
  },
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

  const blob = new Blob(byteArrays as BlobPart[], {type: contentType});
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

async function downloadJson(path: string): Promise<string> {
  const response = await fetch(getUrl(path), {
    headers: {Accept: 'application/json', ...authHeaders()},
  });
  return response.json();
}

export const downloadPlayersExcel = async (fileName: string): Promise<void> => {
  const body = await downloadJson('/players/ExcelExport');
  downloadExcel(body, fileName, true);
};

export const downloadScoresheetExcel = async (match: IMatch): Promise<void> => {
  const body = await downloadJson(`/matches/ExcelScoresheet/${match.id}`);
  const fileName = t('comp.scoresheetFileName', {
    frenoyId: match.frenoyMatchId.replace('/', '-'),
    teamCode: match.getTeam().teamCode,
    theirClub: match.getOpponentClub()?.name,
    theirTeam: match.opponent.teamCode,
  });
  downloadExcel(body, fileName);
};

export const downloadTeamsExcel = async (fileName: string): Promise<void> => {
  const body = await downloadJson('/teams/ExcelExport');
  downloadExcel(body, fileName, true);
};

export default HttpClient;
