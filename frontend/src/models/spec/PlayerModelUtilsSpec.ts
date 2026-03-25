import { displayMobile, createFrenoyLink, createFrenoyLinkByUniqueId, getPlayingStatusClass } from '../PlayerModel';
import { IPlayerCompetition } from '../model-interfaces';

describe('displayMobile', () => {
  it('formats a 10-digit Belgian mobile number', () => {
    expect(displayMobile('0476123456')).toBe('0476/12 34 56');
  });

  it('formats a 9-digit number', () => {
    expect(displayMobile('053123456')).toBe('053/12 34 56');
  });

  it('returns empty string for falsy input', () => {
    expect(displayMobile('')).toBe('');
  });

  it('returns unformatted string if pattern does not match', () => {
    expect(displayMobile('123')).toBe('123');
  });
});

describe('createFrenoyLinkByUniqueId', () => {
  it('builds Vttl link', () => {
    expect(createFrenoyLinkByUniqueId('Vttl', 12345)).toBe('https://competitie.vttl.be/12345');
  });

  it('builds Jeugd link using Vttl domain', () => {
    expect(createFrenoyLinkByUniqueId('Jeugd', 999)).toBe('https://competitie.vttl.be/999');
  });

  it('builds Sporta link with zero-padded uniqueId', () => {
    expect(createFrenoyLinkByUniqueId('Sporta', 42)).toBe('https://ttonline.sporta.be/000042');
  });

  it('builds Sporta link with large uniqueId', () => {
    expect(createFrenoyLinkByUniqueId('Sporta', 123456)).toBe('https://ttonline.sporta.be/123456');
  });
});

describe('createFrenoyLink', () => {
  it('uses frenoyLink for Vttl when available', () => {
    const comp = { competition: 'Vttl', frenoyLink: 'ABC123', uniqueIndex: 99 } as IPlayerCompetition;
    expect(createFrenoyLink(comp)).toBe('https://competitie.vttl.be/?menu=6&result=1&sel=ABC123');
  });

  it('uses frenoyLink for Sporta when available', () => {
    const comp = { competition: 'Sporta', frenoyLink: 'XYZ', uniqueIndex: 99 } as IPlayerCompetition;
    expect(createFrenoyLink(comp)).toBe('https://ttonline.sporta.be/?menu=6&result=1&sel=XYZ');
  });

  it('falls back to uniqueId when frenoyLink is empty', () => {
    const comp = { competition: 'Vttl', frenoyLink: '', uniqueIndex: 42 } as IPlayerCompetition;
    expect(createFrenoyLink(comp)).toBe('https://competitie.vttl.be/42');
  });
});

describe('getPlayingStatusClass', () => {
  it('returns success for Play', () => {
    expect(getPlayingStatusClass('Play')).toBe('success');
  });

  it('returns success for Major', () => {
    expect(getPlayingStatusClass('Major')).toBe('success');
  });

  it('returns warning for Captain', () => {
    expect(getPlayingStatusClass('Captain')).toBe('warning');
  });

  it('returns danger for NotPlay', () => {
    expect(getPlayingStatusClass('NotPlay')).toBe('danger');
  });

  it('returns info for Maybe', () => {
    expect(getPlayingStatusClass('Maybe')).toBe('info');
  });

  it('returns undefined for empty string', () => {
    expect(getPlayingStatusClass('')).toBeUndefined();
  });

  it('returns undefined for undefined', () => {
    expect(getPlayingStatusClass(undefined)).toBeUndefined();
  });
});
