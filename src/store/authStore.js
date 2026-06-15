import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

const initialToken = localStorage.getItem('accessToken') || null;
let initialUser = null;

if (initialToken) {
  try {
    const decoded = jwtDecode(initialToken);
    if (decoded && decoded.role) {
      decoded.role = decoded.role.toUpperCase();
    }
    if (decoded && decoded.sub && !decoded.id) {
      decoded.id = decoded.sub;
    }
    initialUser = decoded;
  } catch (e) {
    // invalid token
  }
}

const useAuthStore = create((set) => ({
  user: initialUser,
  accessToken: initialToken,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!initialToken,

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    try {
      const decodedUser = jwtDecode(accessToken);
      if (decodedUser && decodedUser.role) {
        decodedUser.role = decodedUser.role.toUpperCase();
      }
      if (decodedUser && decodedUser.sub && !decodedUser.id) {
        decodedUser.id = decodedUser.sub;
      }
      set({ accessToken, refreshToken, user: decodedUser, isAuthenticated: true });
    } catch (e) {
      set({ accessToken, refreshToken, isAuthenticated: true });
    }
  },

  setUser: (user) => {
    if (user && user.role) {
      user.role = user.role.toUpperCase();
    }
    set({ user });
  },

  login: (accessToken, refreshToken, user) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    if (user && user.email) {
      localStorage.setItem('userEmail', user.email);
    }
    if (user && user.role) {
      user.role = user.role.toUpperCase();
    }
    set({ accessToken, refreshToken, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('webauthnCredentials');
    
    // Optional: Call logout endpoint here to revoke refresh token on backend
    set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
    
    // Force redirect to login
    window.location.href = '/login';
  }
}));

export default useAuthStore;
