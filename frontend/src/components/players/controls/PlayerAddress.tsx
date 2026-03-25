import React from 'react';
import { IPlayerContact } from '../../../models/model-interfaces';

type PlayerAddressProps = {
  contact: IPlayerContact,
  style: React.CSSProperties,
}

export const PlayerAddress = ({contact, style}: PlayerAddressProps) => {
  if (!contact.address) {
    return null;
  }

  return (
    <div style={style} className="iconize">
      <i className="fa fa-map-marker" style={{verticalAlign: 'top'}} />
      <div>
        {contact.address}
        <br />
        {contact.city}
      </div>
    </div>
  );
};
