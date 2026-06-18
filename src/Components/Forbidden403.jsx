import React from 'react';

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

export default Forbidden403;
