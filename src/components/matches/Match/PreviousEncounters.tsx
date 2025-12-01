import React, {useState} from 'react';
import moment from 'moment';
import Table from 'react-bootstrap/Table';
import { Button, Modal } from 'react-bootstrap';
import {TrophyIcon} from '../../controls/Icons/TrophyIcon';
import {IMatch, PlayerEncounter} from '../../../models/model-interfaces';
import { t } from '../../../locales';
import { useTtcSelector } from '../../../utils/hooks/storeHooks';


export const PreviousEncounters = ({match}: {match: IMatch}) => {
  const ourPlayers = match.getOwnPlayers();
  const ourPlayersUniqueIds = ourPlayers.map(player => player.uniqueIndex);
  const encounters = useTtcSelector(state => state.matchInfo.previousEncounters
    .filter(encounter => encounter.requestMatchId === match.id)
    .filter(encounter => {
      if (ourPlayersUniqueIds.includes(encounter.homePlayerUniqueId)) {
        return true;
      }
      if (ourPlayersUniqueIds.includes(encounter.awayPlayerUniqueId)) {
        return true;
      }
      return false;
    }))
    .sort((a, b) => moment(b.matchDate).diff(moment(a.matchDate)));

  const theirPlayers = match.getTheirPlayers();
  return (
    <div className="match-card-tab-content">
      {ourPlayers.map(player => {
        const playerEncounters = encounters.filter(encounter => encounter.homePlayerUniqueId === player.uniqueIndex
          || encounter.awayPlayerUniqueId === player.uniqueIndex);

        if (playerEncounters.length === 0) {
          return null;
        }

        return (
          <div key={player.playerId}>
            <h2>{player.alias}</h2>
            {theirPlayers.map(theirPlayer => {
              const vsEncounter = playerEncounters.filter(encounter => encounter.homePlayerUniqueId === theirPlayer.uniqueIndex
                || encounter.awayPlayerUniqueId === theirPlayer.uniqueIndex);

              if (!vsEncounter.length) {
                return null;
              }

              return (
                <EncountersTable
                  key={theirPlayer.uniqueIndex}
                  encounters={vsEncounter}
                  ourPlayerUniqueIndex={player.uniqueIndex}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};





export const PreviousEncountersButtonModal = ({encounters, ourPlayerUniqueIndex}: {encounters: PlayerEncounter[], ourPlayerUniqueIndex: number}) => {
  const [open, setOpen] = useState(false);

  if (encounters.length === 0) {
    return null;
  }

  if (!open) {
    return (
      <Button size="sm" variant="outline-info" onClick={() => setOpen(true)} style={{padding: '2px 6px'}}>
        🔄x{encounters.length}
      </Button>
    );
  }

  const names = encounters.find(x => x.awayName && x.homeName) || encounters[0];
  return (
    <Modal size="lg" show onHide={() => setOpen(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>{names.homeName} vs {names.awayName}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <EncountersTable encounters={encounters} ourPlayerUniqueIndex={ourPlayerUniqueIndex} />
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={() => setOpen(false)}>
          {t('common.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};


export const EncountersTable = ({encounters, ourPlayerUniqueIndex}: {encounters: PlayerEncounter[], ourPlayerUniqueIndex: number}) => (
  <Table size="sm" striped>
    <thead>
      <tr>
        <th style={{width: '30%'}}>{t('match.individual.matchTitle')}</th>
        <th style={{width: '30%'}}>Thuis</th>
        <th style={{width: '30%'}}>Bezoeker</th>
        <th style={{width: '10%'}}>{t('match.individual.resultTitle')}</th>
      </tr>
    </thead>
    <tbody>
      {encounters.map(encounter => {
        const home = encounter.homePlayerUniqueId === ourPlayerUniqueIndex;
        const won = (home && encounter.homePlayerSets > encounter.awayPlayerSets)
          || (!home && encounter.awayPlayerSets > encounter.homePlayerSets);

        const date = moment(encounter.matchDate).format('D/M/YYYY');
        return (
          <tr key={encounter.matchId}>
            <td>
              {won && <TrophyIcon style={{marginRight: 6}} />}
              {encounter.competition} {date}
            </td>
            <td>{encounter.homeName} <small>({encounter.homeRanking})</small></td>
            <td>{encounter.awayName} <small>({encounter.awayRanking})</small></td>
            <td>{encounter.homePlayerSets}-{encounter.awayPlayerSets}</td>
          </tr>
        );
      })}
    </tbody>
  </Table>
);
