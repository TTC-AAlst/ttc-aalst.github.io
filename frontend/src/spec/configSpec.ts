import { isProd } from '../config';

const setHost = (host: string) => {
  window.location.href = `https://${host}/`;
};

describe('isProd', () => {
  it.each(['ttc-aalst.be', 'www.ttc-aalst.be'])('is true on the public apex (%s)', host => {
    setHost(host);
    expect(isProd()).toBe(true);
  });

  it.each(['dev-ttc-aalst.sangu.be', 'pr-12-ttc-aalst.sangu.be', 'localhost'])('is false off prod (%s)', host => {
    setHost(host);
    expect(isProd()).toBe(false);
  });
});
