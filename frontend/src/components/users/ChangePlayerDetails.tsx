import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { t } from '../../locales';
import { IStorePlayer } from '../../models/model-interfaces';
import { useTtcDispatch } from '../../utils/hooks/storeHooks';
import { updatePlayer } from '../../reducers/playersReducer';

export const ChangePlayerDetails = ({ player }: { player: IStorePlayer }) => {
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

      <Form.Group>
        <Form.Label>{t('player.email')}</Form.Label>
        <Form.Control defaultValue={email} onChange={e => setEmail(e.target.value)} />
      </Form.Group>

      <Form.Group>
        <Form.Label>{t('player.gsm')}</Form.Label>
        <Form.Control type="number" defaultValue={mobile} onChange={e => setMobile(e.target.value)} />
      </Form.Group>

      <Form.Group>
        <Form.Label>{t('player.address')}</Form.Label>
        <Form.Control defaultValue={address} onChange={e => setAddress(e.target.value)} />
      </Form.Group>

      <Form.Group>
        <Form.Label>{t('player.city')}</Form.Label>
        <Form.Control defaultValue={city} onChange={e => setCity(e.target.value)} />
      </Form.Group>

      <Button
        variant="primary"
        style={{ marginTop: 15 }}
        onClick={() => dispatch(updatePlayer({ player: { ...player, ...{ contact: { playerId: player.id, email, mobile, address, city } } } }))}
      >
        {t('profile.editDetails')}
      </Button>
    </div>
  );
};
