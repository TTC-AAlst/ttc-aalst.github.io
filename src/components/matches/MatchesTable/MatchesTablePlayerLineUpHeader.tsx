import React from 'react';
import { t } from '../../../locales';
import { ITeam } from '../../../models/model-interfaces';
import { getTablePlayers, tableMatchViewportWidths } from './matchesTableUtil';
import { TeamCaptainIcon } from '../../players/PlayerCard';
import { useViewport } from '../../../utils/hooks/useViewport';

type MatchesTablePlayerLineUpProps = {
  team: ITeam;
}

export const MatchesTablePlayerLineUpHeader = ({team}: MatchesTablePlayerLineUpProps) => {
  const viewport = useViewport();
  const teamPlayers = getTablePlayers(team);

  return (
    <thead>
      <tr>
        <th>{t('common.date')}</th>
        {viewport.width > tableMatchViewportWidths.frenoyMatchId && <th>{t('common.frenoy')}</th>}
        <th>{t('teamCalendar.match')}</th>
        <th>{t('match.block.block')}</th>
        {teamPlayers.map(ply => (
          <th key={ply.player.id}>
            {ply.type === 'Captain' ? <TeamCaptainIcon /> : null}
            <span style={{fontStyle: ply.type === 'Reserve' ? 'italic' : undefined}}>{ply.player.alias}</span>
          </th>
        ))}
      </tr>
    </thead>
  );
};
