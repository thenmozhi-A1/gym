import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import styled from "styled-components";
import {
  Users,
  CreditCard,
  Clock,
  LogOut,
  Search,
  CheckCircle,
  XCircle,
  X,
  MessageSquare,
  Fingerprint,
  TrendingUp,
  Activity,
  Zap,
  Target,
  Layout,
  Bell,
  Globe,
  Settings,
  MoreVertical,
  ChevronDown,
  Menu,
  ArrowUpRight,
  TrendingDown,
  BarChart3,
  Calendar,
  Layers,
  Award,
  Trash2,
  Plus,
  Phone,
  MapPin,
  FileText,
  CheckSquare,
  Briefcase,
  FileCheck,
  Package
} from "lucide-react";

import AddUserModal from "./Components/AddUserModal";
import MemberManagement from "./Components/MemberManagement";
import MembershipModule from "./Components/MembershipModule";
import PaymentModule from "./Components/PaymentModule";
import AttendanceModule from "./Components/AttendanceModule";
import TrainerModule from "./Components/TrainerModule";
import WorkoutModule from "./Components/WorkoutModule";
import DietModule from "./Components/DietModule";
import LeadModule from "./Components/LeadModule";
import CommunicationModule from "./Components/CommunicationModule";
import ReportsModule from "./Components/ReportsModule";
import ProductModule from "./Components/ProductModule";
import RequestsModule from "./Components/RequestsModule";
import axiosInstance from "./api/axiosInstance";
import log from "./utils/logger";
import { useAdminNotifications } from "./hooks/useAdminNotifications";
import { useAdminStore } from "./store/useAdminStore";
import useAuthStore from "./store/authStore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const {
    users, staffs, payments, attendance, consultations, feedbacks, leaves, isLoading: loading,
    fetchData, addUser, updateUser, deleteUser, addStaff, updateStaff, deleteStaff, deleteFeedback, updateLeaveStatus
  } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isGlobalConfigOpen, setIsGlobalConfigOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [themeName, setThemeName] = useState("aurora");
  const [globalConfig, setGlobalConfig] = useState({ gymName: "B&Y Fitness Arena", contactEmail: "admin@byfitness.com", maxCapacity: "500", currency: "USD" });
  const [isPayrollDetailOpen, setIsPayrollDetailOpen] = useState(false);
  const [payrollTab, setPayrollTab] = useState("overview"); // overview, payruns, attendance, tax
  const [selectedStaffForSlip, setSelectedStaffForSlip] = useState(null);
  const [payrollSearchTerm, setPayrollSearchTerm] = useState("");
  const [payrollRoleFilter, setPayrollRoleFilter] = useState("ALL");
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const holdTimer = useRef(null);
  const progressTimer = useRef(null);
  const [enrollProgress, setEnrollProgress] = useState(0);
  const [newStaff, setNewStaff] = useState({
    name: "", specialty: "", experience: "", salary: "", times: "", email: "",
    role: "Trainer", phone: "", address: "",
    fingerprintEnrolled: false,
    fingerprintHash: ""
  });
  const [attendanceType, setAttendanceType] = useState("users"); // "users" or "staff"
  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false);
  const [editStaffFormData, setEditStaffFormData] = useState({});

  // Subscribe to real-time admin notifications via SSE
  useAdminNotifications((event) => {
    setNotifications(prev => [event, ...prev].slice(0, 50));
    setUnreadCount(prev => prev + 1);
  });

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab, fetchData]);

  const handleAddUser = async (userData) => {
    const success = await addUser(userData);
    if (success) {
      setIsAddUserModalOpen(false);
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Remove this feedback?")) return;
    await deleteFeedback(id);
  };

  const handleLogout = () => {
    useAuthStore.getState().logout();
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Permanent deletion cannot be undone. Proceed?")) return;
    await deleteUser(id);
  };

  const handleEditUser = async (id, updatedData) => {
    return await updateUser(id, updatedData);
  };

  const handleDeleteStaff = async (id) => {
    if (!window.confirm("Remove this staff member from the system?")) return;
    await deleteStaff(id);
  };

  const handleEditStaffSubmit = async (e) => {
    e.preventDefault();
    await updateStaff(editStaffFormData.id, editStaffFormData);
    setIsEditStaffModalOpen(false);
  };

  const isWebAuthnSupported = () => window.PublicKeyCredential !== undefined && typeof window.PublicKeyCredential === 'function';
  const bufferToBase64 = (buffer) => btoa(String.fromCharCode(...new Uint8Array(buffer)));

  const startScan = async (e) => {
    if (e) e.preventDefault();
    if (!newStaff.email) {
      toast.error("Please enter the staff email before scanning fingerprint.");
      return;
    }
    if (newStaff.fingerprintEnrolled) return;

    setIsEnrolling(true);
    let p = 0;
    progressTimer.current = setInterval(() => {
      p = (p + 5) % 100;
      setEnrollProgress(p);
    }, 100);

    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const userId = new TextEncoder().encode(newStaff.email);
      
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "B&Y Fitness Gym", id: window.location.hostname },
          user: { id: userId, name: newStaff.email, displayName: newStaff.name || newStaff.email },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
          authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required", requireResidentKey: false },
          timeout: 60000,
          attestation: "none",
        }
      });

      // Need to use URL-safe base64 encoding to match Login.jsx exactly
      const credIdBase64 = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      
      localStorage.setItem("lastEnrolledEmail", newStaff.email);

      clearInterval(progressTimer.current);
      setEnrollProgress(100);
      setTimeout(() => {
        setNewStaff(prev => ({ ...prev, fingerprintEnrolled: true, fingerprintHash: credIdBase64 }));
        setIsEnrolling(false);
      }, 500);
    } catch (err) {
      log.error(err);
      clearInterval(progressTimer.current);
      setIsEnrolling(false);
      setEnrollProgress(0);
      if (err.name !== "NotAllowedError") {
        toast.error(`Biometric capture failed: ${err.message || err.name}`);
      }
    }
  };

  const cancelScan = () => {
    clearTimeout(holdTimer.current);
    clearInterval(progressTimer.current);
    if (isEnrolling) {
      setIsEnrolling(false);
      setEnrollProgress(0);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.role) return;
    const staffToAdd = {
      fullName: newStaff.name, email: newStaff.email, password: newStaff.password,
      role: newStaff.role, salary: newStaff.salary, times: newStaff.times,
      specialty: newStaff.specialty, experience: newStaff.experience,
      phone: newStaff.phone, address: newStaff.address, status: "ACTIVE"
    };
    const success = await addStaff(staffToAdd);
    if (success) {
      setNewStaff({
        name: "", specialty: "", experience: "", salary: "", times: "", email: "",
        role: "Trainer", phone: "", address: "", password: ""
      });
      setIsAddStaffModalOpen(false);
    }
  };

  const handleExportData = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(22);
    doc.text("Gym Data Export", 14, 20);
    
    // Meta Info
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Users: ${users.length}`, 14, 36);
    doc.text(`Total Staff: ${staffs.length}`, 14, 42);
    
    const userFirstPayments = {};
    payments.forEach(p => {
      const uid = p.user?.id || p.userId || p.fullName;
      if (uid) {
        if (!userFirstPayments[uid] || new Date(p.paymentDate) < new Date(userFirstPayments[uid].paymentDate)) {
          userFirstPayments[uid] = p;
        }
      }
    });
    const originalIncome = Object.values(userFirstPayments).reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
    
    doc.text(`Total Revenue: Rs. ${originalIncome.toLocaleString()}`, 14, 48);

    // Users Table
    doc.setFontSize(14);
    doc.text("Active Members", 14, 60);
    const userRows = users.map(u => [
      u.fullName || "N/A", 
      u.email || "N/A", 
      u.membershipPlan || u.membershipType || "Standard", 
      u.status || "ACTIVE"
    ]);
    
    autoTable(doc, {
      startY: 65,
      head: [["Name", "Email", "Membership", "Status"]],
      body: userRows,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] }
    });

    // Staffs Table
    doc.addPage();
    doc.setFontSize(14);
    doc.text("Staff Members", 14, 20);
    const staffRows = staffs.map(s => [
      s.fullName || "N/A", 
      s.role || "N/A", 
      s.salary || "N/A",
      s.times || "N/A"
    ]);
    
    autoTable(doc, {
      startY: 25,
      head: [["Name", "Role", "Salary", "Shift"]],
      body: staffRows,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save("gym_data_export.pdf");
    setIsSettingsOpen(false);
  };

  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  const lastDayOfMonth = new Date(currentYear, new Date().getMonth() + 1, 0).getDate();

  const activeStaffCount = staffs.length;
  const totalGross = staffs.reduce((acc, s) => acc + (parseInt(String(s.salary || '0').replace(/[^\d]/g, '')) || 0), 0);
  const totalEPF = activeStaffCount * 1800;
  const totalESI = totalGross * 0.0075;
  const totalTDS = activeStaffCount * 650;
  
  const totalNetPay = staffs.reduce((acc, s) => {
    const gross = parseInt(String(s.salary || '0').replace(/[^\d]/g, '')) || 0;
    const daily = gross / 30;
    const leaveDed = daily * (s.leaves || 0);
    const permDed = (daily / 8) * (s.permissions || 0);
    return acc + (gross - leaveDed - permDed - 2450);
  }, 0);
  const pendingLeavesCount = leaves ? leaves.filter(l => l.status === 'PENDING').length : 0;

  return (
    <AuroraWrapper theme={themeName}>
      <Toaster position="top-right" />
      {/* ── SIDEBAR ── */}
      <Sidebar isOpen={isSidebarOpen}>
        <div className="sidebar-header">
          <div className="logo" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <img src="/logo.png" alt="B&Y Fitness" style={{ height: '60px', objectFit: 'contain' }} />
          </div>
        </div>

        <NavSection>
          {[
            { id: "dashboard", icon: <Layout size={18} />, label: "Dashboard" },
            { id: "users", icon: <Users size={18} />, label: "Users" },
            { id: "memberships", icon: <Award size={18} />, label: "Memberships" },
            { id: "payments", icon: <CreditCard size={18} />, label: "Revenue" },
            { id: "attendance", icon: <Clock size={18} />, label: "Attendance" },
            { id: "staffs", icon: <Layers size={18} />, label: "Staffs" },
            { id: "trainers", icon: <Users size={18} />, label: "Trainers" },
            { id: "products", icon: <Package size={18} />, label: "Store & Supplements" },

            { id: "payroll", icon: <CreditCard size={18} />, label: "Payroll" },
            { id: "requests", icon: <CheckSquare size={18} />, label: "Requests" },
            { id: "consultations", icon: <MessageSquare size={18} />, label: "Inquiries" },
            { id: "feedbacks", icon: <MessageSquare size={18} />, label: "Feedbacks" }
          ].map(item => (
            <NavItem
              key={item.id}
              active={activeTab === item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
            >
              {item.icon} <span>{item.label}</span>
            </NavItem>
          ))}
        </NavSection>


      </Sidebar>
      {isSidebarOpen && <Overlay className="d-lg-none" onClick={() => setIsSidebarOpen(false)} />}

      <MainArea>
        {/* 🚀 HEADER 🚀 */}
        <Header>
          <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="search-bar">
            <Search size={18} />
            <input placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="header-actions" style={{ position: 'relative' }}>
            <button className="mobile-toggle" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <button className="h-btn" onClick={() => setIsSettingsOpen(!isSettingsOpen)}><Settings size={18} /></button>
            {isSettingsOpen && (
              <SettingsDropdown>
                <div className="sd-header">
                  <h4>Admin Settings</h4>
                  <button className="close-btn" onClick={() => setIsSettingsOpen(false)}><X size={16} /></button>
                </div>
                <div className="sd-body">
                  <button className="sd-item" onClick={() => { setIsThemeModalOpen(true); setIsSettingsOpen(false); }}><Layout size={16} /> Theme Customization</button>
                  <button className="sd-item" onClick={handleExportData}><CheckSquare size={16} /> Export Data</button>
                  <div className="sd-divider"></div>
                  <button className="sd-item danger" onClick={handleLogout}><LogOut size={16} /> Logout</button>
                </div>
              </SettingsDropdown>
            )}
            <button
              className="h-btn"
              style={{ position: 'relative' }}
              onClick={() => { setIsNotifOpen(o => !o); setUnreadCount(0); }}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <div className="notif-dot" style={{
                  position: 'absolute', top: 2, right: 2,
                  background: '#ef4444', color: '#fff',
                  borderRadius: '50%', fontSize: 10, fontWeight: 700,
                  minWidth: 16, height: 16, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', padding: '0 2px'
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </button>
            {isNotifOpen && (
              <div style={{
                position: 'absolute', top: 56, right: 16, width: 320,
                background: '#1e293b', border: '1px solid #334155',
                borderRadius: 12, boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                zIndex: 1000, maxHeight: 420, display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>Live Notifications</span>
                  <button onClick={() => setIsNotifOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={14} /></button>
                </div>
                <div style={{ overflowY: 'auto', flex: 1 }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: '#64748b', fontSize: 13 }}>No notifications yet</div>
                  ) : (
                    notifications.map((n, i) => (
                      <div key={i} style={{
                        padding: '10px 16px', borderBottom: '1px solid #0f172a',
                        display: 'flex', gap: 10, alignItems: 'flex-start'
                      }}>
                        <span style={{ fontSize: 18 }}>
                          {n.type === 'NEW_MEMBER' ? '👤' : n.type === 'PAYMENT_FAILED' ? '❌' : n.type === 'FEEDBACK' ? '⭐' : n.type === 'ENQUIRY' ? '📞' : '🏋️'}
                        </span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>
                            {n.type === 'NEW_MEMBER' && `New member: ${n.payload?.name}`}
                            {n.type === 'PAYMENT_FAILED' && `Payment failed — ₹${n.payload?.amount}`}
                            {n.type === 'ATTENDANCE' && `${n.payload?.name} checked in`}
                            {n.type === 'FEEDBACK' && `Feedback from ${n.payload?.name}`}
                            {n.type === 'ENQUIRY' && `New Enquiry: ${n.payload?.name}`}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                            {new Date(n.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            <div className="profile-chip">
              <div className="avatar">AD</div>
            </div>
            <button className="mobile-toggle" onClick={() => setIsSidebarOpen(true)}><Layout size={24} /></button>
          </div>
        </Header>

        {/* ── DASHBOARD CONTENT ── */}
        <ContentContainer>
          {loading ? (
            <LoaderArea><div className="spinner"></div></LoaderArea>
          ) : (
            <>
              {activeTab === "dashboard" ? (
                <div className="dashboard-view">
                  <StatsRow>
                    <StatBox color="#38bdf8">
                      <div className="card-glow" />
                      <div className="lab">Total Users</div>
                      <div className="val-row">
                        <div className="val">{users.length}</div>
                        <div className="icon-badge"><Users size={24} /></div>
                      </div>
                      <div className="footer-text">See in-depth <span>User source</span></div>
                    </StatBox>
                    <StatBox color="#fd7e14">
                      <div className="card-glow" />
                      <div className="lab">Retention Rate</div>
                      <div className="val-row">
                        <div className="val">84.22%</div>
                        <div className="icon-badge"><TrendingUp size={24} /></div>
                      </div>
                      <div className="footer-text">See page-wise <span>Performance</span></div>
                    </StatBox>
                    <StatBox color="#22c55e">
                      <div className="card-glow" />
                      <div className="lab">Growth</div>
                      <div className="val-row">
                        <div className="val">₹{(() => {
                            const userFirstPayments = {};
                            payments.forEach(p => {
                              const uid = p.user?.id || p.userId || p.fullName;
                              if (uid) {
                                if (!userFirstPayments[uid] || new Date(p.paymentDate) < new Date(userFirstPayments[uid].paymentDate)) {
                                  userFirstPayments[uid] = p;
                                }
                              }
                            });
                            return Object.values(userFirstPayments).reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
                        })().toLocaleString()}</div>
                        <div className="icon-badge"><CreditCard size={24} /></div>
                      </div>
                      <div className="footer-text">See last week's <span>Revenue</span></div>
                    </StatBox>
                    <StatBox color="#06b6d4">
                      <div className="card-glow" />
                      <div className="lab">Active Logs</div>
                      <div className="val-row">
                        <div className="val">{attendance.length}</div>
                        <div className="icon-badge"><Zap size={24} /></div>
                      </div>
                      <div className="footer-text">See all inbound <span>Logs</span></div>
                    </StatBox>
                  </StatsRow>

                  <div className="charts-row mt-4">
                    <ChartCard className="flex-2">
                      <div className="chart-header">
                        <div className="tabs">
                          <button className="active">New Users</button>

                        </div>
                        <div className="legend">
                          <span className="actual">Actual Value</span>
                          <span className="projected">Projected Value</span>
                        </div>
                      </div>
                      <div className="main-chart">
                        <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                          <svg width="100%" height="100%" viewBox="0 0 800 200">
                            <path d="M0,180 Q100,150 200,160 T400,80 T600,100 T800,40" fill="none" stroke="#007bff" strokeWidth="4" />
                            <path d="M0,180 Q100,150 200,160 T400,80 T600,100 T800,40 V200 H0 Z" fill="url(#grad)" opacity="0.1" />
                            <defs><linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#007bff" /><stop offset="100%" stopColor="#fff" /></linearGradient></defs>
                          </svg>
                        </div>
                        <div className="chart-footer">
                          <div className="f-stat"><span>275K</span><small>New Users</small></div>
                          <div className="f-stat"><span>3m 12s</span><small>Avg. Session</small></div>
                        </div>
                      </div>
                    </ChartCard>

                    <ChartCard className="flex-1">
                      <div className="chart-header">
                        <h5>Top Classes</h5>
                        <button className="dropdown">This Week <ChevronDown size={14} /></button>
                      </div>
                      <div className="bar-chart mt-4">
                        {[40, 70, 50, 90, 60, 30].map((h, i) => (
                          <div className="bar-group" key={i}>
                            <div className="bar" style={{ height: `${h}%` }}></div>
                          </div>
                        ))}
                      </div>
                    </ChartCard>
                  </div>
                </div>
              ) : activeTab === "payroll" ? (
                <PayrollContainer className="animate-in">
                  {/* ── PAYROLL SUB-NAV ── */}
                  <PayrollSubNav>
                    <div className="nav-items">
                      <button className={payrollTab === "overview" ? "active" : ""} onClick={() => setPayrollTab("overview")}>Overview</button>
                      <button className={payrollTab === "payruns" ? "active" : ""} onClick={() => setPayrollTab("payruns")}>Pay Runs</button>
                      <button className={payrollTab === "attendance" ? "active" : ""} onClick={() => setPayrollTab("attendance")}>Leave & Attendance</button>
                      <button className={payrollTab === "tax" ? "active" : ""} onClick={() => setPayrollTab("tax")}>Tax & Forms</button>
                    </div>
                  </PayrollSubNav>

                  <div className="payroll-content-wrapper">
                    {payrollTab === "overview" && (
                      <>
                        {!isPayrollDetailOpen ? (
                          <>
                            <div className="payroll-main">
                              <header className="payroll-header">
                                <h1 className="welcome">Welcome Slayfit!</h1>
                                <div className="pay-run-status">
                                  <span>Process Pay Run for {currentMonthName} {currentYear}</span>
                                  <span className="badge-approved">APPROVED</span>
                                </div>
                              </header>

                              <div className="payroll-stepper">
                                <div className="step active"><div className="dot">1</div><span>Data Verify</span></div>
                                <div className="connector active" />
                                <div className="step active"><div className="dot">2</div><span>Approval</span></div>
                                <div className="connector" />
                                <div className="step"><div className="dot">3</div><span>Bank Transfer</span></div>
                                <div className="connector" />
                                <div className="step"><div className="dot">4</div><span>Completed</span></div>
                              </div>

                              <div className="hero-card">
                                <div className="hero-stats">
                                  <div className="stat-group">
                                    <label>EMPLOYEES' NET PAY</label>
                                    <div className="amount-row">
                                      <div className="amount">
                                        ₹{staffs.reduce((acc, s) => {
                                          const gross = parseInt(String(s.salary || '0').replace(/[^\d]/g, '')) || 0;
                                          const daily = gross / 30;
                                          const leaveDed = daily * (s.leaves || 0);
                                          const permDed = (daily / 8) * (s.permissions || 0);
                                          return acc + (gross - leaveDed - permDed - 2450);
                                        }, 0).toLocaleString()}
                                      </div>
                                      <div className="trend-badge positive">+4.2% <ArrowUpRight size={12} /></div>
                                    </div>
                                  </div>
                                  <div className="stat-divider" />
                                  <div className="stat-group">
                                    <label>PAYMENT DATE</label>
                                    <div className="date">{lastDayOfMonth} {currentMonthName} {currentYear}</div>
                                  </div>
                                  <div className="stat-divider" />
                                  <div className="stat-group">
                                    <label>NO. OF EMPLOYEES</label>
                                    <div className="count">{activeStaffCount}</div>
                                  </div>
                                  <button className="btn-black" onClick={() => setIsPayrollDetailOpen(true)}>View Details</button>
                                </div>
                                <p className="hero-note">
                                  <Clock size={12} /> Pay your employees on {lastDayOfMonth}/{String(new Date().getMonth() + 1).padStart(2, '0')}/{currentYear}. Record it here once you made the payment.
                                </p>
                              </div>

                              <div className="payroll-grid">
                                <div className="grid-card deduction-card">
                                  <div className="card-header">
                                    <h5>DEDUCTION SUMMARY</h5>
                                    <select className="small-select"><option>Current Month</option></select>
                                  </div>
                                  <div className="deduction-row">
                                    <div className="deduction-item">
                                      <div className="icon-circle"><Layers size={14} /></div>
                                      <label>EPF</label>
                                      <div className="val">₹{Math.floor(totalEPF).toLocaleString()}</div>
                                      <span className="link">View Details</span>
                                    </div>
                                    <div className="deduction-item">
                                      <div className="icon-circle gold"><Award size={14} /></div>
                                      <label>ESI</label>
                                      <div className="val">₹{Math.floor(totalESI).toLocaleString()}</div>
                                      <span className="link">View Details</span>
                                    </div>
                                    <div className="deduction-item">
                                      <div className="icon-circle red"><TrendingDown size={14} /></div>
                                      <label>TDS DEDUCTION</label>
                                      <div className="val">₹{Math.floor(totalTDS).toLocaleString()}</div>
                                      <span className="link">View Details</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid-card summary-card">
                                  <h5>EMPLOYEE SUMMARY</h5>
                                  <div className="summary-body">
                                    <label>ACTIVE EMPLOYEES</label>
                                    <div className="big-count">{activeStaffCount}</div>
                                    <span className="link" onClick={() => setIsPayrollDetailOpen(true)} style={{cursor: 'pointer'}}>View Employees</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <aside className="payroll-sidebar">
                              <h5>To Do Tasks</h5>
                              <div className="task-list">
                                {[
                                  { label: "136 Reimbursement Claim(s)", sub: "Pending Approval" },
                                  { label: "96 Proof of Investment(s)", sub: "Pending Approval" },
                                  { label: "55 Salary Revision(s)", sub: "Pending Approval" }
                                ].map((task, i) => (
                                  <div key={i} className="task-item">
                                    <div className="task-info"><h6>{task.label}</h6><p>{task.sub}</p></div>
                                    <button className="btn-outline">Approve</button>
                                  </div>
                                ))}
                              </div>
                            </aside>
                          </>
                        ) : (
                          <div className="payroll-detail-overlay animate-in">
                            <div className="detail-header">
                              <div className="d-flex align-items-center gap-4">
                                <button className="back-btn" onClick={() => setIsPayrollDetailOpen(false)}>
                                  <ArrowUpRight style={{ transform: 'rotate(-135deg)' }} size={16} /> BACK
                                </button>
                                <h2>Payroll <small>DETAILS / {currentMonthName.toUpperCase()} {currentYear}</small></h2>
                              </div>
                              <div className="d-flex gap-3">
                                <div className="search-box-mini"><Search size={14} /><input type="text" placeholder="Search Staff..." value={payrollSearchTerm} onChange={(e) => setPayrollSearchTerm(e.target.value)} /></div>
                                <select className="role-filter-select" value={payrollRoleFilter} onChange={(e) => setPayrollRoleFilter(e.target.value)}>
                                  <option value="ALL">All Roles</option>
                                  <option value="Trainer">Trainers</option>
                                  <option value="Front Office">Front Office</option>
                                </select>
                                <button className="export-btn pdf"><Activity size={14} /> PDF</button>
                              </div>
                            </div>

                            <TableCard style={{ border: 'none', padding: 0, background: 'transparent' }}>
                              <div className="table-responsive">
                                <table className="table interactive-table">
                                  <thead>
                                    <tr><th>EMPLOYEE</th><th>ROLE</th><th>GROSS PAY</th><th>LEAVES/PERM</th><th>DEDUCTIONS</th><th>NET PAY</th><th>STATUS</th></tr>
                                  </thead>
                                  <tbody>
                                    {staffs.filter(s => (payrollRoleFilter === "ALL" || s.role === payrollRoleFilter) && ((s.fullName || s.name || "").toLowerCase().includes(payrollSearchTerm.toLowerCase()))).map(s => {
                                      const gross = parseInt(String(s.salary || '0').replace(/[^\d]/g, '')) || 0;
                                      const daily = gross / 30;
                                      const leaveDed = daily * (s.leaves || 0);
                                      const permDed = (daily / 8) * (s.permissions || 0);
                                      const netPay = gross - leaveDed - permDed - 2450;

                                      return (
                                        <tr key={s.id} onClick={() => setSelectedStaffForSlip(s)}>
                                          <td><div className="u-cell"><div className="avatar-small">{(s.fullName || s.name || "S").charAt(0)}</div><div className="fw-bold">{s.fullName || s.name || "Staff Member"}</div></div></td>
                                          <td><span className="badge bg-primary-light">{s.role}</span></td>
                                          <td className="fw-bold">{s.salary}</td>
                                          <td>
                                            <div className="d-flex flex-column">
                                              <span className="text-danger" style={{ fontSize: '0.75rem', fontWeight: 700 }}>{s.leaves} Leaves</span>
                                              <span className="text-warning" style={{ fontSize: '0.65rem', fontWeight: 600 }}>{s.permissions} Perms</span>
                                            </div>
                                          </td>
                                          <td className="text-danger">
                                            ₹{Math.floor(2450 + leaveDed + permDed).toLocaleString()}
                                            <small style={{ display: 'block', fontSize: '0.6rem', opacity: 0.6 }}>TDS + PF + Attnd</small>
                                          </td>
                                          <td className="fw-black text-primary">₹{Math.floor(netPay).toLocaleString()}</td>
                                          <td><span className="sync-badge">PAID</span></td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </TableCard>

                            {selectedStaffForSlip && (
                              <>
                                <div className="drawer-overlay" onClick={() => setSelectedStaffForSlip(null)} />
                                <div className="pay-slip-drawer animate-slide-left">
                                  <div className="drawer-header"><h3>Employee Pay Slip</h3><button onClick={() => setSelectedStaffForSlip(null)}><X size={20} /></button></div>
                                  <div className="slip-profile"><div className="big-avatar">{(selectedStaffForSlip.fullName || selectedStaffForSlip.name || "S").charAt(0)}</div><div className="info"><h4>{selectedStaffForSlip.fullName || selectedStaffForSlip.name || "Staff Member"}</h4><p>{selectedStaffForSlip.role} • ID: SF-2024-{Math.floor(Math.random() * 9000) + 1000}</p></div></div>
                                  <div className="slip-summary-cards">
                                    <div className="s-card green"><label>EARNINGS</label><div className="val">{selectedStaffForSlip.salary}</div></div>
                                    <div className="s-card red">
                                      <label>TOTAL DEDUCTIONS</label>
                                      <div className="val">
                                        ₹{Math.floor(2450 + (parseInt(String(selectedStaffForSlip.salary || '0').replace(/[^\d]/g, '')) / 30 * (selectedStaffForSlip.leaves || 0)) + ((parseInt(String(selectedStaffForSlip.salary || '0').replace(/[^\d]/g, '')) / 30 / 8) * (selectedStaffForSlip.permissions || 0))).toLocaleString()}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="slip-section">
                                    <h5>EARNINGS BREAKDOWN</h5>
                                    <div className="line-item"><span>Basic Salary</span> <span>{selectedStaffForSlip.salary}</span></div>
                                    <div className="line-item"><span>HRA / Incentives</span> <span>₹0.00</span></div>
                                  </div>
                                  <div className="slip-section">
                                    <h5>ATTENDANCE DEDUCTIONS</h5>
                                    <div className="line-item">
                                      <span>Leaves ({selectedStaffForSlip.leaves || 0} days)</span>
                                      <span className="text-danger">-₹{Math.floor((parseInt(String(selectedStaffForSlip.salary || '0').replace(/[^\d]/g, '')) / 30) * (selectedStaffForSlip.leaves || 0)).toLocaleString()}</span>
                                    </div>
                                    <div className="line-item">
                                      <span>Permissions ({selectedStaffForSlip.permissions || 0} hrs)</span>
                                      <span className="text-danger">-₹{Math.floor(((parseInt(String(selectedStaffForSlip.salary || '0').replace(/[^\d]/g, '')) / 30) / 8) * (selectedStaffForSlip.permissions || 0)).toLocaleString()}</span>
                                    </div>
                                  </div>
                                  <div className="slip-section">
                                    <h5>STATUTORY DEDUCTIONS</h5>
                                    <div className="line-item"><span>Provident Fund (PF)</span> <span>₹1,800</span></div>
                                    <div className="line-item"><span>Professional Tax / TDS</span> <span>₹650</span></div>
                                  </div>
                                  <div className="slip-total">
                                    <div className="total-row">
                                      <span>NET PAYABLE</span>
                                      <span className="final-val">
                                        ₹{Math.floor(
                                          parseInt(String(selectedStaffForSlip.salary || '0').replace(/[^\d]/g, '')) -
                                          (parseInt(String(selectedStaffForSlip.salary || '0').replace(/[^\d]/g, '')) / 30 * (selectedStaffForSlip.leaves || 0)) -
                                          ((parseInt(String(selectedStaffForSlip.salary || '0').replace(/[^\d]/g, '')) / 30 / 8) * (selectedStaffForSlip.permissions || 0)) -
                                          2450
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                    <p>Payment via Bank Transfer • May 31, 2024</p>
                                  </div>
                                  <button className="download-btn-full">DOWNLOAD SLIP (PDF)</button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {payrollTab === "payruns" && (() => {
                      const currentDate = new Date();
                      const runs = [0, 1, 2].map(offset => {
                        const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - offset, 1);
                        const monthName = d.toLocaleString('default', { month: 'long' });
                        const year = d.getFullYear();
                        const lastDay = new Date(year, d.getMonth() + 1, 0).getDate();
                        const shortMonth = d.toLocaleString('default', { month: 'short' });
                        const netPayOffset = staffs.reduce((acc, s) => {
                          const gross = parseInt(String(s.salary || '0').replace(/[^\d]/g, '')) || 0;
                          return acc + (gross - 2450);
                        }, 0);
                        return {
                          month: monthName + " " + year,
                          status: offset === 0 ? "PROCESSING" : "COMPLETED",
                          amount: "₹" + Math.floor(netPayOffset).toLocaleString(),
                          employees: staffs.length,
                          date: shortMonth + " " + lastDay + ", " + year
                        };
                      });
                      return (
                        <div className="payroll-main animate-in">
                          <header className="payroll-header">
                            <h1 className="welcome">Pay Runs</h1>
                            <button className="btn-black"><Plus size={18} /> Create Pay Run</button>
                          </header>
                          <div className="payrun-list">
                            {runs.map((run, i) => (
                              <div key={i} className="payrun-card">
                                <div className="run-info">
                                  <h3>{run.month}</h3>
                                  <p>Scheduled for {run.date}</p>
                                </div>
                                <div className="run-stats">
                                  <div><label>NET PAY</label><strong>{run.amount}</strong></div>
                                  <div><label>EMPLOYEES</label><strong>{run.employees}</strong></div>
                                </div>
                                <div className="run-status">
                                  <span className={`badge ${run.status === 'COMPLETED' ? 'bg-success-light' : 'bg-primary-light'}`}>{run.status}</span>
                                </div>
                                <button className="btn-outline">View Details</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {payrollTab === "attendance" && (() => {
                      const todayStr = new Date().toISOString().split('T')[0];
                      const todayAttendance = attendance.filter(a => ((a.date || a.attendanceDate) === todayStr) && a.staff?.id);
                      
                      const presentToday = todayAttendance.filter(a => a.status === 'PRESENT' || a.status === 'P' || !a.status).length;
                      const onLeaveToday = todayAttendance.filter(a => a.status === 'LEAVE' || a.status === 'L').length;
                      const lateArrivals = todayAttendance.filter(a => a.checkInTime && a.checkInTime > '09:00:00').length;
                      const totalActiveStaff = staffs.length;

                      return (
                        <div className="payroll-main animate-in">
                          <header className="payroll-header">
                            <h1 className="welcome">Leave & Attendance</h1>
                            <div className="d-flex gap-2">
                              <button className="btn-outline">Attendance Logs</button>
                              <button className="btn-black">Leave Policy</button>
                            </div>
                          </header>
                          <div className="attendance-grid">
                            <div className="grid-card">
                              <h5>Pending Leave Requests</h5>
                              <div className="request-list">
                                {leaves && leaves.filter(l => l.status === 'PENDING').length > 0 ? (
                                  leaves.filter(l => l.status === 'PENDING').slice(0, 5).map((req, i) => (
                                    <div key={i} className="request-item">
                                      <div className="req-profile">
                                        <div className="avatar-small">{(req.staffName || "S").charAt(0)}</div>
                                        <div><strong>{req.staffName}</strong><p>{req.leaveType}</p></div>
                                      </div>
                                      <div className="req-details">
                                        <span className="type">{req.reason}</span>
                                        <span className="dates">{req.startDate} to {req.endDate}</span>
                                      </div>
                                      <div className="req-actions">
                                        <button className="btn-icon text-success" onClick={() => updateLeaveStatus(req.id, 'APPROVED')}><CheckCircle size={18} /></button>
                                        <button className="btn-icon text-danger" onClick={() => updateLeaveStatus(req.id, 'REJECTED')}><XCircle size={18} /></button>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>No pending leave requests.</div>
                                )}
                              </div>
                            </div>
                            <div className="grid-card">
                              <h5>Daily Attendance Summary</h5>
                              <div className="summary-list">
                                <div className="summary-item"><span>Present Today</span> <strong>{presentToday}/{totalActiveStaff}</strong></div>
                                <div className="summary-item"><span>On Leave</span> <strong>{onLeaveToday}</strong></div>
                                <div className="summary-item"><span>Late Arrivals</span> <strong>{lateArrivals}</strong></div>
                              </div>
                              <button className="btn-outline w-100 mt-3">View Full Report</button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {payrollTab === "tax" && (() => {
                      const nextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
                      const monthName = nextMonth.toLocaleString('default', { month: 'long' });
                      const year = nextMonth.getFullYear();
                      const qMonth = new Date().getMonth();
                      const quarterEnds = [2, 5, 8, 11];
                      const nextQEnd = quarterEnds.find(m => m >= qMonth) ?? 2;
                      const nextQEndDate = new Date(new Date().getFullYear() + (nextQEnd === 2 && qMonth > 11 ? 1 : 0), nextQEnd + 1, 0);
                      const tdsDate = nextQEndDate.toLocaleString('default', { month: 'long' }) + " " + nextQEndDate.getDate() + ", " + nextQEndDate.getFullYear();
                      return (
                        <div className="payroll-main animate-in">
                          <header className="payroll-header">
                            <h1 className="welcome">Tax & Forms</h1>
                            <button className="btn-outline"><FileText size={18} /> Tax Calendar</button>
                          </header>
                          <div className="tax-grid">
                            <div className="grid-card">
                              <h5>Statutory Compliances</h5>
                              <div className="tax-list-mini">
                                <div className="tax-item-mini">
                                  <div className="tax-icon"><FileCheck size={18} /></div>
                                  <div className="tax-info"><strong>EPF Filing</strong><p>Due: {monthName} 15, {year}</p></div>
                                  <button className="btn-link">Pay Now</button>
                                </div>
                                <div className="tax-item-mini">
                                  <div className="tax-icon"><FileCheck size={18} /></div>
                                  <div className="tax-info"><strong>ESI Filing</strong><p>Due: {monthName} 15, {year}</p></div>
                                  <button className="btn-link">Pay Now</button>
                                </div>
                                <div className="tax-item-mini">
                                  <div className="tax-icon"><FileCheck size={18} /></div>
                                  <div className="tax-info"><strong>TDS Return (Quarterly)</strong><p>Due: {tdsDate}</p></div>
                                  <button className="btn-link disabled">Upcoming</button>
                                </div>
                              </div>
                            </div>
                            <div className="grid-card">
                              <h5>Employee Tax Forms</h5>
                              <div className="form-downloads">
                                <div className="form-item">
                                  <span>Form 16 (FY {new Date().getFullYear() - 1}-{String(new Date().getFullYear()).slice(2)})</span>
                                  <button className="btn-icon"><ArrowUpRight size={16} /></button>
                                </div>
                                <div className="form-item">
                                  <span>Investment Declarations</span>
                                  <button className="btn-icon"><ArrowUpRight size={16} /></button>
                                </div>
                                <div className="form-item">
                                  <span>Salary Certificates</span>
                                  <button className="btn-icon"><ArrowUpRight size={16} /></button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </PayrollContainer>
              ) : activeTab === "users" ? (
                <MemberManagement onAddUser={() => setIsAddUserModalOpen(true)} />
              ) : activeTab === "memberships" ? (
                <MembershipModule onAddUser={() => setIsAddUserModalOpen(true)} />
              ) : activeTab === "payments" ? (
                <PaymentModule />
              ) : activeTab === "attendance" ? (
                <AttendanceModule />
              ) : activeTab === "trainers" ? (
                <TrainerModule onAddUser={() => setIsAddUserModalOpen(true)} />
              ) : activeTab === "workouts" ? (
                <WorkoutModule />
              ) : activeTab === "diet" ? (
                <DietModule />
              ) : activeTab === "products" ? (
                <ProductModule />
              ) : activeTab === "communications" ? (
                <CommunicationModule />
              ) : activeTab === "reports" ? (
                <ReportsModule />
              ) : activeTab === "requests" ? (
                <RequestsModule />
              ) : (
                <TableCard className="animate-in">
                  <div className="table-header">
                    <h2>{activeTab.toUpperCase()} <small>MANAGEMENT</small></h2>
                    <div className="d-flex gap-3">
                      {activeTab === "staffs" && (
                        <button onClick={() => setIsAddStaffModalOpen(true)} className="add-btn">
                          <Plus size={18} /> ADD STAFF
                        </button>
                      )}
                      <button onClick={fetchData} className="refresh-btn">REFRESH SYSTEM</button>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          {activeTab === "users" && <><th>USER</th><th>STATUS</th><th>TYPE</th><th>ACTIONS</th></>}
                          {activeTab === "payments" && <><th>USER</th><th>AMOUNT</th><th>STATUS</th><th>DATE</th></>}
                          {activeTab === "attendance" && attendanceType === "users" && <><th>USER</th><th>LOGIN TIME</th><th>DATE</th><th>DETAILS</th></>}
                          {activeTab === "attendance" && attendanceType === "staff" && <><th>STAFF NAME</th><th>LOGIN TIME</th><th>LOGOUT TIME</th><th>ROLE</th></>}
                          {activeTab === "consultations" && <><th>USER INFO</th><th>MESSAGE / GOALS</th><th>DATE</th></>}
                          {activeTab === "feedbacks" && <><th>USER</th><th>RATING</th><th>FEEDBACK MESSAGE</th><th>DATE</th><th>ACTIONS</th></>}
                          {activeTab === "staffs" && <><th>STAFF NAME</th><th>ROLE</th><th>SPECIALTY / TASK</th><th>SHIFT TIME</th><th>SALARY</th><th>ACTIONS</th></>}
                        </tr>
                      </thead>
                      <tbody>
                        {activeTab === "consultations" && consultations.map(msg => (
                          <tr key={msg.id}>
                            <td>
                              <div className="fw-bold">{msg.fullName}</div>
                              <div className="sub-text">{msg.email}</div>
                            </td>
                            <td style={{ maxWidth: '400px' }}><p className="mb-0 text-secondary">{msg.goals}</p></td>
                            <td className="sub-text">{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : "Recent"}</td>
                          </tr>
                        ))}
                        {activeTab === "feedbacks" && feedbacks.map(fb => (
                          <tr key={fb.id}>
                            <td>
                              <div className="fw-bold">{fb.userName || "Anonymous"}</div>
                              <div className="sub-text">{fb.userEmail || "Anonymous"}</div>
                            </td>
                            <td>
                              <span style={{ color: '#ffc107', fontSize: '1.1rem', letterSpacing: '2px' }}>
                                {"★".repeat(fb.rating || 0)}{"☆".repeat(Math.max(0, 5 - (fb.rating || 0)))}
                              </span>
                            </td>
                            <td style={{ maxWidth: '400px' }}><p className="mb-0 text-secondary">{fb.message}</p></td>
                            <td className="sub-text">{fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : "Recent"}</td>
                            <td>
                              <button className="btn-icon text-danger" onClick={() => handleDeleteFeedback(fb.id)} title="Delete Feedback">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {activeTab === "staffs" && staffs.map(s => (
                          <tr key={s.id}>
                            <td>
                              <div className="u-cell">
                                <div className="avatar-small bg-primary-light text-primary">{(s.fullName || "S").charAt(0).toUpperCase()}</div>
                                <div className="fw-bold">{s.fullName || "Staff Member"}</div>
                              </div>
                            </td>
                            <td><span className={`badge ${s.role === 'Trainer' ? 'bg-success-light' : 'bg-primary-light'}`}>{s.role}</span></td>
                            <td>{s.specialty}</td>
                            <td className="fw-bold text-secondary">{s.times}</td>
                            <td className="fw-black text-primary">{s.salary}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <button className="btn-icon text-danger" onClick={() => handleDeleteStaff(s.id)} title="Remove Staff">
                                  <Trash2 size={16} />
                                </button>
                                <button className="btn-icon" onClick={() => { setEditStaffFormData(s); setIsEditStaffModalOpen(true); }}><MoreVertical size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TableCard>
              )}
            </>
          )}
        </ContentContainer>
      </MainArea>

      {/* ── ADD STAFF MODAL ── */}
      {isAddStaffModalOpen && (
        <ModalOverlay>
          <ModalContent className="animate-in">
            <div className="modal-header">
              <div className="title-area">
                <div className="icon-wrap"><Plus size={24} /></div>
                <div>
                  <h3>ADD NEW STAFF</h3>
                  <p>Register a new member to the B&Y Fitness operations team.</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setIsAddStaffModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddStaff}>
              <div className="form-grid">
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label>STAFF FULL NAME</label>
                      <div className="input-wrap">
                        <Users size={18} />
                        <input type="text" placeholder="e.g. Marcus Aurelius" value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} required />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label>STAFF ROLE</label>
                      <div className="input-wrap">
                        <Award size={18} />
                        <select value={newStaff.role} onChange={e => setNewStaff({ ...newStaff, role: e.target.value })} style={{ background: 'none', border: 'none', outline: 'none', width: '100%', fontWeight: 600 }}>
                          <option value="Trainer">Trainer</option>
                          <option value="Front Office">Front Office</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>EMAIL ADDRESS</label>
                  <div className="input-wrap">
                    <Globe size={18} />
                    <input type="email" placeholder="staff@byfitness.com" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} required />
                  </div>
                </div>

                <div className="form-group">
                  <label>LOGIN PASSWORD</label>
                  <div className="input-wrap">
                    <Globe size={18} />
                    <input type="text" placeholder="Initial Password" value={newStaff.password} onChange={e => setNewStaff({ ...newStaff, password: e.target.value })} required />
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label>PHONE NUMBER</label>
                      <div className="input-wrap">
                        <Phone size={18} />
                        <input type="text" placeholder="+91 98765 43210" value={newStaff.phone} onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })} required />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label>HOME ADDRESS</label>
                      <div className="input-wrap">
                        <MapPin size={18} />
                        <input type="text" placeholder="City, State" value={newStaff.address} onChange={e => setNewStaff({ ...newStaff, address: e.target.value })} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label>SPECIALTY / MAIN TASK</label>
                      <div className="input-wrap">
                        <Target size={18} />
                        <input type="text" placeholder="e.g. Yoga Expert or Receptionist" value={newStaff.specialty} onChange={e => setNewStaff({ ...newStaff, specialty: e.target.value })} required />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label>EXPERIENCE (Years)</label>
                      <div className="input-wrap">
                        <Award size={18} />
                        <input type="text" placeholder="e.g. 5 Years" value={newStaff.experience || ''} onChange={e => setNewStaff({ ...newStaff, experience: e.target.value })} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label>MONTHLY SALARY</label>
                      <div className="input-wrap">
                        <CreditCard size={18} />
                        <input type="text" placeholder="₹55,000" value={newStaff.salary} onChange={e => setNewStaff({ ...newStaff, salary: e.target.value })} />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label>SHIFT HOURS</label>
                      <div className="input-wrap" style={{ paddingRight: '10px' }}>
                        <Clock size={18} />
                        <input 
                          type="time" 
                          value={newStaff.times?.split(' - ')[0] || ''} 
                          onChange={e => {
                            const end = newStaff.times?.split(' - ')[1] || '';
                            setNewStaff({ ...newStaff, times: `${e.target.value} - ${end}` });
                          }}
                          style={{ flex: 1, background: 'transparent', border: 'none', color: 'inherit', outline: 'none' }}
                        />
                        <span style={{ color: 'var(--text-muted)', margin: '0 5px' }}>to</span>
                        <input 
                          type="time" 
                          value={newStaff.times?.split(' - ')[1] || ''} 
                          onChange={e => {
                            const start = newStaff.times?.split(' - ')[0] || '';
                            setNewStaff({ ...newStaff, times: `${start} - ${e.target.value}` });
                          }}
                          style={{ flex: 1, background: 'transparent', border: 'none', color: 'inherit', outline: 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setIsAddStaffModalOpen(false)}>CANCEL</button>
                <button type="submit" className="submit-btn">ENLIST STAFF</button>
              </div>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* ── EDIT STAFF MODAL ── */}
      {isEditStaffModalOpen && (
        <ModalOverlay>
          <ModalContent className="animate-in">
            <div className="modal-header">
              <div className="title-area">
                <div className="icon-wrap"><Users size={24} /></div>
                <div>
                  <h3>EDIT STAFF</h3>
                  <p>Update details for {editStaffFormData.fullName || "Staff Member"}.</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setIsEditStaffModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleEditStaffSubmit}>
              <div className="form-grid">
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label>STAFF FULL NAME</label>
                      <div className="input-wrap">
                        <Users size={18} />
                        <input type="text" value={editStaffFormData.fullName || editStaffFormData.name || ""} onChange={e => setEditStaffFormData({ ...editStaffFormData, fullName: e.target.value })} required />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label>STAFF ROLE</label>
                      <div className="input-wrap">
                        <Award size={18} />
                        <select value={editStaffFormData.role || "Trainer"} onChange={e => setEditStaffFormData({ ...editStaffFormData, role: e.target.value })} style={{ background: 'none', border: 'none', outline: 'none', width: '100%', fontWeight: 600 }}>
                          <option value="Trainer">Trainer</option>
                          <option value="Front Office">Front Office</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>EMAIL ADDRESS</label>
                  <div className="input-wrap">
                    <Globe size={18} />
                    <input type="email" value={editStaffFormData.email || ""} onChange={e => setEditStaffFormData({ ...editStaffFormData, email: e.target.value })} required />
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label>PHONE NUMBER</label>
                      <div className="input-wrap">
                        <Phone size={18} />
                        <input type="text" value={editStaffFormData.phone || ""} onChange={e => setEditStaffFormData({ ...editStaffFormData, phone: e.target.value })} />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label>HOME ADDRESS</label>
                      <div className="input-wrap">
                        <MapPin size={18} />
                        <input type="text" value={editStaffFormData.address || ""} onChange={e => setEditStaffFormData({ ...editStaffFormData, address: e.target.value })} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label>SPECIALTY / MAIN TASK</label>
                      <div className="input-wrap">
                        <Target size={18} />
                        <input type="text" value={editStaffFormData.specialty || ""} onChange={e => setEditStaffFormData({ ...editStaffFormData, specialty: e.target.value })} required />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label>EXPERIENCE (Years)</label>
                      <div className="input-wrap">
                        <Award size={18} />
                        <input type="text" value={editStaffFormData.experience || ""} onChange={e => setEditStaffFormData({ ...editStaffFormData, experience: e.target.value })} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label>MONTHLY SALARY</label>
                      <div className="input-wrap">
                        <CreditCard size={18} />
                        <input type="text" value={editStaffFormData.salary || ""} onChange={e => setEditStaffFormData({ ...editStaffFormData, salary: e.target.value })} />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label>SHIFT HOURS</label>
                      <div className="input-wrap" style={{ paddingRight: '10px' }}>
                        <Clock size={18} />
                        <input 
                          type="time" 
                          value={editStaffFormData.times?.split(' - ')[0] || ''} 
                          onChange={e => {
                            const end = editStaffFormData.times?.split(' - ')[1] || '';
                            setEditStaffFormData({ ...editStaffFormData, times: `${e.target.value} - ${end}` });
                          }}
                          style={{ flex: 1, background: 'transparent', border: 'none', color: 'inherit', outline: 'none' }}
                        />
                        <span style={{ color: 'var(--text-muted)', margin: '0 5px' }}>to</span>
                        <input 
                          type="time" 
                          value={editStaffFormData.times?.split(' - ')[1] || ''} 
                          onChange={e => {
                            const start = editStaffFormData.times?.split(' - ')[0] || '';
                            setEditStaffFormData({ ...editStaffFormData, times: `${start} - ${e.target.value}` });
                          }}
                          style={{ flex: 1, background: 'transparent', border: 'none', color: 'inherit', outline: 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setIsEditStaffModalOpen(false)}>CANCEL</button>
                <button type="submit" className="submit-btn">SAVE CHANGES</button>
              </div>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* ── SETTINGS MODALS ── */}
      {isGlobalConfigOpen && (
        <ModalOverlay>
          <ModalContent className="animate-in" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <div className="title-area">
                <div className="icon-wrap"><Globe size={24} /></div>
                <div>
                  <h3>GLOBAL CONFIGURATION</h3>
                  <p>Manage system-wide gym parameters.</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setIsGlobalConfigOpen(false)}><X size={20} /></button>
            </div>
            <div className="form-grid" style={{ padding: '20px' }}>
              <div className="form-group">
                <label>GYM NAME</label>
                <div className="input-wrap">
                  <input type="text" value={globalConfig.gymName} onChange={e => setGlobalConfig({ ...globalConfig, gymName: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>ADMIN EMAIL</label>
                <div className="input-wrap">
                  <input type="email" value={globalConfig.contactEmail} onChange={e => setGlobalConfig({ ...globalConfig, contactEmail: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>MAXIMUM CAPACITY</label>
                <div className="input-wrap">
                  <input type="number" value={globalConfig.maxCapacity} onChange={e => setGlobalConfig({ ...globalConfig, maxCapacity: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setIsGlobalConfigOpen(false)}>DISCARD</button>
              <button className="submit-btn" onClick={() => { toast.success("Configuration saved successfully!"); setIsGlobalConfigOpen(false); }}>SAVE CHANGES</button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {isThemeModalOpen && (
        <ModalOverlay>
          <ModalContent className="animate-in" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <div className="title-area">
                <div className="icon-wrap"><Layout size={24} /></div>
                <div>
                  <h3>THEME CUSTOMIZATION</h3>
                  <p>Select your dashboard aesthetic.</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setIsThemeModalOpen(false)}><X size={20} /></button>
            </div>
            <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button className="submit-btn" style={{ background: '#0f172a' }} onClick={() => { setThemeName('midnight'); setIsThemeModalOpen(false); }}>MIDNIGHT SLATE</button>
              <button className="submit-btn" style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1' }} onClick={() => { setThemeName('aurora'); setIsThemeModalOpen(false); }}>AURORA LIGHT</button>
              <button className="submit-btn" style={{ background: '#38bdf8' }} onClick={() => { setThemeName('neon'); setIsThemeModalOpen(false); }}>NEON BLUE</button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {isSidebarOpen && <Overlay onClick={() => setIsSidebarOpen(false)} />}
      <AddUserModal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} onAddUser={handleAddUser} />
    </AuroraWrapper>
  );
};

// ── STYLED COMPONENTS (The "Aurora" Model) ──

const AuroraWrapper = styled.div`
  display: flex; min-height: 100vh;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow-x: hidden;
  
  --bg-color: ${props => props.theme === 'midnight' ? '#060814' : props.theme === 'neon' ? '#04060d' : '#f4f7fa'};
  --card-bg: ${props => props.theme === 'midnight' ? 'rgba(255, 255, 255, 0.03)' : props.theme === 'neon' ? 'rgba(15, 23, 42, 0.6)' : '#ffffff'};
  --text-color: ${props => props.theme === 'midnight' ? '#f8fafc' : props.theme === 'neon' ? '#e2e8f0' : '#1e293b'};
  --text-muted: ${props => props.theme === 'midnight' ? '#94a3b8' : props.theme === 'neon' ? '#64748b' : '#64748b'};
  --sidebar-bg: ${props => props.theme === 'midnight' ? 'rgba(6, 8, 20, 0.7)' : props.theme === 'neon' ? '#080c18' : '#ffffff'};
  --border-color: ${props => props.theme === 'midnight' ? 'rgba(255, 255, 255, 0.06)' : props.theme === 'neon' ? 'rgba(56, 189, 248, 0.15)' : '#e9ecef'};
  --accent-color: ${props => props.theme === 'midnight' ? '#ffc107' : props.theme === 'neon' ? '#38bdf8' : '#007bff'};
  --accent-glow: ${props => props.theme === 'midnight' ? 'rgba(255, 193, 7, 0.3)' : props.theme === 'neon' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(0, 123, 255, 0.1)'};
  --backdrop: ${props => props.theme === 'midnight' ? 'blur(20px)' : props.theme === 'neon' ? 'blur(15px)' : 'none'};
  --shadow: ${props => props.theme === 'midnight' ? '0 20px 50px rgba(0, 0, 0, 0.3)' : props.theme === 'neon' ? '0 15px 35px rgba(56, 189, 248, 0.1)' : '0 10px 30px rgba(0,0,0,0.03)'};

  background: var(--bg-color);
  color: var(--text-color);
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.theme === 'midnight' 
      ? 'radial-gradient(circle at 80% 20%, rgba(255, 193, 7, 0.05) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(0, 123, 255, 0.05) 0%, transparent 50%)' 
      : props.theme === 'neon' 
      ? 'radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.08) 0%, transparent 50%)' 
      : 'none'};
    pointer-events: none;
    z-index: 0;
  }

  @media (max-width: 992px) { flex-direction: column; }
