import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { renderWithProviders } from '../../../utils/test-utils';
import { DashboardUpcomingMatches } from '../DashboardUpcomingMatches';
import { IStorePlayer } from '../../../models/model-interfaces';

vi.mock('../../../storeUtil', () => ({
  default: {
    getTeam: vi.fn().mockReturnValue({ getDivisionRanking: () => ({ empty: true }) }),
    getTeams: vi.fn().mockReturnValue([]),
    getClub: vi.fn(),
    getPlayer: vi.fn(),
    getMatch: vi.fn(),
    getMatches: vi.fn().mockReturnValue([]),
    matches: { getAllMatches: vi.fn().mockReturnValue([]) },
  },
}));

const createPlayer = (id: number, firstName: string, lastName: string): IStorePlayer => ({
  id,
  alias: firstName,
  firstName,
  lastName,
  name: `${firstName} ${lastName}`,
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

describe('DashboardUpcomingMatches', () => {
  it('renders player link when logged in', () => {
    renderWithProviders(
      <MemoryRouter>
        <DashboardUpcomingMatches />
      </MemoryRouter>,
      {
        preloadedState: {
          user: { playerId: 42, teams: [], security: [], token: 'test', alias: 'Wouter' },
          players: [testPlayer],
          matches: [],
          teams: [],
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
          matches: [],
          teams: [],
        } as any,
      },
    );

    expect(screen.queryByRole('link', { name: /hallo/i })).not.toBeInTheDocument();
  });
});
