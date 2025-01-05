import {store} from './store';
import {getRankingValue} from './models/utils/playerRankingValueMapper';
import {ITeam, IClub, IPlayer, IMatch, IMatchPlayer, ITeamOpponent, Competition, IFullMatchOther} from './models/model-interfaces';
import UserModel, {IUser} from './models/UserModel';
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

export function getOpponentMatchesForTeam(competition: Competition, clubId: number, teamCode?: string): IMatch[] {
  return store.getState().readonlyMatches
    .filter(m => m.competition === competition)
    .filter(m => m.home && m.away)
    .filter(m => !teamCode || (m.home.clubId === clubId && m.home.teamCode === teamCode) || (m.away.clubId === clubId && m.away.teamCode === teamCode))
    .filter(m => m.shouldBePlayed)
    .sort((a, b) => a.date.valueOf() - b.date.valueOf())
    .map(m => new MatchModel(m));
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




function getOpponentMatches(match: IMatch, opponentIn?: ITeamOpponent): {home: IMatch[], away: IMatch[]} {
  const opponent = opponentIn || match.opponent;
  const matches = store.getState().readonlyMatches
    .filter(x => x.competition === match.competition && x.frenoyDivisionId === match.frenoyDivisionId);

  return {
    home: matches.filter(m => m.home.clubId === opponent.clubId && (!opponent.teamCode || m.home.teamCode === opponent.teamCode)),
    away: matches.filter(m => m.away.clubId === opponent.clubId && (!opponent.teamCode || m.away.teamCode === opponent.teamCode)),
  };
}

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
    getTodayMatches(): IMatch[] {
      return util.getMatches().filter(cal => cal.isBeingPlayed());
    },
    getFromOpponent(match: IMatch) {
      const result = getOpponentMatches(match);
      return result.away.concat(result.home);
    },

    getAllMatches(): IMatch[] {
      return util.getMatches();
    },

    getFormation(match: IMatch, opponent?: ITeamOpponent) {
      const matches = getOpponentMatches(match, opponent);
      let opponentPlayers: IMatchPlayer[] = matches.home.map(m => m.players).flat().filter(m => m.home);
      opponentPlayers = opponentPlayers.concat(matches.away.map(m => m.players).flat().filter(m => !m.home));

      // TODO: this assumes that if you forfeited, you lost that match (ply has won but not lost property)
      // could be calculated more correctly by looking at the individual match results
      const result: {[key: number]: IMatchFormation} = {};
      opponentPlayers.forEach(ply => {
        if (result[ply.uniqueIndex]) {
          result[ply.uniqueIndex].count++;
          result[ply.uniqueIndex].won += +ply.won || 0;

        } else {
          result[ply.uniqueIndex] = {
            player: ply,
            count: 1,
            won: +ply.won || 0,
          };
        }
      });

      const matchesPerPlayer = match.getTeamPlayerCount();
      return Object.values(result).map(ply => Object.assign(ply, {lost: (matchesPerPlayer * ply.count) - ply.won}));
    },
  },
};

export interface IMatchFormation {
  player: IMatchPlayer;
  count: number;
  won: number;
}

export default util;
