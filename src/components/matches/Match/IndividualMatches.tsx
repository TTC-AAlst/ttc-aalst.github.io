import React, {useState} from 'react';
import { createSelector } from '@reduxjs/toolkit';
import cn from 'classnames';
import moment from 'moment';
import Table from 'react-bootstrap/Table';
import { Button, Modal } from 'react-bootstrap';
import {matchOutcome} from '../../../models/MatchModel';
import {OpponentPlayerLabel} from './OpponentPlayer';
import {TrophyIcon} from '../../controls/Icons/TrophyIcon';
import {PlayerLink} from '../../players/controls/PlayerLink';
import {FrenoyLink} from '../../controls/Buttons/FrenoyButton';
import {IMatch, Competition, IGetGameMatches, IMatchPlayer, PlayerEncounter} from '../../../models/model-interfaces';
import { t } from '../../../locales';
import storeUtil from '../../../storeUtil';
import { useViewport } from '../../../utils/hooks/useViewport';
import { useTtcSelector } from '../../../utils/hooks/storeHooks';
import { RootState } from '../../../store';

type IndividualMatchesProps = {
  match: IMatch;
  ownPlayerId: number;
}


export const IndividualMatches = ({match, ownPlayerId}: IndividualMatchesProps) => {
  const [pinnedPlayerId, setPinnedPlayerId] = useState<number | null>(ownPlayerId);
  const matchResult = {home: 0, out: 0};

  if (match.games.length === 0) {
    return <PreviousEncounters match={match} />;
  }

  return (
    <Table size="sm" striped className="match-card-tab-table">
      <thead>
        <tr>
          <th colSpan={2}>{t('match.individual.matchTitle')} {match.frenoyMatchId}</th>
          <th className="d-none d-sm-table-cell">{t('match.individual.setsTitle')}</th>
          <th>{t('match.individual.resultTitle')}</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {match.getGameMatches().sort((a, b) => a.matchNumber - b.matchNumber).map(game => {
          matchResult[game.homeSets > game.outSets ? 'home' : 'out']++;
          const matchWonTrophy = game.outcome === matchOutcome.Won ? <TrophyIcon style={{marginRight: 6}} /> : null;
          return (
            <tr
              key={game.matchNumber}
              className={cn({
                success: game.ownPlayer.playerId === pinnedPlayerId && game.outcome === matchOutcome.Won,
                danger: game.ownPlayer.playerId === pinnedPlayerId && game.outcome !== matchOutcome.Won,
                accentuate: game.ownPlayer.playerId === ownPlayerId,
              })}
              onClick={() => setPinnedPlayerId(pinnedPlayerId === game.ownPlayer.playerId ? null : game.ownPlayer.playerId)}
            >
              {!game.isDoubles ? ([
                <td className={cn({accentuate: game.outcome === matchOutcome.Won})} key="1">
                  {matchWonTrophy}
                  <PlayerDesc player={game.home} competition={match.competition} />
                </td>,
                <td className={cn({accentuate: game.outcome === matchOutcome.Won})} key="2">
                  <PlayerDesc player={game.out} competition={match.competition} />
                </td>,
              ]) : (
                <td className={cn({accentuate: game.outcome === matchOutcome.Won})} key="2" colSpan={2}>
                  {matchWonTrophy}
                  {t('match.double')}
                </td>
              )}
              <td key="3" className="d-none d-sm-table-cell">{game.homeSets}-{game.outSets}</td>
              <td key="4">{matchResult.home}-{matchResult.out}</td>
              <td key="5">
                {game.isDoubles ? <span>&nbsp;</span> : <PreviousEncountersButtonModal matchId={match.id} players={game} />}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};


const PreviousEncounters = ({match}: {match: IMatch}) => {
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
                  ourPlayer={player}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};


const selectPreviousEncounters = createSelector(
  [
    (state: RootState) => state.matchInfo.previousEncounters,
    (_, matchId: number) => matchId,
    (_, __, players: IGetGameMatches) => players,
  ],
  (previousEncounters, matchId, players) => previousEncounters
    .filter(encounter => encounter.requestMatchId === matchId)
    .filter(encounter => {
      if (encounter.awayPlayerUniqueId === players.home.uniqueIndex && encounter.homePlayerUniqueId === players.out.uniqueIndex) {
        return true;
      }
      if (encounter.awayPlayerUniqueId === players.out.uniqueIndex && encounter.homePlayerUniqueId === players.home.uniqueIndex) {
        return true;
      }
      return false;
    })
    .sort((a, b) => moment(b.matchDate).diff(moment(a.matchDate))),
);


const PreviousEncountersButtonModal = ({matchId, players}: {matchId: number, players: IGetGameMatches}) => {
  const [open, setOpen] = useState(false);
  const encounters = useTtcSelector(state => selectPreviousEncounters(state, matchId, players));

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
        <EncountersTable encounters={encounters} ourPlayer={players.home.playerId ? players.home : players.out} />
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={() => setOpen(false)}>
          {t('common.close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};


const EncountersTable = ({encounters, ourPlayer}: {encounters: PlayerEncounter[], ourPlayer: IMatchPlayer}) => (
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
        const home = encounter.homePlayerUniqueId === ourPlayer.uniqueIndex;
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



type PlayerDescProps = {
  player: IMatchPlayer;
  competition: Competition;
}

const PlayerDesc = ({player, competition}: PlayerDescProps) => {
  const viewport = useViewport();
  if (!player.playerId) {
    return <OpponentPlayerLabel player={player} competition={competition} fullName />;
  }

  const realPlayer = storeUtil.getPlayer(player.playerId);
  if (realPlayer) {
    return <PlayerLink player={realPlayer} alias={viewport.width < 700} />;
  }
  return <span>{player.alias}</span>;
};







export const ReadonlyIndividualMatches = ({match}: {match: IMatch}) => {
  const [pinnedPlayerIndex, setPinnedPlayerIndex] = useState(0);
  const matchResult = {home: 0, out: 0};

  return (
    <Table striped size="sm" className="match-card-tab-table">
      <thead>
        <tr>
          <th colSpan={2}>{t('match.report.title')}</th>
          <th>{t('match.individual.setsTitle')}</th>
          <th><span className="d-none d-sm-inline">{t('match.individual.resultTitle')}</span></th>
        </tr>
      </thead>
      <tbody>
        {match.getGameMatches().sort((a, b) => a.matchNumber - b.matchNumber).map(game => {
          matchResult[game.homeSets > game.outSets ? 'home' : 'out']++;
          const highlightRow = game.home?.uniqueIndex === pinnedPlayerIndex || game.out?.uniqueIndex === pinnedPlayerIndex;
          return (
            <tr key={game.matchNumber} className={cn({success: highlightRow})}>
              {!game.isDoubles ? ([
                <td key="1">
                  <ReadonlyMatchPlayerLabel
                    competition={match.competition}
                    game={game}
                    homePlayer
                    onClick={() => setPinnedPlayerIndex(game.home.uniqueIndex)}
                  />
                </td>,
                <td key="2">
                  <ReadonlyMatchPlayerLabel
                    competition={match.competition}
                    game={game}
                    homePlayer={false}
                    onClick={() => setPinnedPlayerIndex(game.out.uniqueIndex)}
                  />
                </td>,
              ]) : (
                <td key="2" colSpan={2}>{t('match.double')}</td>
              )}
              <td key="3">{game.homeSets}-{game.outSets}</td>
              <td key="4">{matchResult.home}-{matchResult.out}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};


type ReadonlyMatchPlayerLabelProps = {
  game: IGetGameMatches;
  homePlayer: boolean;
  competition: Competition;
  onClick: Function;
}


const ReadonlyMatchPlayerLabel = ({game, homePlayer, competition, onClick}: ReadonlyMatchPlayerLabelProps) => {
  const viewport = useViewport();
  const ply = homePlayer ? game.home : game.out;
  const won = (homePlayer && game.outcome === matchOutcome.Won) || (!homePlayer && game.outcome === matchOutcome.Lost);
  return (
    <span className={cn({accentuate: won})} style={{display: 'inline-block'}}>
      {won && viewport.width > 500 ? <TrophyIcon style={{marginRight: 8}} /> : null}
      <span role="button" onClick={() => onClick()} className="clickable" tabIndex={0}>
        {viewport.width > 800 ? ply.name : ply.alias}
      </span>
      &nbsp;&nbsp;
      {viewport.width > 350 && (
        <FrenoyLink competition={competition} uniqueIndex={ply.uniqueIndex}>
          {viewport.width > 400 ? `${ply.ranking} ` : null}
        </FrenoyLink>
      )}
    </span>
  );
};
