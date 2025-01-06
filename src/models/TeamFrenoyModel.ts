import {ITeamFrenoy, Competition, ITeam} from './model-interfaces';

// https://competitie.vttl.be/?menu=4&season=18&province=5&club_id=282&div_id=3275_A&week_name=03
// https://competitie.vttl.be/?menu=4&div_id=3275_A&modif=0&week_name=03

export class TeamFrenoyModel implements ITeamFrenoy {
  divisionId: number;
  linkId: string;
  teamId: string;
  seasonId: number;
  teamCompetition: Competition;

  constructor(frenoy: ITeamFrenoy, team: ITeam) {
    this.divisionId = frenoy.divisionId;
    this.linkId = frenoy.linkId;
    this.teamId = frenoy.teamId;
    this.seasonId = team.year - 2000 + 1;
    this.teamCompetition = team.competition;
  }

  getUrl(type: 'results' | 'ranking'): string {
    const season = this.seasonId;
    const {linkId} = this;
    if (this.teamCompetition === 'Vttl' || this.teamCompetition === 'Jeugd') {
      // ATTN: Hardcoded province/club ids here!
      if (type === 'results') {
        return `https://competitie.vttl.be/?menu=4&season=${season}&province=5&club_id=282&perteam=1&div_id=${linkId}`;
      } if (type === 'ranking') {
        return `https://competitie.vttl.be/?menu=5&season=${season}&province=5&club_id=282&div_id=${linkId}`;
      }
    } else if (this.teamCompetition === 'Sporta') {
      if (type === 'results') {
        return `https://ttonline.sporta.be/?menu=4&season=${season}&province=4&club_id=37&perteam=1&div_id=${linkId}`;
      } if (type === 'ranking') {
        return `https://ttonline.sporta.be/?menu=5&season=${season}&province=4&club_id=37&perteam=1&div_id=${linkId}`;
      }
    }
    throw new Error('Unknown TeamFrenoyModel.getUrl type');
  }

  getWeekUrl(weekName: number): string {
    const paddedWeekName = weekName < 10 ? `0${weekName}` : weekName;
    if (this.teamCompetition === 'Vttl' || this.teamCompetition === 'Jeugd') {
      // eslint-disable-next-line
      return `https://competitie.vttl.be/?menu=4&season=${this.seasonId}&province=5&club_id=282&div_id=${this.linkId}&modif=0&week_name=${paddedWeekName}`;
    }
    // eslint-disable-next-line
    return `https://ttonline.sporta.be/?menu=4&season=${this.seasonId}&province=4&club_id=37&div_id=${this.linkId}&modif=0&week_name=${paddedWeekName}`;
  }
}
