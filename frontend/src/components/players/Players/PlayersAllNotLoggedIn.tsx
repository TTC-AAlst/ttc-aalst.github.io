import React from 'react';
import Table from 'react-bootstrap/Table';
import {PlayerAllCompetitions} from '../PlayerCard';
import {PlayerPlayingStyle} from '../PlayerPlayingStyle';
import {PlayerLink} from '../controls/PlayerLink';
import { t } from '../../../locales';
import { IPlayer } from '../../../models/model-interfaces';

type PlayersAllNotLoggedInProps = {
  players: IPlayer[];
}

export const PlayersAllNotLoggedIn = ({players}: PlayersAllNotLoggedInProps) => (
  <Table size="sm" hover className="players">
    <thead>
      <tr>
        <th>{t('player.name')}</th>
        <th>{t('common.competition')}</th>
        <th className="d-none d-md-table-cell">{t('player.style')}</th>
      </tr>
    </thead>
    <tbody>
      {players.map(ply => (
        <tr key={ply.id}>
          <td>
            <strong><PlayerLink player={ply} /></strong>
          </td>
          <td>
            <PlayerAllCompetitions player={ply} />
          </td>
          <td className="d-none d-md-table-cell">
            <PlayerPlayingStyle ply={ply} />
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);
