import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithProviders } from '../../../../utils/test-utils';
import { OpponentPlayerSelector } from '../OpponentPlayerSelector';
import { IMatch } from '../../../../models/model-interfaces';
import { ClubPlayer } from '../../../../reducers/clubPlayersReducer';

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
    post: vi.fn().mockResolvedValue({
      id: 1,
      players: [],
      games: [],
      comments: [],
      isHomeMatch: true,
      shouldBePlayed: true,
      isSyncedWithFrenoy: false,
      competition: 'Vttl',
      date: '2026-02-19',
      score: {
        home: 0,
        out: 0,
      },
      scoreType: 'NotYetPlayed',
      isPlayed: false,
      formationComment: '',
      frenoyMatchId: '',
      week: 1,
      frenoyDivisionId: 1,
      teamId: 1,
      description: '',
      reportPlayerId: 0,
      block: '',
      isDerby: false,
      opponent: {
        clubId: 1,
        teamCode: 'A',
      },
    }),
  },
}));

const testPlayers: ClubPlayer[] = [
  {
    name: 'Jean-François Dupont',
    ranking: 'B6',
    uniqueIndex: 101,
  },
  {
    name: 'Marc Peeters',
    ranking: 'C2',
    uniqueIndex: 102,
  },
  {
    name: 'André Van Damme',
    ranking: 'C6',
    uniqueIndex: 103,
  },
  {
    name: 'Luc Janssens',
    ranking: 'D0',
    uniqueIndex: 104,
  },
  {
    name: 'Pieter De Smet',
    ranking: 'D2',
    uniqueIndex: 105,
  },
];

const createMockMatch = (overrides: Partial<IMatch> = {}): IMatch => ({
  id: 1,
  competition: 'Vttl',
  frenoyDivisionId: 1,
  games: [],
  opponent: { clubId: 10, teamCode: 'A' },
  date: { isBefore: () => false, clone: () => ({ subtract: () => ({ isBefore: () => true }) }) } as any,
  getOpponentClub: () => ({ codeVttl: 'OB001', codeSporta: '', id: 10, name: 'Test Club' } as any),
  getTheirPlayers: () => [],
  getTeamPlayerCount: () => 4,
  getOwnPlayers: () => [],
  ...overrides,
} as any);

const defaultStoreState = {
  clubPlayers: {
    players: { 'vttl-ob001': testPlayers },
    loading: {},
  },
  readonlyMatches: [],
};


