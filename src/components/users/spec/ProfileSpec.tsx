import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { renderWithProviders } from '../../../utils/test-utils';
import { Profile } from '../Profile';
import { IStorePlayer } from '../../../models/model-interfaces';

vi.mock('../../../storeUtil', () => ({
  default: {
    getTeam: vi.fn(),
    getTeams: vi.fn().mockReturnValue([]),
    getClub: vi.fn(),
    getPlayer: vi.fn().mockReturnValue({
      id: 42,
      alias: 'Wouter',
      firstName: 'Wouter',
      lastName: 'Test',
      name: 'Wouter Test',
      slug: 'wouter-test',
      active: true,
      contact: { playerId: 42, email: 'test@test.com', mobile: '0471234567', address: 'Test Street 1', city: 'Aalst' },
      getCompetition: () => ({ ranking: 'B6', position: 1 }),
      getTeam: () => null,
      getTeams: () => [],
    }),
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
  vttl: {
    clubId: 1, competition: 'Vttl', frenoyLink: '', position: 1, ranking: 'B6',
    nextRanking: null, prediction: null, uniqueIndex: 100, rankingIndex: 1, rankingValue: 50,
  } as any,
  sporta: undefined as any,
  contact: { playerId: id, email: 'test@test.com', mobile: '0471234567', address: 'Test Street 1', city: 'Aalst' },
  style: {} as any,
  quitYear: null,
  security: 'Player' as any,
  hasKey: false,
  imageVersion: 0,
});

const testPlayer = createPlayer(42, 'Wouter', 'Test');

// User state (will be wrapped in UserModel by selectUser)
const mockUser = {
  playerId: 42,
  teams: [],
  security: [],
};

describe('Profile', () => {
  it('renders "Mijn spelerspagina" button on profile page', () => {
    renderWithProviders(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
      {
        preloadedState: {
          user: mockUser,
          players: [testPlayer],
          teams: [],
        } as any,
      },
    );

    const myPlayerPageButton = screen.getByRole('button', { name: /mijn spelerspagina/i });
    expect(myPlayerPageButton).toBeInTheDocument();
  });

  it('renders logout button on profile page', () => {
    renderWithProviders(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>,
      {
        preloadedState: {
          user: mockUser,
          players: [testPlayer],
          teams: [],
        } as any,
      },
    );

    const logoutButton = screen.getByRole('button', { name: /uitloggen/i });
    expect(logoutButton).toBeInTheDocument();
  });
});
