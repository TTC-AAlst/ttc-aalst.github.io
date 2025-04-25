/* eslint-disable no-restricted-syntax */
import { IMatch, ITeam } from "../../../../models/model-interfaces";
import { TeamAchievementInfo } from "./achievement-models";

export function getTeamHighestWinPercentage(matches: IMatch[]): TeamAchievementInfo {
  const filtered = matches.filter(m => m.shouldBePlayed && m.isSyncedWithFrenoy && m.isPlayed);

  const winStats: Record<number, {
    team: ITeam;
    total: number;
    wins: number;
  }> = {};

  for (const match of filtered) {
    if (!winStats[match.teamId]) {
      winStats[match.teamId] = {
        team: match.getTeam(),
        total: 0,
        wins: 0,
      };
    }

    winStats[match.teamId].total++;
    if (match.scoreType === 'Won') {
      winStats[match.teamId].wins++;
    }
  }

  const ranked = Object.values(winStats)
    .map(s => ({...s, percentage: s.wins / s.total}))
    .sort((a, b) => b.percentage - a.percentage);

  const result: TeamAchievementInfo = {
    title: '🐺 Top Dogs',
    desc: 'Hoogste % overwinningen',
    teams: [],
  };

  const best = ranked[0];
  if (best) {
    result.teams = [{
      throphy: `${(best.percentage * 100).toFixed(1)}% gewonnen over ${best.total} matchen`,
      team: best.team,
    }];
  }

  return result;
}
