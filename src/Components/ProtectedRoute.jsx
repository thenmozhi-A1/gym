import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#fff' }}>
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

const Forbidden403 = () => (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#fff', textAlign: 'center', padding: '20px' }}>
    <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '20px' }}>403</h1>
    <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Access Denied</h2>
    <p style={{ color: '#94a3b8', marginBottom: '30px', maxWidth: '400px' }}>
      You do not have the required permissions to view this page. If you believe this is an error, please contact the administrator.
    </p>
    <a href="/dashboard" style={{ background: '#3b82f6', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
      Return to Dashboard
    </a>
  </div>
);

  if (allowedRoles && !hasRole(allowedRoles)) {
    // Role not authorized, show 403 page
    return <Forbidden403 />;
  }

  return children;
};

export default ProtectedRoute;
