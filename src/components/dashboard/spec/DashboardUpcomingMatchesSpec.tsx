import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import dayjs from 'dayjs';
import { renderWithProviders } from '../../../utils/test-utils';
import { DashboardUpcomingMatches } from '../DashboardUpcomingMatches';
import { IStorePlayer, IMatch } from '../../../models/model-interfaces';

vi.mock('../../../storeUtil', () => ({
  default: {
    getTeam: vi.fn().mockReturnValue({
      id: 1,
      teamCode: 'A',
      competition: 'Vttl',
      getDivisionRanking: () => ({ empty: true }),
      renderOwnTeamTitle: () => 'TTC Aalst A',
    }),
    getTeams: vi.fn().mockReturnValue([]),
    getClub: vi.fn().mockReturnValue({ id: 10, name: 'Test Club', codeVttl: 'OB001', codeSporta: '' }),
    getPlayer: vi.fn(),
    getMatch: vi.fn(),
    getMatches: vi.fn().mockReturnValue([]),
    matches: { getAllMatches: vi.fn().mockReturnValue([]) },
  },
}));

vi.mock('../../../utils/httpClient', () => ({
  default: {
    get: vi.fn().mockResolvedValue([]),
    post: vi.fn().mockResolvedValue({}),
  },
}));

const createPlayer = (id: number, firstName: string, lastName: string): IStorePlayer => ({
  id,
  alias: firstName,
  firstName,
  lastName,
  active: true,
  vttl: { clubId: 1, competition: 'Vttl', frenoyLink: '', position: 1, ranking: 'B6', nextRanking: null, prediction: null, uniqueIndex: 100, rankingIndex: 1, rankingValue: 50 } as any,
  sporta: undefined as any,
  contact: { playerId: id, email: '', mobile: '', address: '', city: '' },
  style: {} as any,
  quitYear: null,
  security: 'Player' as any,
  hasKey: false,
  imageVersion: 0,
});

const testPlayer = createPlayer(42, 'Wouter', 'Test');

// Mock match for tomorrow so it shows up in upcoming matches
const tomorrow = dayjs().add(1, 'day');
const mockMatch: IMatch = {
  id: 1,
  teamId: 1,
  date: tomorrow,
  isSyncedWithFrenoy: false,
  scoreType: 'NotYetPlayed',
  opponent: { clubId: 10, teamCode: 'A' },
  comments: [],
  players: [],
  games: [],
  isBeingPlayed: () => false,
  getTeam: () => ({ id: 1, getDivisionRanking: () => ({ empty: true }), renderOwnTeamTitle: () => 'TTC Aalst A' }) as any,
  getPlayerFormation: () => [],
  getOwnPlayers: () => [],
  getTheirPlayers: () => [],
  renderOpponentTitle: () => 'Opponent A',
} as any;

describe('DashboardUpcomingMatches', () => {
  it('renders player link when logged in', () => {
    renderWithProviders(
      <MemoryRouter>
        <DashboardUpcomingMatches />
      </MemoryRouter>,
      {
        preloadedState: {
          user: { playerId: 42, teams: [1], security: [], token: 'test', alias: 'Wouter' },
          players: [testPlayer],
          matches: [mockMatch],
          teams: [{ id: 1, teamCode: 'A', competition: 'Vttl' }],
        } as any,
      },
    );

    const link = screen.getByRole('link', { name: /hallo wouter/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/speler/wouter-test');
  });

  it('does not render player link when not logged in', () => {
    renderWithProviders(
      <MemoryRouter>
        <DashboardUpcomingMatches />
      </MemoryRouter>,
      {
        preloadedState: {
          user: { playerId: 0, teams: [], security: [], token: '', alias: '' },
          players: [testPlayer],
          matches: [mockMatch],
          teams: [{ id: 1, teamCode: 'A', competition: 'Vttl' }],
        } as any,
      },
    );

    expect(screen.queryByRole('link', { name: /hallo/i })).not.toBeInTheDocument();
  });
});
