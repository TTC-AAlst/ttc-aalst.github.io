import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import './dayjsSetup';

// Mock localStorage for tests
const localStorageMock = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  length: 0,
  key: () => null,
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock fetch to prevent actual HTTP requests during tests
globalThis.fetch = vi.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  } as Response),
);

// Wrap setTimeout to prevent NaN warnings from react-bootstrap animations
const originalSetTimeout = globalThis.setTimeout;
globalThis.setTimeout = ((fn: TimerHandler, delay?: number, ...args: unknown[]) => {
  const safeDelay = Number.isNaN(delay) ? 0 : delay;
  return originalSetTimeout(fn, safeDelay, ...args);
}) as typeof setTimeout;
