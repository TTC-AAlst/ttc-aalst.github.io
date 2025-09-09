import { IMatch, IMatchPlayerInfo, ITeam, ITeamPlayerInfo } from "../../../models/model-interfaces";

export const tableMatchViewportWidths = {
  frenoyMatchId: 2000,
  other: 2000,
};


export const getTablePlayers = (team: ITeam) => {
  // Matches the sorting with the Excel output (which happens on the backend)
  const comp = team.competition === 'Sporta' ? 'sporta' : 'vttl';
  return team.getPlayers()
    .sort((a, b) => {
      const keyA = `${(a.type === 'Reserve' ? '1' : '0')}${a.player[comp]?.ranking}${a.player.alias}`;
      const keyB = `${(b.type === 'Reserve' ? '1' : '0')}${b.player[comp]?.ranking}${b.player.alias}`;
      return keyA.localeCompare(keyB);
    });
};

export const getPlayerFormation = (match: IMatch) => {
  if (match.block === 'Major' || match.block === 'Captain') {
    return match.getPlayerFormation(match.block);
  }
  return match.getPlayerFormation('Captain');
};

export function getRowStripeColor(index: number, match: IMatch, playerId: number, forceStriped: boolean) {
  if (playerId && !forceStriped) {
    const playsThisMatch = match.plays(playerId, 'onlyFinal');
    const playsThisTeam = match.getTeam().plays(playerId);
    return (playsThisMatch || playsThisTeam) ? '#f9f9f9' : undefined;
  }

  return index % 2 === 0 ? '#f9f9f9' : undefined;
}


export const toDontKnowPlayer = (match: IMatch, teamPlayer: ITeamPlayerInfo): IMatchPlayerInfo => ({
  id: teamPlayer.player.id,
  player: teamPlayer.player,
  matchPlayer: {
    id: 0,
    matchId: match.id,
    status: 'DontKnow',
    statusNote: '',
    position: 0,
    name: teamPlayer.player.name,
    ranking: teamPlayer.player[match.competition.toLowerCase()]?.ranking || '',
    uniqueIndex: 0,
    won: 0,
    home: true,
    playerId: teamPlayer.player.id,
    alias: teamPlayer.player.alias,
  },
});
