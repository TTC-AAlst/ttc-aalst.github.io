import React from 'react';
import Table from 'react-bootstrap/Table';
import cn from 'classnames';
import {PlayerLink} from '../controls/PlayerLink';
import {Email} from '../../controls/controls/Email';
import {Telephone} from '../../controls/controls/Telephone';
import { t } from '../../../locales';
import { IPlayer } from '../../../models/model-interfaces';
import { selectUser, useTtcSelector } from '../../../utils/hooks/storeHooks';

export const PlayersAllSmall = ({players}: {players: IPlayer[]}) => {
  const user = useTtcSelector(selectUser);
  return (
    <Table size="sm" hover className="players row-by-two">
      <thead>
        <tr>
          <th>{t('player.name')}</th>
          <th>{t('player.address')}</th>
        </tr>
      </thead>
      <tbody>
        {players.map(ply => [
          <tr key={`${ply.id}_name`} className={cn({'match-won': ply.id === user.playerId})}>
            <td colSpan={2}>
              <strong><PlayerLink player={ply} /></strong>
            </td>
          </tr>,
          <tr key={ply.id} className={cn({'match-won': ply.id === user.playerId})}>
            <td className="truncate">
              <Email email={ply.contact.email} />
              <br />
              <Telephone player={ply} hideIcon />
            </td>
            <td>
              {ply.contact.address}
              <br />
              {ply.contact.city}
            </td>
          </tr>,
        ])}
      </tbody>
    </Table>
  );
};
