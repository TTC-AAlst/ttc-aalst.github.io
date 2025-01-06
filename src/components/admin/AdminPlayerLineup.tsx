import React, {Component} from 'react';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import {PlayerAutoComplete} from '../players/PlayerAutoComplete';
import PlayerLinup from '../users/PlayerLineup';
import {IMatch, Competition} from '../../models/model-interfaces';
import storeUtil from '../../storeUtil';
import { RootState } from '../../store';


type AdminPlayerLineupProps = {}

type AdminPlayerLineupState = {
  comp: Competition;
  playerId: null | number;
}


export class AdminPlayerLineup extends React.Component<AdminPlayerLineupProps, AdminPlayerLineupState> {
  constructor(props) {
    super(props);
    this.state = {comp: 'Vttl', playerId: null};
  }

  render() {
    let playerFormation;
    if (this.state.playerId) {
      const team = storeUtil.getPlayer(this.state.playerId).getTeam(this.state.comp);

      if (!team) {
        playerFormation = (
          <div>Heeft geen vaste ploeg ingesteld (Geen Standard/Captain, misschien enkel als Reserve?)</div>
        );
      } else {
        playerFormation = (
          <PlayerLinup playerId={this.state.playerId} teams={[team]} />
        );
      }
    }

    return (
      <div>
        <AdminPlayerLineupToolbar onFilterChange={(comp, playerId) => this.setState({comp, playerId})} />
        {playerFormation}
      </div>
    );
  }
}

type AdminPlayerLineupToolbarProps = {
  onFilterChange: Function;
}

type AdminPlayerLineupToolbarState = {
  playerId: null | number;
}

class AdminPlayerLineupToolbar extends Component<AdminPlayerLineupToolbarProps, AdminPlayerLineupToolbarState> {
  constructor(props) {
    super(props);
    this.state = {playerId: null};
  }

  render() {
    const {onFilterChange} = this.props;
    return (
      <div style={{padding: 10, display: 'inline-block', width: 300}}>
        <PlayerAutoComplete
          selectPlayer={playerId => typeof playerId === 'number' && this.setState({playerId})}
          label="Selecteer speler"
        />
        <div style={{marginTop: 10}}>
          <Button variant="info" style={{marginRight: 10}} onClick={() => onFilterChange('Vttl', this.state.playerId)}>Vttl</Button>
          <Button variant="info" style={{marginRight: 10}} onClick={() => onFilterChange('Sporta', this.state.playerId)}>Sporta</Button>
          <Button variant="info" onClick={() => onFilterChange('Jeugd', this.state.playerId)}>Jeugd</Button>
        </div>
      </div>
    );
  }
}
