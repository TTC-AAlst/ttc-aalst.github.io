import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
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
    <Card style={{ ...paperStyle, height: 280 }}>
      <Card.Body>
        <h3>{t('password.newPassword')}</h3>
        <PlayerAutoComplete selectPlayer={id => setPlayerId(id)} label={t('login.loginName')} />

        <br />

        <Form.Group>
          <Form.Label>{t('player.email')}</Form.Label>
          <Form.Control onChange={e => setEmail(e.target.value)} />
        </Form.Group>

        <br />
        <br />

        <MaterialButton
          variant="contained"
          label={t('password.sendNewButton')}
          color="primary"
          style={{ marginTop: 15, width: '100%' }}
          onClick={() => dispatch(requestResetPasswordLink({ email, playerId, navigate }))}
          disabled={!playerId || !email}
        />
      </Card.Body>
    </Card>
  );
};

export const ForgotPasswordReset = () => {
  const params = useParams();
  const [playerId, setPlayerId] = useState<number>(0);
  const [password, setPassword] = useState('');
  const dispatch = useTtcDispatch();
  const navigate = useNavigate();

  return (
    <Card style={{ ...paperStyle, height: 210 }}>
      <Card.Body>
        <br />
        <PlayerAutoComplete selectPlayer={id => setPlayerId(id === 'system' ? -1 : id)} label={t('login.loginName')} />

        <Form.Group>
          <Form.Label>{t('password.newPassword')}</Form.Label>
          <Form.Control type="password" onChange={e => setPassword(e.target.value)} />
        </Form.Group>

        <MaterialButton
          variant="contained"
          label={t('password.changeTitle')}
          color="primary"
          style={{ marginTop: 15 }}
          onClick={() => dispatch(setNewPasswordFromGuid({ playerId, password, guid: params.guid || '', navigate }))}
          disabled={!playerId || !password}
        />
      </Card.Body>
    </Card>
  );
};
