import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../hooks/useAuth';
import useAuthStore from '../store/authStore';
import axiosInstance from '../api/axiosInstance';
import log from '../utils/logger';

vi.mock('../api/axiosInstance', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} }))
  }
}));

vi.mock('../utils/logger', () => ({
  default: {
    error: vi.fn()
  }
}));

delete window.location;
window.location = { href: '' };

describe('useAuth hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      isAuthenticated: true, // mock an authenticated state
    });
  });

  it('restores auth successfully on mount', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: { user: { id: 1, email: 'test@gym.com', role: 'ADMIN' } } });

    const { result } = renderHook(() => useAuth());
    
    // Initial loading is true
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(axiosInstance.get).toHaveBeenCalledWith('/auth/me');
    expect(useAuthStore.getState().user).toMatchObject({ id: 1, email: 'test@gym.com' });
  });

  it('attempts explicit refresh if /auth/me returns 401', async () => {
    // 1st /auth/me fails with 401
    axiosInstance.get.mockRejectedValueOnce({ response: { status: 401 } });
    // /auth/refresh succeeds
    axiosInstance.post.mockResolvedValueOnce({});
    // 2nd /auth/me succeeds
    axiosInstance.get.mockResolvedValueOnce({ data: { user: { id: 2, email: 'refresh@gym.com' } } });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(axiosInstance.get).toHaveBeenCalledTimes(2);
    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/refresh');
    expect(useAuthStore.getState().user.email).toBe('refresh@gym.com');
  });

  it('logs out if explicit refresh fails', async () => {
    // 1st /auth/me fails with 401
    axiosInstance.get.mockRejectedValueOnce({ response: { status: 401 } });
    // /auth/refresh fails
    axiosInstance.post.mockRejectedValueOnce(new Error('Refresh failed'));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(axiosInstance.post).toHaveBeenCalledWith('/auth/refresh');
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(log.error).toHaveBeenCalled();
  });

  it('logs out if /auth/me returns non-401 error', async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // It should NOT call refresh
    expect(axiosInstance.post).not.toHaveBeenCalledWith('/auth/refresh');
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('hasRole works correctly', async () => {
    useAuthStore.setState({ user: { role: 'TRAINER' }, isAuthenticated: true });
    
    // prevent the effect from doing anything by skipping it
    axiosInstance.get.mockResolvedValueOnce({ data: { user: { role: 'TRAINER' } } });
    
    const { result } = renderHook(() => useAuth());

    expect(result.current.hasRole(['TRAINER', 'ADMIN'])).toBe(true);
    expect(result.current.hasRole(['USER'])).toBe(false);
  });
});
