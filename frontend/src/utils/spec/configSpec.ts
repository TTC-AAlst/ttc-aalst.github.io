import { config, devUrl, isDev, getSignalRUrl, getStaticFileUrl } from '../../config';

describe('config', () => {
  it('has expected properties', () => {
    expect(config.backend).toContain('https://');
    expect(config.images).toContain('https://');
    expect(config.ga).toBeTruthy();
    expect(config.version).toBeTruthy();
  });

  it('devUrl points to localhost', () => {
    expect(devUrl).toBe('http://localhost:5193');
  });
});

describe('isDev', () => {
  it('returns true for localhost', () => {
    Object.defineProperty(window, 'location', { value: { hostname: 'localhost' }, writable: true });
    expect(isDev()).toBe(true);
  });

  it('returns true for 192.168.x.x', () => {
    Object.defineProperty(window, 'location', { value: { hostname: '192.168.1.100' }, writable: true });
    expect(isDev()).toBe(true);
  });

  it('returns false for production hostname', () => {
    Object.defineProperty(window, 'location', { value: { hostname: 'ttc-aalst.be' }, writable: true });
    expect(isDev()).toBe(false);
  });
});

describe('getSignalRUrl', () => {
  it('returns dev URL on localhost', () => {
    Object.defineProperty(window, 'location', { value: { hostname: 'localhost' }, writable: true });
    expect(getSignalRUrl()).toBe('http://localhost:5193/hubs/ttc');
  });

  it('returns production URL on prod hostname', () => {
    Object.defineProperty(window, 'location', { value: { hostname: 'ttc-aalst.be' }, writable: true });
    expect(getSignalRUrl()).toBe(`${config.backend}/hubs/ttc`);
  });
});

describe('getStaticFileUrl', () => {
  it('returns dev URL on localhost', () => {
    Object.defineProperty(window, 'location', { value: { hostname: 'localhost' }, writable: true });
    expect(getStaticFileUrl('/img/test.png')).toBe('http://localhost:5193/img/test.png');
  });

  it('returns production URL on prod hostname', () => {
    Object.defineProperty(window, 'location', { value: { hostname: 'ttc-aalst.be' }, writable: true });
    expect(getStaticFileUrl('/img/test.png')).toBe(`${config.images}/img/test.png`);
  });
});
