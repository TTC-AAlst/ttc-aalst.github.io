import React from 'react';
import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { renderWithProviders } from '../../../../utils/test-utils';
import { MobileLiveMatchCard } from '../MobileLiveMatchCard';
import { IMatch, IMatchPlayer, IMatchPlayerInfo } from '../../../../models/model-interfaces';

vi.mock('../../../../storeUtil', () => ({
  default: {
    getTeam: vi.fn(),
    getTeams: vi.fn().mockReturnValue([]),
    getClub: vi.fn().mockReturnValue({ name: 'Test Club' }),
    getPlayer: vi.fn(),
    getMatch: vi.fn(),
    getMatches: vi.fn().mockReturnValue([]),
    matches: { getAllMatches: vi.fn().mockReturnValue([]) },
  },
}));

const createMockPlayer = (alias: string, ranking: string, uniqueIndex: number, status = 'Captain'): IMatchPlayer => ({
  uniqueIndex,
  playerId: uniqueIndex,
  alias,
  ranking,
  status,
  home: true,
  position: 1,
  won: 0,
} as any);

const createMockMatch = (overrides: Partial<IMatch> = {}): IMatch => ({
  id: 1,
  competition: 'Vttl',
  frenoyDivisionId: 1,
  teamId: 1,
  games: [],
  players: [],
  block: 'Captain',
  isSyncedWithFrenoy: false,
  opponent: { clubId: 10, teamCode: 'A' },
  date: { format: () => '19:45' } as any,
  score: { home: 0, out: 0 },
  isHomeMatch: true,
  getOwnPlayers: () => [],
  getTheirPlayers: () => [],
  getTeamPlayerCount: () => 4,
  getTeam: () => ({ teamCode: 'A', competition: 'Vttl', getDivisionRanking: () => ({ empty: true }) } as any),
  getPlayerFormation: () => [],
  getGameMatches: () => [],
  renderScore: () => '0-0',
  ...overrides,
} as any);

describe('CollapsedPlayerSummary in MobileLiveMatchCard', () => {
  it('shows player names with rankings when formation is confirmed (pre-match)', () => {
    const players: IMatchPlayer[] = [
      createMockPlayer('Wouter', 'B2', 1),
      createMockPlayer('Jan', 'B6', 2),
      createMockPlayer('Pieter', 'C2', 3),
      createMockPlayer('Karel', 'C4', 4),
    ];

    const match = createMockMatch({
      getPlayerFormation: () => players.map(p => ({
        player: { id: p.playerId, name: p.alias } as any,
        matchPlayer: p,
      })) as IMatchPlayerInfo[],
    });

    renderWithProviders(
      <MobileLiveMatchCard match={match} expanded={false} onToggle={() => {}} isCollapsible />,
    );

    expect(screen.getByText(/Wouter B2/)).toBeInTheDocument();
    expect(screen.getByText(/Jan B6/)).toBeInTheDocument();
  });

  it('shows player names with rankings and win counts when match has games', () => {
    const players: IMatchPlayer[] = [
      createMockPlayer('Wouter', 'B2', 1),
      createMockPlayer('Jan', 'B6', 2),
    ];

    const match = createMockMatch({
      games: [{ id: 1 }] as any,
      getOwnPlayers: () => players,
      getTheirPlayers: () => [createMockPlayer('Opponent', 'C0', 10)],
      getGameMatches: () => [],
    });

    renderWithProviders(
      <MobileLiveMatchCard match={match} expanded={false} onToggle={() => {}} isCollapsible />,
    );

    // With games, should show win counts
    expect(screen.getByText(/Wouter B2 \(0\)/)).toBeInTheDocument();
    expect(screen.getByText(/Jan B6 \(0\)/)).toBeInTheDocument();
  });

  it('returns null when no formation is confirmed', () => {
    const match = createMockMatch({
      getPlayerFormation: () => [],
    });

    const { container } = renderWithProviders(
      <MobileLiveMatchCard match={match} expanded={false} onToggle={() => {}} isCollapsible />,
    );

    // No player summary should be shown
    expect(container.querySelector('div[style*="font-size: 0.8em"]')).toBeNull();
  });

  it('does not show mini body when expanded', () => {
    const players: IMatchPlayer[] = [
      createMockPlayer('Wouter', 'B2', 1),
    ];

    const match = createMockMatch({
      getPlayerFormation: () => players.map(p => ({
        player: { id: p.playerId, name: p.alias } as any,
        matchPlayer: p,
      })) as IMatchPlayerInfo[],
    });

    renderWithProviders(
      <MobileLiveMatchCard match={match} expanded onToggle={() => {}} isCollapsible />,
    );

    // When expanded, mini body is not shown
    const miniBody = screen.queryByText(/Wouter B2/);
    // The player name might appear in the expanded content, but not in mini body
    // We check that mini body is not rendered specifically
    expect(document.querySelector('div[style*="font-size: 0.8em"]')).toBeNull();
  });

  it('uses middle dot separator between players', () => {
    const players: IMatchPlayer[] = [
      createMockPlayer('A', 'B2', 1),
      createMockPlayer('B', 'C2', 2),
    ];

    const match = createMockMatch({
      getPlayerFormation: () => players.map(p => ({
        player: { id: p.playerId, name: p.alias } as any,
        matchPlayer: p,
      })) as IMatchPlayerInfo[],
    });

    renderWithProviders(
      <MobileLiveMatchCard match={match} expanded={false} onToggle={() => {}} isCollapsible />,
    );

    // The separator should be present
    expect(screen.getByText(/·/)).toBeInTheDocument();
  });
});
