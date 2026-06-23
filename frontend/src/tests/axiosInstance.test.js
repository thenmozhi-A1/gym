import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import useAuthStore from '../store/authStore';

// Mock axios.post for the refresh endpoint
vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    default: {
      ...actual.default,
      post: vi.fn(),
      create: actual.default.create
    }
  };
});

describe('axiosInstance interceptor', () => {
  let mockAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: { id: 1 }, isAuthenticated: true });
    // mock logout
    useAuthStore.getState().logout = vi.fn();
  });

  it('retries request if 401 and refresh succeeds', async () => {
    const errorResponse = {
      response: { status: 401 },
      config: { url: '/some-endpoint', _retry: false }
    };

    // mock successful refresh
    axios.post.mockResolvedValueOnce({ data: {} });
    
    // mock successful retry of the original request
    const retryResponse = { data: 'success' };
    const instanceMock = vi.spyOn(axiosInstance, 'request').mockResolvedValueOnce(retryResponse);

    // trigger interceptor manually
    const interceptorErrorCallback = axiosInstance.interceptors.response.handlers[0].rejected;
    
    const result = await interceptorErrorCallback(errorResponse);

    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/auth/refresh'), {}, expect.any(Object));
    expect(result).toBe(retryResponse);

    instanceMock.mockRestore();
  });

  it('calls logout if 401 and refresh fails', async () => {
    const errorResponse = {
      response: { status: 401 },
      config: { url: '/some-endpoint', _retry: false }
    };

    // mock failed refresh
    axios.post.mockRejectedValueOnce(new Error('Refresh failed'));

    const interceptorErrorCallback = axiosInstance.interceptors.response.handlers[0].rejected;
    
    await expect(interceptorErrorCallback(errorResponse)).rejects.toThrow('Refresh failed');
    
    expect(useAuthStore.getState().logout).toHaveBeenCalled();
  });

  it('rejects immediately if not 401', async () => {
    const errorResponse = {
      response: { status: 500 },
      config: { url: '/some-endpoint' }
    };

    const interceptorErrorCallback = axiosInstance.interceptors.response.handlers[0].rejected;
    
    await expect(interceptorErrorCallback(errorResponse)).rejects.toEqual(errorResponse);
    expect(axios.post).not.toHaveBeenCalled();
  });

  it('rejects immediately if request is already retried', async () => {
    const errorResponse = {
      response: { status: 401 },
      config: { url: '/some-endpoint', _retry: true }
    };

    const interceptorErrorCallback = axiosInstance.interceptors.response.handlers[0].rejected;
    
    await expect(interceptorErrorCallback(errorResponse)).rejects.toEqual(errorResponse);
    expect(axios.post).not.toHaveBeenCalled();
  });
});
