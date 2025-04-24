import { IMatch, ITeam } from "../../../../models/model-interfaces";
import { TeamAchievementInfo } from "./achievement-models";

export function getCleanSweepTeams(matches: IMatch[]): TeamAchievementInfo {
  const cleanSweepCounts: Record<number, { team: ITeam, count: number }> = {};

  matches.forEach(match => {
    if (!match.shouldBePlayed || !match.isSyncedWithFrenoy || !match.isPlayed || match.scoreType !== 'Won') {
      return;
    }

    if (match.score.home !== 0 && match.score.out !== 0) {
      return;
    }

    if (!cleanSweepCounts[match.teamId]) {
      cleanSweepCounts[match.teamId] = {
        team: match.getTeam(),
        count: 0,
      };
    }
    cleanSweepCounts[match.teamId].count++;
  });

  const cleanSweeps = Object.values(cleanSweepCounts).sort((a, b) => b.count - a.count);
  const topCount = cleanSweeps[0]?.count ?? 0;

  const result: TeamAchievementInfo = {
    title: '🧹 Clean Sweep',
    desc: 'Alle matchen gewonnen',
    teams: [],
  };
  if (topCount === 0) {
    return result;
  }

  const topTeams = cleanSweeps.filter(team => team.count === topCount);
  result.teams = topTeams.map(team => ({
    throphy: `${team.count} keer overgewalst`,
    team: team.team,
  }));

  return result;
}
