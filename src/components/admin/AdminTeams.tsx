import React, {Component} from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from 'react-bootstrap/Button';
import MenuItem from '@mui/material/MenuItem';
import { connect } from 'react-redux';
import {PlayerAutoComplete} from '../players/PlayerAutoComplete';
import {PlayersImageGallery} from '../players/PlayersImageGallery';
import {teamPlayerType, ITeam, Competition, TeamPlayerType} from '../../models/model-interfaces';
import { frenoyTeamSync } from '../../reducers/matchesReducer';
import { toggleTeamPlayer } from '../../reducers/teamsReducer';


type AdminTeamsProps = {
  teams: ITeam[];
  toggleTeamPlayer: typeof toggleTeamPlayer;
  frenoyTeamSync: typeof frenoyTeamSync;
}

type AdminTeamsState = {
  filter: Competition;
}


class AdminTeams extends React.Component<AdminTeamsProps, AdminTeamsState> {
  constructor(props) {
    super(props);
    this.state = {filter: 'Vttl'};
  }

  _toggleTeamPlayer(teamId: number, playerId: number, role: TeamPlayerType) {
    this.props.toggleTeamPlayer({teamId, playerId, role});
  }

  render() {
    return (
      <div>
        <AdminTeamsToolbar onFilterChange={newFilter => this.setState({filter: newFilter})} />
        {this.props.teams.filter(team => team.competition === this.state.filter).sort((a, b) => a.teamCode.localeCompare(b.teamCode)).map(team => (
          <AdminTeamPlayers
            key={team.id}
            team={team}
            toggleTeamPlayer={this._toggleTeamPlayer.bind(this, team.id)}
            onFrenoySync={this.props.frenoyTeamSync}
          />
        ))}
      </div>
    );
  }
}

type AdminTeamPlayersProps = {
  team: ITeam;
  toggleTeamPlayer: (playerId: number, role: TeamPlayerType) => void;
  onFrenoySync: typeof frenoyTeamSync;
}

type AdminTeamPlayersState = {
  role: TeamPlayerType;
}

class AdminTeamPlayers extends Component<AdminTeamPlayersProps, AdminTeamPlayersState> {
  constructor(props) {
    super(props);
    this.state = {role: 'Standard'};
  }

  _onRoleChange(event) {
    this.setState({role: event.target.value});
  }

  _onToggleTeamPlayer(playerId) {
    this.props.toggleTeamPlayer(playerId, this.state.role);
    this.setState({role: 'Standard'});
  }

  _renderPlayerSubtitle(team, ply) {
    const player = team.getPlayers().find(p => p.player.id === ply.id);
    return <span>{player ? player.type : null}</span>;
  }

  render() {
    const {team} = this.props;
    const teamCompetition = team.competition === 'Sporta' ? 'Sporta' : 'Vttl';
    return (
      <div style={{paddingLeft: 10, paddingRight: 10}}>
        <Paper style={{padding: 20, marginBottom: 20}}>
          <h4>
            {team.renderOwnTeamTitle()}
            <Button style={{marginLeft: 20}} onClick={() => this.props.onFrenoySync({teamId: team.id})}>
              Frenoy Sync
            </Button>
          </h4>

          <PlayersImageGallery
            players={team.getPlayers().map(ply => ply.player)}
            competition={team.competition}
            subtitle={this._renderPlayerSubtitle.bind(this, team)}
            forceSmall
          />

          <div style={{clear: 'both'}} />

          <TextField select value={this.state.role} onChange={e => this._onRoleChange(e)} style={{width: 100, marginRight: 10}}>
            {Object.values(teamPlayerType).map(role => <MenuItem key={role} value={role}>{role}</MenuItem>)}
          </TextField>

          <div style={{width: 250}}>
            <PlayerAutoComplete
              selectPlayer={playerId => this._onToggleTeamPlayer(playerId)}
              label="Selecteer speler"
              competition={teamCompetition}
            />
          </div>
        </Paper>
      </div>
    );
  }
}

const AdminTeamsToolbar = ({onFilterChange}: {onFilterChange: (comp: Competition) => void}) => (
  <div style={{padding: 10}}>
    <Button variant="info" style={{marginRight: 10}} onClick={() => onFilterChange('Vttl')}>Vttl</Button>
    <Button variant="info" style={{marginRight: 10}} onClick={() => onFilterChange('Sporta')}>Sporta</Button>
    <Button variant="info" onClick={() => onFilterChange('Jeugd')}>Jeugd</Button>
  </div>
);

const mapDispatchToProps = (dispatch: any) => ({
  toggleTeamPlayer: (data: Parameters<typeof toggleTeamPlayer>[0]) => dispatch(toggleTeamPlayer(data)),
  frenoyTeamSync: (data: {teamId: number}) => dispatch(frenoyTeamSync(data)),
});

export default connect(null, mapDispatchToProps)(AdminTeams);
