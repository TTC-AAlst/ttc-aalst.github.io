import { Competition, ITeamPlayerStats, IMatch, IPlayer } from "../../../../models/model-interfaces";
import { AchievementInfo } from "./otherAchievements";

export function getMostTeamsParticipated(competition: Competition, playerStats: ITeamPlayerStats[], matches: IMatch[]): AchievementInfo {
  const relevantMatches = matches.filter(match => match.competition === competition && match.shouldBePlayed && match.isSyncedWithFrenoy);

  const playerTeams: Record<number, {
    teams: Set<string>,
    player: IPlayer
  }> = {};

  playerStats.forEach(stat => {
    playerTeams[stat.ply.getCompetition(competition).uniqueIndex] = {
      teams: new Set<string>(),
      player: stat.ply,
    };
  });

  relevantMatches.forEach(match => {
    const ownPlayers = match.getOwnPlayers();
    const team = match.getTeam();

    ownPlayers.forEach(player => {
      const playerStat = playerTeams[player.uniqueIndex];
      if (playerStat && team) {
        playerStat.teams.add(team.teamCode);
      }
    });
  });

  const joinThem = (arr: string[]) => {
    if (arr.length <= 1) {
      return arr.join('');
    }

    return `${arr.slice(0, -1).join(', ')} en ${arr[arr.length - 1]}`;
  };


  const teamsArray = Object.values(playerTeams)
    .map(item => ({
      player: item.player,
      teamCount: item.teams.size,
      teams: joinThem(Array.from(item.teams).sort()),
    }))
    .sort((a, b) => b.teamCount - a.teamCount);

  const highestTeamCount = teamsArray[0].teamCount;
  const highestTeamPlayers = teamsArray.filter(player => player.teamCount === highestTeamCount);
  return {
    title: 'De Kameleon',
    desc: 'Aantredingen in meeste teams',
    players: highestTeamPlayers.map(player => ({
      throphy: `speelde in ${player.teams}`,
      player: player.player,
    })),
  };
}
