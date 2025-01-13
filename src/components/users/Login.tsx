import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { PlayerAutoComplete } from '../players/PlayerAutoComplete';
import { MaterialButton } from '../controls/Buttons/MaterialButton';
import { t } from '../../locales';
import { login } from '../../reducers/userActions';
import { useTtcDispatch } from '../../utils/hooks/storeHooks';

export const paperStyle = {
  width: 290,
  marginTop: 10,
  marginBottom: 10,
  paddingLeft: 10,
  paddingRight: 10,
  display: 'inline-block',
};


export const Login = () => {
  const [playerId, setPlayerId] = useState<number | 'system'>(0);
  const [password, setPassword] = useState('');
  const dispatch = useTtcDispatch();
  const navigate = useNavigate();

  return (
    <Paper style={{...paperStyle, height: 425}}>
      <h3>{t('login.title')}</h3>
      <div>{t('login.introText')}</div>

      <br />

      <PlayerAutoComplete
        selectPlayer={id => setPlayerId(id)}
        label={t('login.loginName')}
        style={{margin: 10}}
      />

      <br />

      <TextField
        label={t('login.password')}
        placeholder={t('login.passwordHint')}
        type="password"
        fullWidth
        onChange={e => setPassword(e.target.value)}
      />

      <br />
      <br />

      <MaterialButton
        variant="contained"
        label={t('login.loginButton')}
        color="primary"
        style={{marginTop: 15, width: '100%'}}
        onClick={() => dispatch(login({playerId, password, navigate}))}
        disabled={!playerId}
      />

      <br />
      <br />
      <Link to={t.route('forgotPassword')} className="pull-right" style={{marginTop: 20, marginRight: 10, fontSize: 18}}>
        {t('password.forgotLink')}
      </Link>
    </Paper>
  );
};
