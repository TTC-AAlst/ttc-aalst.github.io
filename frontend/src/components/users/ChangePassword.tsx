import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
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

      <Form.Group>
        <Form.Label>{t('password.oldPassword')}</Form.Label>
        <Form.Control type="password" onChange={e => setOld(e.target.value)} />
      </Form.Group>

      <br />

      <Form.Group>
        <Form.Label>{t('password.newPassword')}</Form.Label>
        <Form.Control type="password" onChange={e => setNew(e.target.value)} />
      </Form.Group>

      <br />

      <Button
        variant="primary"
        style={{ marginTop: 15 }}
        onClick={() => dispatch(changePassword({ playerId: user.playerId, oldPassword, newPassword }))}
        disabled={!oldPassword || !newPassword}
      >
        {t('profile.editPassword')}
      </Button>
    </div>
  );
};
