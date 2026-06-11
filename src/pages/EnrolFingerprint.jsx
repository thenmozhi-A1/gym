import React, { useState, useEffect } from 'react';
import { enrollFingerprint, getCredentials, deleteCredential } from '../api/webauthnApi';
import useAuthStore from '../store/authStore';
import log from "../utils/logger";
import { useNavigate } from 'react-router-dom';

const EnrolFingerprint = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadCredentials();
  }, [user, navigate]);

  const loadCredentials = async () => {
    try {
      const creds = await getCredentials(user.id);
      setCredentials(creds || []);
    } catch (err) {
      log.error('Failed to load credentials', err);
    }
  };

  const handleEnrol = async () => {
    setError('');
    setStatus('Follow the prompt on your device to scan your fingerprint...');
    setLoading(true);

    try {
      const result = await enrollFingerprint(user.id, user.name);
      if (result.success) {
        setStatus(`Successfully enrolled device! Credential ID: ${result.credentialId.substring(0, 10)}...`);
        loadCredentials(); // Refresh list
      }
    } catch (err) {
      setStatus('');
      setError(err.message || 'Failed to enrol device.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this device? You will not be able to use it for check-in anymore.")) return;
    try {
      await deleteCredential(id);
      loadCredentials();
    } catch (err) {
      setError('Failed to remove device.');
    }
  };

  return (
    <div style={{ padding: '40px', background: '#0f172a', minHeight: '100vh', color: 'white' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#1e293b', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        <h2 style={{ marginBottom: '10px' }}>Fingerprint Enrolment</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
          Important note: Fingerprint enrolment is per-device. If you use a different phone or tablet, you must enrol it separately. 
          To use the gym kiosk, you must enrol your fingerprint on the kiosk tablet itself.
        </p>

        {error && <div style={{ background: '#ef4444', color: 'white', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}
        {status && <div style={{ background: '#10b981', color: 'white', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>{status}</div>}

        <div style={{ marginBottom: '30px' }}>
          <button 
            onClick={handleEnrol} 
            disabled={loading}
            style={{ padding: '12px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          >
            {loading ? 'Enrolling...' : 'Enrol this device'}
          </button>
        </div>

        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '15px', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>Registered Devices ({credentials.length})</h3>
          
          {credentials.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>You have no devices enrolled for fingerprint access.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {credentials.map(cred => (
                <div key={cred.id} style={{ background: '#334155', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{cred.deviceType || 'Device'}</div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1' }}>Enrolled: {new Date(cred.createdAt).toLocaleDateString()}</div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1' }}>Last Used: {cred.lastUsedAt ? new Date(cred.lastUsedAt).toLocaleDateString() : 'Never'}</div>
                  </div>
                  <button 
                    onClick={() => handleRemove(cred.credentialId)}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrolFingerprint;
