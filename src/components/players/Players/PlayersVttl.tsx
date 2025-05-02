import React from 'react';
import cn from 'classnames';
import Table from 'react-bootstrap/Table';
import {PlayerFrenoyLink} from '../PlayerCard';
import {PlayerPlayingStyleForm} from '../PlayerPlayingStyle';
import {PlayerLink} from '../controls/PlayerLink';
import { t } from '../../../locales';
import { selectPlayers, selectUser, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { PlayerRanking } from '../controls/PlayerRanking';

type PlayersVttlProps = {
  filter: string;
};

export const PlayersVttl = ({filter}: PlayersVttlProps) => {
  const user = useTtcSelector(selectUser);
  const allPlayers = useTtcSelector(selectPlayers);
  let players = allPlayers.filter(x => x.vttl);
  if (filter) {
    players = players.filter(x => x.name.toLowerCase().includes(filter));
  }
  players = players.sort((a, b) => a.vttl!.position - b.vttl!.position);
  return (
    <Table size="sm" hover>
      <thead>
        <tr>
          <th>{t('comp.index')}</th>
          <th>{t('comp.vttl.uniqueIndex')}</th>
          <th>{t('player.name')}</th>
          <th><span className="d-none d-sm-table-cell">{t('comp.ranking')}</span></th>
          <th className="d-none d-sm-table-cell">{t('player.style')}</th>
          <th className="d-none d-md-table-cell">{t('player.bestStroke')}</th>
        </tr>
      </thead>
      <tbody>
        {players.map(ply => (
          <tr key={ply.id} className={cn({'match-won': ply.id === user.playerId})}>
            <td>{ply.vttl!.rankingIndex}</td>
            <td>{ply.vttl!.uniqueIndex}</td>
            <td className="d-none d-sm-table-cell"><PlayerLink player={ply} /></td>
            <td className="d-table-cell d-sm-none"><PlayerLink player={ply} alias /></td>
            <td><PlayerRanking player={ply.vttl} /> <PlayerFrenoyLink comp={ply.vttl!} /></td>
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
