import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import axiosInstance from '../api/axiosInstance';
import log from '../utils/logger';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreAuth = async () => {
      if (isAuthenticated) {
        try {
          // Verify session is still valid with the HttpOnly cookies
          const res = await axiosInstance.get('/auth/me');
          if (res.data && res.data.user) {
            useAuthStore.getState().setUser(res.data.user);
          } else {
            throw new Error("Invalid response");
          }
        } catch (e) {
          log.error("Session verification failed", e);
          logout();
        }
      }
      setLoading(false);
    };

    restoreAuth();
  }, [isAuthenticated, logout]);

  const hasRole = (roleArray) => {
    if (!user || !user.role) return false;
    return roleArray.includes(user.role.toUpperCase());
  };

  return { user, isAuthenticated, loading, login, logout, hasRole };
};

export default useAuth;