`;

const Sidebar = styled.div`
  width: 260px; background: var(--sidebar-bg); border-right: 1px solid var(--border-color);
  backdrop-filter: var(--backdrop);
  display: flex; flex-direction: column; padding: 25px 0;
  position: sticky; top: 0; height: 100vh; z-index: 500;
  transition: all 0.3s ease;

  @media (max-width: 992px) {
    position: fixed; left: 0; transform: ${props => props.isOpen ? "translateX(0)" : "translateX(-100%)"};
    transition: transform 0.3s ease; box-shadow: 20px 0 50px rgba(0,0,0,0.1); width: 260px; height: 100%;
    background: var(--sidebar-bg);
  }

  .sidebar-header {
    padding: 0 25px; margin-bottom: 30px;
    .logo { display: flex; align-items: center; gap: 12px;
      span { font-size: 1.5rem; font-weight: 800; color: var(--text-color); }
    }
  }
`;

const NavSection = styled.div` flex: 1; display: flex; flex-direction: column; gap: 4px; padding: 0 15px; z-index: 10; `;

const NavItem = styled.div`
  display: flex; align-items: center; gap: 15px; padding: 12px 20px; border-radius: 8px;
  cursor: pointer; transition: all 0.2s ease; font-weight: 500; font-size: 0.9rem;
  color: ${props => props.active ? "var(--accent-color)" : "var(--text-muted)"};
  background: ${props => props.active ? "var(--accent-glow)" : "transparent"};

  &:hover { background: var(--accent-glow); color: var(--accent-color); }
