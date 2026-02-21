import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { IMatch } from '../../../models/model-interfaces';

export class WeekCalcer {
  includeFreeMatches: boolean;
  matches: IMatch[];
  currentWeek!: number;
  firstWeek!: number;
  lastWeek!: number;
  weeks!: {start: Dayjs; end: Dayjs}[];

  constructor(matches: IMatch[], currentWeek?: number, includeFreeMatches = false) {
    this.includeFreeMatches = includeFreeMatches;
    this.matches = matches.sort((a, b) => a.date.valueOf() - b.date.valueOf());
    this.setCurrentWeeks(currentWeek);
  }

  getMatches() {
    const week = this.getWeek();
    return this.matches.filter(match => match.date.isBetween(week.start, week.end, undefined, '[]'));
  }

  getMatchesForWeek(weekIndex: number): IMatch[] {
    const week = this.weeks[weekIndex];
    if (!week) return [];
    return this.matches.filter(match => match.date.isBetween(week.start, week.end, undefined, '[]'));
  }

  getWeek() {
    return this.weeks[this.currentWeek - 1];
  }

  setCurrentWeeks(currentWeek?: number) {
    if (!this.matches.length) {
      this.firstWeek = 1;
      this.currentWeek = 1;
      this.lastWeek = 22;
      this.weeks = [{start: dayjs().startOf('week'), end: dayjs().endOf('week')}];
      return;
    }
    this.weeks = this.matches.reduce((acc, next) => {
      const date = next.date.startOf('week');
      if (!acc.length || !acc[acc.length - 1].start.isSame(date, 'day')) {
        acc.push({start: date, end: next.date.endOf('week')});
      }
      return acc;
    }, [] as {start: Dayjs; end: Dayjs}[]);

    // console.log('weekz', this.weeks.map(x => x.start.toString() + " -> " + x.end.toString())); // eslint-disable-line

    this.firstWeek = 1;
    this.lastWeek = this.weeks.length;

    if (!currentWeek) {
      let testWeek = dayjs().startOf('week');
      const findWeek = w => w.start.isSame(testWeek, 'day');
      while (!this.currentWeek) {
        this.currentWeek = this.weeks.findIndex(findWeek) + 1;
        testWeek = testWeek.add(1, 'week');
        if (testWeek.isAfter(this.weeks[this.weeks.length - 1].end)) {
          this.currentWeek = this.lastWeek;
          break;
        }
      }
    } else {
      this.currentWeek = currentWeek;
    }
  }
}
