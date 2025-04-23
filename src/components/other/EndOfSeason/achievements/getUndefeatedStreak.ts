import { Moment } from "moment";
import { Competition, IMatch, IPlayer, ITeamPlayerStats } from "../../../../models/model-interfaces";
import { AchievementInfo } from "./otherAchievements";

export function getUndefeatedStreak(competition: Competition, playerStats: ITeamPlayerStats[], matches: IMatch[]): AchievementInfo {
  const sortedMatches = matches
    .filter(match => match.competition === competition && match.shouldBePlayed && match.isSyncedWithFrenoy)
    .sort((a, b) => a.date.valueOf() - b.date.valueOf());

  const playerStreaks: Record<number, {
    currentStreak: number,
    currentFrom: Moment | null,
    longestStreak: number,
    longestFrom: Moment | null,
    player: IPlayer,
  }> = {};

  playerStats.forEach(stat => {
    playerStreaks[stat.ply.getCompetition(competition).uniqueIndex] = {
      currentStreak: 0,
      currentFrom: null,
      longestStreak: 0,
      longestFrom: null,
      player: stat.ply,
    };
  });

  sortedMatches.forEach(match => {
    const ourPlayers = match.getOwnPlayers().map(player => player.uniqueIndex);

    [...match.games].sort((a, b) => a.matchNumber - b.matchNumber).forEach(game => {
      const playerUniqueIndex = ourPlayers.includes(game.homePlayerUniqueIndex)
        ? game.homePlayerUniqueIndex : game.outPlayerUniqueIndex;

      const playerStat = playerStreaks[playerUniqueIndex];
      if (playerStat) {
        if (game.outcome === 'Lost') {
          playerStat.currentStreak = 0;
          playerStat.currentFrom = null;
        } else if (game.outcome === 'Won') {
          if (playerStat.currentStreak === 0) {
            playerStat.currentFrom = match.date;
          }

          playerStat.currentStreak++;

          if (playerStat.currentStreak > playerStat.longestStreak) {
            playerStat.longestStreak = playerStat.currentStreak;
            playerStat.longestFrom = playerStat.currentFrom;
          }
        }
      }
    });
  });

  const result: AchievementInfo = {
    title: 'On a roll',
    desc: 'Langste reeks opeenvolgende overwinningen',
    players: [],
  };

  const streaksArray = Object.values(playerStreaks).sort((a, b) => b.longestStreak - a.longestStreak);
  if (streaksArray.length === 0) {
    return result;
  }

  const highestStreak = streaksArray[0].longestStreak;
  let highestStreakPlayers = streaksArray.filter(player => player.longestStreak === highestStreak);

  const allHighestAreARanking = highestStreakPlayers.every(player => player.player.getCompetition(competition).ranking === 'A');
  if (allHighestAreARanking && streaksArray.length > highestStreakPlayers.length) {
    const secondHighestStreak = streaksArray.find(player => player.longestStreak < highestStreak)?.longestStreak || 0;
    const secondHighestPlayers = streaksArray.filter(player => player.longestStreak === secondHighestStreak);
    highestStreakPlayers = highestStreakPlayers.concat(secondHighestPlayers);
  }

  result.players = highestStreakPlayers.map(player => ({
    throphy: `${player.longestStreak} matchen vanaf ${player.longestFrom!.format('D/M')}`,
    player: player.player,
  }));
  return result;
}
