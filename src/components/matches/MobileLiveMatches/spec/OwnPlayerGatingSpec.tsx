import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { renderWithProviders } from '../../../../utils/test-utils';
import { MobileLiveMatchInProgress } from '../MobileLiveMatchInProgress';
import { IMatch, IStorePlayer, IPlayerCompetition } from '../../../../models/model-interfaces';
import { PlayerRanking } from '../../../../models/utils/rankingSorter';

vi.mock('../../../../storeUtil', () => ({
  default: {
    getTeam: vi.fn(),
    getTeams: vi.fn().mockReturnValue([]),
    getClub: vi.fn(),
    getPlayer: vi.fn().mockReturnValue({ id: 1, alias: 'Test', getCompetition: () => ({ ranking: 'B6', position: 1 }) }),
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

const vttl = (pos: number, ranking: PlayerRanking, idx: number, val: number): IPlayerCompetition => ({
  clubId: 1, competition: 'Vttl', frenoyLink: '', position: pos,
  ranking, nextRanking: null, prediction: null, uniqueIndex: 100 + pos, rankingIndex: pos, rankingValue: val,
});

const testPlayers: IStorePlayer[] = [
  {
    id: 1, alias: 'Jean', firstName: 'Jean', lastName: 'Dupont', active: true,
    vttl: vttl(1, 'B6', 101, 50), sporta: undefined as any,
    contact: { playerId: 1, email: '', mobile: '', address: '', city: '' },
    style: {} as any, quitYear: null, security: 'Player' as any, hasKey: false, imageVersion: 0,
  },
];

const mockTeam = {
  renderOwnTeamTitle: () => 'TTC Aalst A',
  getDivisionRanking: () => ({ empty: true }),
  getThriller: () => null,
  getMatches: () => [],
};

const baseMockMatch: IMatch = {
  id: 1,
  competition: 'Vttl',
  frenoyDivisionId: 1,
  frenoyMatchId: 'OVLH01/001',
  games: [],
  players: [],
  comments: [],
  block: '',
  isHomeMatch: true,
  description: '',
  opponent: { clubId: 10, teamCode: 'A' },
  teamId: 1,
  date: { isBefore: () => true, subtract: () => ({ isBefore: () => true }), format: () => '19:00', isSame: () => true } as any,
  getTeam: () => mockTeam as any,
  renderOpponentTitle: () => 'Opponent A',
  getOwnPlayers: () => [],
  getTheirPlayers: () => [],
  getOpponentClub: () => ({ id: 10, name: 'Test Club', codeVttl: 'OB001', codeSporta: '', mainLocation: null }) as any,
  isSyncedWithFrenoy: false,
  isStandardStartTime: () => true,
  getTeamPlayerCount: () => 4,
  getPlayerFormation: () => [],
} as any;

const createMockMatch = (overrides: Partial<IMatch> = {}): IMatch => ({
  ...baseMockMatch,
  ...overrides,
}) as any;

const renderMatch = (match: IMatch, playerId: number) =>
  renderWithProviders(
    <MemoryRouter><MobileLiveMatchInProgress match={match} /></MemoryRouter>,
    { preloadedState: { user: { playerId, teams: [1], security: [] }, readonlyMatches: [], players: testPlayers } },
  );

const getEditIcons = () => document.querySelectorAll('.fa-pencil-square-o');

describe('OwnPlayerSelector gating (AC9: login, AC10: games played)', () => {
  describe('pre-start mode (no formation)', () => {
    it('shows "Selecteer spelers" when user is logged in', () => {
      renderMatch(createMockMatch(), 1);

      expect(screen.getByRole('button', { name: /selecteer spelers/i })).toBeInTheDocument();
    });

    it('hides "Selecteer spelers" and shows "Opstelling onbekend" when user is not logged in', () => {
      renderMatch(createMockMatch(), 0);

      expect(screen.queryByRole('button', { name: /selecteer spelers/i })).not.toBeInTheDocument();
      expect(screen.getByText(/opstelling onbekend/i)).toBeInTheDocument();
    });
  });

  describe('pre-start mode (has formation)', () => {
    const matchWithFormation = () => createMockMatch({
      getPlayerFormation: () => [
        { id: 1, player: { id: 1, alias: 'Jean', getCompetition: () => ({ ranking: 'B6', position: 1 }) }, matchPlayer: { status: 'Major' } },
      ] as any,
    });

    it('shows edit icon for own formation when user is logged in', () => {
      renderMatch(matchWithFormation(), 1);

      expect(getEditIcons().length).toBeGreaterThanOrEqual(1);
    });

    it('hides edit icon for own formation when user is not logged in', () => {
      renderMatch(matchWithFormation(), 0);

      expect(getEditIcons().length).toBe(0);
    });
  });

  describe('in-progress mode (has their players, no games)', () => {
    const inProgressMatch = () => createMockMatch({
      getTheirPlayers: () => [{ position: 1, name: 'Opp', ranking: 'C6', uniqueIndex: 200, won: 0, home: false, status: 'Major', alias: 'Opp' }] as any,
    });

    it('shows 2 edit icons when user is logged in (own + opponents)', () => {
      renderMatch(inProgressMatch(), 1);

      expect(getEditIcons().length).toBe(2);
    });

    it('shows no edit icons when user is not logged in', () => {
      renderMatch(inProgressMatch(), 0);

      expect(getEditIcons().length).toBe(0);
    });
  });

  describe('in-progress mode with games played (AC10)', () => {
    const inProgressWithGames = () => createMockMatch({
      getTheirPlayers: () => [{ position: 1, name: 'Opp', ranking: 'C6', uniqueIndex: 200, won: 0, home: false, status: 'Major', alias: 'Opp' }] as any,
      games: [{ id: 1 }] as any,
    });

    it('shows no edit icons when games have been played', () => {
      renderMatch(inProgressWithGames(), 1);

      expect(getEditIcons().length).toBe(0);
    });
  });
});
