import { t } from '../../locales';

describe('translate', () => {
  it('returns empty string for undefined key', () => {
    expect(t()).toBe('');
    expect(t(undefined)).toBe('');
  });

  it('returns the key when translation is not found', () => {
    expect(t('nonexistent.key.here')).toBe('nonexistent.key.here');
  });

  it('translates a top-level key', () => {
    expect(t('clubName')).toBe('Aalst');
  });

  it('translates a dotted key', () => {
    expect(t('common.apiSuccess')).toBe('Greato success');
  });

  it('substitutes positional parameter with ${}', () => {
    // player.editStyle.title uses ${} pattern
    const result = t('player.editStyle.title', 'Dirk');
    expect(result).toContain('Dirk');
  });

  it('substitutes named parameters', () => {
    const result = t('dashboard.greeting', { name: 'Dirk' });
    expect(result).toContain('Dirk');
  });
});

describe('translate.route', () => {
  it('returns a simple route', () => {
    expect(t.route('login')).toBe('/login');
  });

  it('returns a dotted route', () => {
    expect(t.route('profileTabs.editDetails')).toBe('wijzig-gegevens');
  });

  it('substitutes route parameters', () => {
    const route = t.route('player', { playerId: 42 });
    expect(route).toBe('/speler/42');
  });

  it('returns empty string for unknown route', () => {
    expect(t.route('nonexistent')).toBe('');
  });

  it('substitutes competition parameter in teams route', () => {
    const route = t.route('teams', { competition: 'Vttl' });
    expect(route).toContain('Vttl');
  });
});

describe('translate.reverseRoute', () => {
  it('finds key by translated value', () => {
    const key = t.reverseRoute('profileTabs', 'wijzig-gegevens');
    expect(key).toBe('editDetails');
  });

  it('returns empty string for unknown base route', () => {
    expect(t.reverseRoute('nonexistent', 'foo')).toBe('');
  });

  it('returns empty string when translated value not found', () => {
    expect(t.reverseRoute('profileTabs', 'nonexistent')).toBe('');
  });
});
