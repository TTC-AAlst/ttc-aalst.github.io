import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { PlayerAutoComplete } from '../players/PlayerAutoComplete';
import { MaterialButton } from '../controls/Buttons/MaterialButton';
import { t } from '../../locales';
import { adminSetNewPassword } from '../../reducers/userActions';
import { useTtcDispatch } from '../../utils/hooks/storeHooks';

type AdminChangePasswordProps = {
  onEnd: () => void;
};

const AdminChangePassword = ({ onEnd }: AdminChangePasswordProps) => {
  const dispatch = useTtcDispatch();
  const [playerId, setPlayerId] = useState<number | string>('');
  const [newPassword, setNewPassword] = useState('');

  const paperStyle: React.CSSProperties = {
    marginLeft: 20,
    textAlign: 'center',
    display: 'inline-block',
  };

  return (
    <div style={paperStyle}>
      <h3>{t('password.changeTitle')}</h3>

      <PlayerAutoComplete selectPlayer={id => setPlayerId(id)} label={t('login.loginName')} />

      <br />

      <Form.Group>
        <Form.Label>{t('password.newPassword')}</Form.Label>
        <Form.Control type="password" onChange={e => setNewPassword(e.target.value)} />
      </Form.Group>

      <br />

      <MaterialButton
        variant="contained"
        label={t('profile.editPassword')}
        color="primary"
        style={{ marginTop: 15 }}
        onClick={() => {
          dispatch(adminSetNewPassword({ playerId, newPassword }));
          onEnd();
        }}
        disabled={!playerId && !newPassword}
      />
    </div>
  );
};

export default AdminChangePassword;
