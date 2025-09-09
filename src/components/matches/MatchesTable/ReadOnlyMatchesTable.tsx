import React from 'react';
import { Table } from 'react-bootstrap';
import { MatchesTableDateCell, MatchesTableFrenoyLinkCell, MatchesTableHeader,
  MatchesTableMatchVsCell, ReadOnlyMatchPlayers } from './MatchesTableCells';
import { IMatch } from '../../../models/model-interfaces';
import { getRowStripeColor } from './matchesTableUtil';
import { selectUser, useTtcSelector } from '../../../utils/hooks/storeHooks';
import { ViewMatchDetailsButton } from '../controls/ViewMatchDetailsButton';
import { useViewport } from '../../../utils/hooks/useViewport';

type ReadOnlyMatchesTableProps = {
  forceStripes: boolean;
  matches: IMatch[];
  ownTeamLink?: 'main' | 'matches' | 'ranking' | 'players' | 'matchesTable' | 'week';
  allowOpponentOnly?: boolean;
}

export const ReadOnlyMatchesTable = ({matches, forceStripes, ownTeamLink, allowOpponentOnly}: ReadOnlyMatchesTableProps) => {
  const user = useTtcSelector(selectUser);
  const viewport = useViewport();
  return (
    <Table className="matches-table">
      <MatchesTableHeader editMode={false} matches={matches} />
      {matches.map((match, i) => {
        const stripeColor = {backgroundColor: getRowStripeColor(i, match, user.playerId, forceStripes)};
        return (
          <tbody key={match.id}>
            <tr style={stripeColor}>
              <MatchesTableDateCell match={match} matches={matches} />
              <MatchesTableFrenoyLinkCell match={match} />
              <MatchesTableMatchVsCell match={match} ownTeamLink={ownTeamLink} allowOpponentOnly={allowOpponentOnly} />
              <td><ViewMatchDetailsButton match={match} size={viewport.width < 600 ? 'sm' : null} /></td>
            </tr>
            {(match.block || match.isSyncedWithFrenoy) && (
              <tr style={stripeColor}>
                <td colSpan={4} style={{border: 'none', paddingTop: 0}}>
                  <ReadOnlyMatchPlayers match={match} displayNonBlocked={false} />
                </td>
              </tr>
            )}
          </tbody>
        );
      })}
    </Table>
  );
};
