import moment from 'moment';
import 'moment/dist/locale/nl-be';

moment.locale('nl-be');

describe('moment.js API patterns used in codebase', () => {
  describe('isBetween (DashboardRecentMatches, DashboardUpcomingMatches)', () => {
    it('inclusive isBetween with day granularity', () => {
      const start = moment('2025-03-10');
      const end = moment('2025-03-17');
      const inside = moment('2025-03-12T20:00:00');
      const onStart = moment('2025-03-10T05:00:00');
      const onEnd = moment('2025-03-17T23:00:00');
      const outside = moment('2025-03-18T01:00:00');

      expect(inside.isBetween(start, end, 'day', '[]')).toBe(true);
      expect(onStart.isBetween(start, end, 'day', '[]')).toBe(true);
      expect(onEnd.isBetween(start, end, 'day', '[]')).toBe(true);
      expect(outside.isBetween(start, end, 'day', '[]')).toBe(false);
    });
  });

  describe('startOf/endOf (TeamOverview, DashboardUpcomingMatches, WeekCalcer)', () => {
    it('startOf day sets time to 00:00:00', () => {
      const d = moment('2025-03-15T14:30:00').startOf('day');
      expect(d.hours()).toBe(0);
      expect(d.minutes()).toBe(0);
      expect(d.seconds()).toBe(0);
    });

    it('endOf day sets time to 23:59:59', () => {
      const d = moment('2025-03-15T14:30:00').endOf('day');
      expect(d.hours()).toBe(23);
      expect(d.minutes()).toBe(59);
      expect(d.seconds()).toBe(59);
    });

    it('startOf week sets to Monday in nl-be locale', () => {
      const d = moment('2025-03-12T14:30:00').startOf('week'); // Wednesday
      expect(d.day()).toBe(1); // Monday
      expect(d.date()).toBe(10); // Monday March 10
    });

    it('endOf week sets to Sunday in nl-be locale', () => {
      const d = moment('2025-03-12T14:30:00').endOf('week'); // Wednesday
      expect(d.day()).toBe(0); // Sunday
      expect(d.date()).toBe(16); // Sunday March 16
    });
  });

  describe('add/subtract (DashboardUpcomingMatches, DashboardRecentMatches, PlayerEvents)', () => {
    it('subtract 7 days for recent matches window', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 2, 15)); // Mar 15

      const lastWeek = moment().subtract(7, 'days');
      expect(lastWeek.date()).toBe(8);
      expect(lastWeek.month()).toBe(2); // March

      vi.useRealTimers();
    });

    it('add 14 days + endOf day for upcoming matches window', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 2, 15)); // Mar 15

      const twoWeeks = moment().add(14, 'days').endOf('day');
      expect(twoWeeks.date()).toBe(29);
      expect(twoWeeks.hours()).toBe(23);
      expect(twoWeeks.minutes()).toBe(59);

      vi.useRealTimers();
    });

    it('clone + subtract for "1 hour before match" check (MobileLiveMatchInProgress)', () => {
      const matchDate = moment('2025-03-15T20:00:00');
      const oneHourBefore = matchDate.clone().subtract(1, 'hour');
      expect(oneHourBefore.hours()).toBe(19);
      expect(matchDate.hours()).toBe(20); // original unchanged
    });
  });

  describe('diff sorting (PreviousEncounters, OpponentsFormation, IndividualMatches)', () => {
    it('sorts dates descending using moment(b).diff(moment(a))', () => {
      const dates = ['2025-01-10', '2025-03-15', '2025-02-20'];
      const sorted = [...dates].sort((a, b) => moment(b).diff(moment(a)));
      expect(sorted).toEqual(['2025-03-15', '2025-02-20', '2025-01-10']);
    });

    it('diff returns positive when b is later', () => {
      expect(moment('2025-03-15').diff(moment('2025-03-10'))).toBeGreaterThan(0);
    });

    it('diff returns negative when b is earlier', () => {
      expect(moment('2025-03-10').diff(moment('2025-03-15'))).toBeLessThan(0);
    });
  });

  describe('fromNow (TimeAgo)', () => {
    it('returns a relative time string', () => {
      const recentDate = moment().subtract(5, 'minutes');
      const result = recentDate.fromNow();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('handles past dates', () => {
      const pastDate = moment().subtract(3, 'days');
      expect(pastDate.fromNow()).toMatch(/dagen/); // nl-be: "3 dagen geleden"
    });
  });

  describe('format patterns used across codebase', () => {
    const d = moment('2025-03-15T19:30:00');

    it('YYYY-MM-DD for grouping and httpClient filename', () => {
      expect(d.format('YYYY-MM-DD')).toBe('2025-03-15');
    });

    it('D/M for short date display', () => {
      expect(d.format('D/M')).toBe('15/3');
    });

    it('D/M/YYYY for full date (PreviousEncounters)', () => {
      expect(d.format('D/M/YYYY')).toBe('15/3/2025');
    });

    it('ddd D/M for day-abbreviated date', () => {
      expect(d.format('ddd D/M')).toMatch(/^za\.? 15\/3$/);
    });

    it('dd D MMM for match grouping display', () => {
      const result = d.format('dd D MMM');
      expect(result).toMatch(/za 15 mrt/i);
    });

    it('HH:mm for time display', () => {
      expect(d.format('HH:mm')).toBe('19:30');
    });

    it('HH for hour-only display', () => {
      expect(moment('2025-03-15T20:00:00').format('HH')).toBe('20');
    });

    it('ddd DD MMMM YYYY for full date (Eetfestijn)', () => {
      const result = d.format('ddd DD MMMM YYYY');
      expect(result).toMatch(/za\.? 15 maart 2025/);
    });
  });

  describe('month() for season round detection', () => {
    it('month() returns 0-indexed months', () => {
      expect(moment('2025-01-15').month()).toBe(0);
      expect(moment('2025-07-15').month()).toBe(6);
      expect(moment('2025-08-15').month()).toBe(7);
      expect(moment('2025-12-15').month()).toBe(11);
    });

    it('first round: month >= 7 (Aug-Dec)', () => {
      expect(moment('2024-09-15').month() >= 7).toBe(true);
      expect(moment('2024-12-15').month() >= 7).toBe(true);
    });

    it('last round: month < 7 (Jan-Jul)', () => {
      expect(moment('2025-01-15').month() < 7).toBe(true);
      expect(moment('2025-06-15').month() < 7).toBe(true);
    });
  });

  describe('duration (MatchModel.isBeingPlayed)', () => {
    it('calculates absolute hours difference', () => {
      const now = moment('2025-03-15T21:00:00');
      const matchDate = moment('2025-03-15T20:00:00');
      const diff = moment.duration(now.diff(matchDate)).asHours();
      expect(diff).toBe(1);
      expect(Math.abs(diff) < 14).toBe(true);
    });

    it('negative diff when match is in future', () => {
      const now = moment('2025-03-15T19:00:00');
      const matchDate = moment('2025-03-15T20:00:00');
      const diff = moment.duration(now.diff(matchDate)).asHours();
      expect(diff).toBe(-1);
      expect(Math.abs(diff) < 14).toBe(true);
    });
  });
});