describe('OpponentPlayerSelector', () => {
  it('renders select button when form is closed', () => {
    renderWithProviders(
      <OpponentPlayerSelector match={createMockMatch()} />,
      { preloadedState: defaultStoreState },
    );

    expect(screen.getByRole('button', { name: /selecteer tegenstanders/i })).toBeInTheDocument();
  });

  it('shows location unknown when no club code', () => {
    const match = createMockMatch({
      getOpponentClub: () => ({ codeVttl: '', codeSporta: '' } as any),
    });

    renderWithProviders(
      <OpponentPlayerSelector match={match} />,
      { preloadedState: defaultStoreState },
    );

    expect(screen.getByText('Niet gekend')).toBeInTheDocument();
  });

  it('shows loading spinner', () => {
    renderWithProviders(
      <OpponentPlayerSelector match={createMockMatch()} initialOpen />,
      {
        preloadedState: {
          ...defaultStoreState,
          clubPlayers: {
            players: { 'vttl-ob001': [] },
            loading: { 'vttl-ob001': true },
          },
        },
      },
    );

    expect(screen.getByText('Laden...')).toBeInTheDocument();
  });

  it('shows formation unknown when club players list is empty', () => {
    renderWithProviders(
      <OpponentPlayerSelector match={createMockMatch()} initialOpen />,
      {
        preloadedState: {
          ...defaultStoreState,
          clubPlayers: {
            players: { 'vttl-ob001': [] },
            loading: {},
          },
        },
      },
    );

    expect(screen.getByText('Opstelling onbekend')).toBeInTheDocument();
  });

  it('renders player list when opened with data', () => {
    renderWithProviders(
      <OpponentPlayerSelector match={createMockMatch()} initialOpen />,
      { preloadedState: defaultStoreState },
    );

    testPlayers.forEach(p => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
      expect(screen.getByText(p.ranking)).toBeInTheDocument();
    });
  });

  it('filters players with latinize search (accent-insensitive)', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <OpponentPlayerSelector match={createMockMatch()} initialOpen />,
      { preloadedState: defaultStoreState },
    );

    const searchInput = screen.getByPlaceholderText('Zoeken...');
    await user.type(searchInput, 'francois');

    expect(screen.getByText('Jean-François Dupont')).toBeInTheDocument();
    expect(screen.queryByText('Marc Peeters')).not.toBeInTheDocument();
  });

  it('toggles player selection', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <OpponentPlayerSelector match={createMockMatch()} initialOpen />,
      { preloadedState: defaultStoreState },
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).not.toBeChecked();

    await user.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();

    await user.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();
  });

  it('disables excess players when max reached', async () => {
    const match = createMockMatch({ getTeamPlayerCount: () => 2 as any });
    const user = userEvent.setup();
    renderWithProviders(
      <OpponentPlayerSelector match={match} initialOpen />,
      { preloadedState: defaultStoreState },
    );

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);

    // Third checkbox should be disabled
    expect(checkboxes[2]).toBeDisabled();
  });

  it('pre-selects existing opponent players on open', async () => {
    const existingPlayers = [
      { uniqueIndex: 101, name: 'Jean-François Dupont', position: 1, ranking: 'B6' },
      { uniqueIndex: 103, name: 'André Van Damme', position: 2, ranking: 'C6' },
    ];
    const match = createMockMatch({
      getTheirPlayers: () => existingPlayers as any,
    });

    renderWithProviders(
      <OpponentPlayerSelector match={match} initialOpen />,
      { preloadedState: defaultStoreState },
    );

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      // Jean-François (index 0 after sort) and André should be checked
      const checkedBoxes = checkboxes.filter(cb => (cb as HTMLInputElement).checked);
      expect(checkedBoxes).toHaveLength(2);
    });
  });

  it('sorts selected players to top of list', async () => {
    const existingPlayers = [
      { uniqueIndex: 105, name: 'Pieter De Smet', position: 1, ranking: 'D2' },
    ];
    const match = createMockMatch({
      getTheirPlayers: () => existingPlayers as any,
    });

    renderWithProviders(
      <OpponentPlayerSelector match={match} initialOpen />,
      { preloadedState: defaultStoreState },
    );

    await waitFor(() => {
      const labels = screen.getAllByText(/Dupont|Peeters|Van Damme|Janssens|De Smet/);
      // Pieter De Smet (selected) should be first
      expect(labels[0]).toHaveTextContent('Pieter De Smet');
    });
  });

  it('allows saving with no players selected', () => {
    renderWithProviders(
      <OpponentPlayerSelector match={createMockMatch()} initialOpen />,
      { preloadedState: defaultStoreState },
    );

    const saveButton = screen.getByRole('button', { name: /bewaren/i });
    expect(saveButton).toBeEnabled();
  });

  it('clears search and refocuses after selecting a player while searching', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <OpponentPlayerSelector match={createMockMatch()} initialOpen />,
      { preloadedState: defaultStoreState },
    );

    const searchInput = screen.getByPlaceholderText('Zoeken...');
    await user.type(searchInput, 'jean');

    // Only one player visible
    expect(screen.getByText('Jean-François Dupont')).toBeInTheDocument();

    // Select that player
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    // Search should be cleared, all players visible again
    await waitFor(() => {
      expect(searchInput).toHaveValue('');
      expect(screen.getByText('Marc Peeters')).toBeInTheDocument();
    });
  });

  it('does not focus search input when selecting without search text', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <OpponentPlayerSelector match={createMockMatch()} initialOpen />,
      { preloadedState: defaultStoreState },
    );

    const searchInput = screen.getByPlaceholderText('Zoeken...');
    const checkboxes = screen.getAllByRole('checkbox');

    // Click a player without any search text
    await user.click(checkboxes[0]);

    // Search input should NOT be focused
    expect(searchInput).not.toHaveFocus();
  });

  it('cancel button closes form and resets state', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <OpponentPlayerSelector match={createMockMatch()} initialOpen />,
      { preloadedState: defaultStoreState },
    );

    // Select a player first
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    // Click cancel
    const cancelButton = screen.getByRole('button', { name: /annuleren/i });
    await user.click(cancelButton);

    // Form should be closed, back to select button
    expect(screen.getByRole('button', { name: /selecteer tegenstanders/i })).toBeInTheDocument();
  });

  it('auto-saves when reaching required player count', async () => {
    const match = createMockMatch({ getTeamPlayerCount: () => 2 as any });
    const user = userEvent.setup();
    renderWithProviders(
      <OpponentPlayerSelector match={match} initialOpen />,
      { preloadedState: defaultStoreState },
    );

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);

    // Should auto-save and close the form
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /selecteer tegenstanders/i })).toBeInTheDocument();
    });
  });
});
