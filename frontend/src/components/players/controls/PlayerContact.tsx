import React from 'react';
import { Email } from '../../controls/controls/Email';
import { Telephone } from '../../controls/controls/Telephone';
import { PlayerAddress } from './PlayerAddress';
import { IStorePlayer } from '../../../models/model-interfaces';

export const PlayerContact = ({ player, ...props }: { player: IStorePlayer }) => (
  <div {...props}>
    <Email email={player.contact.email} showIcon />
    <br />
    <Telephone player={player} style={{ marginTop: 5 }} />
    <PlayerAddress contact={player.contact} style={{ marginTop: 5 }} />
  </div>
);
