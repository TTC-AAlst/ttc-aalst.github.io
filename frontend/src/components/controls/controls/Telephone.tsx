import React, {Component} from 'react';
import {Icon} from '../Icons/Icon';
import {displayMobile} from '../../../models/PlayerModel';
import {IStorePlayer} from '../../../models/model-interfaces';

function callFormat(n: string) {
  return n;
  // return '+32' + n.substr(1);
}

type TelephoneProps = {
  number?: string,
  player?: IStorePlayer,
  hideIcon?: boolean,
  noLink?: boolean,
  style?: React.CSSProperties,
}

export class Telephone extends Component<TelephoneProps> {
  static defaultProps = {
    hideIcon: false,
  };

  render() {
    if (!this.props.number && !this.props.player) {
      return null;
    }

    const {number, hideIcon, player, noLink, ...props} = this.props;
    const nr = player ? player.contact.mobile : number;
    if (!nr) {
      return null;
    }
    if (hideIcon) {
      return <a href={`tel:${callFormat(nr)}`} {...props}>{displayMobile(nr)}</a>;
    }

    return (
      <div className="iconize" {...props}>
        <Icon fa="fa fa-phone" />
        {noLink ? (
          <div>{displayMobile(nr)}</div>
        ) : (
          <a style={{marginLeft: 7}} href={`tel:${callFormat(nr)}`}>{displayMobile(nr)}</a>
        )}
      </div>
    );
  }
}
