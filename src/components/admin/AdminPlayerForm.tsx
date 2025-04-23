/* eslint-disable react/no-unused-state */
import React, {Component} from 'react';
import { connect } from 'react-redux';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import { MenuItem } from '@mui/material';
import Card from 'react-bootstrap/Card';
import {UserRoles, userRoles} from '../../models/UserModel';
import {MaterialButton} from '../controls/Buttons/MaterialButton';
import PlayerStyleAutocomplete from '../players/PlayerStyleAutocomplete';
import {IPlayer, IStorePlayer} from '../../models/model-interfaces';
import { t } from '../../locales';
import { updatePlayer } from '../../reducers/playersReducer';

type AdminPlayerFormProps = {
  player?: IPlayer;
  updatePlayer: typeof updatePlayer;
  onEnd: () => void;
}

class AdminPlayerForm extends Component<AdminPlayerFormProps, IStorePlayer> {
  constructor(props) {
    super(props);
    if (!props.player) {
      this.state = {
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
      };
    } else {
      this.state = props.player;
    }
  }

  render() {
    const player = this.state;
    const fieldMargin = 30;
    return (
      <div style={{marginLeft: 10, marginRight: 10}}>
        <h3>{!player.firstName && !player.lastName ? 'Nieuw lid' : (`${player.firstName || ''} ${player.lastName || ''}`)}</h3>
        <div>
          <Paper style={{padding: 15}}>
            <h4>Persoonlijk</h4>
            <TextField
              style={{width: 200, marginRight: fieldMargin}}
              label={t('Voornaam')}
              defaultValue={player.firstName}
              onChange={e => this.setState({firstName: e.target.value})}
            />

            <TextField
              style={{width: 200, marginRight: fieldMargin}}
              label={t('Achternaam')}
              defaultValue={player.lastName}
              onChange={e => this.setState({lastName: e.target.value})}
            />

            <TextField
              style={{width: 200}}
              label={t('player.alias')}
              defaultValue={player.alias}
              onChange={e => this.setState({alias: e.target.value})}
            />

            <br />
            <br />

            <div style={{maxWidth: 250, marginBottom: 7}}>
              <PlayerStyleAutocomplete
                value={player.style.name || ''}
                onChange={text => this.setState({style: {...player.style, name: text}})}
              />
            </div>

            <TextField
              style={{width: 230}}
              label={t('player.editStyle.bestStroke')}
              defaultValue={player.style.bestStroke}
              onChange={e => this.setState({style: {...player.style, bestStroke: e.target.value}})}
            />

            <br />
            <br />

            <PlayerSecuritySelectField value={player.security} onChange={security => this.setState({security})} />
          </Paper>


          <Card style={{marginTop: 20, padding: 15}}>
            <h4>Contact</h4>
            <TextField
              style={{width: 200, marginRight: fieldMargin}}
              label={t('player.email')}
              defaultValue={player.contact.email}
              onChange={e => this.setState({contact: {...player.contact, email: e.target.value}})}
            />

            <TextField
              style={{width: 200}}
              type="number"
              label={t('player.gsm')}
              defaultValue={player.contact.mobile}
              onChange={e => this.setState({contact: {...player.contact, mobile: e.target.value}})}
            />

            <br />

            <TextField
              style={{width: 200, marginRight: fieldMargin}}
              label={t('player.address')}
              defaultValue={player.contact.address}
              onChange={e => this.setState({contact: {...player.contact, address: e.target.value}})}
            />

            <TextField
              style={{width: 200}}
              label={t('player.city')}
              defaultValue={player.contact.city}
              onChange={e => this.setState({contact: {...player.contact, city: e.target.value}})}
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
                  onChange={e => this.setState({vttl: {...player.vttl!, nextRanking: e.target.value}})}
                  placeholder={`Huidig: ${player.vttl?.ranking}`}
                />
              )}
              {!!player.sporta && (
                <TextField
                  style={{width: 250, marginRight: fieldMargin}}
                  label="Volgend Klassement Sporta"
                  defaultValue={player.sporta?.nextRanking}
                  onChange={e => this.setState({sporta: {...player.sporta!, nextRanking: e.target.value}})}
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
          onClick={() => {
            this.props.updatePlayer({player: this.state});
            this.props.onEnd();
          }}
        />

        <MaterialButton
          variant="contained"
          label={t('common.cancel')}
          style={{marginTop: 5, marginLeft: 10}}
          onClick={() => this.props.onEnd()}
        />
      </div>
    );
  }
}


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


const mapDispatchToProps = (dispatch: any) => ({
  updatePlayer: (data: Parameters<typeof updatePlayer>[0]) => dispatch(updatePlayer(data)),
});


export default connect(null, mapDispatchToProps)(AdminPlayerForm);
