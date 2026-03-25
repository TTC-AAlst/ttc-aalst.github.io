import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { Alert } from 'react-bootstrap';
import { UserRoles, userRoles } from '../../models/UserModel';
import { MaterialButton } from '../controls/Buttons/MaterialButton';
import PlayerStyleAutocomplete from '../players/PlayerStyleAutocomplete';
import { IPlayer, IStorePlayer } from '../../models/model-interfaces';
import { t } from '../../locales';
import { updatePlayer } from '../../reducers/playersReducer';
import { PlayerRanking } from '../../models/utils/rankingSorter';
import { useTtcDispatch, useTtcSelector } from '../../utils/hooks/storeHooks';

const getNewPlayer = (): IStorePlayer => ({
  alias: '',
  contact: {
    playerId: 0,
    email: '',
    mobile: '',
    address: '',
    city: '',
  },
  id: 0,
  active: true,
  firstName: '',
  lastName: '',
  sporta: undefined,
  vttl: undefined,
  style: {
    playerId: 0,
    name: '',
    bestStroke: '',
  },
  quitYear: null,
  security: 'Player' as UserRoles,
  hasKey: null,
  imageVersion: 0,
});

type AdminPlayerFormProps = {
  player?: IPlayer;
  onEnd: () => void;
};

const isValidEmail = (email: string): boolean => {
  if (!email) return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const AdminPlayerForm = (props: AdminPlayerFormProps) => {
  const dispatch = useTtcDispatch();
  const [player, setPlayer] = useState(props.player || getNewPlayer());
  const [emailError, setEmailError] = useState('');
  const similarPlayers = useTtcSelector(state =>
    state.players
      .concat(state.playersQuitters)
      .filter(
        p =>
          (player.alias.length > 2 && p.alias.toLowerCase().trim().includes(player.alias.toLowerCase().trim())) ||
          (player.firstName.length > 2 && p.firstName.toLowerCase().trim().includes(player.firstName.toLowerCase().trim())) ||
          (player.lastName.length > 2 && p.lastName.toLowerCase().trim().includes(player.lastName.toLowerCase().trim())),
      )
      .filter(p => p.id !== player.id),
  );
  const fieldMargin = 30;
  return (
    <div style={{ marginLeft: 10, marginRight: 10 }}>
      <h3>{!player.firstName && !player.lastName ? 'Nieuw lid' : `${player.firstName || ''} ${player.lastName || ''}`}</h3>
      <div>
        <Card style={{ padding: 15 }}>
          <Card.Body>
            <h4>Persoonlijk</h4>
            {similarPlayers.length > 0 && (
              <Alert variant="danger" style={{ width: 660 }}>
                <div>
                  <b>Potentiële Duplicatie</b>
                </div>
                {similarPlayers.map(p => (
                  <div key={p.id}>
                    {p.firstName} {p.lastName}&nbsp;
                    {p.alias.trim().toLowerCase() === player.alias.trim().toLowerCase() ? <b>({p.alias})</b> : <span>({p.alias})</span>}
                    {p.quitYear && <span style={{ color: 'red' }}> - Inactief</span>}
                  </div>
                ))}
              </Alert>
            )}
            <Form.Group style={{ width: 200, display: 'inline-block', marginRight: fieldMargin }}>
              <Form.Label>{t('Voornaam')}</Form.Label>
              <Form.Control defaultValue={player.firstName} onChange={e => setPlayer({ ...player, firstName: e.target.value })} />
            </Form.Group>

            <Form.Group style={{ width: 200, display: 'inline-block', marginRight: fieldMargin }}>
              <Form.Label>{t('Achternaam')}</Form.Label>
              <Form.Control defaultValue={player.lastName} onChange={e => setPlayer({ ...player, lastName: e.target.value })} />
            </Form.Group>

            <Form.Group style={{ width: 200, display: 'inline-block' }}>
              <Form.Label>{t('player.alias')}</Form.Label>
              <Form.Control defaultValue={player.alias} onChange={e => setPlayer({ ...player, alias: e.target.value })} />
            </Form.Group>

            <br />
            <br />

            <div style={{ maxWidth: 250, marginBottom: 7 }}>
              <PlayerStyleAutocomplete value={player.style.name || ''} onChange={text => setPlayer({ ...player, style: { ...player.style, name: text } })} />
            </div>

            <Form.Group style={{ width: 230 }}>
              <Form.Label>{t('player.editStyle.bestStroke')}</Form.Label>
              <Form.Control
                defaultValue={player.style.bestStroke}
                onChange={e => setPlayer({ ...player, style: { ...player.style, bestStroke: e.target.value } })}
              />
            </Form.Group>

            <br />
            <br />

            <PlayerSecuritySelectField value={player.security} onChange={security => setPlayer({ ...player, security })} />
          </Card.Body>
        </Card>

        <Card style={{ marginTop: 20, padding: 15 }}>
          <Card.Body>
            <h4>Contact</h4>
            <Form.Group style={{ width: 300, display: 'inline-block', marginRight: fieldMargin }}>
              <Form.Label>{t('player.email')}</Form.Label>
              <Form.Control
                defaultValue={player.contact.email}
                isInvalid={!!emailError}
                onChange={e => {
                  const email = e.target.value;
                  setPlayer({ ...player, contact: { ...player.contact, email } });
                  setEmailError(isValidEmail(email) ? '' : 'Ongeldig e-mailadres');
                }}
              />
              <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group style={{ width: 300, display: 'inline-block' }}>
              <Form.Label>{t('player.gsm')}</Form.Label>
              <Form.Control
                type="number"
                defaultValue={player.contact.mobile}
                onChange={e => setPlayer({ ...player, contact: { ...player.contact, mobile: e.target.value } })}
              />
            </Form.Group>

            <br />

            <Form.Group style={{ width: 300, display: 'inline-block', marginRight: fieldMargin }}>
              <Form.Label>{t('player.address')}</Form.Label>
              <Form.Control
                defaultValue={player.contact.address}
                onChange={e => setPlayer({ ...player, contact: { ...player.contact, address: e.target.value } })}
              />
            </Form.Group>

            <Form.Group style={{ width: 300, display: 'inline-block' }}>
              <Form.Label>{t('player.city')}</Form.Label>
              <Form.Control defaultValue={player.contact.city} onChange={e => setPlayer({ ...player, contact: { ...player.contact, city: e.target.value } })} />
            </Form.Group>
          </Card.Body>
        </Card>

        {(!!player.vttl || !!player.sporta) && (
          <Card style={{ marginTop: 20, padding: 15 }}>
            <Card.Body>
              <h4>Einde Seizoen</h4>
              {!!player.vttl && (
                <Form.Group style={{ width: 250, display: 'inline-block', marginRight: fieldMargin }}>
                  <Form.Label>Volgend Klassement VTTL</Form.Label>
                  <Form.Control
                    defaultValue={player.vttl?.nextRanking ?? ''}
                    onChange={e => setPlayer({ ...player, vttl: { ...player.vttl!, nextRanking: e.target.value as PlayerRanking } })}
                    placeholder={`Huidig: ${player.vttl?.ranking}`}
                  />
                </Form.Group>
              )}
              {!!player.sporta && (
                <Form.Group style={{ width: 250, display: 'inline-block', marginRight: fieldMargin }}>
                  <Form.Label>Volgend Klassement Sporta</Form.Label>
                  <Form.Control
                    defaultValue={player.sporta?.nextRanking ?? ''}
                    onChange={e => setPlayer({ ...player, sporta: { ...player.sporta!, nextRanking: e.target.value as PlayerRanking } })}
                    placeholder={`Huidig: ${player.sporta?.ranking}`}
                  />
                </Form.Group>
              )}
            </Card.Body>
          </Card>
        )}
      </div>
      <MaterialButton
        variant="contained"
        label={t('common.save')}
        color="primary"
        style={{ marginTop: 5 }}
        disabled={!!emailError}
        onClick={() => {
          if (!isValidEmail(player.contact.email)) {
            setEmailError('Ongeldig e-mailadres');
            return;
          }
          dispatch(updatePlayer({ player }));
          props.onEnd();
        }}
      />

      <MaterialButton variant="contained" label={t('common.cancel')} style={{ marginTop: 5, marginLeft: 10 }} onClick={props.onEnd} />
    </div>
  );
};

type PlayerSecuritySelectFieldProps = {
  value: string;
  onChange: (security: UserRoles) => void;
};

const PlayerSecuritySelectField = ({ value, onChange }: PlayerSecuritySelectFieldProps) => (
  <Form.Group style={{ width: 100 }}>
    <Form.Label>Toegang</Form.Label>
    <Form.Select value={value} onChange={e => onChange(e.target.value as UserRoles)}>
      {userRoles.map(role => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </Form.Select>
  </Form.Group>
);
