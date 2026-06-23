import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProtectedRoute from '../Components/ProtectedRoute';
import useAuthStore from '../store/authStore';

vi.mock('../hooks/useAuth', () => {
  const useAuthMock = () => ({
    loading: false,
    isAuthenticated: useAuthStore.getState().isAuthenticated,
    user: useAuthStore.getState().user,
    hasRole: (roles) => {
      if (!roles || roles.length === 0) return true;
      const userRole = useAuthStore.getState().user?.role;
      return roles.includes(userRole);
    }
  });
  return {
    useAuth: useAuthMock,
    default: useAuthMock
  };
});

// Mock the Login component as a fallback route
const LoginMock = () => <div data-testid="login-page">Login Page</div>;
const ProtectedContent = () => <div data-testid="protected-content">Secret Content</div>;
const LoadingMock = () => <div data-testid="loading-spinner">Loading...</div>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (ui, { initialRoute = '/' } = {}) => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/login" element={<LoginMock />} />
          <Route path="/*" element={ui} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders children if user has required role', () => {
    useAuthStore.setState({ user: { role: 'ADMIN' }, isAuthenticated: true });

    renderWithRouter(
      <ProtectedRoute roles={['ADMIN']}>
        <ProtectedContent />
      </ProtectedRoute>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('redirects to login if user is not authenticated', () => {
    useAuthStore.setState({ user: null, isAuthenticated: false });

    renderWithRouter(
      <ProtectedRoute roles={['ADMIN']}>
        <ProtectedContent />
      </ProtectedRoute>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('redirects to login if user lacks required role', () => {
    useAuthStore.setState({ user: { role: 'USER' }, isAuthenticated: true });

    renderWithRouter(
      <ProtectedRoute roles={['ADMIN']}>
        <ProtectedContent />
      </ProtectedRoute>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('allows access if roles array is empty or not provided and user is authenticated', () => {
    useAuthStore.setState({ user: { role: 'TRAINER' }, isAuthenticated: true });

    renderWithRouter(
      <ProtectedRoute>
        <ProtectedContent />
      </ProtectedRoute>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
});
