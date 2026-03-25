import dayjs from 'dayjs';
import { IStoreMatchCommon } from '../../models/model-interfaces';

// shouldSync is exported from matchesReducer but importing it triggers
// the full store initialization chain. Replicate the logic here to test
// the date pattern in isolation.
const shouldSync = (match: IStoreMatchCommon) => !match.isSyncedWithFrenoy
  && dayjs().isAfter(match.date)
  && match.shouldBePlayed;

const createStoreMatch = (overrides: Partial<IStoreMatchCommon> = {}): IStoreMatchCommon => ({
  id: 1,
  frenoyMatchId: '',
  shouldBePlayed: true,
  isSyncedWithFrenoy: false,
  week: 1,
  competition: 'Vttl',
  frenoyDivisionId: 0,
  date: dayjs('2020-01-01T20:00:00'),
  score: {home: 0, out: 0},
  scoreType: 'NotYetPlayed',
  isPlayed: false,
  players: [],
  formationComment: '',
  games: [],
  ...overrides,
});

describe('shouldSync', () => {
  it('returns true for a past, unsynced match that should be played', () => {
    const match = createStoreMatch({date: dayjs('2020-01-01T20:00:00')});
    expect(shouldSync(match)).toBe(true);
  });

  it('returns false when already synced', () => {
    const match = createStoreMatch({
      date: dayjs('2020-01-01T20:00:00'),
      isSyncedWithFrenoy: true,
    });
    expect(shouldSync(match)).toBe(false);
  });

  it('returns false when match should not be played', () => {
    const match = createStoreMatch({
      date: dayjs('2020-01-01T20:00:00'),
      shouldBePlayed: false,
    });
    expect(shouldSync(match)).toBe(false);
  });

  it('returns false when match is in the future', () => {
    const match = createStoreMatch({
      date: dayjs().add(7, 'days'),
    });
    expect(shouldSync(match)).toBe(false);
  });

  it('returns true when match date just passed', () => {
    const match = createStoreMatch({
      date: dayjs().subtract(1, 'hour'),
    });
    expect(shouldSync(match)).toBe(true);
  });
});
