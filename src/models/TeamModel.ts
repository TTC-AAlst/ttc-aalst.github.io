import moment from 'moment';
import storeUtil from '../storeUtil';
import {TeamFrenoyModel} from './TeamFrenoyModel';
import {ITeam, Competition, ITeamOpponent, ITeamPlayer, ITeamRanking, ITeamFrenoy, teamPlayerType,
  IPlayer, IMatch, ITeamPlayerInfo, ITeamPlayerStats,
  IStoreTeam} from './model-interfaces';

export default class TeamModel implements ITeam {
  competition: Competition;
  divisionName: string;
  id: number;
  teamCode: string;
  clubId: number;
  year: number;
  opponents: ITeamOpponent[];
  players: ITeamPlayer[];
  ranking: ITeamRanking[];
  frenoy: ITeamFrenoy;

  constructor(json: IStoreTeam) {
    this.competition = json.competition; // 'Sporta' or 'Vttl' or 'Jeugd'
    this.divisionName = json.divisionName;
    this.id = json.id;
    this.teamCode = json.teamCode;
    this.clubId = json.clubId;
    this.year = json.year;
    this.opponents = json.opponents; // : {teamCode: A-Z, clubId: number}[]
    this.players = json.players; // : {playerId: number, type: teamPlayerType}[]
    this.ranking = json.ranking; // : {clubId, teamCode, isForfait, position, points, gamesWon, gamesDraw, gamesLost}[]
    this.frenoy = new TeamFrenoyModel(json.frenoy, this);
  }

  getTeamPlayerCount(): 2 | 3 | 4 {
    if (this.competition === 'Jeugd') {
      return 2;
    }
    return this.competition === 'Vttl' ? 4 : 3;
  }

  getScoreCount(): 16 | 10 | 5 {
    if (this.competition === 'Jeugd') {
      return 5;
    }
    return this.competition === 'Vttl' ? 16 : 10;
  }

  renderOwnTeamTitle(): string {
    return `${this.competition} ${this.teamCode}`;
  }

  getDivisionDescription(): string {
    // TODO: put in translations
    if (this.competition === 'Jeugd') {
      return `Afdeling ${this.divisionName}`;
    }

    if (!this.divisionName) {
      return 'Ere Afdeling';
    }
    return `Prov ${this.divisionName}`;
  }

  getDivisionRanking(opponent: 'our-ranking' | ITeamOpponent | undefined = 'our-ranking'): ITeamRanking & {empty: false} | {empty: true} {
    if (opponent === 'our-ranking') {
      return this.getDivisionRanking({clubId: this.clubId, teamCode: this.teamCode});
    }
    const result = this.ranking.find(x => x.clubId === opponent.clubId && (!opponent.teamCode || x.teamCode === opponent.teamCode));
    if (!result) {
      return {empty: true};
    }
    return {...result, empty: false};
  }

  getThriller(match: IMatch): undefined | 'topMatch' | 'degradationMatch' {
    if (match.date.isBefore(moment())) {
      return undefined;
    }
    const ourRanking = this.getDivisionRanking();
    const theirRanking = this.getDivisionRanking(match.opponent);
    if (ourRanking.empty || theirRanking.empty) {
      return undefined;
    }
    const teamsInDivision = this.ranking.length;

    const gamesPlayed = ourRanking.gamesWon + ourRanking.gamesLost + ourRanking.gamesDraw;
    if (gamesPlayed < 5) {
      return undefined;
    }

    if (ourRanking.position <= 3 && theirRanking.position <= 3) {
      return 'topMatch';
    } if (ourRanking.position >= teamsInDivision - 2 && theirRanking.position >= teamsInDivision - 2) {
      return 'degradationMatch';
    }
    return undefined;
  }

  isCaptain(player: IPlayer): boolean {
    return !!this.players.find(x => x.type === teamPlayerType.captain && x.playerId === player.id);
  }

  getCaptainPlayerIds(): number[] {
    return this.players.filter(x => x.type === teamPlayerType.captain).map(x => x.playerId);
  }

