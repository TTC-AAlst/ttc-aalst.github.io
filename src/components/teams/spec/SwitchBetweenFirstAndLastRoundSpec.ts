import moment from 'moment';
import { getFirstOrLastMatches, getFirstOrLast } from '../SwitchBetweenFirstAndLastRoundButton';
import { IStoreMatchCommon } from '../../../models/model-interfaces';

const createStoreMatch = (dateStr: string): IStoreMatchCommon => ({
  id: 0,
  frenoyMatchId: '',
  shouldBePlayed: true,
  isSyncedWithFrenoy: false,
  week: 1,
  competition: 'Vttl',
  frenoyDivisionId: 0,
  date: moment(dateStr),
  score: {home: 0, out: 0},
  scoreType: 'NotYetPlayed',
  isPlayed: false,
  players: [],
  formationComment: '',
  games: [],
});

describe('getFirstOrLastMatches', () => {
  const septMatch = createStoreMatch('2024-09-15T20:00:00'); // month=8, >= 7 → first round
  const octMatch = createStoreMatch('2024-10-20T20:00:00');  // month=9, >= 7 → first round
  const janMatch = createStoreMatch('2025-01-15T20:00:00');  // month=0, < 7 → last round
  const febMatch = createStoreMatch('2025-02-20T20:00:00');  // month=1, < 7 → last round
  const allMatches = [septMatch, octMatch, janMatch, febMatch];

  it('returns all matches with "all" filter', () => {
    const result = getFirstOrLastMatches(allMatches, 'all');
    expect(result.matches.length).toBe(4);
    expect(result.hasMore).toBe(false);
  });

  it('returns first round (month >= 7) with "first" filter', () => {
    const result = getFirstOrLastMatches(allMatches, 'first');
    expect(result.matches.length).toBe(2);
    expect(result.matches.every(m => m.date.month() >= 7)).toBe(true);
    expect(result.hasMore).toBe(true);
  });

  it('returns last round (month < 7) with "last" filter', () => {
    const result = getFirstOrLastMatches(allMatches, 'last');
    expect(result.matches.length).toBe(2);
    expect(result.matches.every(m => m.date.month() < 7)).toBe(true);
    expect(result.hasMore).toBe(true);
  });

  it('sorts first round matches by date ascending', () => {
    const result = getFirstOrLastMatches(allMatches, 'first');
    expect(result.matches[0].date.valueOf()).toBeLessThan(result.matches[1].date.valueOf());
  });

  it('sorts last round matches by date ascending', () => {
    const result = getFirstOrLastMatches(allMatches, 'last');
    expect(result.matches[0].date.valueOf()).toBeLessThan(result.matches[1].date.valueOf());
  });

  it('falls back to last round when first round is empty', () => {
    const lastOnly = [janMatch, febMatch];
    const result = getFirstOrLastMatches(lastOnly, 'first');
    expect(result.matches.length).toBe(2);
    expect(result.hasMore).toBe(false);
  });

  it('hasMore is false when the other round has no matches', () => {
    const firstOnly = [septMatch, octMatch];
    const result = getFirstOrLastMatches(firstOnly, 'first');
    expect(result.hasMore).toBe(false);
  });
});

describe('getFirstOrLast', () => {
  it('returns "first" during September (month=8)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 8, 15)); // Sep 15
    expect(getFirstOrLast()).toBe('first');
    vi.useRealTimers();
  });

  it('returns "last" during February (month=1)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 1, 15)); // Feb 15
    expect(getFirstOrLast()).toBe('last');
    vi.useRealTimers();
  });

  it('returns "first" during June (month=5)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 5, 15)); // Jun 15
    // month >= 5 && !(month === 11 && date > 20) → 'first'
    expect(getFirstOrLast()).toBe('first');
    vi.useRealTimers();
  });

  it('returns "last" during May (month=4)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 4, 15)); // May 15
    // month < 5 → 'last'
    expect(getFirstOrLast()).toBe('last');
    vi.useRealTimers();
  });

  it('returns "last" late December (month=11, date > 20)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 11, 25)); // Dec 25
    // month >= 5 but month === 11 && date > 20 → 'last'
    expect(getFirstOrLast()).toBe('last');
    vi.useRealTimers();
  });

  it('returns "first" early December (month=11, date <= 20)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 11, 15)); // Dec 15
    // month >= 5 && !(month === 11 && date > 20) → 'first'
    expect(getFirstOrLast()).toBe('first');
    vi.useRealTimers();
  });
});
