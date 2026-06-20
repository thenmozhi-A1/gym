import axios from 'axios';
import useAuthStore from '../store/authStore';
import { getApiBase } from '../config';

let API_BASE = getApiBase();

if (!API_BASE.endsWith('/api') && !API_BASE.endsWith('/')) {
  API_BASE = API_BASE + '/api';
}

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
});

// Response interceptor to handle 401 and refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Prevent infinite loops if refresh itself fails
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh')) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh (cookies are sent automatically)
        await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
        
        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token is expired or revoked
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
