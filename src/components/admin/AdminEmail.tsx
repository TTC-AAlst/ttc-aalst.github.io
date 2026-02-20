import React, { useEffect, useState } from 'react';
import { ButtonStack } from '../controls/Buttons/ButtonStack';
import { IStorePlayer } from '../../models/model-interfaces';
import { selectPlayers, selectQuitters, useTtcDispatch, useTtcSelector } from '../../utils/hooks/storeHooks';
import { fetchQuitters } from '../../reducers/playersReducer';

type Pages = 'all' | 'inactive' | 'comp' | 'vttl' | 'sporta' | 'captains' | 'bestuur';


export const AdminEmail = () => {
  const dispatch = useTtcDispatch();
  const activePlayers = useTtcSelector(selectPlayers);
  const quitters = useTtcSelector(selectQuitters);
  const [filter, setFilter] = useState<Pages>('all');

  useEffect(() => {
    if (!quitters.length) {
      dispatch(fetchQuitters());
    }
  }, [dispatch, quitters.length]);

  const filterPlayers = () => {
    if (filter === 'inactive') {
      return quitters;
    }

    switch (filter) {
      case 'comp':
        return activePlayers.filter(p => p.vttl || p.sporta);
      case 'vttl':
        return activePlayers.filter(p => p.vttl);
      case 'sporta':
        return activePlayers.filter(p => p.sporta);
      case 'bestuur':
        return activePlayers.filter(p => p.security === 'Board' || p.security === 'Dev');
      case 'captains':
        return activePlayers.filter(p => p.getTeams().some(team => team.isCaptain(p)));
      default:
        return activePlayers;
    }
  };

  const viewsConfig = [
    { key: 'all', text: 'Alle' },
    { key: 'comp', text: 'Competitie' },
    { key: 'captains', text: 'Kapiteinen' },
    { key: 'vttl', text: 'Vttl' },
    { key: 'sporta', text: 'Sporta' },
    { key: 'bestuur', text: 'Bestuur' },
    { key: 'inactive', text: 'Inactives' },
  ];

  const selectedPlayers = filterPlayers().sort((a, b) => a.alias.localeCompare(b.alias));
  const emails = selectedPlayers
    .filter(p => p.contact && p.contact.email)
    .map(p => `"${p.firstName} ${p.lastName}" <${p.contact.email.trim()}>`);
  const emailsWithoutName = selectedPlayers
    .filter(p => p.contact && p.contact.email)
    .map(p => p.contact.email.trim());

  return (
    <div style={{ paddingLeft: 15 }}>
      <h1>Email adressen</h1>
      <ButtonStack
        config={viewsConfig}
        activeView={filter}
        onClick={newFilter => setFilter(newFilter as Pages)}
      />

      <span style={{ marginLeft: 6 }}>
        # {selectedPlayers.length}
      </span>

      <div className="row" style={{ marginTop: 25 }}>
        <div className="col-md-6">
          {selectedPlayers.map(p => <PlayerEmail player={p} key={p.id} />)}
        </div>

        <div className="col-md-6">
          <textarea
            style={{ width: '100%', height: 300 }}
            value={emails.join('\n')}
            onChange={() => true}
          />
        </div>

        <div className="col-md-6">
          <textarea
            style={{ width: '100%', height: 300 }}
            value={emailsWithoutName.join(';\n')}
            onChange={() => true}
          />
        </div>
      </div>
    </div>
  );
};


const PlayerEmail = ({player}: {player: IStorePlayer}) => (
  <span style={{whiteSpace: 'normal', marginRight: 7, paddingTop: 15}}>
    <span className="badge label-as-badge bg-success" key={player.id} style={{fontSize: 12, fontWeight: 'normal'}}>
      {player.firstName} {player.lastName}
    </span>
    {' '}
  </span>
);
