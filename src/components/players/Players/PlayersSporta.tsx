import React from 'react';
import cn from 'classnames';
import Table from 'react-bootstrap/Table';
import {PlayerFrenoyLink} from '../PlayerCard';
import {PlayerPlayingStyleForm} from '../PlayerPlayingStyle';
import {PlayerLink} from '../controls/PlayerLink';
import { t } from '../../../locales';
import { selectPlayers, selectUser, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { PlayerRanking } from '../controls/PlayerRanking';

type PlayersSportaProps = {
  filter: string;
};

export const PlayersSporta = ({filter}: PlayersSportaProps) => {
  const user = useTtcSelector(selectUser);
  const allPlayers = useTtcSelector(selectPlayers);
  let players = allPlayers.filter(x => x.sporta);
  if (filter) {
    players = players.filter(x => x.name.toLowerCase().includes(filter));
  }
  players = players.sort((a, b) => a.sporta!.position - b.sporta!.position);

  // Sorting as required by the Sporta scoresheet Excel
  // players = players.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <Table size="sm" hover>
      <thead>
        <tr>
          <th>{t('comp.index')}</th>
          <th>{t('comp.sporta.uniqueIndex')}</th>
          <th>{t('player.name')}</th>
          <th><span className="d-none d-sm-inline">{t('comp.ranking')}</span></th>
          <th>{t('comp.sporta.rankingValue')}</th>
          <th className="d-none d-sm-table-cell">{t('player.style')}</th>
          <th className="d-none d-md-table-cell">{t('player.bestStroke')}</th>
        </tr>
      </thead>
      <tbody>
        {players.map(ply => (
          <tr key={ply.id} className={cn({'match-won': ply.id === user.playerId})}>
            <td>{ply.sporta!.rankingIndex}</td>
            <td>{ply.sporta!.uniqueIndex}</td>
            <td className="d-none d-sm-table-cell"><PlayerLink player={ply} /></td>
            <td className="d-table-cell d-sm-none"><PlayerLink player={ply} alias /></td>
            <td><PlayerRanking player={ply.sporta} /> <PlayerFrenoyLink comp={ply.sporta!} /></td>
            <td>{ply.sporta!.rankingValue}</td>
            <td className="d-none d-sm-table-cell">{ply.style.name}</td>
            <td className="d-none d-md-table-cell">
              <PlayerPlayingStyleForm player={ply} iconStyle="edit-icon" style={{color: '#d3d3d3', float: 'right'}} />
              {ply.style.bestStroke}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
