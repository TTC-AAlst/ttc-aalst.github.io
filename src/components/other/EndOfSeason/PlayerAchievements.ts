import { Competition, IMatch, IMatchPlayer, IPlayer, ITeamPlayerStats } from '../../../models/model-interfaces';
import { getRankingValue } from '../../../models/utils/playerRankingValueMapper';
import rankingSorter, { PlayerRanking } from '../../../models/utils/rankingSorter';
import storeUtil from '../../../storeUtil';

const getPerGames = cur => Math.floor((cur.victories / cur.games) * 1000) / 10;


export type AchievementInfo = {
  title: string;
  desc: string;
  players: {
    throphy: string;
    player: IPlayer;
  }[];
}


export function getMostMatchesWon(playerStats: ITeamPlayerStats[]): AchievementInfo {
  const highest = playerStats.reduce((acc, cur) => (acc.victories > cur.victories ? acc : cur), playerStats[0]);
  const players = playerStats.filter(cur => cur.victories === highest.victories);

  return {
    title: 'Krijgsheer',
    desc: 'Meest aantal gewonnen matchen',
    players: players.map(cur => ({
      throphy: `${cur.victories} gewonnen matchen`,
      player: cur.ply,
    })),
  };
}

function getHighestJumper(competition: Competition, playerStats: ITeamPlayerStats[]): AchievementInfo {
  const calculateRankingJump = (currentRanking: PlayerRanking, nextRanking: PlayerRanking): number => {
    const rankDiff = rankingSorter(currentRanking, nextRanking);
    return rankDiff;
  };

  const playersWithJumps = playerStats.map(player => {
    const {ranking, nextRanking} = player.ply.getCompetition(competition);
    if (!nextRanking) {
      return undefined;
    }

    const jump = calculateRankingJump(ranking, nextRanking);
    return {
      player: player.ply,
      ranking,
      nextRanking,
      jump,
    };
  });

  const sortedPlayers = playersWithJumps
    .filter(player => player !== undefined)
    .map(player => player!)
    .filter(player => player.jump > 0)
    .sort((a, b) => b.jump - a.jump);

  if (sortedPlayers.length === 0) {
    return {
      title: 'Springer',
      desc: 'Grootste klassement stijging',
      players: [],
    };
  }

  const highestJump = sortedPlayers[0].jump;
  const highestJumpPlayers = sortedPlayers.filter(player => player.jump === highestJump);
  return {
    title: 'Springer',
    desc: 'Grootste klassement stijging',
    players: highestJumpPlayers.map(player => ({
      throphy: `${player.ranking} 🠖 ${player.nextRanking}`,
      player: player.player,
    })),
  };
}


export function getMostMatchesPercentageWon(comp: Competition, playerStats: ITeamPlayerStats[]): AchievementInfo {
  const sortedPlayers = [...playerStats].sort((a, b) => getPerGames(b) - getPerGames(a));

  const highestPercentage = getPerGames(sortedPlayers[0]);
  let highestPlayers = sortedPlayers.filter(player => getPerGames(player) === highestPercentage);

  const allHighestAreARanking = highestPlayers.every(player => player.ply.getCompetition(comp).ranking === 'A');
  if (allHighestAreARanking) {
    const secondHighestPercentage = getPerGames(
      sortedPlayers.find(player => getPerGames(player) < highestPercentage) || sortedPlayers[0],
    );

    highestPlayers = highestPlayers.concat(
      sortedPlayers.filter(player => getPerGames(player) === secondHighestPercentage),
    );
  }

  return {
    title: 'The Destroyer',
    desc: 'Hoogst % gewonnen matchen',
    players: highestPlayers.map(cur => ({
      throphy: `${getPerGames(cur)}% gewonnen`,
      player: cur.ply,
    })),
  };
}




export function getRankingDestroyer(competition: Competition, playerStats: ITeamPlayerStats[]): AchievementInfo {
  const getValue = r => getRankingValue(competition, r);

  const result = playerStats.map(ps => {
    const ownRanking = ps.ply.getCompetition(competition).ranking;
    const ownValue = getValue(ownRanking);

    const highestWon = Object.entries(ps.won).reduce((acc, [ranking]) => (getValue(acc) > getValue(ranking) ? acc : ranking), 'NG');

    return {
      player: ps.ply,
      difference: getValue(highestWon) - ownValue,
      throphy: `${ownRanking} vs ${ps.won[highestWon]}x${highestWon}`,
    };
  });

  const highest = result.reduce((acc, cur) => (acc.difference > cur.difference ? acc : cur), result[0]);

  const players = result.filter(cur => cur.difference === highest.difference);

  return {
    title: 'Klassement Vernietiger',
    desc: 'Grootste klassement verschil',
    players: players.map(cur => ({
      throphy: cur.throphy,
      player: cur.player,
    })),
  };
}




export function getMostBellesPlayed(playerStats: ITeamPlayerStats[]): AchievementInfo {
  const highest = playerStats.reduce((acc, cur) => (acc.belleGames > cur.belleGames ? acc : cur), playerStats[0]);

  const players = playerStats.filter(cur => cur.belleGames === highest.belleGames);
  return {
    title: 'Grootste uitslover',
    desc: 'Meeste belles gespeeld',
    players: players.map(cur => ({
      throphy: `${cur.belleGames} belles (${Math.floor((cur.belleVictories / cur.belleGames) * 100)}% gewonnen)`,
      player: cur.ply,
    })),
  };
}



