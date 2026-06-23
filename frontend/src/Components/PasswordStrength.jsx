import React, { useState, useEffect } from 'react';

const PasswordStrength = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('#dc3545'); // Default weak red

  useEffect(() => {
    let score = 0;
    if (!password) {
      setStrength(0);
      setLabel('');
      return;
    }

    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;

    setStrength(score);

    if (score === 25) {
      setLabel('Weak');
      setColor('#dc3545'); // Red
    } else if (score === 50) {
      setLabel('Fair');
      setColor('#fd7e14'); // Orange
    } else if (score === 75) {
      setLabel('Strong');
      setColor('#ffc107'); // Yellow
    } else if (score === 100) {
      setLabel('Very Strong');
      setColor('#198754'); // Green
    }
  }, [password]);

  if (!password) return null;

  return (
    <div style={{ marginTop: '5px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
        <span>Password Strength</span>
        <span style={{ color, fontWeight: 'bold' }}>{label}</span>
      </div>
      <div style={{ height: '5px', background: '#e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${strength}%`, background: color, transition: 'width 0.3s ease' }} />
      </div>
      <ul style={{ fontSize: '11px', color: '#6c757d', marginTop: '6px', paddingLeft: '20px' }}>
        <li style={{ color: password.length >= 8 ? '#198754' : 'inherit' }}>At least 8 characters</li>
        <li style={{ color: /[A-Z]/.test(password) ? '#198754' : 'inherit' }}>One uppercase letter</li>
        <li style={{ color: /[0-9]/.test(password) ? '#198754' : 'inherit' }}>One number</li>
        <li style={{ color: /[^A-Za-z0-9]/.test(password) ? '#198754' : 'inherit' }}>One special character</li>
      </ul>
    </div>
  );
};

export default PasswordStrength;
