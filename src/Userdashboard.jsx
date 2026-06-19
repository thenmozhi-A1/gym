import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import styled, { keyframes, css } from "styled-components";
import {
  User, CreditCard, Clock, Dumbbell, Star, LogOut,
  Download, ChevronRight, CheckCircle, AlertCircle,
  Calendar, Zap, TrendingUp, FileText, MessageSquare, ChevronLeft
} from "lucide-react";
import axiosInstance from "./api/axiosInstance";
import useAuthStore from "./store/authStore";
import { generateInvoicePDF } from "./utils/pdfTemplates";
import log from "./utils/logger";

// ── Animations ────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
`;

// ── Layout ────────────────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  background: #0f172a;
  background-image:
    radial-gradient(ellipse at 10% 30%, rgba(251,191,36,0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 90% 70%, rgba(59,130,246,0.06) 0%, transparent 50%);
  color: #f1f5f9;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  padding-bottom: 40px;
`;

// ── Top nav bar ───────────────────────────────────────────────────────────────
const NavBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(15,23,42,0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #1e293b;
  position: sticky;
  top: 0;
  z-index: 50;
`;

const NavBrand = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: #facc15;
  letter-spacing: 0.5px;
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconBtn = styled.button`
  background: rgba(255,255,255,0.06);
  border: 1px solid #334155;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255,255,255,0.1);
    color: #f1f5f9;
  }
`;

// ── Hero section ──────────────────────────────────────────────────────────────
const Hero = styled.div`
  padding: 28px 20px 0;
  max-width: 900px;
  margin: 0 auto;
  animation: ${fadeUp} 0.4s ease;
`;

const HeroGreeting = styled.p`
  font-size: 0.85rem;
  color: #64748b;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
