import { ITeam } from "../../../models/model-interfaces";

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
