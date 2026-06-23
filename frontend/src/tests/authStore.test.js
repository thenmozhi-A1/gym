/**
 * authStore.test.js
 *
 * Unit tests for the Zustand auth store.
 * Tests login, logout, and setUser actions.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import axiosInstance from '../api/axiosInstance';

// Mock axiosInstance
vi.mock('../api/axiosInstance', () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ data: {} }))
  }
}));

// Mock localStorage
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

// Mock window.location
delete window.location;
window.location = { href: '' };

import useAuthStore from '../store/authStore';

describe('authStore', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
    });
  });

  describe('login()', () => {
    it('sets isAuthenticated to true', () => {
      useAuthStore.getState().login({ role: 'ADMIN', id: 1 });
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it('stores the user object in state', () => {
      const user = { id: 1, email: 'admin@gym.com', role: 'ADMIN' };
      useAuthStore.getState().login(user);
      expect(useAuthStore.getState().user).toMatchObject({ id: 1, email: 'admin@gym.com' });
    });

    it('normalises role to uppercase', () => {
      useAuthStore.getState().login({ role: 'trainer' });
      expect(useAuthStore.getState().user.role).toBe('TRAINER');
    });

    it('writes user and email to localStorage', () => {
      const user = { email: 'admin@gym.com', role: 'ADMIN' };
      useAuthStore.getState().login(user);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('userEmail', 'admin@gym.com');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(useAuthStore.getState().user));
    });
  });

  describe('logout()', () => {
    it('calls backend logout endpoint and clears user from state', async () => {
      useAuthStore.setState({ user: { id: 1 }, isAuthenticated: true });
      useAuthStore.getState().logout();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userEmail');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('webauthnCredentials');
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/logout');
      
      // Wait for the async finally block to execute
      await new Promise(process.nextTick);
      
      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
      expect(window.location.href).toBe('/login');
    });
  });

  describe('setUser()', () => {
    it('sets the user in state and local storage', () => {
      const user = { id: 5, email: 'member@gym.com', role: 'USER' };
      useAuthStore.getState().setUser(user);
      expect(useAuthStore.getState().user).toMatchObject({ id: 5 });
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(useAuthStore.getState().user));
    });

    it('removes user from local storage when set to null', () => {
      useAuthStore.getState().setUser(null);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it('normalises role to uppercase', () => {
      useAuthStore.getState().setUser({ role: 'staff' });
      expect(useAuthStore.getState().user.role).toBe('STAFF');
    });

    it('handles null user without throwing', () => {
      expect(() => useAuthStore.getState().setUser(null)).not.toThrow();
    });
  });
});
