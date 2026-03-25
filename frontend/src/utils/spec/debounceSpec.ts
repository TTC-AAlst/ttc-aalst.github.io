import { debounce } from '../debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls the callback after the specified duration', () => {
    const cb = vi.fn();
    const debounced = debounce(cb, 100);

    debounced();
    expect(cb).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(cb).toHaveBeenCalledOnce();
  });

  it('resets the timer on subsequent calls', () => {
    const cb = vi.fn();
    const debounced = debounce(cb, 100);

    debounced();
    vi.advanceTimersByTime(80);
    debounced();
    vi.advanceTimersByTime(80);

    expect(cb).not.toHaveBeenCalled();

    vi.advanceTimersByTime(20);
    expect(cb).toHaveBeenCalledOnce();
  });

  it('passes arguments to the callback', () => {
    const cb = vi.fn();
    const debounced = debounce(cb, 50);

    debounced('hello', 42);
    vi.advanceTimersByTime(50);

    expect(cb).toHaveBeenCalledWith('hello', 42);
  });

  it('only calls callback once for rapid successive calls', () => {
    const cb = vi.fn();
    const debounced = debounce(cb, 100);

    for (let i = 0; i < 10; i++) {
      debounced(i);
    }

    vi.advanceTimersByTime(100);
    expect(cb).toHaveBeenCalledOnce();
    expect(cb).toHaveBeenCalledWith(9);
  });
});
