import React from 'react';
import Table from 'react-bootstrap/Table';
import cn from 'classnames';
import {PlayerAllCompetitions} from '../PlayerCard';
import {PlayerPlayingStyle} from '../PlayerPlayingStyle';
import {PlayerLink} from '../controls/PlayerLink';
import {Email} from '../../controls/controls/Email';
import {Telephone} from '../../controls/controls/Telephone';
import { t } from '../../../locales';
import { IPlayer } from '../../../models/model-interfaces';
import { selectUser, useTtcSelector } from '../../../utils/hooks/storeHooks';

type PlayersAllBigProps = {
  players: IPlayer[];
};


export const PlayersAllBig = ({players}: PlayersAllBigProps) => {
  const user = useTtcSelector(selectUser);
  return (
    <Table size="sm" hover className="players">
      <thead>
        <tr>
          <th>{t('player.name')}</th>
          <th>{t('player.address')}</th>
          <th>{t('common.competition')}</th>
          <th className="d-none d-md-table-cell">{t('player.style')}</th>
        </tr>
      </thead>
      <tbody>
        {players.map(ply => (
          <tr key={ply.id} className={cn({'match-won': ply.id === user.playerId})}>
            <td>
              <strong><PlayerLink player={ply} /></strong>
              <br />
              <Email email={ply.contact.email} />
              <br />
              <Telephone player={ply} hideIcon />
            </td>
            <td>
              {ply.contact.address}
              <br />
              {ply.contact.city}
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
};
