 
import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { MenuItem } from '@mui/material';
import Card from 'react-bootstrap/Card';
import { Alert } from 'react-bootstrap';
import {UserRoles, userRoles} from '../../models/UserModel';
import {MaterialButton} from '../controls/Buttons/MaterialButton';
import PlayerStyleAutocomplete from '../players/PlayerStyleAutocomplete';
import {IPlayer, IStorePlayer} from '../../models/model-interfaces';
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
}

const isValidEmail = (email: string): boolean => {
  if (!email) return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const AdminPlayerForm = (props: AdminPlayerFormProps) => {
  const dispatch = useTtcDispatch();
  const [player, setPlayer] = useState(props.player || getNewPlayer());
  const [emailError, setEmailError] = useState('');
  const similarPlayers = useTtcSelector(state => state.players.concat(state.playersQuitters)
    .filter(p => (player.alias.length > 2 && p.alias.toLowerCase().trim().includes(player.alias.toLowerCase().trim()))
      || (player.firstName.length > 2 && p.firstName.toLowerCase().trim().includes(player.firstName.toLowerCase().trim()))
      || (player.lastName.length > 2 && p.lastName.toLowerCase().trim().includes(player.lastName.toLowerCase().trim())))
    .filter(p => p.id !== player.id));
  const fieldMargin = 30;
  return (
    <div style={{marginLeft: 10, marginRight: 10}}>
      <h3>{!player.firstName && !player.lastName ? 'Nieuw lid' : (`${player.firstName || ''} ${player.lastName || ''}`)}</h3>
      <div>
        <Paper style={{padding: 15}}>
          <h4>Persoonlijk</h4>
          {similarPlayers.length > 0 && (
            <Alert variant="danger" style={{width: 660}}>
              <div><b>Potentiële Duplicatie</b></div>
              {similarPlayers.map(p => (
                <div key={p.id}>
                  {p.firstName} {p.lastName}&nbsp;
                  {p.alias.trim().toLowerCase() === player.alias.trim().toLowerCase() ? (
                    <b>({p.alias})</b>
                  ) : (
                    <span>({p.alias})</span>
                  )}
                  {p.quitYear && <span style={{color: 'red'}}> - Inactief</span>}
                </div>
              ))}
            </Alert>
          )}
          <TextField
            style={{width: 200, marginRight: fieldMargin}}
            label={t('Voornaam')}
            defaultValue={player.firstName}
            onChange={e => setPlayer({...player, firstName: e.target.value})}
          />

          <TextField
            style={{width: 200, marginRight: fieldMargin}}
            label={t('Achternaam')}
            defaultValue={player.lastName}
            onChange={e => setPlayer({...player, lastName: e.target.value})}
          />

          <TextField
            style={{width: 200}}
            label={t('player.alias')}
            defaultValue={player.alias}
            onChange={e => setPlayer({...player, alias: e.target.value})}
          />

          <br />
          <br />

          <div style={{maxWidth: 250, marginBottom: 7}}>
            <PlayerStyleAutocomplete
              value={player.style.name || ''}
              onChange={text => setPlayer({...player, style: {...player.style, name: text}})}
            />
          </div>

          <TextField
            style={{width: 230}}
            label={t('player.editStyle.bestStroke')}
            defaultValue={player.style.bestStroke}
            onChange={e => setPlayer({...player, style: {...player.style, bestStroke: e.target.value}})}
          />

          <br />
          <br />

          <PlayerSecuritySelectField value={player.security} onChange={security => setPlayer({...player, security})} />
        </Paper>


        <Card style={{marginTop: 20, padding: 15}}>
          <h4>Contact</h4>
          <TextField
            style={{width: 300, marginRight: fieldMargin}}
            label={t('player.email')}
            defaultValue={player.contact.email}
            error={!!emailError}
            helperText={emailError}
            onChange={e => {
              const email = e.target.value;
              setPlayer({...player, contact: {...player.contact, email}});
              setEmailError(isValidEmail(email) ? '' : 'Ongeldig e-mailadres');
            }}
          />

          <TextField
            style={{width: 300}}
            type="number"
            label={t('player.gsm')}
            defaultValue={player.contact.mobile}
            onChange={e => setPlayer({...player, contact: {...player.contact, mobile: e.target.value}})}
          />

          <br />

          <TextField
            style={{width: 300, marginRight: fieldMargin}}
            label={t('player.address')}
            defaultValue={player.contact.address}
            onChange={e => setPlayer({...player, contact: {...player.contact, address: e.target.value}})}
          />

          <TextField
            style={{width: 300}}
            label={t('player.city')}
            defaultValue={player.contact.city}
            onChange={e => setPlayer({...player, contact: {...player.contact, city: e.target.value}})}
          />

        </Card>

        {(!!player.vttl || !!player.sporta) && (
          <Card style={{marginTop: 20, padding: 15}}>
            <h4>Einde Seizoen</h4>
            {!!player.vttl && (
              <TextField
                style={{width: 250, marginRight: fieldMargin}}
                label="Volgend Klassement VTTL"
                defaultValue={player.vttl?.nextRanking}
                onChange={e => setPlayer({...player, vttl: {...player.vttl!, nextRanking: e.target.value as PlayerRanking}})}
                placeholder={`Huidig: ${player.vttl?.ranking}`}
              />
            )}
            {!!player.sporta && (
              <TextField
                style={{width: 250, marginRight: fieldMargin}}
                label="Volgend Klassement Sporta"
                defaultValue={player.sporta?.nextRanking}
                onChange={e => setPlayer({...player, sporta: {...player.sporta!, nextRanking: e.target.value as PlayerRanking}})}
                placeholder={`Huidig: ${player.sporta?.ranking}`}
              />
            )}
          </Card>
        )}
      </div>
      <MaterialButton
        variant="contained"
        label={t('common.save')}
        color="primary"
        style={{marginTop: 5}}
        disabled={!!emailError}
        onClick={() => {
          if (!isValidEmail(player.contact.email)) {
            setEmailError('Ongeldig e-mailadres');
            return;
          }
          dispatch(updatePlayer({player}));
          props.onEnd();
        }}
      />

      <MaterialButton
        variant="contained"
        label={t('common.cancel')}
        style={{marginTop: 5, marginLeft: 10}}
        onClick={props.onEnd}
      />
    </div>
  );
};


type PlayerSecuritySelectFieldProps = {
  value: string;
  onChange: (security: UserRoles) => void;
}

const PlayerSecuritySelectField = ({ value, onChange }: PlayerSecuritySelectFieldProps) => (
  <TextField
    select
    style={{ width: 100 }}
    value={value}
    onChange={e => onChange(e.target.value as UserRoles)}
    label="Toegang"
  >
    {userRoles.map(role => (
      <MenuItem key={role} value={role}>
        {role}
      </MenuItem>
    ))}
  </TextField>
);
