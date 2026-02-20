import moment from 'moment';
import { WeekCalcer } from '../WeekCalcer';
import MatchModel from '../../../../models/MatchModel';
import { IMatch } from '../../../../models/model-interfaces';

const createMatch = (dateStr: string, id = 1): IMatch => new MatchModel({
  id,
  date: dateStr,
  competition: 'Vttl',
  players: [],
  games: [],
  comments: [],
  opponent: {},
  isHomeMatch: true,
  score: {home: 0, out: 0},
}) as IMatch;

describe('WeekCalcer', () => {
  describe('empty matches', () => {
    it('defaults to week 1 of 22 with no matches', () => {
      const wc = new WeekCalcer([]);
      expect(wc.firstWeek).toBe(1);
      expect(wc.currentWeek).toBe(1);
      expect(wc.lastWeek).toBe(22);
    });
  });

  describe('week grouping', () => {
    it('groups matches in the same week together', () => {
      const matches = [
        createMatch('2025-03-10T20:00:00', 1), // Monday
        createMatch('2025-03-12T20:00:00', 2), // Wednesday same week
      ];
      const wc = new WeekCalcer(matches, 1);
      expect(wc.weeks.length).toBe(1);
    });

    it('creates separate weeks for matches in different weeks', () => {
      const matches = [
        createMatch('2025-03-10T20:00:00', 1), // week 11
        createMatch('2025-03-17T20:00:00', 2), // week 12
      ];
      const wc = new WeekCalcer(matches, 1);
      expect(wc.weeks.length).toBe(2);
    });

    it('sorts matches by date before grouping', () => {
      const matches = [
        createMatch('2025-03-17T20:00:00', 2),
        createMatch('2025-03-10T20:00:00', 1),
      ];
      const wc = new WeekCalcer(matches, 1);
      expect(wc.weeks[0].start.isBefore(wc.weeks[1].start)).toBe(true);
    });
  });

  describe('getMatches', () => {
    it('returns matches for the current week', () => {
      const matches = [
        createMatch('2025-03-10T20:00:00', 1),
        createMatch('2025-03-11T20:00:00', 2),
        createMatch('2025-03-17T20:00:00', 3),
      ];
      const wc = new WeekCalcer(matches, 1);
      const weekMatches = wc.getMatches();
      expect(weekMatches.length).toBe(2);
      expect(weekMatches.map(m => m.id)).toEqual([1, 2]);
    });

    it('includes match at exact week start boundary', () => {
      // Monday 00:00:00 is the startOf('week') in nl-be locale
      // The week.start is set via clone().startOf('week'), so a match
      // at exactly Monday 00:00 must be included
      const matches = [
        createMatch('2025-03-10T00:00:00', 1), // Monday midnight = exact startOf('week')
        createMatch('2025-03-12T20:00:00', 2), // Wednesday same week
      ];
      const wc = new WeekCalcer(matches, 1);
      const weekMatches = wc.getMatches();
      expect(weekMatches.length).toBe(2);
      expect(weekMatches.map(m => m.id)).toEqual([1, 2]);
    });

    it('returns matches for a different week', () => {
      const matches = [
        createMatch('2025-03-10T20:00:00', 1),
        createMatch('2025-03-17T20:00:00', 2),
      ];
      const wc = new WeekCalcer(matches, 2);
      const weekMatches = wc.getMatches();
      expect(weekMatches.length).toBe(1);
      expect(weekMatches[0].id).toBe(2);
    });
  });

  describe('currentWeek auto-detection', () => {
    it('uses explicit currentWeek when provided', () => {
      const matches = [
        createMatch('2025-03-10T20:00:00', 1),
        createMatch('2025-03-17T20:00:00', 2),
        createMatch('2025-03-24T20:00:00', 3),
      ];
      const wc = new WeekCalcer(matches, 2);
      expect(wc.currentWeek).toBe(2);
    });

    it('detects current week when today falls within a match week', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 2, 12, 10, 0, 0)); // Wed Mar 12 2025

      const matches = [
        createMatch('2025-03-03T20:00:00', 1),  // week 1 (Mar 3-9)
        createMatch('2025-03-10T20:00:00', 2),  // week 2 (Mar 10-16) ← today is here
        createMatch('2025-03-17T20:00:00', 3),  // week 3 (Mar 17-23)
      ];
      const wc = new WeekCalcer(matches);
      expect(wc.currentWeek).toBe(2);

      vi.useRealTimers();
    });

    it('advances to next match week when today is between match weeks', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2025, 2, 19, 10, 0, 0)); // Wed Mar 19, between week 2 and 3

      const matches = [
        createMatch('2025-03-10T20:00:00', 1),  // week 1 (Mar 10-16)
        createMatch('2025-03-24T20:00:00', 2),  // week 2 (Mar 24-30) ← skipped Mar 17 week
      ];
      const wc = new WeekCalcer(matches);
      // Loop should advance past Mar 17 week (no match) and find Mar 24 week
      expect(wc.currentWeek).toBe(2);

      vi.useRealTimers();
    });

    it('falls back to last week when all matches are in the past', () => {
      const matches = [
        createMatch('2020-03-10T20:00:00', 1),
        createMatch('2020-03-17T20:00:00', 2),
      ];
      const wc = new WeekCalcer(matches);
      expect(wc.currentWeek).toBe(wc.lastWeek);
    });
  });

  describe('week boundaries', () => {
    it('week start is beginning of the week', () => {
      const matches = [createMatch('2025-03-12T20:00:00', 1)]; // Wednesday
      const wc = new WeekCalcer(matches, 1);
      const week = wc.getWeek();
      // startOf('week') should be Monday (locale-dependent)
      expect(week.start.day()).toBe(moment('2025-03-12').startOf('week').day());
    });

    it('week end is end of the week', () => {
      const matches = [createMatch('2025-03-12T20:00:00', 1)];
      const wc = new WeekCalcer(matches, 1);
      const week = wc.getWeek();
      expect(week.end.hours()).toBe(23);
      expect(week.end.minutes()).toBe(59);
    });
  });
});