  getPlayers(type?: 'reserve' | 'standard'): ITeamPlayerInfo[] {
    let {players} = this;
    if (type === 'reserve') {
      players = players.filter(ply => ply.type === teamPlayerType.reserve);
    } else if (type === 'standard') {
      players = players.filter(ply => ply.type !== teamPlayerType.reserve);
    }

    const plys = players.map(ply => ({
      player: storeUtil.getPlayer(ply.playerId),
      type: ply.type,
    }));

    return plys.sort(sortMappedPlayers(this.competition));
  }

  plays(playerId: number): boolean {
    return !!this.players.find(ply => ply.playerId === playerId);
  }

  getMatches(): IMatch[] {
    return storeUtil.matches.getAllMatches()
      .filter(match => match.teamId === this.id);
  }

  getPlayerStats(): ITeamPlayerStats[] {
    const matches = this.getMatches().filter(m => m.isSyncedWithFrenoy);
    return getPlayerStats(matches);
  }

  isTopper(opponent?: ITeamOpponent): boolean {
    const ranking = this.getDivisionRanking(opponent);
    return ranking.empty ? false : ranking.position < 3;
  }

  isInDegradationZone(opponent?: ITeamOpponent): boolean {
    const ranking = this.getDivisionRanking(opponent);
    return ranking.empty ? false : ranking.position >= (this.ranking.length - 2);
  }
}

export function getPlayerStats(matches: IMatch[], withBelles = false): ITeamPlayerStats[] {
  // ATTN: There are tests for this one...
  const result: {[playerId: number]: ITeamPlayerStats} = {};
  matches.forEach(match => {
    const gameResults = match.getGameMatches();
    // const homeOrOut = match.isHomeMatch ? 'home' : 'out';

    gameResults.forEach(game => {
      const playerId = game.ownPlayer.playerId || 0;
      const isDoubles = !playerId;

      if (playerId === 0) {
        // TODO: Doubles issues, see MatchModel
        // console.log('yaye', gameResults.toArray());
        // console.log('uhoh-', game, playerId, storeUtil.getPlayer(playerId));
        return;
      }

      if (!result[playerId]) {
        result[playerId] = {
          ply: storeUtil.getPlayer(playerId) || {},
          won: {},
          lost: {},
          games: 0,
          victories: 0,
          isDoubles,
          belles: {},
          belleVictories: 0,
          belleGames: 0,
        };
      }

      const playerResult = result[playerId];
      playerResult.games++;
      if (game.outcome === 'Won') {
        playerResult.victories++;
      }

      if (!isDoubles) {
        // Singles WIN
        const otherPlayer = game[!match.isHomeMatch ? 'home' : 'out'];
        if (game.outcome === 'Won') {
          if (!playerResult.won[otherPlayer.ranking]) {
            playerResult.won[otherPlayer.ranking] = 0;
          }
          playerResult.won[otherPlayer.ranking]++;

        } else {
          // Singles LOST
          if (!playerResult.lost[otherPlayer.ranking]) {
            playerResult.lost[otherPlayer.ranking] = 0;
          }
          playerResult.lost[otherPlayer.ranking]++;
        }

        // Belles?
        if (withBelles && (game.homeSets === 2 || game.outSets === 2)) {
          playerResult.belleGames++;
          if (!playerResult.belles[otherPlayer.ranking]) {
            playerResult.belles[otherPlayer.ranking] = {won: 0, lost: 0};
          }
          if (game.outcome === 'Won') {
            playerResult.belles[otherPlayer.ranking].won++;
            playerResult.belleVictories++;
          } else {
            playerResult.belles[otherPlayer.ranking].lost++;
          }
        }
      }
    });
  });

  return Object.keys(result).map(key => result[key]);
}


export function sortMappedPlayers(competition: Competition): (plyA: ITeamPlayerInfo, plyB: ITeamPlayerInfo) => number {
  return (plyA, plyB) => {
    const aComp = plyA.player.getCompetition(competition);
    const bComp = plyB.player.getCompetition(competition);
    if (!aComp || !aComp.position) {
      return -1;
    }
    if (!bComp || bComp.position) {
      return 1;
    }

    if (plyA.type === plyB.type) {
      return aComp.position - bComp.position;
    }

    if (plyA.type === teamPlayerType.captain || plyB.type === teamPlayerType.reserve) {
      return -1;
    }
    if (plyB.type === teamPlayerType.captain || plyA.type === teamPlayerType.reserve) {
      return 1;
    }
    return aComp.position - bComp.position;
  };
}
