import UserModel from '../UserModel';

const createUser = (overrides: Partial<{ playerId: number; teams: number[]; security: string[] }> = {}) =>
  new UserModel({
    playerId: overrides.playerId ?? 1,
    teams: overrides.teams ?? [10, 20],
    security: overrides.security ?? [],
  });

describe('UserModel', () => {
  describe('playsIn', () => {
    it('returns true when user plays in the team', () => {
      expect(createUser({ teams: [10, 20] }).playsIn(10)).toBe(true);
    });

    it('returns false when user does not play in the team', () => {
      expect(createUser({ teams: [10, 20] }).playsIn(99)).toBe(false);
    });
  });

  describe('can', () => {
    it('returns true when user has the permission', () => {
      expect(createUser({ security: ['CAN_MANAGETEAM'] }).can('CAN_MANAGETEAM')).toBe(true);
    });

    it('returns false when user lacks the permission', () => {
      expect(createUser({ security: [] }).can('CAN_MANAGETEAM')).toBe(false);
    });
  });

  describe('canManageTeams', () => {
    it('returns true with CAN_MANAGETEAM permission', () => {
      expect(createUser({ security: ['CAN_MANAGETEAM'] }).canManageTeams()).toBe(true);
    });

    it('returns false without permission', () => {
      expect(createUser().canManageTeams()).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('returns true with IS_ADMIN permission', () => {
      expect(createUser({ security: ['IS_ADMIN'] }).isAdmin()).toBe(true);
    });

    it('returns false without permission', () => {
      expect(createUser().isAdmin()).toBe(false);
    });
  });

  describe('isDev', () => {
    it('returns true with IS_DEV permission', () => {
      expect(createUser({ security: ['IS_DEV'] }).isDev()).toBe(true);
    });

    it('returns false without permission', () => {
      expect(createUser().isDev()).toBe(false);
    });
  });

  describe('isSystem', () => {
    it('returns true with IS_SYSTEM permission', () => {
      expect(createUser({ security: ['IS_SYSTEM'] }).isSystem()).toBe(true);
    });

    it('returns false without permission', () => {
      expect(createUser().isSystem()).toBe(false);
    });
  });

  describe('canPostReport', () => {
    it('returns true when user plays in the team', () => {
      expect(createUser({ teams: [10] }).canPostReport(10)).toBe(true);
    });

    it('returns true with CAN_EDITALLREPORTS permission', () => {
      expect(createUser({ teams: [] }).canPostReport(10)).toBe(false);
      expect(createUser({ teams: [], security: ['CAN_EDITALLREPORTS'] }).canPostReport(10)).toBe(true);
    });

    it('returns false when user does not play and lacks permission', () => {
      expect(createUser({ teams: [20] }).canPostReport(10)).toBe(false);
    });
  });
});
