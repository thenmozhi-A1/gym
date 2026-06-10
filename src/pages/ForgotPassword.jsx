import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Mail, KeyRound, Lock, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import PasswordStrength from '../components/PasswordStrength';

// ── Animations ────────────────────────────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// ── Layout ────────────────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  padding: 20px;
  font-family: 'Inter', 'Segoe UI', sans-serif;

  /* Subtle radial glow matching login page */
  background-image: radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.08) 0%, transparent 60%),
                    radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.06) 0%, transparent 60%);
`;

const Card = styled.div`
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04);
  animation: ${fadeIn} 0.4s ease;

  @media (max-width: 480px) {
    padding: 28px 20px;
    border-radius: 16px;
  }
`;

// ── Step progress ─────────────────────────────────────────────────────────────
const StepRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 32px;
`;

const StepDot = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
  transition: all 0.3s ease;
  background: ${p => p.$active ? '#3b82f6' : p.$done ? '#10b981' : '#334155'};
  color: ${p => p.$active || p.$done ? '#fff' : '#64748b'};
  border: 2px solid ${p => p.$active ? '#60a5fa' : p.$done ? '#34d399' : '#334155'};
  box-shadow: ${p => p.$active ? '0 0 12px rgba(59,130,246,0.4)' : 'none'};
`;

const StepLine = styled.div`
  flex: 1;
  height: 2px;
  background: ${p => p.$done ? '#10b981' : '#334155'};
  transition: background 0.4s ease;
`;

const StepLabel = styled.span`
  font-size: 11px;
  color: #64748b;
  margin-top: 4px;
  display: block;
  text-align: center;
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

// ── Typography ────────────────────────────────────────────────────────────────
const Title = styled.h2`
  color: #f1f5f9;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 6px 0;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0 28px 0;
  line-height: 1.5;
`;

// ── Alerts ────────────────────────────────────────────────────────────────────
const Alert = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 0.85rem;
  margin-bottom: 20px;
  line-height: 1.5;
  background: ${p => p.$type === 'error'
    ? 'rgba(239,68,68,0.12)'
    : 'rgba(16,185,129,0.12)'};
  border: 1px solid ${p => p.$type === 'error'
    ? 'rgba(239,68,68,0.3)'
    : 'rgba(16,185,129,0.3)'};
  color: ${p => p.$type === 'error' ? '#fca5a5' : '#6ee7b7'};
`;

// ── Form elements ─────────────────────────────────────────────────────────────
const FieldGroup = styled.div`
  margin-bottom: 18px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
`;

const InputWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 14px;
    color: #475569;
    pointer-events: none;
    flex-shrink: 0;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px 12px 42px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  color: #f1f5f9;
  font-size: ${p => p.$otp ? '1.4rem' : '0.95rem'};
  letter-spacing: ${p => p.$otp ? '6px' : 'normal'};
  text-align: ${p => p.$otp ? 'center' : 'left'};
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;

  &::placeholder { color: #475569; }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
  }

  @media (max-width: 480px) {
    font-size: ${p => p.$otp ? '1.2rem' : '0.9rem'};
    padding: 11px 12px 11px 40px;
  }
`;

// ── Buttons ───────────────────────────────────────────────────────────────────
const PrimaryBtn = styled.button`
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${p => p.disabled ? 0.6 : 1};
  transition: transform 0.15s, box-shadow 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 6px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(59,130,246,0.35);
  }

  &:active:not(:disabled) { transform: translateY(0); }
`;

const SuccessBtn = styled(PrimaryBtn)`
  background: linear-gradient(135deg, #10b981, #059669);

  &:hover:not(:disabled) {
    box-shadow: 0 8px 20px rgba(16,185,129,0.35);
  }
`;

const BackLink = styled.button`
  background: none;
  border: none;
  color: #60a5fa;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 20px;
  padding: 0;
  transition: color 0.2s;

  &:hover { color: #93c5fd; }
`;

const SpinIcon = styled(Loader2)`
  animation: ${spin} 0.8s linear infinite;
`;

