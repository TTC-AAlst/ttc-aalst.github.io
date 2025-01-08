import React from 'react';
import Table from 'react-bootstrap/Table';
import { OpponentPlayerLabel } from './OpponentPlayer';
import { Spinner } from '../../controls/controls/Spinner';
import { ThumbsUpIcon, ThumbsDownIcon } from '../../controls/Icons/ThumbsIcons';
import { ITeamOpponent, IMatch, IMatchPlayer } from '../../../models/model-interfaces';
import { t } from '../../../locales';
import { useViewport } from '../../../utils/hooks/useViewport';
import { useTtcSelector } from '../../../utils/hooks/storeHooks';
import { selectOpponentMatches } from '../../../reducers/selectors/selectOpponentMatches';

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
  const opponentMatches = useTtcSelector(state => selectOpponentMatches(state, match, opponent));
  const formations = getFormation(match, opponentMatches)
    .sort((a, b) => b.count - a.count);

  if (formations.length === 0) {
    return <div className="match-card-tab-content"><h3><Spinner /></h3></div>;
  }

  const showTimesPlayed = viewport.width > 600;

  return (
    <Table size="sm" striped className="match-card-tab-table">
      <thead>
        <tr>
          <th>{t('match.opponents.player')}</th>
          {showTimesPlayed ? <th>{t('match.opponents.timesPlayed')}</th> : null}
          <th colSpan={2}>{t('match.opponents.victories')}</th>
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
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
