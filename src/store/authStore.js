import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

const initialUserString = localStorage.getItem('user');
let initialUser = null;

if (initialUserString) {
  try {
    initialUser = JSON.parse(initialUserString);
  } catch (e) {
    // invalid JSON
  }
}

const useAuthStore = create((set) => ({
  user: initialUser,
  isAuthenticated: !!initialUser,

  setUser: (user) => {
    if (user && user.role) {
      user.role = user.role.toUpperCase();
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    set({ user, isAuthenticated: !!user });
  },

  login: (user) => {
    if (user && user.role) {
      user.role = user.role.toUpperCase();
    }
    if (user && user.email) {
      localStorage.setItem('userEmail', user.email);
    }
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('webauthnCredentials');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Call backend logout to clear HttpOnly cookies (in case they are still used)
    axiosInstance.post('/auth/logout').catch(() => {}).finally(() => {
      set({ user: null, isAuthenticated: false });
      window.location.href = '/login';
    });
  }
}));

export default useAuthStore;
