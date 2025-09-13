import React from 'react';
import PlayerAvatar from '../../players/PlayerAvatar';
import { IPlayer, ITeam } from '../../../models/model-interfaces';
import { t } from '../../../locales';

type TeamPlayerAvatarsProps = {
  team: ITeam;
  style?: React.CSSProperties;
}

const getSortKey = (player: IPlayer, team: ITeam) => player.getCompetition(team.competition).position;

const containerStyle: React.CSSProperties = {
  justifyContent: 'center',
  display: 'flex',
  marginBottom: 16,
  flexWrap: 'wrap',
};

export const TeamPlayerAvatars = ({team, style}: TeamPlayerAvatarsProps) => {
  const teamPlayers = team.getPlayers('standard')
    .sort((a, b) => getSortKey(a.player, team) - getSortKey(b.player, team));

  return (
    <div style={{...containerStyle, ...style}}>
      {teamPlayers.map(ply => {
        let tooltip = ply.player.name;

        const isCaptain = team.isCaptain(ply.player);
        if (isCaptain) {
          tooltip = `${t('player.teamCaptain')}: ${tooltip}`;
        }

        const comp = ply.player.getCompetition(team.competition);
        if (comp.ranking) {
          tooltip += ` (${comp.ranking})`;
        }

        const avatarStyle = {
          marginRight: 16,
          boxShadow: `3px 3px 3px ${isCaptain ? '#CD7F32' : '#888888'}`,
          flex: 1,
        };

        return (
          <PlayerAvatar
            key={ply.player.id}
            player={ply.player}
            style={avatarStyle}
            tooltip={tooltip}
            tooltipPlacement="bottom"
          />
        );
      })}
    </div>
  );
};
