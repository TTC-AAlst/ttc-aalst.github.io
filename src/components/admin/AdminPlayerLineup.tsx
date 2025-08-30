import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import {PlayerAutoComplete} from '../players/PlayerAutoComplete';
import PlayerLinup from '../users/PlayerLineup';
import {Competition} from '../../models/model-interfaces';
import storeUtil from '../../storeUtil';
import { selectTeams, selectUser, useTtcSelector } from '../../utils/hooks/storeHooks';


type AdminPlayerLineupState = {
  comp: Competition;
  playerId: null | number;
}


export const AdminPlayerLineup = () => {
  const [state, setState] = useState<AdminPlayerLineupState>({ comp: 'Vttl', playerId: null });
  const allTeams = useTtcSelector(selectTeams);
  const player = storeUtil.getPlayer(state.playerId ?? 0);
  const teams = allTeams
    .filter(team => team.competition === state.comp)
    .filter(team => team.players.some(ply => ply.playerId === player?.id));

  let playerFormation: React.ReactNode;
  if (state.playerId) {
    if (!teams.length) {
      playerFormation = (
        <div>Heeft geen vaste ploeg ingesteld (Geen Standard/Captain, misschien enkel als Reserve?)</div>
      );
    } else {
      playerFormation = (
        <PlayerLinup playerId={state.playerId} teams={teams} />
      );
    }
  }

  return (
    <div>
      <AdminPlayerLineupToolbar onFilterChange={(comp, playerId) => setState({ comp, playerId })} />
      {playerFormation}
    </div>
  );
};



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
