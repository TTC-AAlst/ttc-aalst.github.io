import moment from 'moment';
import { IMatch } from '../../../models/model-interfaces';

export class WeekCalcer {
  includeFreeMatches: boolean;
  matches: IMatch[];
  currentWeek!: number;
  firstWeek!: number;
  lastWeek!: number;
  weeks!: {start: moment.Moment; end: moment.Moment}[];

  constructor(matches: IMatch[], currentWeek?: number, includeFreeMatches = false) {
    this.includeFreeMatches = includeFreeMatches;
    this.matches = matches.sort((a, b) => a.date.valueOf() - b.date.valueOf());
    this.setCurrentWeeks(currentWeek);
  }

  getMatches() {
    const week = this.getWeek();
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
      this.weeks = [{start: moment().startOf('week'), end: moment().endOf('week')}];
      return;
    }
    this.weeks = this.matches.reduce((acc, next) => {
      const date = next.date.clone().startOf('week');
      if (!acc.length || !acc[acc.length - 1].start.isSame(date, 'day')) {
        acc.push({start: date, end: next.date.clone().endOf('week')});
      }
      return acc;
    }, [] as {start: moment.Moment; end: moment.Moment}[]);

    // console.log('weekz', this.weeks.map(x => x.start.toString() + " -> " + x.end.toString())); // eslint-disable-line

    this.firstWeek = 1;
    this.lastWeek = this.weeks.length;

    if (!currentWeek) {
      let testWeek = moment().startOf('week');
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
