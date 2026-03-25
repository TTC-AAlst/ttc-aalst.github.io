import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { MaterialButton } from '../controls/Buttons/MaterialButton';
import { t } from '../../locales';
import { IStorePlayer } from '../../models/model-interfaces';
import { useTtcDispatch } from '../../utils/hooks/storeHooks';
import { updatePlayer } from '../../reducers/playersReducer';

export const ChangePlayerDetails = ({player}: {player: IStorePlayer}) => {
  const [email, setEmail] = useState(player.contact.email);
  const [mobile, setMobile] = useState(player.contact.mobile);
  const [address, setAddress] = useState(player.contact.address);
  const [city, setCity] = useState(player.contact.city);
  const dispatch = useTtcDispatch();

  const paperStyle: React.CSSProperties = {
    width: 290,
    margin: 12,
    textAlign: 'center',
    display: 'inline-block',
  };
  return (
    <div style={paperStyle}>
      <h3>{t('profile.editDetails')}</h3>

      <TextField
        label={t('player.email')}
        defaultValue={email}
        onChange={e => setEmail(e.target.value)}
      />

      <TextField
        label={t('player.gsm')}
        type="number"
        defaultValue={mobile}
        onChange={e => setMobile(e.target.value)}
      />

      <TextField
        label={t('player.address')}
        defaultValue={address}
        onChange={e => setAddress(e.target.value)}
      />

      <TextField
        label={t('player.city')}
        defaultValue={city}
        onChange={e => setCity(e.target.value)}
      />

      <MaterialButton
        variant="contained"
        label={t('profile.editDetails')}
        color="primary"
        style={{marginTop: 15}}
        onClick={() => dispatch(updatePlayer({player: {...player, ...{contact: {playerId: player.id, email, mobile, address, city}}}}))}
      />

    </div>
  );
};
