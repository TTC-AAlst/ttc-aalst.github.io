import keyMirror from 'fbjs/lib/keyMirror';
import moment from 'moment';
import storeUtil from '../storeUtil';
import {IPlayer, ITeam, IMatch} from './model-interfaces';

export const userRoles = ['Player', 'Board', 'Dev', 'System'];

const security = keyMirror({
  CAN_MANAGETEAM: '',
  CAN_EDITALLREPORTS: '',
  IS_ADMIN: '',
  IS_DEV: '',
  IS_SYSTEM: '',
});

export interface IUser {
  playerId: number;
  teams: number[];
  _security: string[];

  playsIn(teamId: number): boolean;
  getPlayer(): IPlayer;
  getTeams(): ITeam[];
  can(what: string): boolean;
  canManageTeams(): boolean;
  canEditMatchesOrIsCaptain(): boolean;
  canEditMatchPlayers(match: IMatch): boolean;
  canEditPlayersOnMatchDay(match: IMatch): boolean;
  canPostReport(teamId: number): boolean;
  canChangeMatchScore(match: IMatch): boolean;
  isAdmin: () => boolean;
  isDev(): boolean;
  isSystem(): boolean;
}

export default class UserModel implements IUser {
  playerId: number;
  teams: number[];
  _security: string[];

  constructor(json) {
    this.playerId = json.playerId;
    this.teams = json.teams; // : number[]
    this._security = json.security;
  }

  playsIn(teamId: number): boolean {
    return this.teams.indexOf(teamId) !== -1;
  }

  getPlayer(): IPlayer {
    return storeUtil.getPlayer(this.playerId);
  }

  getTeams(): ITeam[] {
    return this.teams.map(storeUtil.getTeam);
  }

  can(what: string): boolean {
    return this._security.indexOf(what) !== -1;
  }

  canManageTeams(): boolean {
    return this.can(security.CAN_MANAGETEAM);
  }

  canEditMatchesOrIsCaptain(): boolean {
    if (this.can(security.CAN_MANAGETEAM)) {
      return true;
    }

    // eslint-disable-next-line prefer-spread
    const captains: number[] = [].concat.apply([], this.getTeams().map(team => team.getCaptainPlayerIds()));
    return captains.indexOf(this.playerId) !== -1;
  }

  canEditMatchPlayers(match: IMatch): boolean {
    if (match.isSyncedWithFrenoy) {
      return false;
    }

    if (this.can(security.CAN_MANAGETEAM)) {
      return true;
    }

    const isCaptain = match.getTeam().isCaptain(this.getPlayer());
    if (!isCaptain) {
      return false;
    }

    if (match.block === 'Major') {
      return false;
    }

    return true;
  }

  canEditPlayersOnMatchDay(match: IMatch) {
    if (this.isAdmin()) {
      return true;
    }

    return this.playerId && match.date.isSame(moment(), 'day');
  }

  canPostReport(teamId: number): boolean {
    return this.playsIn(teamId) || this.can(security.CAN_EDITALLREPORTS);
  }

  canChangeMatchScore(match: IMatch): boolean {
    if (match.isSyncedWithFrenoy) {
      return false;
    }
    return this.playsIn(match.teamId) || this.isAdmin() || !!match.players.find(p => p.playerId === this.playerId);
  }

  isAdmin(): boolean {
    return this.can(security.IS_ADMIN);
  }

  isDev(): boolean {
    return this.can(security.IS_DEV);
  }

  isSystem(): boolean {
    return this.can(security.IS_SYSTEM);
  }
}
