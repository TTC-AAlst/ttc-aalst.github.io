import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { paperStyle } from './Login';
import { PlayerAutoComplete } from '../players/PlayerAutoComplete';
import { MaterialButton } from '../controls/Buttons/MaterialButton';
import { t } from '../../locales';
import { requestResetPasswordLink, setNewPasswordFromGuid } from '../../reducers/userActions';
import { useTtcDispatch } from '../../utils/hooks/storeHooks';


export const ForgotPassword = () => {
  const [playerId, setPlayerId] = useState<number | 'system'>(0);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const dispatch = useTtcDispatch();

  return (
    <Paper style={{...paperStyle, height: 280}}>
      <h3>{t('password.newPassword')}</h3>
      <PlayerAutoComplete
        selectPlayer={id => setPlayerId(id)}
        label={t('login.loginName')}
      />

      <br />

      <TextField
        label={t('player.email')}
        onChange={e => setEmail(e.target.value)}
        fullWidth
      />

      <br />
      <br />

      <MaterialButton
        variant="contained"
        label={t('password.sendNewButton')}
        color="primary"
        style={{marginTop: 15, width: '100%'}}
        onClick={() => dispatch(requestResetPasswordLink({email, playerId, navigate}))}
        disabled={!playerId || !email}
      />
    </Paper>
  );
};


export const ForgotPasswordReset = () => {
  const params = useParams();
  const [playerId, setPlayerId] = useState<number>(0);
  const [password, setPassword] = useState('');
  const dispatch = useTtcDispatch();
  const navigate = useNavigate();

  return (
    <Paper style={{...paperStyle, height: 210}}>
      <br />
      <PlayerAutoComplete
        selectPlayer={id => setPlayerId(id === 'system' ? -1 : id)}
        label={t('login.loginName')}
      />

      <TextField
        label={t('password.newPassword')}
        type="password"
        onChange={e => setPassword(e.target.value)}
        fullWidth
      />

      <MaterialButton
        variant="contained"
        label={t('password.changeTitle')}
        color="primary"
        style={{marginTop: 15}}
        onClick={() => dispatch(setNewPasswordFromGuid({playerId, password, guid: params.guid || '', navigate}))}
        disabled={!playerId || !password}
      />
    </Paper>
  );
};
