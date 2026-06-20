import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import axiosInstance from '../api/axiosInstance';
import log from '../utils/logger';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const restoreAuth = async () => {
      // If we already have the user in memory, no need to block and fetch again.
      if (isAuthenticated) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        // Try to restore session from HttpOnly cookie
        const res = await axiosInstance.get('/auth/me');
        if (res.data && res.data.user) {
          useAuthStore.getState().setUser(res.data.user);
        }
      } catch (e) {
        // Explicit token refresh fallback if access token is expired
        if (e.response?.status === 401) {
          try {
            await axiosInstance.post('/auth/refresh');
            const retryRes = await axiosInstance.get('/auth/me');
            if (retryRes.data && retryRes.data.user) {
              useAuthStore.getState().setUser(retryRes.data.user);
              if (isMounted) setLoading(false);
              return;
            }
          } catch (refreshErr) {
            log.error("Explicit session refresh failed", refreshErr);
          }
        } else {
          log.error("Session verification failed", e);
        }
      }
      
      if (isMounted) setLoading(false);
    };

    restoreAuth();
    
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const hasRole = (roleArray) => {
    if (!user || !user.role) return false;
    return roleArray.includes(user.role.toUpperCase());
  };

  return { user, isAuthenticated, loading, login, logout, hasRole };
};

export default useAuth;
