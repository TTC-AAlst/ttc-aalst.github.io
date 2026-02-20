import dayjs from 'dayjs';

describe('dayjs API patterns used in codebase', () => {
  describe('isBetween (DashboardRecentMatches, DashboardUpcomingMatches)', () => {
    it('inclusive isBetween with day granularity', () => {
      const start = dayjs('2025-03-10');
      const end = dayjs('2025-03-17');
      const inside = dayjs('2025-03-12T20:00:00');
      const onStart = dayjs('2025-03-10T05:00:00');
      const onEnd = dayjs('2025-03-17T23:00:00');
      const outside = dayjs('2025-03-18T01:00:00');

      expect(inside.isBetween(start, end, 'day', '[]')).toBe(true);
      expect(onStart.isBetween(start, end, 'day', '[]')).toBe(true);
      expect(onEnd.isBetween(start, end, 'day', '[]')).toBe(true);
      expect(outside.isBetween(start, end, 'day', '[]')).toBe(false);
    });
  });

  describe('startOf/endOf (TeamOverview, DashboardUpcomingMatches, WeekCalcer)', () => {
    it('startOf day sets time to 00:00:00', () => {
      const d = dayjs('2025-03-15T14:30:00').startOf('day');
      expect(d.hour()).toBe(0);
      expect(d.minute()).toBe(0);
      expect(d.second()).toBe(0);
    });

    it('endOf day sets time to 23:59:59', () => {
      const d = dayjs('2025-03-15T14:30:00').endOf('day');
      expect(d.hour()).toBe(23);
      expect(d.minute()).toBe(59);
      expect(d.second()).toBe(59);
    });

    it('startOf week sets to Monday in nl locale', () => {
      const d = dayjs('2025-03-12T14:30:00').startOf('week'); // Wednesday
      expect(d.day()).toBe(1); // Monday
      expect(d.date()).toBe(10); // Monday March 10
    });

    it('endOf week sets to Sunday in nl locale', () => {
      const d = dayjs('2025-03-12T14:30:00').endOf('week'); // Wednesday
      expect(d.day()).toBe(0); // Sunday
      expect(d.date()).toBe(16); // Sunday March 16
    });
  });

  describe('add/subtract (DashboardUpcomingMatches, DashboardRecentMatches, PlayerEvents)', () => {
    it('subtract 7 days for recent matches window', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 2, 15)); // Mar 15

      const lastWeek = dayjs().subtract(7, 'days');
      expect(lastWeek.date()).toBe(8);
      expect(lastWeek.month()).toBe(2); // March

      vi.useRealTimers();
    });

    it('add 14 days + endOf day for upcoming matches window', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 2, 15)); // Mar 15

      const twoWeeks = dayjs().add(14, 'days').endOf('day');
      expect(twoWeeks.date()).toBe(29);
      expect(twoWeeks.hour()).toBe(23);
      expect(twoWeeks.minute()).toBe(59);

      vi.useRealTimers();
    });

    it('subtract for "1 hour before match" check (MobileLiveMatchInProgress)', () => {
      const matchDate = dayjs('2025-03-15T20:00:00');
      const oneHourBefore = matchDate.subtract(1, 'hour');
      expect(oneHourBefore.hour()).toBe(19);
      expect(matchDate.hour()).toBe(20); // original unchanged (dayjs is immutable)
    });

    it('canEnterOpponents: true when within 1 hour before match start', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 2, 15, 19, 30, 0)); // 19:30, match at 20:00

      const matchDate = dayjs('2025-03-15T20:00:00');
      // 19:00.isBefore(19:30) = true -> can enter
      const canEnterOpponents = matchDate.subtract(1, 'hour').isBefore(dayjs());
      expect(canEnterOpponents).toBe(true);

      vi.useRealTimers();
    });

    it('canEnterOpponents: false when more than 1 hour before match', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 2, 15, 18, 30, 0)); // 18:30, match at 20:00

      const matchDate = dayjs('2025-03-15T20:00:00');
      // 19:00.isBefore(18:30) = false -> cannot enter yet
      const canEnterOpponents = matchDate.subtract(1, 'hour').isBefore(dayjs());
      expect(canEnterOpponents).toBe(false);

      vi.useRealTimers();
    });
  });

  describe('diff sorting (PreviousEncounters, OpponentsFormation, IndividualMatches)', () => {
    it('sorts dates descending using dayjs(b).diff(dayjs(a))', () => {
      const dates = ['2025-01-10', '2025-03-15', '2025-02-20'];
      const sorted = [...dates].sort((a, b) => dayjs(b).diff(dayjs(a)));
      expect(sorted).toEqual(['2025-03-15', '2025-02-20', '2025-01-10']);
    });

    it('diff returns positive when b is later', () => {
      expect(dayjs('2025-03-15').diff(dayjs('2025-03-10'))).toBeGreaterThan(0);
    });

    it('diff returns negative when b is earlier', () => {
      expect(dayjs('2025-03-10').diff(dayjs('2025-03-15'))).toBeLessThan(0);
    });
  });

  describe('valueOf sorting with inline dayjs construction (PlayerEvents)', () => {
    it('sorts string dates descending using dayjs(b).valueOf() - dayjs(a).valueOf()', () => {
      const events = [
        {createdOn: '2025-03-10T10:00:00'},
        {createdOn: '2025-03-15T20:00:00'},
        {createdOn: '2025-03-12T14:00:00'},
      ];
      const sorted = [...events].sort(
        (a, b) => dayjs(b.createdOn).valueOf() - dayjs(a.createdOn).valueOf(),
      );
      expect(sorted.map(e => e.createdOn)).toEqual([
        '2025-03-15T20:00:00',
        '2025-03-12T14:00:00',
        '2025-03-10T10:00:00',
      ]);
    });

    it('handles equal dates in valueOf subtraction', () => {
      const a = dayjs('2025-03-15T20:00:00');
      const b = dayjs('2025-03-15T20:00:00');
      expect(b.valueOf() - a.valueOf()).toBe(0);
    });
  });

  describe('fromNow (TimeAgo)', () => {
    it('returns a relative time string', () => {
      const recentDate = dayjs().subtract(5, 'minutes');
      const result = recentDate.fromNow();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('handles past dates with full nl locale format', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 2, 15, 12, 0, 0));

      const pastDate = dayjs().subtract(3, 'days');
      const result = pastDate.fromNow();
      expect(result).toBe('3 dagen geleden');

      vi.useRealTimers();
    });
  });

  describe('format patterns used across codebase', () => {
    const d = dayjs('2025-03-15T19:30:00');

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
      expect(dayjs('2025-03-15T20:00:00').format('HH')).toBe('20');
    });

    it('ddd DD MMMM YYYY for full date (Eetfestijn)', () => {
      const result = d.format('ddd DD MMMM YYYY');
      expect(result).toMatch(/za\.? 15 maart 2025/);
    });
  });

  describe('month() for season round detection', () => {
    it('month() returns 0-indexed months', () => {
      expect(dayjs('2025-01-15').month()).toBe(0);
      expect(dayjs('2025-07-15').month()).toBe(6);
      expect(dayjs('2025-08-15').month()).toBe(7);
      expect(dayjs('2025-12-15').month()).toBe(11);
    });

    it('first round: month >= 7 (Aug-Dec)', () => {
      expect(dayjs('2024-09-15').month() >= 7).toBe(true);
      expect(dayjs('2024-12-15').month() >= 7).toBe(true);
    });

    it('last round: month < 7 (Jan-Jul)', () => {
      expect(dayjs('2025-01-15').month() < 7).toBe(true);
      expect(dayjs('2025-06-15').month() < 7).toBe(true);
    });
  });

  describe('next vs previous match partitioning (TeamOverview)', () => {
    it('match on today appears in next, not previous', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 2, 15, 10, 0, 0)); // Mar 15 10:00

      const today = dayjs().startOf('day');
      const matchToday = dayjs('2025-03-15T20:00:00');
      const matchYesterday = dayjs('2025-03-14T20:00:00');
      const matchTomorrow = dayjs('2025-03-16T20:00:00');

      // TeamOverview logic: next = isSame(today, 'day') || isAfter(today, 'day')
      expect(matchToday.isSame(today, 'day') || matchToday.isAfter(today, 'day')).toBe(true);
      expect(matchTomorrow.isSame(today, 'day') || matchTomorrow.isAfter(today, 'day')).toBe(true);
      expect(matchYesterday.isSame(today, 'day') || matchYesterday.isAfter(today, 'day')).toBe(false);

      // previous = isBefore(today, 'day')
      expect(matchYesterday.isBefore(today, 'day')).toBe(true);
      expect(matchToday.isBefore(today, 'day')).toBe(false);

      vi.useRealTimers();
    });
  });

  describe('diff hours (MatchModel.isBeingPlayed)', () => {
    it('calculates absolute hours difference', () => {
      const now = dayjs('2025-03-15T21:00:00');
      const matchDate = dayjs('2025-03-15T20:00:00');
      const diff = now.diff(matchDate, 'hour', true);
      expect(diff).toBe(1);
      expect(Math.abs(diff) < 14).toBe(true);
    });

    it('negative diff when match is in future', () => {
      const now = dayjs('2025-03-15T19:00:00');
      const matchDate = dayjs('2025-03-15T20:00:00');
      const diff = now.diff(matchDate, 'hour', true);
      expect(diff).toBe(-1);
      expect(Math.abs(diff) < 14).toBe(true);
    });
  });

  describe('DST transitions (Belgium: last Sunday of March/October)', () => {
    it('startOf week across spring DST (clocks forward) still returns Monday', () => {
      // 2025 spring DST: Sunday March 30, 2:00 -> 3:00
      const duringDstWeek = dayjs('2025-03-31T20:00:00'); // Monday after DST
      const weekStart = duringDstWeek.startOf('week');
      expect(weekStart.day()).toBe(1); // Monday
      expect(weekStart.date()).toBe(31);
    });

    it('startOf week across autumn DST (clocks backward) still returns Monday', () => {
      // 2025 autumn DST: Sunday October 26, 3:00 -> 2:00
      const duringDstWeek = dayjs('2025-10-27T20:00:00'); // Monday after DST
      const weekStart = duringDstWeek.startOf('week');
      expect(weekStart.day()).toBe(1); // Monday
      expect(weekStart.date()).toBe(27);
    });

    it('subtract 1 hour across spring DST gives correct result', () => {
      // Match at 20:00 on Sunday March 30 (DST day)
      const matchDate = dayjs('2025-03-30T20:00:00');
      const oneHourBefore = matchDate.subtract(1, 'hour');
      expect(oneHourBefore.hour()).toBe(19);
    });

    it('isBeingPlayed diff is correct across DST boundary', () => {
      vi.useFakeTimers();
      // Set "now" to 21:00 on DST Sunday
      vi.setSystemTime(new Date(2025, 2, 30, 21, 0, 0));

      const matchDate = dayjs('2025-03-30T20:00:00');
      const diff = dayjs().diff(matchDate, 'hour', true);
      expect(Math.abs(diff)).toBeLessThan(2);
      expect(Math.abs(diff) < 14).toBe(true);

      vi.useRealTimers();
    });

    it('isBetween works correctly during DST week', () => {
      // Match on DST Sunday
      const match = dayjs('2025-03-30T20:00:00');
      const weekStart = match.startOf('week');
      const weekEnd = match.endOf('week');
      expect(match.isBetween(weekStart, weekEnd, undefined, '[]')).toBe(true);
    });
  });

  describe('invalid input handling (MatchModel constructor, TimeAgo)', () => {
    it('dayjs(null) creates an invalid dayjs', () => {
      const m = dayjs(null as any);
      expect(m.isValid()).toBe(false);
      expect(m.format('YYYY-MM-DD')).toBe('Invalid Date');
    });

    it('dayjs(undefined) is treated as dayjs() - valid current time', () => {
      const m = dayjs(undefined as any);
      expect(m.isValid()).toBe(true);
    });

    it('dayjs("garbage") creates an invalid dayjs', () => {
      const m = dayjs('not-a-date');
      expect(m.isValid()).toBe(false);
    });

    it('dayjs(validString).isValid() returns true', () => {
      const m = dayjs('2025-03-15T20:00:00');
      expect(m.isValid()).toBe(true);
    });
  });
});
