import React from 'react';
import { createSelector } from '@reduxjs/toolkit';
import moment from 'moment';
import Table from 'react-bootstrap/Table';
import { OpponentPlayerLabel } from './OpponentPlayer';
import { Spinner } from '../../controls/controls/Spinner';
import { ThumbsUpIcon, ThumbsDownIcon } from '../../controls/Icons/ThumbsIcons';
import { ITeamOpponent, IMatch, IMatchPlayer, IPlayer } from '../../../models/model-interfaces';
import { t } from '../../../locales';
import { useViewport } from '../../../utils/hooks/useViewport';
import { selectUser, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { selectOpponentMatches } from '../../../reducers/selectors/selectOpponentMatches';
import { RootState } from '../../../store';
import storeUtil from '../../../storeUtil';
import { PreviousEncountersButtonModal } from './PreviousEncounters';


type OpponentsFormationProps = {
  match: IMatch,
  opponent: ITeamOpponent,
}

interface IMatchFormation {
  player: IMatchPlayer;
  count: number;
  won: number;
}

function getFormation(match: IMatch, matches: ReturnType<typeof selectOpponentMatches>) {
  let opponentPlayers: IMatchPlayer[] = matches.home.map(m => m.players).flat().filter(m => m.home);
  opponentPlayers = opponentPlayers.concat(matches.away.map(m => m.players).flat().filter(m => !m.home));

  // TODO: this assumes that if you forfeited, you lost that match (ply has won but not lost property)
  // could be calculated more correctly by looking at the individual match results
  const result: {[key: number]: IMatchFormation} = {};
  opponentPlayers.forEach(ply => {
    if (result[ply.uniqueIndex]) {
      result[ply.uniqueIndex].count++;
      result[ply.uniqueIndex].won += +ply.won || 0;

    } else {
      result[ply.uniqueIndex] = {
        player: ply,
        count: 1,
        won: +ply.won || 0,
      };
    }
  });

  const matchesPerPlayer = match.getTeamPlayerCount();
  return Object.values(result).map(ply => Object.assign(ply, {lost: (matchesPerPlayer * ply.count) - ply.won}));
}


export const OpponentsFormation = ({match, opponent}: OpponentsFormationProps) => {
  const viewport = useViewport();
  const user = useTtcSelector(selectUser);
  const opponentMatches = useTtcSelector(state => selectOpponentMatches(state, match, opponent));
  const formations = getFormation(match, opponentMatches)
    .sort((a, b) => b.count - a.count);

  if (formations.length === 0) {
    return <div className="match-card-tab-content"><h3><Spinner /></h3></div>;
  }

  const showTimesPlayed = viewport.width > 600;
  const currentPlayer = user?.playerId ? storeUtil.getPlayer(user.playerId) : null;

  return (
    <Table size="sm" striped className="match-card-tab-table">
      <thead>
        <tr>
          <th>{t('match.opponents.player')}</th>
          {showTimesPlayed ? <th>{t('match.opponents.timesPlayed')}</th> : null}
          <th colSpan={2}>{t('match.opponents.victories')}</th>
          {currentPlayer ? <th>&nbsp;</th> : null}
        </tr>
      </thead>
      <tbody>
        {formations.map(f => (
          <tr key={f.player.uniqueIndex}>
            <td>
              <OpponentPlayerLabel player={f.player} competition={match.competition} />
            </td>
            {showTimesPlayed ? <td>{f.count}</td> : null}
            <td>
              <ThumbsUpIcon />
              {f.won}

              <ThumbsDownIcon style={{marginLeft: 8}} />
              {f.lost}
            </td>
            <td>{`${((f.won / (f.lost + f.won)) * 100).toFixed(0)}%`}</td>
            {currentPlayer ? (
              <td>
                <PreviousEncountersButton
                  ourPlayer={currentPlayer}
                  opponent={f.player}
                  match={match}
                />
              </td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};


const selectPreviousEncounters = createSelector(
  [
    (state: RootState) => state.matchInfo.previousEncounters,
    (_, ourPlayer: IPlayer) => ourPlayer,
    (_, __, opponent: IMatchPlayer) => opponent,
    (_, __, ___, match: IMatch) => match,
  ],
  (previousEncounters, ourPlayer, opponent, match) => previousEncounters
    .filter(encounter => encounter.requestMatchId === match.id)
    .filter(encounter => {
      if (encounter.awayPlayerUniqueId === ourPlayer.getCompetition(match.competition)?.uniqueIndex && encounter.homePlayerUniqueId === opponent.uniqueIndex) {
        return true;
      }
      if (encounter.awayPlayerUniqueId === opponent.uniqueIndex && encounter.homePlayerUniqueId === ourPlayer.getCompetition(match.competition)?.uniqueIndex) {
        return true;
      }
      return false;
    })
    .sort((a, b) => moment(b.matchDate).diff(moment(a.matchDate))),
);


const PreviousEncountersButton = ({ourPlayer, opponent, match}: {ourPlayer: IPlayer, opponent: IMatchPlayer, match: IMatch}) => {
  const encounters = useTtcSelector(state => selectPreviousEncounters(state, ourPlayer, opponent, match));
  return (
    <PreviousEncountersButtonModal
      encounters={encounters}
      ourPlayerUniqueIndex={ourPlayer.getCompetition(match.competition)?.uniqueIndex ?? 0}
    />
  );
};
