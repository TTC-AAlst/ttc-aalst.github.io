import React from 'react';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, beforeEach, afterEach } from 'vitest';
import { renderWithProviders } from '../../../../utils/test-utils';
import { MobileLiveMatches } from '../MobileLiveMatches';
import { IMatch } from '../../../../models/model-interfaces';

vi.mock('../../../../storeUtil', () => ({
  default: {
    getTeam: vi.fn(),
    getTeams: vi.fn().mockReturnValue([]),
    getClub: vi.fn(),
    getPlayer: vi.fn(),
    getMatch: vi.fn(),
    getMatches: vi.fn().mockReturnValue([]),
    matches: { getAllMatches: vi.fn().mockReturnValue([]) },
  },
}));

vi.mock('../../../../utils/httpClient', () => ({
  default: {
    get: vi.fn().mockResolvedValue([]),
    post: vi.fn().mockResolvedValue({}),
  },
}));

const createMockMatch = (id: number): IMatch => ({
  id,
  competition: 'Vttl',
  frenoyDivisionId: 1,
  frenoyMatchId: `OVLH01/00${id}`,
  games: [],
  players: [],
  comments: [],
  block: 'Major',
  isHomeMatch: true,
  description: '',
  opponent: { clubId: 10, teamCode: 'A' },
  teamId: id,
  date: { isBefore: () => true, subtract: () => ({ isBefore: () => true }), format: () => '19:00', isSame: () => true } as any,
  getTeam: () => ({
    renderOwnTeamTitle: () => `TTC Aalst ${String.fromCharCode(64 + id)}`,
    getDivisionRanking: () => ({ empty: true }),
    getThriller: () => null,
  }) as any,
  renderOpponentTitle: () => `Opponent ${id}`,
  getOwnPlayers: () => [],
  getTheirPlayers: () => [{ position: 1, name: 'Player', ranking: 'C6', uniqueIndex: 100, won: 0, home: false, status: 'Major', alias: 'P' }],
  getOpponentClub: () => ({ id: 10, name: 'Club', codeVttl: 'OB001', codeSporta: '', mainLocation: null }) as any,
  isSyncedWithFrenoy: false,
  isStandardStartTime: () => true,
  getTeamPlayerCount: () => 4,
} as any);

const renderMatches = (matches: IMatch[], userState = {}) => renderWithProviders(
    <MemoryRouter><MobileLiveMatches matches={matches} /></MemoryRouter>,
    { preloadedState: { user: { playerId: 1, teams: [1], security: [], ...userState }, readonlyMatches: [] } },
  );

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('Sync all matches button', () => {
  it('shows sync button for logged-in users', () => {
    renderMatches([createMockMatch(1)]);

    expect(screen.getByRole('button', { name: 'sync' })).toBeInTheDocument();
  });

  it('does not show sync button for anonymous users', () => {
    renderMatches([createMockMatch(1)], { playerId: 0 });

    expect(screen.queryByRole('button', { name: 'sync' })).not.toBeInTheDocument();
  });

  it('disables sync button for 10 minutes after clicking', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderMatches([createMockMatch(1)]);

    const syncButton = screen.getByRole('button', { name: 'sync' });
    await user.click(syncButton);

    expect(syncButton).toBeDisabled();

    act(() => { vi.advanceTimersByTime(10 * 60 * 1000); });

    expect(syncButton).toBeEnabled();
  });
});
