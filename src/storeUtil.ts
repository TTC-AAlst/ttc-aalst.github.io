import {store} from './store';
import {getRankingValue} from './models/utils/playerRankingValueMapper';
import {ITeam, IClub, IPlayer, IMatch, IMatchPlayer, ITeamOpponent} from './models/model-interfaces';
import PlayerModel from './models/PlayerModel';
import TeamModel from './models/TeamModel';
import MatchModel from './models/MatchModel';

/** How many players of a ranking beat */
export interface IOpponentFormationRankingInfo {
  ranking: string;
  amount: number;
}

export interface IOponnentFormation {
  key: string;
  details: IOpponentFormationRankingInfo[];
  amount: number;
  value: number;
}

const createKey = (form: IOpponentFormationRankingInfo[]): string => form.reduce((key, f) => key + f.amount + f.ranking, '');

export function getOpponentFormations(matches: IMatch[], opponent?: ITeamOpponent): IOponnentFormation[] {
  return matches.filter(match => match.isSyncedWithFrenoy).reduce((acc: IOponnentFormation[], match) => {
    let isHomeTeam: boolean;
    if (!opponent) {
      isHomeTeam = true;
    } else {
      isHomeTeam = match.home.clubId === opponent.clubId && match.home.teamCode === opponent.teamCode;
    }
    const formation = getMatchPlayerRankings(match, isHomeTeam);

    const exists = acc.find(form => form.key === createKey(formation));
    if (!exists) {
      acc.push({
        key: createKey(formation),
        details: formation,
        amount: 1,
        value: formation.reduce((total, {ranking, amount}) => total + (amount * getRankingValue(match.competition, ranking)), 0),
      });

    } else {
      exists.amount++;
    }
    return acc;
  }, []);
}


const unique = (value: any, index: number, self: any[]): boolean => self.indexOf(value) === index;

export function getMatchPlayerRankings(match: IMatch, homeTeam: boolean): IOpponentFormationRankingInfo[] {
  let opponentFormation: IMatchPlayer[];
  if (homeTeam) {
    opponentFormation = match.players.filter(m => m.home);
  } else {
    opponentFormation = match.players.filter(m => !m.home);
  }
  const rankings = opponentFormation.map(ply => ply.ranking);
  const diffs = rankings.filter(unique);
  return diffs.map((ranking: string) => ({
    ranking,
    amount: rankings.reduce((prev, cur) => prev + (cur === ranking ? 1 : 0), 0),
  }));
}

// TODO: This stuff should be done with selectors:
// Components using these functions will not update
// when the state changes...
// Since this stuff does not typically change a lot
// it's not a big deal.

const util = {
  getTeam(teamId: number): ITeam {
    const {teams} = store.getState();
    const singleTeam = teams.find(team => team.id === teamId)!;
    return new TeamModel(singleTeam);
  },
  getTeams(): ITeam[] {
    const {teams} = store.getState();
    return teams.map(team => new TeamModel(team));
  },

  getClub(clubId: number): IClub {
    const {clubs} = store.getState();
    return clubs.find(club => club.id === clubId)!;
  },

  getPlayer(playerId: number): IPlayer {
    const {players} = store.getState();
    const player = players.find(ply => ply.id === playerId)!;
    return new PlayerModel(player);
  },

  getMatch(matchId: number): IMatch {
    const {matches} = store.getState();
    const match = matches.find(m => m.id === matchId)!;
    return new MatchModel(match);
  },
  getMatches(): IMatch[] {
    const {matches} = store.getState();
    return matches.map(m => new MatchModel(m));
  },

  matches: {
    getAllMatches(): IMatch[] {
      return util.getMatches();
    },
  },
};

export default util;
