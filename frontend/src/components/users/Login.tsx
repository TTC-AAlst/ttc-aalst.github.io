import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { PlayerAutoComplete } from '../players/PlayerAutoComplete';
import Button from 'react-bootstrap/Button';
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
    <Card style={{ ...paperStyle, height: 425 }}>
      <Card.Body>
        <h3>{t('login.title')}</h3>
        <div>{t('login.introText')}</div>

        <br />

        <PlayerAutoComplete selectPlayer={id => setPlayerId(id)} label={t('login.loginName')} style={{ margin: 10 }} />

        <br />

        <Form.Group>
          <Form.Label>{t('login.password')}</Form.Label>
          <Form.Control placeholder={t('login.passwordHint')} type="password" onChange={e => setPassword(e.target.value)} />
        </Form.Group>

        <br />
        <br />

        <Button
          variant="primary"
          style={{ marginTop: 15, width: '100%' }}
          onClick={() => dispatch(login({ playerId, password, navigate }))}
          disabled={!playerId}
        >
          {t('login.loginButton')}
        </Button>

        <br />
        <br />
        <Link to={t.route('forgotPassword')} className="pull-right" style={{ marginTop: 20, marginRight: 10, fontSize: 18 }}>
          {t('password.forgotLink')}
        </Link>
      </Card.Body>
    </Card>
  );
};
