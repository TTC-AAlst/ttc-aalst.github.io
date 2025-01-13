import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { MaterialButton } from '../controls/Buttons/MaterialButton';
import { t } from '../../locales';
import { selectUser, useTtcDispatch, useTtcSelector } from '../../utils/hooks/storeHooks';
import { changePassword } from '../../reducers/userActions';

export const ChangePassword = () => {
  const user = useTtcSelector(selectUser);
  const [oldPassword, setOld] = useState('');
  const [newPassword, setNew] = useState('');
  const dispatch = useTtcDispatch();

  const paperStyle: React.CSSProperties = {
    marginLeft: 20,
    textAlign: 'center',
    display: 'inline-block',
  };
  return (
    <div style={paperStyle}>
      <h3>{t('password.changeTitle')}</h3>

      <TextField
        label={t('password.oldPassword')}
        type="password"
        onChange={e => setOld(e.target.value)}
      />

      <br />

      <TextField
        label={t('password.newPassword')}
        type="password"
        onChange={e => setNew(e.target.value)}
      />

      <br />

      <MaterialButton
        variant="contained"
        label={t('profile.editPassword')}
        color="primary"
        style={{marginTop: 15}}
        onClick={() => dispatch(changePassword({playerId: user.playerId, oldPassword, newPassword}))}
        disabled={!oldPassword || !newPassword}
      />

    </div>
  );
};
