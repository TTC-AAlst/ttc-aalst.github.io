import { config, getStaticFileUrl } from '../config';
import storeUtil from '../storeUtil';
import {IPlayer, IPlayerContact, IPlayerCompetition, IPlayerStyle, Competition, ITeam, MatchPlayerStatus} from './model-interfaces';
import { UserRoles } from './UserModel';


export default class PlayerModel implements IPlayer {
  alias: string;
  contact: IPlayerContact;
  id: number;
  active: boolean;
  firstName: string;
  lastName: string;
  sporta: IPlayerCompetition;
  vttl: IPlayerCompetition;
  style: IPlayerStyle;
  quitYear: number;
  security: UserRoles;
  hasKey: boolean;
  imageVersion: number;

  constructor(json: any = {security: 'Player'}) {
    this.alias = json.alias || json.name || '';
    this.contact = new PlayerContactModel(json.contact || {}); // playerId, email, mobile, address, city
    this.id = json.id;
    this.active = json.active;
    this.firstName = json.firstName;
    this.lastName = json.lastName;
    this.sporta = json.sporta; // clubId, competition, frenoyLink, position (=index), ranking, rankingIndex, rankingValue
    this.vttl = json.vttl;
    this.style = json.style || {}; // playerId, name, bestStroke
    this.quitYear = json.quitYear;
    this.security = json.security;
    this.hasKey = json.hasKey;
    this.imageVersion = json.imageVersion;
  }

  get name(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get slug(): string {
    return this.name.toLowerCase().replace(/\s/g, '-');
  }

  getCompetition(competition: Competition): IPlayerCompetition {
    const comp = competition === 'Vttl' || competition === 'Jeugd' ? this.vttl : this.sporta;
    return comp || {};
  }

  getTeam(competition: Competition): ITeam {
    const teams = this.getTeams().filter(team => team.competition === competition);
    return teams[0];
  }

  getTeams(): ITeam[] {
    const teams = storeUtil.getTeams()
      .filter(team => team.players.some(tp => tp.playerId === this.id && (tp.type === 'Captain' || tp.type === 'Standard')));

    return teams;
  }
}


export function displayMobile(n: string): string {
  if (!n) {
    return '';
  }
  return n.replace(/^(\d{3,4})(\d{2})(\d{2})(\d{2})$/, '$1/$2 $3 $4');
}


class PlayerContactModel implements IPlayerContact {
  playerId: number;
  email: string;
  mobile: string;
  address: string;
  city: string;

  constructor(contact: IPlayerContact) {
    this.playerId = contact.playerId;
    this.email = contact.email;
    this.mobile = contact.mobile;
    this.address = contact.address;
    this.city = contact.city;
  }

  getMobile(): string {
    return displayMobile(this.mobile);
  }
}


export const playerUtils = {
  getPlayerImageSize(): {width: number, height: number} {
    return {
      width: 200,
      height: 200,
    };
  },
  getPlayerAvatarImageSize(): {width: number, height: number} {
    return {
      width: 40,
      height: 40,
    };
  },
  getImageUrl(playerId: number, version: number): string {
    return getStaticFileUrl(`/img/players/${playerId}.png?${version}`);
  },
  getAvatarImageUrl(playerId: number, version: number): string {
    return getStaticFileUrl(`/img/players/${playerId}_avatar.png?${version}`);
  },
};

export function createFrenoyLink(comp: IPlayerCompetition): string {
  // old and reliable but with frenoyLink that needs to be fetched manually
  if (!comp.frenoyLink) {
    return createFrenoyLinkByUniqueId(comp.competition, comp.uniqueIndex);
  }
  if (comp.competition === 'Vttl' || comp.competition === 'Jeugd') {
    return `https://competitie.vttl.be/?menu=6&result=1&sel=${comp.frenoyLink}`;
  }
  return `https://ttonline.sporta.be/?menu=6&result=1&sel=${comp.frenoyLink}`;

}

export function createFrenoyLinkByUniqueId(comp: Competition, uniqueId: number): string {
  // new and restfull but may contains glitches
  if (comp === 'Vttl' || comp === 'Jeugd') {
    return `https://competitie.vttl.be/${uniqueId}`;
  }
  return `https://ttonline.sporta.be/${(`000000${uniqueId}`).slice(-6)}`;
}

export function getPlayingStatusClass(playingStatus?: MatchPlayerStatus | ''): undefined | 'success' | 'danger' | 'info' | 'warning' {
  if (!playingStatus) {
    return undefined;
  }

  switch (playingStatus) {
    case 'Play':
    case 'Major':
      return 'success';
    case 'Captain':
      return 'warning';
    case 'NotPlay':
      return 'danger';
    case 'Maybe':
      return 'info';
    default:
      return undefined;
  }
}


export function getPlayingStatusColor(playingStatus?: {status: MatchPlayerStatus}): null | string {
  if (!playingStatus) {
    return null;
  }

  switch (playingStatus.status) {
    case 'Play':
    case 'Major':
    case 'Captain':
      return '#FFB00F';
    case 'NotPlay':
      return '#c9302c';
    case 'Maybe':
      return '#31b0d5';
    default:
      return null;
  }
}
