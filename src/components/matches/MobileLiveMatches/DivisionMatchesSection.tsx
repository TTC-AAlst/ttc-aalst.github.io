import React, { useState, useEffect } from 'react';
import { Modal, Table } from 'react-bootstrap';
import { IMatch } from '../../../models/model-interfaces';
import { OtherMatchPlayerResults } from '../Match/OtherMatchPlayerResults';
import { ReadonlyIndividualMatches } from '../Match/IndividualMatches';
import { OpponentMatchScore } from '../Match/OpponentMatchScore';
import { selectReadOnlyMatches, useTtcDispatch, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { frenoyReadOnlyMatchSync } from '../../../reducers/readonlyMatchesReducer';

type DivisionMatchesSectionProps = {
  match: IMatch;
};

export const DivisionMatchesSection = ({ match }: DivisionMatchesSectionProps) => {
  const dispatch = useTtcDispatch();
  const readonlyMatches = useTtcSelector(selectReadOnlyMatches);
  const [expandedMatch, setExpandedMatch] = useState<number | null>(null);
  const [modalMatch, setModalMatch] = useState<IMatch | null>(null);

  const team = match.getTeam();
  const competition = team.competition === 'Sporta' ? 'Sporta' : 'Vttl';

  const todayDivisionMatches = readonlyMatches
    .filter(m => m.competition === competition)
    .filter(m => m.frenoyDivisionId === team.frenoy.divisionId)
    .filter(m => m.shouldBePlayed && m.isBeingPlayed())
    .filter(m => !m.isOurMatch);

  // Auto-sync every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      todayDivisionMatches.forEach(m => dispatch(frenoyReadOnlyMatchSync(m)));
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [todayDivisionMatches, dispatch]);

  if (todayDivisionMatches.length === 0) {
    return <div style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', padding: 8 }}>Geen andere wedstrijden vandaag</div>;
  }

  const handleRowClick = (matchId: number) => {
    setExpandedMatch(expandedMatch === matchId ? null : matchId);
  };

  const handleFullView = (m: IMatch) => {
    setModalMatch(m);
  };

  return (
    <div>
      <Table size="sm" striped hover style={{ marginBottom: 0 }}>
        <tbody>
          {todayDivisionMatches.map(m => (
            <React.Fragment key={m.id}>
              <tr
                style={{ cursor: 'pointer' }}
                onClick={() => handleRowClick(m.id)}
              >
                <td style={{ whiteSpace: 'nowrap' }}>
                  {m.getClub('home')?.name} {m.home.teamCode}
                </td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>
                  <OpponentMatchScore match={m} />
                </td>
                <td style={{ whiteSpace: 'nowrap', textAlign: 'right' }}>
                  {m.getClub('away')?.name} {m.away.teamCode}
                </td>
              </tr>
              {expandedMatch === m.id && (
                <tr>
                  <td colSpan={3} style={{ padding: 8 }}>
                    <OtherMatchPlayerResults match={m} onFullView={handleFullView} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>

      <Modal show={!!modalMatch} onHide={() => setModalMatch(null)} fullscreen style={{ zIndex: 99999 }}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMatch?.getClub('home')?.name} {modalMatch?.home.teamCode} vs {modalMatch?.getClub('away')?.name} {modalMatch?.away.teamCode}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: 6 }}>
          {modalMatch && <ReadonlyIndividualMatches match={modalMatch} />}
        </Modal.Body>
      </Modal>
    </div>
  );
};
