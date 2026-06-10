/**
 * src/tests/setup.js
 * Global test setup — runs before every test file.
 */
import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Unmount React trees after each test to avoid state leaks
afterEach(() => {
  cleanup();
});

// ── Browser API stubs ──────────────────────────────────────────────────────

// jsdom doesn't implement window.location.href assignment — stub it
Object.defineProperty(window, 'location', {
  value: { href: '', assign: vi.fn(), replace: vi.fn(), reload: vi.fn() },
  writable: true,
});

// jsdom doesn't implement matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Silence styled-components SSR warning in tests
vi.mock('styled-components', async (importOriginal) => {
  const actual = await importOriginal();
  return actual;
});
