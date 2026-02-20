 
import { IMatch, ITeam } from "../../../../models/model-interfaces";
import { TeamAchievementInfo } from "./achievement-models";

export function getPerfectFormation(matches: IMatch[]): TeamAchievementInfo {
  const formationWins: Record<string, { team: ITeam; count: number; players: string[] }> = {};

  const matchesWon = matches
    .filter(match => match.shouldBePlayed && match.isSyncedWithFrenoy && match.isPlayed && match.scoreType === 'Won');

  for (const match of matchesWon) {
    const players = match.getOwnPlayers();
    const playerIds = players.map(p => p.uniqueIndex).sort((a, b) => a - b);
    const playersKey = playerIds.join('-');

    if (!formationWins[playersKey]) {
      formationWins[playersKey] = {
        team: match.getTeam(),
        count: 0,
        players: players.map(ply => ply.alias),
      };
    }

    formationWins[playersKey].count++;
  }

  const allFormations = Object.values(formationWins);
  const highestCount = Math.max(0, ...allFormations.map(f => f.count));
  const topFormations = allFormations.filter(f => f.count === highestCount);
  return {
    title: '🏹 Perfect Formation',
    desc: 'Meeste zeges met opstelling',
    teams: topFormations.map(f => ({
      throphy: `${f.count} overwinningen met ${f.players.join(", ")}`,
      team: f.team,
    })),
  };
}
