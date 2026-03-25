import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import { getOpponentFormations } from '../../../storeUtil';
import { PlayerRankings } from '../controls/MatchPlayerRankings';
import { t } from '../../../locales';
import { IMatch, ITeamOpponent } from '../../../models/model-interfaces';

type OpponentsTeamFormationProps = {
  matches: IMatch[];
  opponent?: ITeamOpponent;
  hideHeader?: boolean;
  limitRows?: boolean;
}

const INITIAL_ROW_LIMIT = 5;

export const OpponentsTeamFormation = ({matches, opponent, hideHeader, limitRows}: OpponentsTeamFormationProps) => {
  const [showAll, setShowAll] = useState(false);
  const formations = getOpponentFormations(matches, opponent)
    .filter(f => f.value > 0) // Filter out forfeits with no real players
    .sort((a, b) => b.value - a.value);

  const shouldLimit = limitRows && !showAll && formations.length > INITIAL_ROW_LIMIT;
  const displayedFormations = shouldLimit ? formations.slice(0, INITIAL_ROW_LIMIT) : formations;

  return (
    <Table size="sm" striped style={{maxWidth: 250}}>
      {!hideHeader ? (
        <thead>
          <tr>
            <th colSpan={2}>{t('common.teamFormation')}</th>
            <th style={{width: 80}}>{t('comp.sporta.rankingValue')}</th>
          </tr>
        </thead>
      ) : null}
      <tbody>
        {displayedFormations.map(formation => (
          <tr key={formation.key}>
            <td>{formation.amount}x</td>

            <td>
              <PlayerRankings formation={formation.details} />
            </td>

            <td>{formation.value}</td>
          </tr>
        ))}
        {shouldLimit && (
          <tr>
            <td colSpan={3} style={{textAlign: 'right'}}>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowAll(true)}>
                Meer tonen
              </button>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};
