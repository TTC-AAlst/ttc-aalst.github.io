import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import {PlayerAutoComplete} from '../players/PlayerAutoComplete';
import PlayerLinup from '../users/PlayerLineup';
import {Competition} from '../../models/model-interfaces';
import storeUtil from '../../storeUtil';
import { useTtcSelector } from '../../utils/hooks/storeHooks';


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
  onFilterChange: (competition: Competition, playerId: number | null) => void;
};

const AdminPlayerLineupToolbar = ({ onFilterChange }: AdminPlayerLineupToolbarProps) => {
  const hasYouthTeam = useTtcSelector(state => state.teams.some(team => team.competition === 'Jeugd'));
  const [playerId, setPlayerId] = useState<number | null>(null);

  return (
    <div style={{ padding: 10, display: 'inline-block', width: 300 }}>
      <PlayerAutoComplete
        selectPlayer={id => typeof id === 'number' && setPlayerId(id)}
        label="Selecteer speler"
      />
      <div style={{ marginTop: 10 }}>
        <Button variant="info" style={{ marginRight: 10 }} onClick={() => onFilterChange('Vttl', playerId)}>
          Vttl
        </Button>
        <Button variant="info" style={{ marginRight: 10 }} onClick={() => onFilterChange('Sporta', playerId)}>
          Sporta
        </Button>
        {hasYouthTeam && (
          <Button variant="info" onClick={() => onFilterChange('Jeugd', playerId)}>
            Jeugd
          </Button>
        )}
      </div>
    </div>
  );
};
