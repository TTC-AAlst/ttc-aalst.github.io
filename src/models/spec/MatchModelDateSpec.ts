import dayjs from 'dayjs';
import MatchModel from '../MatchModel';

const createMatch = (dateStr: string) => new MatchModel({
  id: 1,
  date: dateStr,
  competition: 'Vttl',
  players: [],
  games: [],
  comments: [],
  opponent: {},
  isHomeMatch: true,
  score: {home: 0, out: 0},
});

describe('MatchModel date methods', () => {
  describe('getDisplayDate', () => {
    it('shows short format with "s"', () => {
      const match = createMatch('2025-03-15T20:00:00');
      expect(match.getDisplayDate('s')).toBe('15/3');
    });

    it('shows day+date format with "d"', () => {
      const match = createMatch('2025-03-15T20:00:00');
      expect(match.getDisplayDate('d')).toMatch(/^za\.? 15\/3$/);
    });

    it('omits minutes when minutes are zero', () => {
      const match = createMatch('2025-03-15T20:00:00');
      expect(match.getDisplayDate()).toMatch(/za\.? 15\/3 20$/);
    });

    it('includes minutes when non-zero', () => {
      const match = createMatch('2025-03-15T19:30:00');
      expect(match.getDisplayDate()).toMatch(/za\.? 15\/3 19:30$/);
    });
  });

  describe('getDisplayTime', () => {
    it('shows just hours when minutes are zero', () => {
      const match = createMatch('2025-03-15T20:00:00');
      expect(match.getDisplayTime()).toBe('20');
    });

    it('shows hours:minutes when minutes are non-zero', () => {
      const match = createMatch('2025-03-15T19:30:00');
      expect(match.getDisplayTime()).toBe('19:30');
    });
  });

  describe('isStandardStartTime', () => {
    it('returns true for 20:00', () => {
      const match = createMatch('2025-03-15T20:00:00');
      expect(match.isStandardStartTime()).toBe(true);
    });

    it('returns false for 19:30', () => {
      const match = createMatch('2025-03-15T19:30:00');
      expect(match.isStandardStartTime()).toBe(false);
    });

    it('returns false for 19:00', () => {
      const match = createMatch('2025-03-15T19:00:00');
      expect(match.isStandardStartTime()).toBe(false);
    });

    it('returns false for 20:30', () => {
      const match = createMatch('2025-03-15T20:30:00');
      expect(match.isStandardStartTime()).toBe(false);
    });
  });

  describe('isBeingPlayed', () => {
    it('returns true when match is within 14 hours of now', () => {
      const nowIsh = dayjs().subtract(1, 'hour').format('YYYY-MM-DDTHH:mm:ss');
      const match = createMatch(nowIsh);
      expect(match.isBeingPlayed()).toBe(true);
    });

    it('returns true when match is upcoming within 14 hours', () => {
      const soon = dayjs().add(2, 'hours').format('YYYY-MM-DDTHH:mm:ss');
      const match = createMatch(soon);
      expect(match.isBeingPlayed()).toBe(true);
    });

    it('returns false when match was days ago', () => {
      const match = createMatch('2020-01-01T20:00:00');
      expect(match.isBeingPlayed()).toBe(false);
    });

    it('returns false when match is days from now', () => {
      const farFuture = dayjs().add(7, 'days').format('YYYY-MM-DDTHH:mm:ss');
      const match = createMatch(farFuture);
      expect(match.isBeingPlayed()).toBe(false);
    });

    it('returns false at exactly 14 hours boundary', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 2, 15, 10, 0, 0)); // Mar 15 10:00

      // Match was 14 hours ago: Mar 14 20:00
      const match = createMatch('2025-03-14T20:00:00');
      // Math.abs(diff) < 14 -> 14 is NOT less than 14, so false
      expect(match.isBeingPlayed()).toBe(false);

      vi.useRealTimers();
    });

    it('returns true just under 14 hours', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 2, 15, 9, 59, 0)); // Mar 15 09:59

      // Match was at Mar 14 20:00 -> 13h59m ago
      const match = createMatch('2025-03-14T20:00:00');
      expect(match.isBeingPlayed()).toBe(true);

      vi.useRealTimers();
    });
  });

  describe('comment postedOn parsing', () => {
    it('converts comment postedOn strings to dayjs objects', () => {
      const match = new MatchModel({
        id: 1,
        date: '2025-03-15T20:00:00',
        competition: 'Vttl',
        players: [],
        games: [],
        comments: [
          {id: 1, text: 'Great match', postedOn: '2025-03-15T22:30:00', playerId: 1},
        ],
        opponent: {clubId: 1, teamCode: 'A'},
        isHomeMatch: true,
        score: {home: 10, out: 6},
      });
      expect(dayjs.isDayjs(match.comments[0].postedOn)).toBe(true);
      expect(match.comments[0].postedOn.hour()).toBe(22);
      expect(match.comments[0].postedOn.minute()).toBe(30);
    });

    it('preserves other comment properties alongside postedOn', () => {
      const match = new MatchModel({
        id: 1,
        date: '2025-03-15T20:00:00',
        competition: 'Vttl',
        players: [],
        games: [],
        comments: [
          {id: 42, text: 'Nice one', postedOn: '2025-03-15T23:00:00', playerId: 7},
        ],
        opponent: {clubId: 1, teamCode: 'A'},
        isHomeMatch: true,
        score: {home: 10, out: 6},
      });
      expect(match.comments[0].id).toBe(42);
      expect(match.comments[0].text).toBe('Nice one');
      expect(match.comments[0].playerId).toBe(7);
    });
  });

  describe('invalid date handling', () => {
    it('null date creates an invalid dayjs', () => {
      const match = createMatch(null as any);
      expect(match.date.isValid()).toBe(false);
      expect(match.date.format('YYYY-MM-DD')).toBe('Invalid Date');
    });

    it('undefined date silently becomes current time', () => {
      const match = createMatch(undefined as any);
      expect(match.date.isValid()).toBe(true);
      expect(match.date.diff(dayjs(), 'seconds')).toBeLessThan(2);
    });

    it('garbage string date creates an invalid dayjs', () => {
      const match = createMatch('not-a-date');
      expect(match.date.isValid()).toBe(false);
    });

    it('isBeingPlayed returns false for invalid date', () => {
      const match = createMatch(null as any);
      expect(match.isBeingPlayed()).toBe(false);
    });

    it('getDisplayDate returns "Invalid Date" for null date', () => {
      const match = createMatch(null as any);
      expect(match.getDisplayDate()).toContain('Invalid Date');
    });

    it('null comment postedOn creates an invalid dayjs', () => {
      const match = new MatchModel({
        id: 1,
        date: '2025-03-15T20:00:00',
        competition: 'Vttl',
        players: [],
        games: [],
        comments: [
          {id: 1, text: 'Test', postedOn: null, playerId: 1},
        ],
        opponent: {clubId: 1, teamCode: 'A'},
        isHomeMatch: true,
        score: {home: 0, out: 0},
      });
      expect(match.comments[0].postedOn.isValid()).toBe(false);
    });

    it('undefined comment postedOn becomes current time', () => {
      const match = new MatchModel({
        id: 1,
        date: '2025-03-15T20:00:00',
        competition: 'Vttl',
        players: [],
        games: [],
        comments: [
          {id: 1, text: 'Test', postedOn: undefined, playerId: 1},
        ],
        opponent: {clubId: 1, teamCode: 'A'},
        isHomeMatch: true,
        score: {home: 0, out: 0},
      });
      expect(match.comments[0].postedOn.isValid()).toBe(true);
    });
  });

  describe('date parsing', () => {
    it('parses ISO date string into dayjs', () => {
      const match = createMatch('2025-09-20T20:00:00');
      expect(match.date.year()).toBe(2025);
      expect(match.date.month()).toBe(8); // 0-indexed
      expect(match.date.date()).toBe(20);
      expect(match.date.hour()).toBe(20);
      expect(match.date.minute()).toBe(0);
    });

    it('supports valueOf for sorting', () => {
      const m1 = createMatch('2025-03-15T20:00:00');
      const m2 = createMatch('2025-03-16T20:00:00');
      expect(m1.date.valueOf()).toBeLessThan(m2.date.valueOf());
    });

    it('supports isBefore/isAfter/isSame', () => {
      const match = createMatch('2025-03-15T20:00:00');
      const ref = dayjs('2025-03-15T10:00:00');
      expect(match.date.isSame(ref, 'day')).toBe(true);
      expect(match.date.isAfter(ref, 'day')).toBe(false);
      expect(match.date.isBefore(ref, 'day')).toBe(false);
    });

    it('isBefore returns true for earlier date', () => {
      const match = createMatch('2025-03-14T20:00:00');
      const ref = dayjs('2025-03-15T10:00:00');
      expect(match.date.isBefore(ref, 'day')).toBe(true);
    });

    it('isAfter returns true for later date', () => {
      const match = createMatch('2025-03-16T20:00:00');
      const ref = dayjs('2025-03-15T10:00:00');
      expect(match.date.isAfter(ref, 'day')).toBe(true);
    });
  });
});
