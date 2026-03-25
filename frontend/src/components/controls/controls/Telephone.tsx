import React from 'react';
import { Icon } from '../Icons/Icon';
import { displayMobile } from '../../../models/PlayerModel';
import { IStorePlayer } from '../../../models/model-interfaces';

function callFormat(n: string) {
  return n;
  // return '+32' + n.substr(1);
}

type TelephoneProps = {
  number?: string;
  player?: IStorePlayer;
  hideIcon?: boolean;
  noLink?: boolean;
  style?: React.CSSProperties;
};

export const Telephone = ({ number, player, hideIcon = false, noLink, style, ...props }: TelephoneProps) => {
  if (!number && !player) {
    return null;
  }

  const nr = player ? player.contact.mobile : number;
  if (!nr) {
    return null;
  }
  if (hideIcon) {
    return (
      <a href={`tel:${callFormat(nr)}`} style={style} {...props}>
        {displayMobile(nr)}
      </a>
    );
  }

  return (
    <div className="iconize" style={style} {...props}>
      <Icon fa="fa fa-phone" />
      {noLink ? (
        <div>{displayMobile(nr)}</div>
      ) : (
        <a style={{ marginLeft: 7 }} href={`tel:${callFormat(nr)}`}>
          {displayMobile(nr)}
        </a>
      )}
    </div>
  );
};
