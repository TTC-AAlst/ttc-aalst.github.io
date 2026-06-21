import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { renderWithProviders, TestRouter } from '../../../../utils/test-utils';
import { ReadOnlyMatchPlayers } from '../MatchesTableCells';
import { IMatch, IMatchPlayer, IMatchPlayerInfo } from '../../../../models/model-interfaces';

vi.mock('../../../../storeUtil', () => ({ default: {} }));
// Tag which branch rendered: OwnPlayer = the "all played players" branch, badge = the formation branch.
vi.mock('../../Match/OwnPlayer', () => ({ default: ({ ply }: { ply: IMatchPlayer }) => <span>OWN:{ply.alias}</span> }));
vi.mock('../../../players/PlayerBadges', () => ({
  PlayerCompetitionBadge: ({ plyInfo }: { plyInfo: IMatchPlayerInfo }) => <span>FORM:{plyInfo.player.alias}</span>,
}));
vi.mock('../../Match/MatchBlock', () => ({ MatchBlock: () => null }));

const bench = (alias: string, i: number): IMatchPlayer => ({ playerId: i, alias, status: 'Play', home: true, position: i }) as unknown as IMatchPlayer;
const major = (alias: string, i: number): IMatchPlayerInfo =>
  ({ id: i, player: { alias } as unknown, matchPlayer: { status: 'Major' } }) as unknown as IMatchPlayerInfo;

// A synced WALKOVER: getOwnPlayers still holds every pre-match selection (no game cleanup),
// while getPlayerFormation('onlyFinal') is the real 4-man lineup (status === Major).
const woMatch = (): IMatch =>
  ({
    isSyncedWithFrenoy: true,
    scoreType: 'WalkOver',
    block: 'Major',
    getOwnPlayers: () => [bench('Bench1', 1), bench('Bench2', 2), bench('Bench3', 3)],
    getPlayerFormation: (f: string) => (f === 'onlyFinal' ? [major('Major1', 11), major('Major2', 12)] : []),
  }) as unknown as IMatch;

describe('ReadOnlyMatchPlayers — walkover', () => {
  it('shows only the blocked formation, not every selected player', () => {
    renderWithProviders(
      <TestRouter>
        <ReadOnlyMatchPlayers match={woMatch()} displayNonBlocked={false} />
      </TestRouter>,
    );
    expect(screen.getByText('FORM:Major1')).toBeInTheDocument();
    expect(screen.getByText('FORM:Major2')).toBeInTheDocument();
    expect(screen.queryByText('OWN:Bench1')).not.toBeInTheDocument();
  });
});
