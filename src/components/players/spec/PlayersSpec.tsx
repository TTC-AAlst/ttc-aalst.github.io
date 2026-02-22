import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { renderWithProviders } from '../../../utils/test-utils';
import { Players } from '../Players';
import { IStorePlayer } from '../../../models/model-interfaces';

vi.mock('../../../storeUtil', () => ({
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

const createPlayer = (id: number, firstName: string, lastName: string): IStorePlayer => ({
  id,
  alias: firstName,
  firstName,
  lastName,
  active: true,
  vttl: { clubId: 1, competition: 'Vttl', frenoyLink: '', position: id, ranking: 'B6', nextRanking: null, prediction: null, uniqueIndex: 100 + id, rankingIndex: id, rankingValue: 50 } as any,
  sporta: { clubId: 1, competition: 'Sporta', frenoyLink: '', position: id, ranking: 'C2', nextRanking: null, prediction: null, uniqueIndex: 200 + id, rankingIndex: id, rankingValue: 40 } as any,
  contact: { playerId: id, email: '', mobile: '', address: '', city: '' },
  style: {} as any,
  quitYear: null,
  security: 'Player' as any,
  hasKey: false,
  imageVersion: 0,
});

const testPlayer = createPlayer(42, 'Wouter', 'Test');
const otherPlayer = createPlayer(43, 'Jan', 'Janssens');

describe('Players', () => {
  it('renders "Mijn spelerspagina" link when logged in', () => {
    renderWithProviders(
      <MemoryRouter>
        <Players />
      </MemoryRouter>,
      {
        preloadedState: {
          user: { playerId: 42, teams: [], security: [], token: 'test', alias: 'Wouter' },
          players: [testPlayer, otherPlayer],
          teams: [],
        } as any,
      },
    );

    const link = screen.getByRole('link', { name: /mijn spelerspagina/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/speler/wouter-test');
  });

  it('does not render "Mijn spelerspagina" link when not logged in', () => {
    renderWithProviders(
      <MemoryRouter>
        <Players />
      </MemoryRouter>,
      {
        preloadedState: {
          user: { playerId: 0, teams: [], security: [], token: '', alias: '' },
          players: [testPlayer, otherPlayer],
          teams: [],
        } as any,
      },
    );

    expect(screen.queryByRole('link', { name: /mijn spelerspagina/i })).not.toBeInTheDocument();
  });
});
