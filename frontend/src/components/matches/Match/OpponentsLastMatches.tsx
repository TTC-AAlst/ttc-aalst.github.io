import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import IconButton from '@mui/material/IconButton';
import {OtherMatchPlayerResultsTableRow} from './OtherMatchPlayerResults';
import {MatchPlayerRankings} from '../controls/MatchPlayerRankings';
import {Spinner} from '../../controls/controls/Spinner';
import { IMatch, ITeamOpponent } from '../../../models/model-interfaces';
import { t } from '../../../locales';
import { useViewport } from '../../../utils/hooks/useViewport';
import { selectReadOnlyMatches, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { Icon } from '../../controls/Icons/Icon';

const AmountOfOpponentMatchesToShow = 5;

type OpponentsLastMatchesProps = {
  match: IMatch;
}

export const OpponentsLastMatches = ({match}: OpponentsLastMatchesProps) => {
  const [showAll, setShowAll] = useState(false);
  const [showDetails, setShowDetails] = useState<{[matchId: number]: boolean}>({});
  const viewport = useViewport();
  const allReadOnlyMatches = useTtcSelector(selectReadOnlyMatches);

  const isOpponent = (opp: ITeamOpponent) => opp.clubId === match.opponent.clubId && opp.teamCode === match.opponent.teamCode;
  let readonlyMatches = allReadOnlyMatches
    .filter(m => isOpponent(m.home) || isOpponent(m.away))
    .filter(m => m.competition === match.competition && m.frenoyDivisionId === match.frenoyDivisionId)
    .filter(m => m.score && (m.score.home || m.score.out))
    .filter(m => m.id !== match.id)
    .sort((a, b) => b.date.valueOf() - a.date.valueOf());

  const widthRemoveColumn = 750; // combine Home&Away columns to just one Opponent column on small devices
  const totalMatches = readonlyMatches.length;

  if (!showAll) {
    readonlyMatches = readonlyMatches.slice(0, AmountOfOpponentMatchesToShow);
  }
  if (readonlyMatches.length === 0) {
    // If they haven't played any games yet, the spinner will never go away
    return <div className="match-card-tab-content"><h3><Spinner /></h3></div>;
  }

  return (
    <Table size="sm" className="match-card-tab-table">
      <thead>
        <tr>
          <th key="1" className="d-none d-sm-table-cell">{t('common.date')}</th>
          <th key="7" className="d-none d-md-table-cell">{t('common.frenoy')}</th>
          {viewport.width > widthRemoveColumn ? [
            <th key="2">{t('match.opponents.homeTeam')}</th>,
            <th key="3">{t('match.opponents.awayTeam')}</th>,
          ] : (
            <th key="4">{t('match.opponents.vsTeam')}</th>
          )}
          <th key="5">{t('common.teamFormation')}</th>
          <th key="6">{t('match.opponents.outcome')}</th>
        </tr>
      </thead>
      <tbody>
        {readonlyMatches.map(m => {
          const isHomeMatch = m.home.clubId === match.opponent.clubId && m.home.teamCode === match.opponent.teamCode;
          return [
            <tr
              key={m.id}
              className={`clickable ${m.won(match.opponent) ? 'accentuate success' : ''}`}
              onClick={() => setShowDetails({...showDetails, [m.id]: !showDetails[m.id]})}
            >

              <td key="1" className="d-none d-sm-table-cell">{m.getDisplayDate(viewport.width > widthRemoveColumn ? 'd' : 's')}</td>
              <td key="7" className="d-none d-md-table-cell">{m.frenoyMatchId}</td>
              {viewport.width > widthRemoveColumn ? [
                <td key="2">{m.getClub('home')?.name} {m.home.teamCode}</td>,
                <td key="3">{m.getClub('away')?.name} {m.away.teamCode}</td>,
              ] : (
                <td key="4">
                  {isHomeMatch && <Icon fa="fa fa-home" style={{ marginRight: 4, color: '#666' }} />}
                  {isHomeMatch ? (
                    `${m.getClub('away')?.name} ${m.away.teamCode}`
                  ) : (
                    `${m.getClub('home')?.name} ${m.home.teamCode}`
                  )}
                </td>
              )}

              <td key="5"><MatchPlayerRankings match={m} homeTeam={isHomeMatch} /></td>

              <td key="6">
                {m.won(match.opponent) && <Icon fa="fa fa-trophy" style={{ marginRight: 4, color: '#f1c40f' }} />}
                {m.score.home}&nbsp;-&nbsp;{m.score.out}
              </td>
            </tr>,
            <OtherMatchPlayerResultsTableRow key="8" show={showDetails[m.id]} match={m} colSpan={5} />,
          ];
        })}
        {!showAll && totalMatches > AmountOfOpponentMatchesToShow ? (
          <tr key="showAll">
            <td colSpan={5} style={{textAlign: 'center'}}>
              <IconButton onClick={() => setShowAll(true)}>
                <i className="fa fa-chevron-circle-down" />
              </IconButton>
            </td>
          </tr>
        ) : null}
      </tbody>
    </Table>
  );
};
