import moment from 'moment';
import 'moment/dist/locale/nl-be';
import MatchModel from '../MatchModel';

moment.locale('nl-be');

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
      const nowIsh = moment().subtract(1, 'hour').format('YYYY-MM-DDTHH:mm:ss');
      const match = createMatch(nowIsh);
      expect(match.isBeingPlayed()).toBe(true);
    });

    it('returns true when match is upcoming within 14 hours', () => {
      const soon = moment().add(2, 'hours').format('YYYY-MM-DDTHH:mm:ss');
      const match = createMatch(soon);
      expect(match.isBeingPlayed()).toBe(true);
    });

    it('returns false when match was days ago', () => {
      const match = createMatch('2020-01-01T20:00:00');
      expect(match.isBeingPlayed()).toBe(false);
    });

    it('returns false when match is days from now', () => {
      const farFuture = moment().add(7, 'days').format('YYYY-MM-DDTHH:mm:ss');
      const match = createMatch(farFuture);
      expect(match.isBeingPlayed()).toBe(false);
    });
  });

  describe('date parsing', () => {
    it('parses ISO date string into moment', () => {
      const match = createMatch('2025-09-20T20:00:00');
      expect(match.date.year()).toBe(2025);
      expect(match.date.month()).toBe(8); // 0-indexed
      expect(match.date.date()).toBe(20);
      expect(match.date.hours()).toBe(20);
      expect(match.date.minutes()).toBe(0);
    });

    it('supports valueOf for sorting', () => {
      const m1 = createMatch('2025-03-15T20:00:00');
      const m2 = createMatch('2025-03-16T20:00:00');
      expect(m1.date.valueOf()).toBeLessThan(m2.date.valueOf());
    });

    it('supports isBefore/isAfter/isSame', () => {
      const match = createMatch('2025-03-15T20:00:00');
      const ref = moment('2025-03-15T10:00:00');
      expect(match.date.isSame(ref, 'day')).toBe(true);
      expect(match.date.isAfter(ref, 'day')).toBe(false);
      expect(match.date.isBefore(ref, 'day')).toBe(false);
    });

    it('isBefore returns true for earlier date', () => {
      const match = createMatch('2025-03-14T20:00:00');
      const ref = moment('2025-03-15T10:00:00');
      expect(match.date.isBefore(ref, 'day')).toBe(true);
    });

    it('isAfter returns true for later date', () => {
      const match = createMatch('2025-03-16T20:00:00');
      const ref = moment('2025-03-15T10:00:00');
      expect(match.date.isAfter(ref, 'day')).toBe(true);
    });
  });
});
