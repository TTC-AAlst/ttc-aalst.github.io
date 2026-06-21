import http from '../httpClient';

describe('httpClient.post', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('resolves on a 200 with an empty body instead of rejecting', async () => {
    // ASP.NET POST actions returning Task send 200 with no body; response.json() would throw.
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve(''),
          json: () => Promise.reject(new SyntaxError('Unexpected end of JSON input')),
        } as unknown as Response),
      ),
    );

    await expect(http.post('/config', { key: 'year', value: '2026' })).resolves.toBeUndefined();
  });

  it('parses a JSON body when one is returned', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          text: () => Promise.resolve('{"id":42}'),
          json: () => Promise.resolve({ id: 42 }),
        } as unknown as Response),
      ),
    );

    await expect(http.post('/something')).resolves.toEqual({ id: 42 });
  });
});