// ── Component ─────────────────────────────────────────────────────────────────
const ForgotPassword = () => {
  const [step, setStep]                   = useState(1);
  const [email, setEmail]                 = useState('');
  const [otp, setOtp]                     = useState('');
  const [newPassword, setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage]             = useState('');
  const [error, setError]                 = useState('');
  const [loading, setLoading]             = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await axiosInstance.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post('/auth/reset-password', { email, otp, newPassword });
      setMessage(res.data.message);
      setStep(3);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Card>
        {/* ── Step indicator ── */}
        <StepRow>
          <StepItem>
            <StepDot $active={step === 1} $done={step > 1}>{step > 1 ? '✓' : '1'}</StepDot>
            <StepLabel>Email</StepLabel>
          </StepItem>
          <StepLine $done={step > 1} />
          <StepItem>
            <StepDot $active={step === 2} $done={step > 2}>{step > 2 ? '✓' : '2'}</StepDot>
            <StepLabel>OTP</StepLabel>
          </StepItem>
          <StepLine $done={step > 2} />
          <StepItem>
            <StepDot $active={step === 3} $done={step === 3}>3</StepDot>
            <StepLabel>Done</StepLabel>
          </StepItem>
        </StepRow>

        {/* ── Heading ── */}
        <Title>
          {step === 1 && 'Forgot Password?'}
          {step === 2 && 'Verify & Reset'}
          {step === 3 && 'Password Reset!'}
        </Title>
        <Subtitle>
          {step === 1 && "Enter your registered email and we'll send you a secure 6-digit code."}
          {step === 2 && 'Enter the code from your email and choose a new strong password.'}
          {step === 3 && 'Your password has been updated. Redirecting you to login…'}
        </Subtitle>

        {/* ── Alerts ── */}
        {error   && <Alert $type="error">{error}</Alert>}
        {message && <Alert $type="success">{message}</Alert>}

        {/* ── Step 1: Email ── */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <FieldGroup>
              <Label htmlFor="fp-email">Email Address</Label>
              <InputWrap>
                <Mail size={16} />
                <Input
                  id="fp-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </InputWrap>
            </FieldGroup>

            <PrimaryBtn type="submit" disabled={loading}>
              {loading ? <><SpinIcon size={16} /> Sending…</> : 'Send Reset Code'}
            </PrimaryBtn>

            <BackLink onClick={() => navigate('/login')}>
              <ArrowLeft size={14} /> Back to Login
            </BackLink>
          </form>
        )}

        {/* ── Step 2: OTP + New Password ── */}
        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <FieldGroup>
              <Label htmlFor="fp-otp">6-Digit Code</Label>
              <InputWrap>
                <KeyRound size={16} />
                <Input
                  id="fp-otp"
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="• • • • • •"
                  required
                  maxLength="6"
                  inputMode="numeric"
                  $otp
                />
              </InputWrap>
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="fp-new-pass">New Password</Label>
              <InputWrap>
                <Lock size={16} />
                <Input
                  id="fp-new-pass"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min 8 chars, 1 uppercase, 1 number…"
                  required
                  autoComplete="new-password"
                />
              </InputWrap>
              <PasswordStrength password={newPassword} />
            </FieldGroup>

            <FieldGroup style={{ marginBottom: 24 }}>
              <Label htmlFor="fp-confirm-pass">Confirm Password</Label>
              <InputWrap>
                <Lock size={16} />
                <Input
                  id="fp-confirm-pass"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your new password"
                  required
                  autoComplete="new-password"
                />
              </InputWrap>
            </FieldGroup>

            <SuccessBtn type="submit" disabled={loading}>
              {loading ? <><SpinIcon size={16} /> Resetting…</> : 'Reset Password'}
            </SuccessBtn>

            <BackLink onClick={() => setStep(1)}>
              <ArrowLeft size={14} /> Back
            </BackLink>
          </form>
        )}

        {/* ── Step 3: Success ── */}
        {step === 3 && (
          <div style={{ textAlign: 'center', paddingTop: 8 }}>
            <CheckCircle2 size={56} color="#10b981" style={{ marginBottom: 16 }} />
            <PrimaryBtn onClick={() => navigate('/login')}>
              Go to Login
            </PrimaryBtn>
          </div>
        )}
      </Card>
    </Page>
  );
};

export default ForgotPassword;
