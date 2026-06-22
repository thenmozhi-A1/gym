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

// Request interceptor to attach Bearer token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Response interceptor to handle 401 and refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Prevent infinite loops if refresh itself fails
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh')) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Attempt to refresh using localStorage token
        const refreshResponse = await axios.post(`${API_BASE}/auth/refresh`, { 
          refreshToken: localStorage.getItem('refreshToken') 
        }, { withCredentials: true });
        
        // Save new tokens if they exist in the response
        if (refreshResponse.data.accessToken) localStorage.setItem('accessToken', refreshResponse.data.accessToken);
        if (refreshResponse.data.refreshToken) localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);

        isRefreshing = false;
        processQueue(null);
        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);
        // Refresh token is expired or revoked
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
