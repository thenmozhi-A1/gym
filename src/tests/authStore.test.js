/**
 * authStore.test.js
 *
 * Unit tests for the Zustand auth store.
 * Tests login, logout, setUser, and setTokens actions.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// ── Mock jwt-decode ───────────────────────────────────────────────────────────
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn((token) => {
    // Return a synthetic decoded payload based on token string
    if (token === 'admin-token')   return { id: 1, email: 'admin@gym.com', role: 'admin' };
    if (token === 'trainer-token') return { id: 2, email: 'trainer@gym.com', role: 'trainer' };
    throw new Error('Invalid token');
  }),
}));

// ── Mock localStorage ─────────────────────────────────────────────────────────
const localStorageMock = (() => {
  let store = {};
  return {
    getItem:    vi.fn((k) => store[k] ?? null),
    setItem:    vi.fn((k, v) => { store[k] = String(v); }),
    removeItem: vi.fn((k) => { delete store[k]; }),
    clear:      vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Import store AFTER mocks are in place
import useAuthStore from '../store/authStore';

describe('authStore', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    // Reset store state between tests
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  });

  // ── login() ─────────────────────────────────────────────────────────────────
  describe('login()', () => {
    it('sets isAuthenticated to true', () => {
      useAuthStore.getState().login('admin-token', 'refresh-123', { role: 'ADMIN', id: 1 });
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('stores the user object in state', () => {
      const user = { id: 1, email: 'admin@gym.com', role: 'ADMIN' };
      useAuthStore.getState().login('admin-token', 'refresh-123', user);
      expect(useAuthStore.getState().user).toMatchObject({ id: 1, email: 'admin@gym.com' });
    });

    it('normalises role to uppercase', () => {
      useAuthStore.getState().login('t', 'r', { role: 'trainer' });
      expect(useAuthStore.getState().user.role).toBe('TRAINER');
    });

    it('writes accessToken to localStorage', () => {
      useAuthStore.getState().login('my-access-token', 'my-refresh-token', { role: 'ADMIN' });
      expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', 'my-access-token');
    });

    it('writes refreshToken to localStorage', () => {
      useAuthStore.getState().login('my-access-token', 'my-refresh-token', { role: 'ADMIN' });
      expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', 'my-refresh-token');
    });
  });

  // ── logout() ────────────────────────────────────────────────────────────────
  describe('logout()', () => {
    it('clears user from state', () => {
      useAuthStore.setState({ user: { id: 1 }, isAuthenticated: true });
      useAuthStore.getState().logout();
      expect(useAuthStore.getState().user).toBeNull();
    });

    it('sets isAuthenticated to false', () => {
      useAuthStore.setState({ isAuthenticated: true });
      useAuthStore.getState().logout();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('removes accessToken from localStorage', () => {
      useAuthStore.getState().logout();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
    });

    it('removes refreshToken from localStorage', () => {
      useAuthStore.getState().logout();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
    });

    it('clears accessToken from state', () => {
      useAuthStore.setState({ accessToken: 'old-token' });
      useAuthStore.getState().logout();
      expect(useAuthStore.getState().accessToken).toBeNull();
    });
  });

  // ── setUser() ───────────────────────────────────────────────────────────────
  describe('setUser()', () => {
    it('sets the user in state', () => {
      const user = { id: 5, email: 'member@gym.com', role: 'USER' };
      useAuthStore.getState().setUser(user);
      expect(useAuthStore.getState().user).toMatchObject({ id: 5 });
    });

    it('normalises role to uppercase', () => {
      useAuthStore.getState().setUser({ role: 'staff' });
      expect(useAuthStore.getState().user.role).toBe('STAFF');
    });

    it('handles null user without throwing', () => {
      expect(() => useAuthStore.getState().setUser(null)).not.toThrow();
    });
  });

  // ── setTokens() ─────────────────────────────────────────────────────────────
  describe('setTokens()', () => {
    it('decodes a valid token and sets user', () => {
      useAuthStore.getState().setTokens('admin-token', 'r');
      expect(useAuthStore.getState().user).toMatchObject({ email: 'admin@gym.com' });
    });

    it('normalises role from decoded token to uppercase', () => {
      useAuthStore.getState().setTokens('admin-token', 'r');
      expect(useAuthStore.getState().user.role).toBe('ADMIN');
    });

    it('still sets isAuthenticated=true even with invalid token', () => {
      useAuthStore.getState().setTokens('bad-token', 'r');
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
  });
});