`;

const PromoCard = styled.div`
  margin: 20px; z-index: 10;
  .promo-inner {
    background: var(--card-bg); border: 1px solid var(--border-color); backdrop-filter: var(--backdrop); border-radius: 16px; padding: 20px; text-align: center;
    .promo-icon { background: var(--accent-glow); color: var(--accent-color); width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; }
    h6 { font-weight: 700; margin-bottom: 5px; color: var(--text-color); }
    p { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 15px; .price { color: var(--accent-color); font-weight: 700; } }
    .promo-list { list-style: none; padding: 0; margin-bottom: 20px; text-align: left;
      li { font-size: 0.75rem; color: var(--text-color); margin-bottom: 8px; display: flex; align-items: center; gap: 10px;
        &::before { content: '✓'; color: var(--accent-color); font-weight: 900; }
      }
    }
    .explore-btn { width: 100%; background: var(--accent-color); color: #000; border: none; padding: 10px; border-radius: 10px; font-weight: 800; font-size: 0.85rem; cursor: pointer; }
  }
`;

const MainArea = styled.main` flex: 1; display: flex; flex-direction: column; min-width: 0; z-index: 10; `;

const Header = styled.header`
  padding: 20px 40px; background: var(--sidebar-bg); border-bottom: 1px solid var(--border-color);
  backdrop-filter: var(--backdrop);
  display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 400;
  transition: all 0.3s ease;
  @media (max-width: 768px) { padding: 15px 20px; }
  @media (max-width: 576px) {
    padding: 10px 15px;
    .header-actions {
      gap: 10px;
      .profile-chip .avatar { width: 32px; height: 32px; font-size: 0.8rem; }
    }
  }

  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    color: var(--text-color);
    cursor: pointer;
    padding: 8px;
    margin-right: 15px;
    @media (max-width: 992px) { display: block; }
  }

  .search-bar {
    background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 10px 20px;
    display: flex; align-items: center; gap: 15px; width: 400px;
    @media (max-width: 1200px) { width: 250px; }
    @media (max-width: 768px) { display: none; }
    input { background: none; border: none; outline: none; width: 100%; font-size: 0.9rem; color: var(--text-color); }
    svg { color: var(--text-muted); }
  }

  .header-actions {
    display: flex; align-items: center; gap: 15px;
    .h-btn { background: none; border: none; color: var(--text-muted); position: relative; padding: 8px; border-radius: 8px; &:hover { background: var(--card-bg); } }
    .notif-dot { position: absolute; top: 10px; right: 10px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; border: 2px solid var(--sidebar-bg); }
    .profile-chip { .avatar { width: 40px; height: 40px; background: var(--accent-color); color: #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; } }
    .mobile-toggle { display: none; @media (max-width: 992px) { display: block; background: none; border: none; color: var(--text-color); cursor: pointer; } }
  }
`;

const ContentContainer = styled.div`
  padding: 40px;
  @media (max-width: 768px) { padding: 20px; }

  .charts-row {
    display: flex;
    gap: 30px;
    @media (max-width: 1024px) {
      flex-direction: column;
    }
  }
`;

const StatsRow = styled.div` display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px; @media (max-width: 1200px) { grid-template-columns: repeat(2, 1fr); } @media (max-width: 768px) { grid-template-columns: 1fr; } `;

const StatBox = styled.div`
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  padding: 28px;
  backdrop-filter: var(--backdrop);
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  &:hover {
    transform: translateY(-6px);
    border-color: ${props => props.color || "var(--accent-color)"}4d;
    box-shadow: 0 20px 40px -15px ${props => props.color || "var(--accent-color)"}25, var(--shadow);
    
    .icon-badge {
      background: ${props => props.color || "var(--accent-color)"};
      color: #000;
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 0 20px ${props => props.color || "var(--accent-color)"}80;
    }
    
    .card-glow {
      opacity: 0.15;
    }
  }

  .card-glow {
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, ${props => props.color || "var(--accent-color)"} 0%, transparent 70%);
    opacity: 0.05;
    pointer-events: none;
    transition: opacity 0.4s ease;
  }

  .lab {
    font-size: 0.85rem;
    color: var(--text-muted);
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 15px;
  }

  .val-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .val {
    font-size: 2.4rem;
    font-weight: 900;
    color: var(--text-color);
    letter-spacing: -1px;
  }

  .icon-badge {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.color || "var(--accent-color)"}18;
    border: 1px solid ${props => props.color || "var(--accent-color)"}33;
    color: ${props => props.color || "var(--accent-color)"};
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .footer-text {
    font-size: 0.75rem;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 4px;
    
    span {
      color: var(--text-color);
      font-weight: 700;
      cursor: pointer;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 1.5px;
        background: ${props => props.color || "var(--accent-color)"};
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }
      
      &:hover::after {
        transform: scaleX(1);
      }
    }
  }
