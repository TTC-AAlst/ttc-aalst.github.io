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