export function getMostBellesWon(playerStats: ITeamPlayerStats[]): AchievementInfo {
  const highest = playerStats.reduce((acc, cur) => (acc.belleVictories > cur.belleVictories ? acc : cur), playerStats[0]);

  const players = playerStats.filter(cur => cur.belleVictories === highest.belleVictories);
  return {
    title: 'Meest Koelbloedig',
    desc: 'Meeste belles gewonnen',
    players: players.map(cur => ({
      throphy: `${cur.belleVictories} belles (${Math.floor((cur.belleVictories / cur.belleGames) * 100)}% gewonnen)`,
      player: cur.ply,
    })),
  };
}


export function getMostBellesPercentageWon(playerStats: ITeamPlayerStats[]): AchievementInfo {
  const getPer = cur => Math.floor((cur.belleVictories / cur.belleGames) * 1000) / 10;

  const highest = playerStats.reduce((acc, cur) => {
    if (!acc.belleGames) {
      return cur;
    }
    if (!cur.belleGames) {
      return acc;
    }
    return getPer(acc) > getPer(cur) ? acc : cur;
  }, playerStats[0]);

  const players = playerStats.filter(cur => getPer(cur) === getPer(highest));
  return {
    title: 'Onderste uit de kan',
    desc: 'Meeste belles % gewonnen',
    players: players.map(cur => ({
      throphy: `${getPer(cur)}% gewonnen belles (${cur.belleGames} belles)`,
      player: cur.ply,
    })),
  };
}



export function getMostBellesPercentageLost(playerStats: ITeamPlayerStats[]): AchievementInfo {
  const getPer = cur => Math.floor((cur.belleVictories / cur.belleGames) * 1000) / 10;

  const highest = playerStats.reduce((acc, cur) => {
    if (!acc.belleGames) {
      return cur;
    }
    if (!cur.belleGames) {
      return acc;
    }
    if (getPer(acc) === getPer(cur)) {
      return acc.belleGames > cur.belleGames ? acc : cur;
    }
    return getPer(acc) < getPer(cur) ? acc : cur;
  }, playerStats[0]);

  return {
    title: 'Grootste Pechvogel',
    desc: 'Meest verloren belles',
    players: [{
      throphy: `${getPer(highest)}% gewonnen belles (${highest.belleGames} gespeeld)`,
      player: highest.ply,
    }],
  };
}



export function getMostGamesPlayer(playerStats: ITeamPlayerStats[]): AchievementInfo {
  const highest = playerStats.reduce((acc, cur) => (acc.games > cur.games ? acc : cur), playerStats[0]);

  const players = playerStats.filter(cur => cur.games === highest.games);
  return {
    title: 'Altijd Paraat',
    desc: 'Meeste aantredingen',
    players: players.map(cur => ({
      throphy: `${cur.games} aantredingen (${Math.floor((cur.victories / cur.games) * 100)}% gewonnen)`,
      player: cur.ply,
    })),
  };
}


export function getMostNetjesTegen(playerStats: ITeamPlayerStats[]): AchievementInfo {
  const gerdo = playerStats.find(x => x.ply.alias === 'Gerdo')!;
  return {
    title: 'Meeste netjes tegen',
    desc: '',
    players: [{
      throphy: '+Infinity',
      player: gerdo.ply,
    }],
  };
}


export function getMostMatchesAllWon(competition: Competition, playerStats: ITeamPlayerStats[], matches: IMatch[]): AchievementInfo {
  const toWinCount = matches[0].getTeamPlayerCount();

  const playerIds = matches.reduce((acc, cur) => {
    const fullWin = cur.getOwnPlayers().filter(p => p.won === toWinCount);
    if (fullWin.length) {
      acc = acc.concat(fullWin.map(p => p.playerId));
    }
    return acc;
  }, [] as number[]);


  let playerWins = playerIds.reduce((acc, id) => {
    let existing = acc.find(x => x.id === id);
    if (!existing) {
      existing = {id, ply: storeUtil.getPlayer(id), wins: 0};
      acc.push(existing);
    }
    existing.wins++;
    return acc;
  }, [] as {id: number, ply: IPlayer, wins: number}[]);


  playerWins = playerWins.sort((a, b) => b.wins - a.wins);
  const highest = playerWins[0];
  let players = playerWins.filter(cur => cur.wins === highest.wins);

  const allHighestAreARanking = players.every(player => player.ply.getCompetition(competition).ranking === 'A');
  if (allHighestAreARanking) {
    const secondHighestWins = playerWins.find(player => player.wins < highest.wins)?.wins || highest.wins;
    players = players.concat(playerWins.filter(player => player.wins === secondHighestWins));
  }

  return {
    title: 'Topdagen',
    desc: '',
    players: players.map(cur => ({
      throphy: `${cur.wins} matchen alle ${toWinCount} gewonnen`,
      player: cur.ply,
    })),
  };
}

const allAchievements: {[key: string]: ((playerStats: ITeamPlayerStats[], matches: IMatch[]) => AchievementInfo)[]} = {
  Vttl: [
    getHighestJumper.bind(this, 'Vttl'),
    getMostMatchesWon,
    getMostMatchesPercentageWon.bind(this, 'Vttl'),
    getMostGamesPlayer,
    getRankingDestroyer.bind(this, 'Vttl'),
    getMostMatchesAllWon.bind(this, 'Vttl'),
    getMostNetjesTegen,
  ],
  Sporta: [
    getHighestJumper.bind(this, 'Sporta'),
    getMostMatchesWon,
    getMostMatchesPercentageWon.bind(this, 'Sporta'),
    getMostGamesPlayer,
    getRankingDestroyer.bind(this, 'Sporta'),
    getMostMatchesAllWon.bind(this, 'Sporta'),
  ],
  belles: [
    getMostBellesWon,
    getMostBellesPercentageWon,
    getMostBellesPercentageLost,
    getMostBellesPlayed,
  ],
};

export default allAchievements;
