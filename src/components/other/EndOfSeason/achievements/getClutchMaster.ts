/* eslint-disable no-restricted-syntax */
import { AchievementInfo } from "./otherAchievements";
import { Competition, IMatch, ITeamPlayerStats } from "../../../../models/model-interfaces";

export function getClutchMaster(competition: Competition, playerStats: ITeamPlayerStats[], matches: IMatch[]): AchievementInfo {
  const clutchCounts: Record<number, { count: number, player: ITeamPlayerStats["ply"] }> = {};

  const sortedMatches = matches
    .filter(m => m.shouldBePlayed && m.isSyncedWithFrenoy && m.isPlayed && m.scoreType === 'Won' && m.competition === competition);

  for (const match of sortedMatches) {
    const requiredPoints = match.competition === 'Sporta' ? 6 : 9;

    if (match.score.home === requiredPoints) {
      let ourPoints = 0;
      let theirPoints = 0;
      const games = [...match.games].sort((a, b) => a.matchNumber - b.matchNumber);

      for (const game of games) {
        const weWon = game.outcome === 'Won';

        if (weWon) ourPoints++;
        else theirPoints++;

        if (ourPoints === requiredPoints) {
          const ourPlayers = match.getOwnPlayers().map(ply => ply.uniqueIndex);
          let playerUniqueIndex: number | null = null;
          if (ourPlayers.includes(game.homePlayerUniqueIndex)) {
            playerUniqueIndex = game.homePlayerUniqueIndex;
          } else if (ourPlayers.includes(game.outPlayerUniqueIndex)) {
            playerUniqueIndex = game.outPlayerUniqueIndex;
          }

          if (playerUniqueIndex) {
            if (!clutchCounts[playerUniqueIndex]) {
              const player = playerStats.find(stats => stats.ply.getCompetition(competition).uniqueIndex === playerUniqueIndex);
              if (player) {
                clutchCounts[playerUniqueIndex] = { count: 1, player: player.ply };
              }
            } else {
              clutchCounts[playerUniqueIndex].count++;
            }
          }

          break;
        }
      }
    }
  }

  const sorted = Object.values(clutchCounts).sort((a, b) => b.count - a.count);
  const result: AchievementInfo = {
    title: '🧨 Clutch Master',
    desc: 'Zorgde voor de overwinning',
    players: [],
  };

  if (sorted.length === 0) {
    return result;
  }

  const topCount = sorted[0].count;
  const topPlayers = sorted.filter(p => p.count === topCount);
  result.players = topPlayers.map(p => ({
    throphy: `${p.count} keer het beslissende punt`,
    player: p.player,
  }));

  return result;
}
