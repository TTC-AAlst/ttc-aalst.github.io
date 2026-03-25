import dayjs from 'dayjs';
import { collectPlayerGameResultsByMatch, getRecentResults, MatchGameResults } from '../PlayerPerformanceUtils';
import { IMatch } from '../../../../models/model-interfaces';

const createSyncedMatch = (id: number, dateStr: string, playerId: number, games: any[]): IMatch => ({
  id,
  date: dayjs(dateStr),
  isSyncedWithFrenoy: true,
  isHomeMatch: true,
  competition: 'Vttl',
  getGameMatches: () => games.map((g, i) => ({
    matchNumber: i + 1,
    home: {playerId: g.homePlayerId, uniqueIndex: g.homePlayerId, ranking: g.homeRanking || 'D6'},
    out: {playerId: g.outPlayerId, uniqueIndex: g.outPlayerId, ranking: g.outRanking || 'E6'},
    homeSets: g.homeSets || 0,
    outSets: g.outSets || 0,
    outcome: g.outcome,
    isDoubles: g.isDoubles || false,
    ownPlayer: {playerId: g.homePlayerId, ranking: g.homeRanking || 'D6'},
  })),
} as any);

describe('collectPlayerGameResultsByMatch', () => {
  it('collects results for a player from synced matches', () => {
    const matches = [
      createSyncedMatch(1, '2025-03-10T20:00:00', 1, [
        {homePlayerId: 1, outPlayerId: 2, outcome: 'Won', homeRanking: 'D6', outRanking: 'E6'},
        {homePlayerId: 1, outPlayerId: 3, outcome: 'Lost', homeRanking: 'D6', outRanking: 'D2'},
      ]),
    ];

    const results = collectPlayerGameResultsByMatch(1, 'D6', matches);
    expect(results.length).toBe(1);
    expect(results[0].results.length).toBe(2);
    expect(results[0].results[0].won).toBe(true);
    expect(results[0].results[1].won).toBe(false);
  });

  it('skips unsynced matches', () => {
    const match = createSyncedMatch(1, '2025-03-10T20:00:00', 1, [
      {homePlayerId: 1, outPlayerId: 2, outcome: 'Won'},
    ]);
    (match as any).isSyncedWithFrenoy = false;

    const results = collectPlayerGameResultsByMatch(1, 'D6', [match]);
    expect(results.length).toBe(0);
  });

  it('skips doubles games', () => {
    const matches = [
      createSyncedMatch(1, '2025-03-10T20:00:00', 1, [
        {homePlayerId: 1, outPlayerId: 2, outcome: 'Won', isDoubles: true},
      ]),
    ];

    const results = collectPlayerGameResultsByMatch(1, 'D6', matches);
    expect(results.length).toBe(0);
  });

  it('skips games where the player is not involved', () => {
    const matches = [
      createSyncedMatch(1, '2025-03-10T20:00:00', 1, [
        {homePlayerId: 99, outPlayerId: 2, outcome: 'Won'},
      ]),
    ];

    const results = collectPlayerGameResultsByMatch(1, 'D6', matches);
    expect(results.length).toBe(0);
  });

  it('sorts results by date descending (most recent first)', () => {
    const matches = [
      createSyncedMatch(1, '2025-03-10T20:00:00', 1, [
        {homePlayerId: 1, outPlayerId: 2, outcome: 'Won'},
      ]),
      createSyncedMatch(2, '2025-03-17T20:00:00', 1, [
        {homePlayerId: 1, outPlayerId: 3, outcome: 'Lost'},
      ]),
    ];

    const results = collectPlayerGameResultsByMatch(1, 'D6', matches);
    expect(results.length).toBe(2);
    expect(results[0].matchId).toBe(2); // most recent first
    expect(results[1].matchId).toBe(1);
  });
});

describe('getRecentResults', () => {
  const makeMatchResults = (matchId: number, count: number): MatchGameResults => ({
    matchId,
    matchDate: dayjs('2025-03-10'),
    results: Array.from({length: count}, (_, i) => ({
      won: i % 2 === 0,
      playerRanking: 'D6' as any,
      opponentRanking: 'E6' as any,
    })),
  });

  it('returns results from last 2 vttl + 2 sporta matches', () => {
    const vttl = [makeMatchResults(1, 4), makeMatchResults(2, 4), makeMatchResults(3, 4)];
    const sporta = [makeMatchResults(4, 3), makeMatchResults(5, 3), makeMatchResults(6, 3)];

    const recent = getRecentResults(vttl, sporta);
    // 2 vttl * 4 = 8 + 2 sporta * 3 = 6 = 14
    expect(recent.length).toBe(14);
  });

  it('handles empty vttl results', () => {
    const sporta = [makeMatchResults(1, 3)];
    const recent = getRecentResults([], sporta);
    expect(recent.length).toBe(3);
  });

  it('handles empty sporta results', () => {
    const vttl = [makeMatchResults(1, 4)];
    const recent = getRecentResults(vttl, []);
    expect(recent.length).toBe(4);
  });

  it('handles fewer than 2 matches', () => {
    const vttl = [makeMatchResults(1, 4)];
    const sporta = [makeMatchResults(2, 3)];
    const recent = getRecentResults(vttl, sporta);
    expect(recent.length).toBe(7); // 4 + 3
  });
});