`;

const HeroName = styled.h1`
  font-size: clamp(1.6rem, 5vw, 2.2rem);
  font-weight: 800;
  margin: 0 0 20px 0;
  color: #f8fafc;
  span { color: #facc15; }
`;

// ── Tab navigation ────────────────────────────────────────────────────────────
const TabBar = styled.nav`
  display: flex;
  gap: 4px;
  background: #1e293b;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar { display: none; }
`;

const Tab = styled.button`
  flex: 1;
  min-width: 80px;
  padding: 9px 12px;
  border: none;
  border-radius: 9px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
  background: ${p => p.$active ? '#facc15' : 'transparent'};
  color: ${p => p.$active ? '#000' : '#64748b'};

  svg { flex-shrink: 0; }

  &:hover:not([data-active="true"]) {
    background: rgba(255,255,255,0.05);
    color: #cbd5e1;
  }
`;

// ── Content area ──────────────────────────────────────────────────────────────
const Content = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
  animation: ${fadeUp} 0.3s ease;
`;

// ── Cards ─────────────────────────────────────────────────────────────────────
const Card = styled.div`
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
`;

const CardTitle = styled.h3`
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

// ── Plan badge ────────────────────────────────────────────────────────────────
const PlanBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #facc15, #f59e0b);
  color: #000;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.72rem;
  font-weight: 700;
  background: ${p => p.$ok
    ? 'rgba(16,185,129,0.12)'
    : 'rgba(239,68,68,0.12)'};
  color: ${p => p.$ok ? '#34d399' : '#f87171'};
  border: 1px solid ${p => p.$ok ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'};
`;

// ── Stats grid ────────────────────────────────────────────────────────────────
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
`;

const StatBox = styled.div`
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 14px 12px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${p => p.$color || '#f1f5f9'};
`;

const StatLabel = styled.div`
  font-size: 0.7rem;
  color: #64748b;
  margin-top: 3px;
  font-weight: 500;
`;

// ── Check-in list ─────────────────────────────────────────────────────────────
const CheckInItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #0f172a;

  &:last-child { border-bottom: none; }
`;

const CheckInDate = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #e2e8f0;
`;

const CheckInTime = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 2px;
`;

// ── Payment row ───────────────────────────────────────────────────────────────
const PaymentRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #0f172a;

  &:last-child { border-bottom: none; }
`;

const PayAmount = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #facc15;
`;

const DownloadBtn = styled.button`
  background: rgba(250,204,21,0.08);
  border: 1px solid rgba(250,204,21,0.2);
  border-radius: 8px;
  color: #facc15;
  padding: 6px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: rgba(250,204,21,0.15);
    transform: translateY(-1px);
  }
`;

// ── Workout plan ──────────────────────────────────────────────────────────────
const WorkoutDay = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid #0f172a;

  &:last-child { border-bottom: none; }
`;

const DayTag = styled.div`
  min-width: 36px;
  height: 36px;
  border-radius: 9px;
  background: ${p => p.$active ? 'rgba(250,204,21,0.15)' : '#0f172a'};
  border: 1px solid ${p => p.$active ? 'rgba(250,204,21,0.4)' : '#1e293b'};
  color: ${p => p.$active ? '#facc15' : '#475569'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 800;
  flex-shrink: 0;
`;

const WorkoutInfo = styled.div`
  flex: 1;
`;

const WorkoutTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: #e2e8f0;
`;

const WorkoutDetail = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 3px;
`;

// ── Feedback form ─────────────────────────────────────────────────────────────
const StarRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const StarBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: ${p => p.$on ? '#facc15' : '#334155'};
  padding: 0;
  transition: color 0.15s, transform 0.1s;
  text-shadow: ${p => p.$on ? '0 0 8px rgba(250,204,21,0.4)' : 'none'};
  &:hover { transform: scale(1.1); }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  color: #f1f5f9;
  padding: 12px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
  transition: border-color 0.2s;
  margin-bottom: 14px;

  &:focus {
    outline: none;
    border-color: #facc15;
    box-shadow: 0 0 0 3px rgba(250,204,21,0.1);
  }

  &::placeholder { color: #475569; }
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #facc15, #f59e0b);
  color: #000;
  font-weight: 800;
  font-size: 0.95rem;
  border: none;
  border-radius: 10px;
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${p => p.disabled ? 0.6 : 1};
  transition: transform 0.15s, box-shadow 0.15s;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(250,204,21,0.25);
  }
`;

const AlertBox = styled.div`
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-bottom: 14px;
  background: ${p => p.$ok ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)'};
  border: 1px solid ${p => p.$ok ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'};
  color: ${p => p.$ok ? '#34d399' : '#f87171'};
`;

// ── Skeleton loader ───────────────────────────────────────────────────────────
const SkeletonBlock = styled.div`
  height: ${p => p.$h || 16}px;
  border-radius: ${p => p.$r || 6}px;
  width: ${p => p.$w || '100%'};
  background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s infinite;
  margin-bottom: ${p => p.$mb || 10}px;
`;

// ── Default workout plan ───────────────────────────────────────────────────────
const DEFAULT_PLAN = [
  { day: 'MON', label: 'Push Day', detail: 'Chest · Shoulders · Triceps', active: true },
  { day: 'TUE', label: 'Pull Day', detail: 'Back · Biceps · Rear Delts', active: false },
  { day: 'WED', label: 'Leg Day', detail: 'Quads · Hamstrings · Calves', active: false },
  { day: 'THU', label: 'Active Recovery', detail: 'Yoga · Stretching · Foam Roll', active: false },
  { day: 'FRI', label: 'Upper Body', detail: 'Compound lifts + Isolation', active: false },
  { day: 'SAT', label: 'Cardio', detail: 'HIIT · Treadmill · Cycling', active: false },
  { day: 'SUN', label: 'Rest Day', detail: 'Full recovery', active: false },
];

// ── Component ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'home',      label: 'Home',     icon: Zap },
  { id: 'checkins',  label: 'Check-ins',icon: Clock },
  { id: 'payments',  label: 'Payments', icon: CreditCard },
  { id: 'workout',   label: 'Workout',  icon: Dumbbell },
  { id: 'feedback',  label: 'Feedback', icon: MessageSquare },
];

const Userdashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [activeTab, setActiveTab]   = useState('home');
  const [profile,   setProfile]     = useState(null);
  const [checkins,  setCheckins]    = useState([]);
  const [payments,  setPayments]    = useState([]);
  const [loading,   setLoading]     = useState(true);
  const [attendanceMonth, setAttendanceMonth] = useState(new Date());

  // Feedback state
  const [rating,       setRating]       = useState(5);
  const [hovered,      setHovered]      = useState(0);
  const [feedbackMsg,  setFeedbackMsg]  = useState('');
  const [submitting,   setSubmitting]   = useState(false);
  const [fbStatus,     setFbStatus]     = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const userId = user?.id;

  // ── Fetch member data ────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [profileRes, checkinsRes, paymentsRes] = await Promise.allSettled([
        axiosInstance.get(`/users/${userId}`),
        axiosInstance.get(`/attendance/user/${userId}`),
        axiosInstance.get(`/payments/user/${userId}`),
      ]);

      if (profileRes.status === 'fulfilled')  setProfile(profileRes.value.data);
      if (checkinsRes.status === 'fulfilled') setCheckins(checkinsRes.value.data || []);
      if (paymentsRes.status === 'fulfilled') setPayments(paymentsRes.value.data || []);
    } catch (e) {
      log.error('Failed to fetch member data', e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Derived values ────────────────────────────────────────────────────────────
  const displayName   = profile?.fullName || user?.name || user?.fullName || 'Champion';
  const firstName     = displayName.split(' ')[0];
  const plan          = profile?.membershipType || 'Standard';
  const memberStatus  = (profile?.status || 'ACTIVE').toUpperCase();
  const isActive      = memberStatus === 'ACTIVE';

  const recentCheckins  = [...checkins].reverse().slice(0, 5);
  const recentPayments  = [...payments].reverse().slice(0, 5);
  const totalCheckins   = checkins.length;
  const successPay      = payments.filter(p => p.paymentStatus === 'SUCCESS').length;

  const handlePrevAttMonth = () => setAttendanceMonth(new Date(attendanceMonth.getFullYear(), attendanceMonth.getMonth() - 1, 1));
  const handleNextAttMonth = () => setAttendanceMonth(new Date(attendanceMonth.getFullYear(), attendanceMonth.getMonth() + 1, 1));

  const filteredCheckins = checkins.filter(c => {
    let d = c.attendanceDate || c.date;
    if (Array.isArray(d)) {
      return d[0] === attendanceMonth.getFullYear() && (d[1] - 1) === attendanceMonth.getMonth();
    }
    if (typeof d === 'string') {
      const dateObj = new Date(d);
      return dateObj.getFullYear() === attendanceMonth.getFullYear() && dateObj.getMonth() === attendanceMonth.getMonth();
    }
    return false;
  }).sort((a,b) => {
     let da = Array.isArray(a.attendanceDate) ? new Date(a.attendanceDate[0], a.attendanceDate[1]-1, a.attendanceDate[2]) : new Date(a.attendanceDate || a.date);
     let db = Array.isArray(b.attendanceDate) ? new Date(b.attendanceDate[0], b.attendanceDate[1]-1, b.attendanceDate[2]) : new Date(b.attendanceDate || b.date);
     return db - da;
  });

  const sortedPayments = payments.length 
    ? [...payments].sort((a,b) => {
        let dateA = a.paymentDate;
        let dateB = b.paymentDate;
        if (Array.isArray(dateA)) dateA = new Date(dateA[0], dateA[1]-1, dateA[2], dateA[3]||0, dateA[4]||0);
        else dateA = new Date(dateA);
        if (Array.isArray(dateB)) dateB = new Date(dateB[0], dateB[1]-1, dateB[2], dateB[3]||0, dateB[4]||0);
        else dateB = new Date(dateB);
        return dateB - dateA;
      }) 
    : [];

  const lastPay = sortedPayments[0] || null;

  let nextPayDateStr = 'N/A';
  if (lastPay) {
    if (lastPay.planEndDate) {
      let d = lastPay.planEndDate;
      if (Array.isArray(d)) d = new Date(d[0], d[1]-1, d[2], d[3]||0, d[4]||0);
      else d = new Date(d);
      nextPayDateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } else {
      let d = lastPay.paymentDate;
      if (Array.isArray(d)) d = new Date(d[0], d[1]-1, d[2], d[3]||0, d[4]||0);
      else d = new Date(d);
      nextPayDateStr = new Date(d.getTime() + 30 * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  } else if (profile?.expiryDate) {
    let d = profile.expiryDate;
    if (Array.isArray(d)) d = new Date(d[0], d[1]-1, d[2], d[3]||0, d[4]||0);
    else d = new Date(d);
    nextPayDateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  const nextPayDate = nextPayDateStr;

  // ── Feedback submit ───────────────────────────────────────────────────────────
  const handleFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackMsg.trim()) return;
    setSubmitting(true);
    setFbStatus(null);
    try {
      await axiosInstance.post('/feedbacks', {
        userEmail: user?.email || 'anonymous',
        userName: displayName,
        message: feedbackMsg,
        rating,
      });
      setFbStatus({ ok: true, msg: 'Thank you! Your feedback has been sent to our team.' });
      setFeedbackMsg('');
      setRating(5);
    } catch (err) {
      setFbStatus({ ok: false, msg: err.response?.data?.error || 'Failed to send feedback.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      await axiosInstance.post(`/attendance/user/${userId}`, {});
      toast.success('Checked in successfully!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to check in');
    }
  };

  const activeCheckin = checkins.find(c => {
    if (c.checkOutTime || c.exit) return false;
    let d = c.attendanceDate || c.date;
    if (Array.isArray(d)) {
      d = `${d[0]}-${String(d[1]).padStart(2, '0')}-${String(d[2]).padStart(2, '0')}`;
    }
    return d === new Date().toISOString().split('T')[0];
  });

  const handleCheckOut = async () => {
    if (!activeCheckin) return;
    try {
      await axiosInstance.put(`/attendance/${activeCheckin.id}/checkout`, {});
      toast.success('Checked out successfully!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to check out');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    logout();
    navigate('/login');
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <Page>
      {/* ── Nav bar ── */}
      <NavBar>
        <NavBrand>B&Y FITNESS</NavBrand>
        <NavActions>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {activeCheckin && (
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'right', display: 'none' }} className="d-sm-block">
                <div>Checked in at</div>
                <div style={{ color: '#34d399', fontWeight: 'bold' }}>{activeCheckin.checkInTime || activeCheckin.entry || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            )}
            <button 
              onClick={activeCheckin ? handleCheckOut : handleCheckIn}
              style={{
                background: activeCheckin ? '#ef4444' : '#28a745', color: '#fff', border: 'none', 
                padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '0.85rem'
              }}
            >
              <Clock size={16} /> {activeCheckin ? 'Check Out' : 'Check In'}
            </button>
          </div>
            <div style={{ position: 'relative' }}>
              <IconBtn onClick={() => setIsProfileOpen(!isProfileOpen)} title="Profile"><User size={16} /></IconBtn>
              {isProfileOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setIsProfileOpen(false)} />
                  <div style={{
                    position: 'absolute', top: '50px', right: '0', background: '#1e293b', border: '1px solid #334155',
                    borderRadius: '12px', padding: '16px', width: '250px', zIndex: 100, boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    animation: 'fadeUp 0.2s ease'
                  }}>
                    <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                      <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#facc15', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', margin: '0 auto 10px' }}>
                        {firstName.charAt(0)}
                      </div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '1rem', color: '#f8fafc' }}>{displayName}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{profile?.email || user?.email || 'N/A'}</p>
                    </div>
                    <div style={{ borderTop: '1px solid #334155', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: '#64748b' }}>Plan:</span>
                        <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{plan}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: '#64748b' }}>Status:</span>
                        <span style={{ color: isActive ? '#34d399' : '#f87171', fontWeight: 'bold' }}>{memberStatus}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: '#64748b' }}>Next Renewal:</span>
                        <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{nextPayDate}</span>
                      </div>
                    </div>
                    <button onClick={() => { setIsProfileOpen(false); navigate('/myprofile'); }} style={{ width: '100%', padding: '8px', marginTop: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid #334155', borderRadius: '6px', color: '#f1f5f9', cursor: 'pointer', fontSize: '0.8rem' }}>View Full Profile</button>
                  </div>
                </>
              )}
            </div>
            <IconBtn onClick={handleLogout} title="Logout"><LogOut size={16} /></IconBtn>
          </NavActions>
        </NavBar>

      <Hero>
        <HeroGreeting>Good day</HeroGreeting>
        <HeroName>Hey, <span>{firstName}</span> 👋</HeroName>

        {/* Tab bar */}
        <TabBar>
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <Tab key={t.id} $active={activeTab === t.id} onClick={() => setActiveTab(t.id)}>
                <Icon size={14} />
                {t.label}
              </Tab>
            );
          })}
        </TabBar>
      </Hero>

      <Content>
        {/* ══════════ HOME TAB ══════════ */}
        {activeTab === 'home' && (
          <>
            {/* Membership card */}
            <Card>
              <CardTitle><CreditCard size={13} /> Membership</CardTitle>
              {loading ? (
                <><SkeletonBlock $h={24} $w="60%" /><SkeletonBlock $h={16} $w="40%" /></>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <PlanBadge><Star size={12} /> {plan} Plan</PlanBadge>
                    <div style={{ marginTop: 10, fontSize: '0.8rem', color: '#64748b' }}>
                      Next renewal: <strong style={{ color: '#e2e8f0' }}>{nextPayDate}</strong>
                      {lastPay && (
                        <>
                          <span style={{ margin: '0 8px', color: '#334155' }}>|</span>
                          Last paid: <strong style={{ color: '#facc15' }}>₹{(lastPay.amount || 0).toLocaleString()}</strong>
                        </>
                      )}
                    </div>
                  </div>
                  <StatusBadge $ok={isActive}>
                    {isActive ? <CheckCircle size={11} /> : <AlertCircle size={11} />}
                    {memberStatus}
                  </StatusBadge>
                </div>
              )}
            </Card>

            {/* Stats */}
            <StatsGrid>
              <StatBox>
                <StatValue $color="#facc15">{loading ? '—' : totalCheckins}</StatValue>
                <StatLabel>Check-ins</StatLabel>
              </StatBox>
              <StatBox>
                <StatValue $color="#34d399">{loading ? '—' : successPay}</StatValue>
                <StatLabel>Payments</StatLabel>
              </StatBox>
              <StatBox>
                <StatValue $color="#60a5fa">{loading ? '—' : plan.charAt(0)}</StatValue>
                <StatLabel>Plan Tier</StatLabel>
              </StatBox>
            </StatsGrid>

            {/* Quick actions */}
            <Card>
              <CardTitle><Zap size={13} /> Quick Actions</CardTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Start Today\'s Workout', icon: Dumbbell, action: () => navigate('/workouts') },
                  { label: 'View My Stats',          icon: TrendingUp, action: () => navigate('/dashboard/stats') },
                  { label: 'Browse Nutrition Plans', icon: FileText, action: () => navigate('/nutrition') },
                ].map(({ label, icon: Icon, action }) => (
                  <button key={label} onClick={action} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10,
                    padding: '12px 14px', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.875rem',
                    fontWeight: 600, transition: 'border-color 0.2s, background 0.2s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#facc15'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#1e293b'}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Icon size={16} color="#facc15" /> {label}
                    </span>
                    <ChevronRight size={16} color="#475569" />
                  </button>
                ))}
              </div>
            </Card>

            {/* Last check-in preview */}
            {recentCheckins.length > 0 && (
              <Card>
                <CardTitle><Clock size={13} /> Last Check-in</CardTitle>
                <CheckInDate>{Array.isArray(recentCheckins[0].attendanceDate) ? `${recentCheckins[0].attendanceDate[0]}-${String(recentCheckins[0].attendanceDate[1]).padStart(2, '0')}-${String(recentCheckins[0].attendanceDate[2]).padStart(2, '0')}` : recentCheckins[0].date || recentCheckins[0].attendanceDate || 'Today'}</CheckInDate>
                <CheckInTime>Entry: {recentCheckins[0].entry || recentCheckins[0].checkInTime || '—'} {(recentCheckins[0].exit || recentCheckins[0].checkOutTime) && `· Exit: ${recentCheckins[0].exit || recentCheckins[0].checkOutTime}`}</CheckInTime>
                <button onClick={() => setActiveTab('checkins')} style={{
                  background: 'none', border: 'none', color: '#facc15', fontSize: '0.8rem',
                  fontWeight: 600, cursor: 'pointer', padding: 0, marginTop: 10,
                  display: 'flex', alignItems: 'center', gap: 4
                }}>View all <ChevronRight size={13} /></button>
              </Card>
            )}
          </>
        )}

        {/* ══════════ CHECK-INS TAB ══════════ */}
        {activeTab === 'checkins' && (
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <CardTitle style={{ margin: 0 }}><Clock size={13} /> Monthly Attendance</CardTitle>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={handlePrevAttMonth} style={{ padding: "4px", borderRadius: "50%", border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={16} /></button>
                <span style={{ fontWeight: "bold", color: "#facc15", width: "120px", textAlign: "center", fontSize: "0.85rem" }}>
                  {attendanceMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={handleNextAttMonth} style={{ padding: "4px", borderRadius: "50%", border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronRight size={16} /></button>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <div style={{ padding: '8px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', color: '#34d399', fontSize: '0.8rem', fontWeight: 'bold' }}>
                Total Present: {filteredCheckins.length} days
              </div>
            </div>

            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonBlock key={i} $h={36} $mb={8} />
              ))
            ) : filteredCheckins.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.875rem', textAlign: 'center', padding: '20px 0' }}>
                No check-in records found for this month.
              </p>
            ) : (
              filteredCheckins.map((c, i) => (
                <CheckInItem key={i}>
                  <div>
                    <CheckInDate>{Array.isArray(c.attendanceDate) ? `${c.attendanceDate[0]}-${String(c.attendanceDate[1]).padStart(2, '0')}-${String(c.attendanceDate[2]).padStart(2, '0')}` : c.date || c.attendanceDate || 'Unknown date'}</CheckInDate>
                    <CheckInTime>
                      Entry: {c.entry || c.checkInTime || '—'}
                      {(c.exit || c.checkOutTime) && ` · Exit: ${c.exit || c.checkOutTime}`}
                    </CheckInTime>
                  </div>
                  <StatusBadge $ok>
                    <CheckCircle size={10} /> Present
                  </StatusBadge>
                </CheckInItem>
              ))
            )}
          </Card>
        )}

        {/* ══════════ PAYMENTS TAB ══════════ */}
        {activeTab === 'payments' && (
          <Card>
            <CardTitle><CreditCard size={13} /> Payment History</CardTitle>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} $h={44} $mb={8} />)
            ) : recentPayments.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.875rem', textAlign: 'center', padding: '20px 0' }}>
                No payment records found.
              </p>
            ) : (
              recentPayments.map((p, i) => (
                <PaymentRow key={i}>
                  <div>
                    <PayAmount>₹{(p.amount || 0).toLocaleString()}</PayAmount>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 3 }}>
                      {Array.isArray(p.paymentDate) ? new Date(p.paymentDate[0], p.paymentDate[1]-1, p.paymentDate[2], p.paymentDate[3]||0, p.paymentDate[4]||0).toLocaleDateString() : new Date(p.paymentDate).toLocaleDateString()} · {p.paymentMode || 'Card'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StatusBadge $ok={p.paymentStatus === 'SUCCESS'}>
                      {p.paymentStatus === 'SUCCESS'
                        ? <><CheckCircle size={10} /> Paid</>
                        : <><AlertCircle size={10} /> {p.paymentStatus || 'Pending'}</>
                      }
                    </StatusBadge>
                    <DownloadBtn onClick={() => generateInvoicePDF({ ...p, fullName: displayName })}>
                      <Download size={12} /> PDF
                    </DownloadBtn>
                  </div>
                </PaymentRow>
              ))
            )}
          </Card>
        )}

        {/* ══════════ WORKOUT TAB ══════════ */}
        {activeTab === 'workout' && (
          <>
            <Card>
              <CardTitle><Dumbbell size={13} /> Your Weekly Plan</CardTitle>
              <div style={{ marginBottom: 14, padding: '10px 14px', background: '#0f172a', borderRadius: 10, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                📋 <strong style={{ color: '#facc15' }}>{plan}</strong> membership plan • Standard 6-day programme assigned by your trainer.
              </div>
              {DEFAULT_PLAN.map((d, i) => (
                <WorkoutDay key={i}>
                  <DayTag $active={d.active}>{d.day}</DayTag>
                  <WorkoutInfo>
                    <WorkoutTitle>{d.label}</WorkoutTitle>
                    <WorkoutDetail>{d.detail}</WorkoutDetail>
                  </WorkoutInfo>
                  {d.active && <StatusBadge $ok><Zap size={10} /> Today</StatusBadge>}
                </WorkoutDay>
              ))}
              <button onClick={() => navigate('/workouts')} style={{
                marginTop: 16, width: '100%', padding: '11px',
                background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.2)',
                borderRadius: 10, color: '#facc15', fontWeight: 700, fontSize: '0.875rem',
                cursor: 'pointer', transition: 'background 0.2s'
              }}>
                Browse Full Workout Library →
              </button>
            </Card>
          </>
        )}

        {/* ══════════ FEEDBACK TAB ══════════ */}
        {activeTab === 'feedback' && (
          <Card>
            <CardTitle><MessageSquare size={13} /> Share Your Experience</CardTitle>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: 16, lineHeight: 1.5 }}>
              Your feedback goes straight to our management board and helps us improve every day.
            </p>
            <form onSubmit={handleFeedback}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rating</div>
                <StarRow>
                  {[1,2,3,4,5].map(s => (
                    <StarBtn
                      key={s}
                      type="button"
                      $on={s <= (hovered || rating)}
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHovered(s)}
                      onMouseLeave={() => setHovered(0)}
                    >★</StarBtn>
                  ))}
                </StarRow>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Message</div>
              <TextArea
                value={feedbackMsg}
                onChange={e => setFeedbackMsg(e.target.value)}
                placeholder="Tell us what you love or what we can improve…"
                required
              />
              {fbStatus && <AlertBox $ok={fbStatus.ok}>{fbStatus.msg}</AlertBox>}
              <SubmitBtn type="submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send Feedback'}
              </SubmitBtn>
            </form>
          </Card>
        )}
      </Content>
    </Page>
  );
};

export default Userdashboard;
