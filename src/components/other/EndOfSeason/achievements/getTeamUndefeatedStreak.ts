 
import { Moment } from "moment";
import { IMatch, ITeam } from "../../../../models/model-interfaces";
import { TeamAchievementInfo } from "./achievement-models";

export function getTeamUndefeatedStreak(matches: IMatch[]): TeamAchievementInfo {
  const sortedMatches = matches
    .filter(match => match.shouldBePlayed && match.isSyncedWithFrenoy && match.isPlayed)
    .sort((a, b) => a.date.valueOf() - b.date.valueOf());

  interface TeamStreak {
    team: ITeam;
    currentStreak: number;
    currentFrom: Moment | null;
    longestStreak: number;
    longestFrom: Moment | null;
  }

  const streaksByTeam: Record<number, TeamStreak> = {};

  for (const match of sortedMatches) {
    if (!streaksByTeam[match.teamId]) {
      streaksByTeam[match.teamId] = {
        team: match.getTeam(),
        currentStreak: 0,
        currentFrom: null,
        longestStreak: 0,
        longestFrom: null,
      };
    }

    const streak = streaksByTeam[match.teamId];
    if (match.scoreType === 'Won') {
      if (streak.currentStreak === 0) {
        streak.currentFrom = match.date;
      }
      streak.currentStreak++;
      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
        streak.longestFrom = streak.currentFrom;
      }
    } else {
      streak.currentStreak = 0;
      streak.currentFrom = null;
    }
  }

  const streakers = Object.values(streaksByTeam).sort((a, b) => b.longestStreak - a.longestStreak);
  const longest = streakers[0]?.longestStreak ?? 0;
  const topTeams = Object.values(streaksByTeam).filter(t => t.longestStreak === longest);
  return {
    title: '👑 Streak Kings',
    desc: 'Langste reeks overwinningen',
    teams: topTeams.map(long => ({
      throphy: `won ${long.longestStreak} keer vanaf ${long.longestFrom?.format('D/M')}`,
      team: long.team,
    })),
  };
}
