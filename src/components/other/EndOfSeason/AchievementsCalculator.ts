import {getPlayerStats} from '../../../models/TeamModel';
import PlayerAchievements, { AchievementInfo } from './PlayerAchievements';
import {getRankingValue} from '../../../models/utils/playerRankingValueMapper';
import {IPlayer, IMatch, ITeam, Competition, ITeamPlayerStats} from '../../../models/model-interfaces';

export type NewPlayerRanking = {
  ply: IPlayer;
  old: string;
  oldValue: number;
  new: string | null;
  newValue: number;
}

export class AchievementsCalculator {
  players: IPlayer[];
  matches: IMatch[];
  teams: ITeam[];
  playerStats: ITeamPlayerStats[];
  vttlPlayerStats: ITeamPlayerStats[];
  sportaplayerStats: ITeamPlayerStats[];
  sportaMatches: IMatch[];
  vttlMatches: IMatch[];

  constructor(players: IPlayer[], matches: IMatch[], teams: ITeam[]) {
    this.players = players;
    this.matches = matches.filter(x => x.isSyncedWithFrenoy).sort((a, b) => a.date.valueOf() - b.date.valueOf());
    this.teams = teams;
    this.playerStats = getPlayerStats(this.matches, true).filter(x => x.ply.id);

    const vttlMatches = this.matches.filter(m => m.competition === 'Vttl' || m.competition === 'Jeugd');
    this.vttlPlayerStats = getPlayerStats(vttlMatches, true).filter(x => x.ply.id);

    const sportaMatches = this.matches.filter(m => m.competition === 'Sporta');
    this.sportaplayerStats = getPlayerStats(sportaMatches, true).filter(x => !x.isDoubles).filter(x => x.ply.id);

    // this.sportaTeams = this.teams.filter(t => t.competition === 'Sporta');
    // this.vttlTeams = this.teams.filter(t => t.competition === 'Vttl' || t.competition === 'Jeugd');

    this.sportaMatches = this.matches.filter(t => t.competition === 'Sporta');
    this.vttlMatches = this.matches.filter(t => t.competition === 'Vttl' || t.competition === 'Jeugd');

    // console.log('matches', this.teams);
    // console.log('yaye', this.vttlMatches);
  }

  getTopRankedTeams() {
    return this.teams.reduce((acc, cur) => {
      const ranking = cur.getDivisionRanking();
      if (!ranking.empty && ranking.position === 1) {
        acc.push(cur);
      }
      return acc;
    }, [] as ITeam[]);
  }

  getAchievements(type: Competition | 'belles') {
    const {playerStats, matches} = this.getPlayerStats(type);
    if (playerStats.length !== 0) {
      return PlayerAchievements[type].reduce((acc, achievementGetter) => {
        const achievement = achievementGetter(playerStats, matches);
        if (achievement.players.length > 0) {
          acc = acc.concat(achievement);
        }
        return acc;
      }, [] as AchievementInfo[]);
    }
    return [];
  }

  getNewRanking(competition: Competition): NewPlayerRanking[] {
    const players = this.players
      .filter(player => player.getCompetition(competition))
      .map(player => {
        const result: Partial<NewPlayerRanking> = {
          ply: player,
          old: player.getCompetition(competition).ranking,
          new: player.getCompetition(competition).nextRanking,
        };
        if (result.old) {
          result.oldValue = getRankingValue(competition, result.old);
        }
        if (result.new) {
          result.newValue = getRankingValue(competition, result.new);
        }
        return result as NewPlayerRanking;
      })
      .filter(x => x.old && x.new && x.old !== x.new)
      .sort((a, b) => (a.oldValue - a.newValue) - (b.oldValue - b.newValue));

    return players;
  }

  getPlayerStats(type: Competition | 'belles'): {playerStats: ITeamPlayerStats[], matches: IMatch[]} {
    switch (type) {
      case 'Vttl':
        return {playerStats: this.vttlPlayerStats, matches: this.vttlMatches};

      case 'Sporta':
        return {playerStats: this.sportaplayerStats, matches: this.sportaMatches};

      case 'belles':
      default:
        return {playerStats: this.playerStats, matches: this.matches};
    }
  }
}