`;

const ChartCard = styled.div`
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 28px;
  padding: 30px;
  backdrop-filter: var(--backdrop);
  box-shadow: var(--shadow);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 30px 60px -25px rgba(0, 0, 0, 0.4), var(--shadow);
  }

  &.flex-2 { flex: 2; }
  &.flex-1 { flex: 1; }
  @media (max-width: 768px) { padding: 24px; border-radius: 20px; }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    @media (max-width: 768px) { flex-direction: column; align-items: flex-start; gap: 15px; }
    
    h5 {
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--text-color);
      margin: 0;
      letter-spacing: -0.5px;
    }
    
    .tabs {
      display: flex;
      gap: 20px;
      button {
        background: none;
        border: none;
        color: var(--text-muted);
        font-weight: 700;
        font-size: 0.85rem;
        padding-bottom: 10px;
        position: relative;
        cursor: pointer;
        
        &.active {
          color: var(--accent-color);
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2.5px;
            background: var(--accent-color);
            border-radius: 2px;
          }
        }
      }
    }
    
    .legend {
      display: flex;
      gap: 20px;
      span {
        font-size: 0.75rem;
        color: var(--text-muted);
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        
        &::before {
          content: '';
          width: 12px;
          height: 3px;
          border-radius: 2px;
        }
        &.actual::before { background: var(--accent-color); }
        &.projected::before { background: #28a745; border-top: 1.5px dashed #28a745; }
      }
    }
    
    .dropdown {
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border-color);
      color: var(--text-color);
      padding: 8px 14px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        background: rgba(255,255,255,0.08);
        border-color: var(--accent-color);
      }
    }
  }

  .main-chart {
    position: relative;
    overflow-x: auto;
    
    svg path {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: drawPath 2.5s ease-in-out forwards;
    }
    
    @keyframes drawPath {
      to { stroke-dashoffset: 0; }
    }
  }
  
  .chart-footer { 
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    border-top: 1px solid var(--border-color);
    padding-top: 20px;
    @media (max-width: 768px) { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    
    .f-stat {
      span {
        display: block;
        font-size: 1.4rem;
        font-weight: 900;
        color: var(--text-color);
      }
      small {
        color: var(--text-muted);
        font-size: 0.75rem;
        font-weight: 600;
      }
    }
  }

  .bar-chart {
    height: 200px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    
    .bar-group {
      width: 11%;
      height: 100%;
      display: flex;
      align-items: flex-end;
      
      .bar {
        width: 100%;
        background: linear-gradient(180deg, var(--accent-color) 0%, rgba(255,193,7,0.15) 100%);
        border-radius: 8px 8px 0 0;
        animation: scaleUpBar 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        transform-origin: bottom;
        transform: scaleY(0);
        transition: all 0.3s ease;
        
        &:hover {
          filter: brightness(1.2) drop-shadow(0 0 10px var(--accent-color));
          transform: scaleY(1.05);
        }
      }
      
      &:nth-child(1) .bar { animation-delay: 0.05s; }
      &:nth-child(2) .bar { animation-delay: 0.1s; }
      &:nth-child(3) .bar { animation-delay: 0.15s; }
      &:nth-child(4) .bar { animation-delay: 0.2s; }
      &:nth-child(5) .bar { animation-delay: 0.25s; }
      &:nth-child(6) .bar { animation-delay: 0.3s; }
    }
  }
  
  @keyframes scaleUpBar {
    to { transform: scaleY(1); }
  }
`;

const PayrollContainer = styled.div`
  display: flex; gap: 30px; animation: fadeIn 0.5s ease;
  position: relative;
  overflow: hidden;
  flex-direction: column;
  width: 100%;

  .payroll-content-wrapper {
    display: flex;
    gap: 30px;
    width: 100%;
    @media (max-width: 1200px) {
      flex-direction: column;
    }
  }

  .payroll-main {
    flex: 1; display: flex; flex-direction: column; gap: 30px; min-width: 0;
    .payroll-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
      @media (max-width: 768px) { flex-direction: column; align-items: flex-start; gap: 15px; }
      .welcome { font-size: 1.8rem; font-weight: 900; margin: 0; color: var(--text-color); @media (max-width: 768px) { font-size: 1.4rem; } }
      .pay-run-status { 
        display: flex; align-items: center; gap: 15px; background: var(--card-bg); padding: 10px 20px; border-radius: 12px; border: 1px solid var(--border-color);
        span { font-size: 0.85rem; font-weight: 700; color: var(--text-muted); }
        .badge-approved { background: rgba(40, 167, 69, 0.1); color: #28a745; padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; }
      }
    }

    .payroll-stepper {
      display: flex; align-items: center; gap: 15px; margin-bottom: 40px; background: var(--card-bg); border: 1px solid var(--border-color); padding: 15px 30px; border-radius: 20px;
      @media (max-width: 768px) { overflow-x: auto; padding: 15px; &::-webkit-scrollbar { display: none; } }
      .step { 
        @media (max-width: 768px) { white-space: nowrap; }        display: flex; align-items: center; gap: 10px; opacity: 0.4;
        &.active { opacity: 1; .dot { background: var(--accent-color); color: #000; border-color: var(--accent-color); } span { color: var(--text-color); font-weight: 800; } }
        .dot { width: 24px; height: 24px; border: 2px solid var(--border-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 900; color: var(--text-color); }
        span { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); }
      }
      .connector { flex: 1; height: 2px; background: var(--border-color); &.active { background: var(--accent-color); } }
    }
  }

  .hero-card {
    background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 24px; padding: 35px;
    box-shadow: var(--shadow);
    backdrop-filter: var(--backdrop);
    @media (max-width: 768px) { padding: 20px; }
    .hero-stats {
      display: flex; align-items: center; justify-content: space-between;
      @media (max-width: 992px) { flex-direction: column; gap: 25px; align-items: flex-start; }
      .stat-group {
        label { display: block; font-size: 0.7rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1px; margin-bottom: 8px; }
        .amount-row { 
          display: flex; align-items: center; gap: 15px;
          .amount { font-size: 2.2rem; font-weight: 900; color: var(--text-color); @media (max-width: 768px) { font-size: 1.8rem; } }
          .trend-badge { 
            padding: 4px 10px; border-radius: 8px; font-size: 0.7rem; font-weight: 800; display: flex; align-items: center; gap: 4px;
            &.positive { background: rgba(40, 167, 69, 0.15); color: #28a745; }
          }
        }
        .date, .count { font-size: 1.4rem; font-weight: 800; color: var(--text-color); }
      }
      .stat-divider { width: 1px; height: 50px; background: var(--border-color); @media (max-width: 992px) { display: none; } }
      .btn-black { background: var(--accent-color); color: #000; border: none; padding: 15px 30px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; @media (max-width: 768px) { width: 100%; } &:hover { transform: scale(1.05); box-shadow: 0 10px 25px var(--accent-glow); } }
    }
    .hero-note { margin-top: 25px; padding-top: 20px; border-top: 1px solid var(--border-color); display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
  }

  .payroll-grid {
    display: grid; grid-template-columns: 2fr 1fr; gap: 25px;
    @media (max-width: 1024px) { grid-template-columns: 1fr; }
    .grid-card {
      background: var(--card-bg); border: 1px solid var(--border-color); backdrop-filter: var(--backdrop); border-radius: 24px; padding: 25px;
      h5 { font-weight: 800; margin: 0 0 20px 0; font-size: 0.9rem; color: var(--text-color); }
      .link { color: var(--accent-color); font-weight: 700; font-size: 0.8rem; cursor: pointer; &:hover { text-decoration: underline; } }
    }
    .deduction-row {
      display: flex; justify-content: space-between; margin-top: 20px;
      @media (max-width: 768px) { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 20px; }
      .deduction-item {
        text-align: center; flex: 1;
        .icon-circle { 
          width: 40px; height: 40px; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; color: var(--text-muted);
          &.gold { background: var(--accent-glow); color: var(--accent-color); }
          &.red { background: rgba(220, 38, 38, 0.1); color: #dc2626; }
        }
        label { display: block; font-size: 0.65rem; font-weight: 800; color: var(--text-muted); margin-bottom: 5px; }
        .val { font-size: 0.95rem; font-weight: 800; color: var(--text-color); margin-bottom: 5px; }
      }
    }
    .summary-body {
      .big-count { font-size: 2.5rem; font-weight: 900; color: var(--text-color); margin: 10px 0; @media (max-width: 768px) { font-size: 1.8rem; } }
      label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); }
    }
  }

  .payroll-sidebar {
    width: 320px; background: var(--sidebar-bg); border: 1px solid var(--border-color); backdrop-filter: var(--backdrop); border-radius: 24px; padding: 25px;
    @media (max-width: 1200px) { width: 100%; }
    h5 { font-weight: 800; margin-bottom: 25px; color: var(--text-color); }
    .task-list {
      display: flex; flex-direction: column; gap: 15px;
      .task-item {
        background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px; padding: 18px; display: flex; justify-content: space-between; align-items: center;
        .task-info {
          h6 { margin: 0; font-weight: 800; font-size: 0.85rem; color: var(--text-color); }
          p { margin: 4px 0 0; font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
        }
        .btn-outline { background: var(--card-bg); border: 1px solid var(--border-color); color: var(--text-color); font-weight: 800; font-size: 0.7rem; padding: 6px 12px; border-radius: 8px; cursor: pointer; &:hover { background: var(--accent-color); color: #000; border-color: var(--accent-color); } }
      }
    }
  }

  .payrun-list {
    display: flex; flex-direction: column; gap: 15px;
    .payrun-card {
      background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 20px; padding: 25px;
      display: grid; grid-template-columns: 2fr 2fr 1fr 1fr; align-items: center; gap: 20px;
      @media (max-width: 992px) { grid-template-columns: 1fr 1fr; }
      @media (max-width: 500px) { grid-template-columns: 1fr; gap: 15px; }
      transition: all 0.2s; &:hover { border-color: var(--accent-color); transform: translateY(-2px); box-shadow: var(--shadow); }
      h3 { margin: 0; font-size: 1.1rem; font-weight: 800; color: var(--text-color); }
      p { margin: 4px 0 0; font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }
      .run-stats { display: flex; gap: 30px; label { display: block; font-size: 0.6rem; font-weight: 800; color: var(--text-muted); margin-bottom: 4px; } strong { font-size: 0.95rem; font-weight: 800; color: var(--text-color); } }
    }
  }

  .attendance-grid, .tax-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 25px;
    @media (max-width: 992px) { grid-template-columns: 1fr; }
  }

  .request-list, .summary-list, .tax-list-mini, .form-downloads {
    display: flex; flex-direction: column; gap: 12px; margin-top: 20px;
  }

  .request-item {
    background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 16px; padding: 15px; display: flex; justify-content: space-between; align-items: center;
    @media (max-width: 576px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
      .req-details { text-align: left; }
      .req-actions { width: 100%; display: flex; justify-content: flex-end; gap: 10px; }
    }
    .req-profile { display: flex; align-items: center; gap: 12px; strong { font-size: 0.85rem; color: var(--text-color); } p { font-size: 0.7rem; color: var(--text-muted); margin: 0; } }
    .req-details { text-align: right; .type { display: block; font-size: 0.75rem; font-weight: 800; color: var(--text-color); } .dates { font-size: 0.7rem; color: var(--text-muted); } }
  }

  .tax-item-mini {
    display: flex; align-items: center; gap: 15px; background: var(--card-bg); border: 1px solid var(--border-color); padding: 15px; border-radius: 16px;
    .tax-icon { width: 36px; height: 36px; background: var(--accent-glow); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--accent-color); }
    .tax-info { flex: 1; strong { font-size: 0.85rem; color: var(--text-color); } p { font-size: 0.7rem; color: var(--text-muted); margin: 0; } }
  }

  .form-item {
    display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px;
    span { font-size: 0.85rem; font-weight: 600; color: var(--text-color); }
  }

  .btn-link { background: none; border: none; color: var(--accent-color); font-weight: 800; font-size: 0.75rem; cursor: pointer; &.disabled { color: var(--text-muted); cursor: default; } }

  .detail-header {
    display: flex; justify-content: space-between; align-items: center;
    @media (max-width: 992px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
      width: 100%;
      .d-flex {
        width: 100%;
        flex-wrap: wrap;
        gap: 10px !important;
      }
    }
  }

  .pay-slip-drawer {
    @media (max-width: 768px) {
      width: 100% !important;
      padding: 20px !important;
      gap: 20px !important;
    }
  }
`;

const PayrollSubNav = styled.div`
  position: relative; z-index: 10;
  background: var(--sidebar-bg); border-bottom: 1px solid var(--border-color); margin: -20px -24px 30px -24px; padding: 0 24px;
  backdrop-filter: var(--backdrop);
  transition: all 0.3s ease;
  @media (max-width: 768px) { margin: -20px -20px 20px -20px; padding: 0 20px; overflow-x: auto; &::-webkit-scrollbar { display: none; } }
  .nav-items {
    display: flex; gap: 30px;
    @media (max-width: 768px) { width: max-content; gap: 20px; }
    button {
      background: none; border: none; padding: 20px 0; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); cursor: pointer; position: relative;
      @media (max-width: 768px) { padding: 15px 0; }
      &.active { color: var(--text-color); &::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--accent-color); border-radius: 3px 3px 0 0; } }
      &:hover { color: var(--text-color); }
    }
  }
`;

const TableCard = styled.div`
  background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 20px; padding: 30px;
  backdrop-filter: var(--backdrop);
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  @media (max-width: 768px) { padding: 20px; border-radius: 16px; }
  .table-header { 
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; 
    @media (max-width: 768px) { flex-direction: column; align-items: flex-start; gap: 20px; }
    h2 { font-weight: 900; color: var(--text-color); margin: 0; small { font-size: 0.6rem; color: var(--accent-color); letter-spacing: 2px; display: block; } } 
    .refresh-btn { background: var(--card-bg); border: 1px solid var(--border-color); color: var(--text-muted); padding: 10px 20px; border-radius: 10px; font-size: 0.8rem; font-weight: 700; cursor: pointer; &:hover { color: var(--text-color); } }
    .add-btn { background: var(--accent-color); color: #000; border: none; padding: 10px 20px; border-radius: 10px; font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; gap: 8px; cursor: pointer; @media (max-width: 768px) { width: 100%; justify-content: center; } }
    .filter-btn { background: var(--card-bg); border: 2px solid var(--border-color); color: var(--text-muted); padding: 8px 16px; border-radius: 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; &:hover { color: var(--text-color); border-color: var(--accent-color); } &.active { background: var(--accent-glow); border-color: var(--accent-color); color: var(--accent-color); font-weight: 700; } }
  }
  .table-wrapper { overflow-x: auto; &::-webkit-scrollbar { height: 6px; } &::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; } }
  .table { 
    width: 100%; 
    --bs-table-bg: transparent !important;
    --bs-table-color: var(--text-color) !important;
    background: transparent !important;
    @media (max-width: 992px) { min-width: 800px; } 
    th { background: var(--card-bg); color: var(--text-muted); font-size: 0.75rem; font-weight: 800; padding: 15px; border: none; } 
    td { padding: 20px 15px; border-bottom: 1px solid var(--border-color); color: var(--text-color); vertical-align: middle; } 
  }
  .u-cell { 
    display: flex; align-items: center; gap: 12px; 
    .avatar-small { width: 32px; height: 32px; background: var(--accent-glow); color: var(--accent-color); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; } 
    .u-name { font-weight: 700; font-size: 0.9rem; color: var(--text-color); } 
    .u-email { font-size: 0.7rem; color: var(--text-muted); } 
  }
  .badge { padding: 6px 12px; border-radius: 8px; font-size: 0.7rem; font-weight: 700; border: none; }
  .bg-success-light { background: rgba(40, 167, 69, 0.1); color: #28a745; } 
  .bg-danger-light { background: rgba(220, 38, 38, 0.1); color: #dc2626; } 
  .bg-primary-light { background: var(--accent-glow); color: var(--accent-color); }
  .sync-badge { color: var(--accent-color); font-weight: 900; font-size: 0.7rem; }
`;

const LoaderArea = styled.div` display: flex; align-items: center; justify-content: center; height: 300px; .spinner { width: 40px; height: 40px; border: 4px solid var(--border-color); border-top: 4px solid var(--accent-color); border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } } `;

const ModalOverlay = styled.div`
  position: fixed; inset: 0; background: rgba(6, 8, 20, 0.85); backdrop-filter: blur(15px);
  display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;
  animation: fadeIn 0.3s ease;
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

const ModalContent = styled.div`
  background: var(--bg-color); border: 1px solid var(--border-color); backdrop-filter: var(--backdrop);
  color: var(--text-color);
  width: 100%; max-width: 600px; border-radius: 32px; padding: 40px;
  box-shadow: var(--shadow); position: relative;
  max-height: 90vh; overflow-y: auto;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 25px;
    border-radius: 24px;
  }
  
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
  &::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  &.animate-in { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  
  .modal-header {
    display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;
    @media (max-width: 768px) {
      margin-bottom: 25px;
    }
    .title-area { 
      display: flex; gap: 20px; 
      @media (max-width: 768px) {
        gap: 12px;
      }
      .icon-wrap { background: var(--accent-glow); color: var(--accent-color); padding: 12px; border-radius: 16px; box-shadow: var(--shadow); }
      h3 { margin: 0; font-weight: 900; letter-spacing: -1px; font-size: 1.5rem; color: var(--text-color); }
      p { margin: 5px 0 0; font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }
    }
    .close-btn { background: var(--card-bg); border: 1px solid var(--border-color); color: var(--text-muted); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; &:hover { background: var(--border-color); color: var(--text-color); } }
  }

  .form-group {
    margin-bottom: 25px;
    label { display: block; font-size: 0.7rem; font-weight: 800; color: var(--text-muted); letter-spacing: 1px; margin-bottom: 10px; }
    .input-wrap {
      display: flex; align-items: center; gap: 12px; background: var(--bg-color); border: 1.5px solid var(--border-color); border-radius: 16px; padding: 4px 18px; transition: all 0.2s;
      svg { color: var(--text-muted); transition: color 0.2s; }
      input { width: 100%; background: none; border: none; outline: none; padding: 12px 0; font-weight: 600; font-size: 0.95rem; color: var(--text-color); &::placeholder { color: var(--text-muted); } }
      &:focus-within { border-color: var(--accent-color); box-shadow: 0 0 0 4px var(--accent-glow); svg { color: var(--accent-color); } }
    }
  }

  .modal-footer {
    display: flex; gap: 20px; margin-top: 40px;
    @media (max-width: 600px) { flex-direction: column-reverse; gap: 10px; }
    button { flex: 1; padding: 16px; border-radius: 16px; font-weight: 800; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
    .cancel-btn { background: var(--card-bg); color: var(--text-muted); border: 1px solid var(--border-color); &:hover { background: var(--border-color); color: var(--text-color); } }
    .submit-btn { background: var(--accent-color); color: #000; border: none; font-weight: 800; &:hover { transform: translateY(-3px); box-shadow: 0 15px 30px var(--accent-glow); } }
  }

  .biometric-enroll-pad {
    background: var(--card-bg); border: 2.5px dashed var(--border-color); border-radius: 20px; padding: 25px; cursor: pointer; transition: all 0.3s; margin-top: 10px;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; position: relative; overflow: hidden;
    .pad-content { display: flex; align-items: center; gap: 15px; color: var(--text-muted); font-weight: 800; font-size: 0.85rem; }
    &:hover { border-color: var(--accent-color); background: var(--accent-glow); .pad-content { color: var(--accent-color); } }
    &.scanning { border-color: var(--accent-color); background: var(--accent-glow); .pad-content { color: var(--accent-color); animation: pulse 1s infinite; } }
    &.success { border-color: #28a745; background: rgba(40, 167, 69, 0.05); border-style: solid; .pad-content { color: #28a745; } }

    .progress-bar { position: absolute; bottom: 0; left: 0; width: 100%; height: 4px; background: var(--border-color); .fill { height: 100%; background: var(--accent-color); transition: width 0.1s linear; } }
  }
  @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
    .detail-header {
      display: flex; justify-content: space-between; align-items: center;
      .back-btn { background: none; border: none; color: var(--accent-color); font-weight: 800; font-size: 0.8rem; display: flex; align-items: center; gap: 8px; cursor: pointer; &:hover { gap: 12px; } }
      h2 { font-weight: 900; color: var(--text-color); margin: 0; small { font-size: 0.6rem; color: var(--text-muted); letter-spacing: 2px; display: block; } }
      
      .search-box-mini {
        background: var(--card-bg); border: 1.5px solid var(--border-color); border-radius: 10px; padding: 8px 15px; display: flex; align-items: center; gap: 10px;
        input { border: none; outline: none; font-size: 0.8rem; font-weight: 600; width: 150px; background: none; color: var(--text-color); }
        svg { color: var(--text-muted); }
        &:focus-within { border-color: var(--accent-color); }
      }

      .role-filter-select { background: var(--card-bg); border: 1.5px solid var(--border-color); border-radius: 10px; padding: 8px 12px; font-size: 0.75rem; font-weight: 700; color: var(--text-color); outline: none; cursor: pointer; &:hover { border-color: var(--accent-color); } }

      .export-btn { 
        background: var(--card-bg); border: 1.5px solid var(--border-color); padding: 10px 18px; border-radius: 12px; font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; gap: 8px; cursor: pointer; color: var(--text-color);
        transition: all 0.2s; &:hover { border-color: var(--accent-color); color: var(--accent-color); transform: translateY(-2px); }
        &.pdf { border-color: rgba(220, 38, 38, 0.2); color: #dc2626; &:hover { background: rgba(220, 38, 38, 0.1); } }
      }
    }

    .interactive-table {
      tr { cursor: pointer; transition: all 0.2s; &:hover { background: var(--accent-glow) !important; transform: scale(1.005); } }
    }

    .drawer-overlay { position: fixed; inset: 0; background: rgba(6, 8, 20, 0.6); backdrop-filter: blur(8px); z-index: 1000; animation: fadeIn 0.3s ease; }
    .pay-slip-drawer {
      position: fixed; top: 0; right: 0; height: 100vh; width: 450px; background: var(--sidebar-bg); border-left: 1px solid var(--border-color); z-index: 1100; padding: 40px; box-shadow: var(--shadow);
      display: flex; flex-direction: column; gap: 30px; color: var(--text-color);
      @media (max-width: 500px) { width: 100%; }
      &.animate-slide-left { animation: slideLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }

      .drawer-header {
        display: flex; justify-content: space-between; align-items: center;
        h3 { margin: 0; font-weight: 900; letter-spacing: -0.5px; }
        button { background: var(--card-bg); border: 1px solid var(--border-color); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); &:hover { background: var(--border-color); color: var(--text-color); } }
      }

      .slip-profile {
        display: flex; align-items: center; gap: 20px; background: var(--card-bg); border: 1px solid var(--border-color); padding: 25px; border-radius: 24px;
        .big-avatar { width: 64px; height: 64px; background: var(--accent-glow); color: var(--accent-color); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 900; }
        h4 { margin: 0; font-weight: 800; font-size: 1.2rem; color: var(--text-color); }
        p { margin: 5px 0 0; font-size: 0.8rem; color: #64748b; font-weight: 600; }
      }

      .slip-summary-cards {
        display: grid; grid-template-columns: 1fr 1fr; gap: 15px;
        .s-card {
          padding: 20px; border-radius: 20px; border: 1px solid #e2e8f0;
          label { display: block; font-size: 0.65rem; font-weight: 800; letter-spacing: 1px; margin-bottom: 10px; opacity: 0.6; }
          .val { font-size: 1.3rem; font-weight: 900; }
          &.green { background: #f0fdf4; border-color: #dcfce7; .val { color: #15803d; } }
          &.red { background: #fef2f2; border-color: #fee2e2; .val { color: #b91c1c; } }
        }
      }

      .slip-section {
        border-bottom: 1px dashed #e2e8f0; padding-bottom: 20px;
        h5 { font-size: 0.75rem; font-weight: 800; color: #94a3b8; letter-spacing: 1px; margin-bottom: 15px; }
        .line-item { display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 600; color: #1e293b; margin-bottom: 10px; span:last-child { font-weight: 800; } }
      }

      .slip-total {
        margin-top: auto; background: #1e293b; color: #fff; padding: 30px; border-radius: 24px;
        .total-row {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;
          span:first-child { font-size: 0.8rem; font-weight: 700; opacity: 0.7; }
          .final-val { font-size: 1.8rem; font-weight: 900; }
        }
        p { margin: 0; font-size: 0.75rem; opacity: 0.6; font-weight: 500; }
      }

      .download-btn-full { width: 100%; padding: 20px; background: #007bff; color: #fff; border: none; border-radius: 16px; font-weight: 800; box-shadow: 0 10px 20px rgba(0, 123, 255, 0.2); &:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(0, 123, 255, 0.3); } }
    }
  }
`;

const Overlay = styled.div` position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 450; `;

const SettingsDropdown = styled.div`
  position: absolute;
  top: 50px;
  right: 120px;
  width: 260px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  z-index: 1000;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;

  @media (max-width: 768px) {
    right: 20px;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .sd-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    background: rgba(248, 250, 252, 0.8);
    
    h4 { margin: 0; font-size: 0.95rem; font-weight: 800; color: #1e293b; }
    .close-btn { 
      background: none; border: none; cursor: pointer; color: #64748b; padding: 4px; border-radius: 50%;
      &:hover { background: rgba(0,0,0,0.05); color: #0f172a; }
    }
  }

  .sd-body {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;

    .sd-item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      text-align: left;
      padding: 12px 16px;
      background: transparent;
      border: none;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #f1f5f9;
        color: #0f172a;
        transform: translateX(4px);
      }

      &.danger {
        color: #ef4444;
        &:hover { background: #fef2f2; }
      }
    }

    .sd-divider {
      height: 1px;
      background: rgba(0,0,0,0.05);
      margin: 6px 0;
    }
  }
`;

export default AdminDashboard;
