import React, {Component} from 'react';
import {Email} from '../../controls/controls/Email';
import {Telephone} from '../../controls/controls/Telephone';
import {PlayerAddress} from './PlayerAddress';
import { IStorePlayer } from '../../../models/model-interfaces';

export class PlayerContact extends Component<{player: IStorePlayer}> {
  render() {
    const {player, ...props} = this.props;
    return (
      <div {...props}>
        <Email email={player.contact.email} showIcon />
        <br />
        <Telephone player={player} style={{marginTop: 5}} />
        <PlayerAddress contact={player.contact} style={{marginTop: 5}} />
      </div>
    );
  }
}
