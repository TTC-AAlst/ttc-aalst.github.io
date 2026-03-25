import dayjs from 'dayjs';
import UserModel from '../UserModel';
import { IMatch } from '../model-interfaces';

const createUser = (playerId: number, securityRoles: string[] = []) => new UserModel({playerId, teams: [], security: securityRoles});

const createMatchStub = (dateStr: string): IMatch => ({
  date: dayjs(dateStr),
} as any);

describe('UserModel.canEditPlayersOnMatchDay', () => {
  it('returns true for admin regardless of date', () => {
    const user = createUser(1, ['IS_ADMIN']);
    const match = createMatchStub('2020-01-01T20:00:00');
    expect(user.canEditPlayersOnMatchDay(match)).toBe(true);
  });

  it('returns true when player has id and match is today', () => {
    const user = createUser(1);
    const today = dayjs().format('YYYY-MM-DDTHH:mm:ss');
    const match = createMatchStub(today);
    expect(user.canEditPlayersOnMatchDay(match)).toBe(true);
  });

  it('returns false when player has id but match is not today', () => {
    const user = createUser(1);
    const match = createMatchStub('2020-06-15T20:00:00');
    expect(user.canEditPlayersOnMatchDay(match)).toBe(false);
  });

  it('returns false when no player id even if match is today', () => {
    const user = createUser(0);
    const today = dayjs().format('YYYY-MM-DDTHH:mm:ss');
    const match = createMatchStub(today);
    expect(user.canEditPlayersOnMatchDay(match)).toBe(false);
  });

  it('isSame compares at day granularity, not exact time', () => {
    const user = createUser(1);
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 2, 15, 10, 0, 0)); // 10:00
    const match = createMatchStub('2025-03-15T20:00:00');  // 20:00 same day
    expect(user.canEditPlayersOnMatchDay(match)).toBe(true);
    vi.useRealTimers();
  });
});
