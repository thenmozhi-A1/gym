import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../api/axiosInstance';
import log from '../utils/logger';

export const useAuth = () => {
  const { user, accessToken, isAuthenticated, login, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreAuth = async () => {
      if (accessToken) {
        try {
          const decoded = jwtDecode(accessToken);
          if (decoded && decoded.sub && !decoded.id) {
            decoded.id = decoded.sub;
          }
          // Check if expired
          if (decoded.exp * 1000 < Date.now()) {
            // Force a refresh via an innocuous backend call, axios interceptor handles the rest
            await axiosInstance.get('/auth/me');
          } else {
            useAuthStore.getState().setUser(decoded);
          }
        } catch (e) {
          log.error("Token restore failed", e);
          logout();
        }
      }
      setLoading(false);
    };

    restoreAuth();
  }, [accessToken, logout]);

  const hasRole = (roleArray) => {
    if (!user || !user.role) return false;
    return roleArray.includes(user.role.toUpperCase());
  };

  return { user, isAuthenticated, loading, login, logout, hasRole };
};

export default useAuth;
