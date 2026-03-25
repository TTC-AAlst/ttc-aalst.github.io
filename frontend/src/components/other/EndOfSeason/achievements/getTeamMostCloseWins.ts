 
import { IMatch, ITeam } from "../../../../models/model-interfaces";
import { TeamAchievementInfo } from "./achievement-models";

export function getTeamMostCloseWins(matches: IMatch[]): TeamAchievementInfo {
  const filtered = matches.filter(m => m.shouldBePlayed && m.isSyncedWithFrenoy && m.isPlayed);

  const closeWinStats: Record<number, {
    team: ITeam;
    count: number;
  }> = {};

  for (const match of filtered) {
    const { home, out } = match.score;
    const vttlWin = match.competition === 'Vttl' && ((home === 9 && out === 6) || (home === 6 && out === 9));
    const sportaWin = match.competition === 'Sporta' && ((home === 6 && out === 4) || (home === 4 && out === 6));

    if (match.scoreType === 'Won' && (vttlWin || sportaWin)) {
      if (!closeWinStats[match.teamId]) {
        closeWinStats[match.teamId] = {
          team: match.getTeam(),
          count: 0,
        };
      }

      closeWinStats[match.teamId].count++;
    }
  }

  const sortedTeams = Object.values(closeWinStats).sort((a, b) => b.count - a.count);
  const best = sortedTeams[0]?.count ?? 0;
  const topTeams = sortedTeams.filter(team => team.count === best);
  return {
    title: '🧊 Cool Under Pressure',
    desc: 'Meeste nipte overwinningen',
    teams: topTeams.map(team => ({
      throphy: `${team.count} overwinningen`,
      team: team.team,
    })),
  };
}
