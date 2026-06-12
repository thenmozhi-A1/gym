import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { 
  Fingerprint, 
  ShieldCheck, 
  ShieldAlert, 
  Calendar, 
  CreditCard, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Download, 
  ChevronRight,
  LogOut,
  User,
  Zap,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { generatePayslipPDF } from "./utils/pdfTemplates";

import axiosInstance from "./api/axiosInstance";
import log from "./utils/logger";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [scanState, setScanState] = useState("idle"); // idle, scanning, success, error
  const [scanProgress, setScanProgress] = useState(0);
  const [employeeData, setEmployeeData] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [activeView, setActiveView] = useState("home"); // home, salary, attendance

  // Fetch real data for the specific staff member from the database
  useEffect(() => {
    const fetchEmployeeData = async () => {
      const email = localStorage.getItem('userEmail');
      // Relaxed check: ProtectedRoute already verified auth state
      try {
        const res = await axiosInstance.get("/staffs/me");
        const me = res.data;
        
        if (me) {
          const cleanSalary = typeof me.salary === 'string' 
            ? parseInt(me.salary.replace(/[^0-9]/g, '')) 
            : (me.salary || 0);

          let attendanceLog = [];
          try {
            const attRes = await axiosInstance.get(`/attendance/staff/${me.id}`);
            attendanceLog = attRes.data || [];
            setAttendance(attendanceLog);
          } catch(e) {
            console.error("Failed to fetch staff attendance", e);
          }

          const daysWorked = attendanceLog.filter(log => log.status === "PRESENT").length;
          const leaves = attendanceLog.filter(log => log.status === "LEAVE").length;

          setEmployeeData({
            ...me,
            salary: cleanSalary,
            attendance: attendanceLog,
            daysWorked,
            leaves,
            permissions: me.permissions || 0
          });
        }
      } catch (err) {
        log.error("Failed to sync employee data:", err);
      }
    };

    fetchEmployeeData();
  }, [navigate]);

  const handleFingerprintScan = () => {
    setScanState("scanning");
    setScanProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setScanState("success");
        setTimeout(() => setIsVerified(true), 1000);
      }
    }, 50);
  };

  const calculateNetPay = () => {
    if (!employeeData) return 0;
    const gross = employeeData.salary;
    const daily = gross / 30;
    const leaveDed = daily * employeeData.leaves;
    const permDed = (daily / 8) * employeeData.permissions;
    const statutory = 2450; // PF + TDS
    return Math.floor(gross - leaveDed - permDed - statutory);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDownloadSlip = () => {
    if (!employeeData) return;
    const netPay = calculateNetPay();
    generatePayslipPDF(employeeData, netPay);
  };

  const fetchAttendance = async () => {
    if (!employeeData?.id) return;
    try {
      const attRes = await axiosInstance.get(`/attendance/staff/${employeeData.id}`);
      setAttendance(attRes.data || []);
    } catch(e) {}
  };

  const handleCheckIn = async () => {
    try {
      await axiosInstance.post(`/attendance/staff/${employeeData?.id}`, {});
      toast.success('Checked in successfully!');
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to check in');
    }
  };

  const activeCheckin = attendance.find(c => !c.checkOutTime && !c.exit && String(c.attendanceDate || c.date) === new Date().toISOString().split('T')[0]);

  const handleCheckOut = async () => {
    if (!activeCheckin) return;
    try {
      await axiosInstance.put(`/attendance/${activeCheckin.id}/checkout`, {});
      toast.success('Checked out successfully!');
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to check out');
    }
  };

  // Removed redundant secondary lock screen to show dashboard content immediately
  // if (!isVerified) { ... }

  return (
    <DashboardContainer>
      <div className="sidebar">
        <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <img src="/logo.png" alt="B&Y Fitness" style={{ height: '60px', objectFit: 'contain' }} />
        </div>
        <nav>
          <button className={activeView === 'home' ? 'active' : ''} onClick={() => setActiveView('home')}>
            <Calendar size={20} /> Dashboard
          </button>
          <button className={activeView === 'salary' ? 'active' : ''} onClick={() => setActiveView('salary')}>
            <CreditCard size={20} /> My Salary
          </button>
          <button className={activeView === 'attendance' ? 'active' : ''} onClick={() => setActiveView('attendance')}>
            <Clock size={20} /> Attendance
          </button>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} /> Logout
        </button>
      </div>

      <MainArea>
        <header className="main-header">
          <div className="welcome">
            <h1>Welcome, {employeeData?.fullName || employeeData?.name || "Employee"}</h1>
            <p>{employeeData?.role || "Staff Member"} • Elite Fitness Team</p>
          </div>
          <div className="user-profile" style={{ display: 'flex', alignItems: 'center' }}>
            {activeCheckin ? (
              <button onClick={handleCheckOut} style={{ marginRight: '15px', padding: '8px 16px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={16} /> Check-out Now
              </button>
            ) : (
              <button onClick={handleCheckIn} style={{ marginRight: '15px', padding: '8px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={16} /> Check-in Now
              </button>
            )}
            <div className="avatar">{(employeeData?.fullName || employeeData?.name || "E").charAt(0).toUpperCase()}</div>
          </div>
        </header>

        {activeView === 'home' && (
          <div className="view-content animate-in">
            <div className="stats-row">
              <StatCard color="#007bff">
                <div className="label">Days Worked</div>
                <div className="value">{employeeData?.daysWorked || 0}</div>
                <div className="sub">Current Month</div>
              </StatCard>
              <StatCard color="#28a745">
                <div className="label">Est. Net Payable</div>
                <div className="value">₹{calculateNetPay().toLocaleString()}</div>
                <div className="sub">Due on May 31</div>
              </StatCard>
              <StatCard color="#ef4444">
                <div className="label">Total Leaves</div>
                <div className="value">{employeeData?.leaves || 0}</div>
                <div className="sub">This Month</div>
              </StatCard>
            </div>

            <div className="grid-2">
              <div className="card">
                <h3>Recent Attendance</h3>
                <div className="attendance-list">
                {[...attendance].reverse().map((log, i) => (
                  <div key={i} className="log-item">
                    <div className="date">{log.attendanceDate || log.date}</div>
                    <div className="details">
                      <span className={`status ${(log.status || 'PRESENT').toLowerCase()}`}>{log.status || 'PRESENT'}</span>
                      <span className="time">{log.checkInTime || log.checkIn || '—'} - {log.checkOutTime || log.checkOut || '—'}</span>
                    </div>
                  </div>
                ))}
                {attendance.length === 0 && <p style={{ color: '#64748b' }}>No attendance records found.</p>}
              </div>
                <button className="view-all" onClick={() => setActiveView('attendance')}>View Detailed Logs <ChevronRight size={14} /></button>
              </div>
              <div className="card">
                <h3>Salary Breakdown</h3>
                <div className="salary-mini">
                  <div className="row"><span>Gross Salary</span> <strong>₹{employeeData?.salary.toLocaleString()}</strong></div>
                  <div className="row text-danger"><span>Deductions</span> <strong>-₹{(employeeData?.salary - calculateNetPay()).toLocaleString()}</strong></div>
                  <div className="divider" />
                  <div className="row total"><span>Net Payable</span> <strong>₹{calculateNetPay().toLocaleString()}</strong></div>
                </div>
                <button className="view-all" onClick={() => setActiveView('salary')}>View Pay Slips <ChevronRight size={14} /></button>
              </div>
            </div>
          </div>
        )}

        {activeView === 'salary' && (
          <div className="view-content animate-in">
            <div className="salary-header-card">
              <div className="main-info">
                <label>CURRENT MONTH NET PAY</label>
                <h2>₹{calculateNetPay().toLocaleString()}</h2>
                <div className="status-badge">Payment Processing</div>
              </div>
              <button className="download-btn" onClick={handleDownloadSlip}><Download size={18} /> Download Slip</button>
            </div>

            <div className="grid-2 mt-4">
              <div className="card">
                <h3>Earnings</h3>
                <div className="list">
                  <div className="list-item"><span>Basic Salary</span> <strong>₹{employeeData?.salary.toLocaleString()}</strong></div>
                  <div className="list-item"><span>HRA</span> <strong>₹0</strong></div>
                  <div className="list-item"><span>Incentives</span> <strong>₹0</strong></div>
                </div>
              </div>
              <div className="card">
                <h3>Deductions</h3>
                <div className="list">
                  <div className="list-item">
                    <span>Leaves ({employeeData?.leaves} days)</span> 
                    <strong className="text-danger">-₹{Math.floor((employeeData?.salary / 30) * employeeData?.leaves).toLocaleString()}</strong>
                  </div>
                  <div className="list-item">
                    <span>Permissions ({employeeData?.permissions} hr)</span> 
                    <strong className="text-danger">-₹{Math.floor((employeeData?.salary / 30 / 8) * employeeData?.permissions).toLocaleString()}</strong>
                  </div>
                  <div className="list-item"><span>Provident Fund</span> <strong>-₹1,800</strong></div>
                  <div className="list-item"><span>TDS / Taxes</span> <strong>-₹650</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'attendance' && (
          <div className="view-content animate-in">
            <div className="card">
              <div className="card-header-flex">
                <h3>Attendance History</h3>
                <div className="filters">
                  <select><option>May 2024</option></select>
                </div>
              </div>
              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr><th>Date</th><th>Status</th><th>Check In</th><th>Check Out</th><th>Duration</th></tr>
                  </thead>
                  <tbody>
                    {employeeData?.attendance.map((log, i) => (
                      <tr key={i}>
                        <td>{log.date}</td>
                        <td><span className={`badge ${log.status.toLowerCase()}`}>{log.status}</span></td>
                        <td>{log.checkIn}</td>
                        <td>{log.checkOut}</td>
                        <td>{log.checkIn !== '-' ? '5h 10m' : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </MainArea>
    </DashboardContainer>
  );
};

const LockScreen = styled.div`
  height: 100vh; display: flex; align-items: center; justify-content: center; background: #000; color: #fff; position: relative; overflow: hidden;
  .aurora-bg { position: absolute; inset: 0; background: radial-gradient(circle at 20% 30%, #001f3f 0%, #000 100%); opacity: 0.8; }
  .lock-content {
    position: relative; z-index: 10; text-align: center; max-width: 400px; padding: 40px; background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border-radius: 32px; border: 1px solid rgba(255,255,255,0.1);
    .logo { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 30px; span { font-weight: 900; font-size: 1.5rem; letter-spacing: 2px; } }
    h2 { font-size: 2rem; font-weight: 800; margin-bottom: 10px; }
    p { color: #888; margin-bottom: 40px; font-size: 0.9rem; line-height: 1.6; }
  }
  .fingerprint-scanner {
    width: 160px; height: 160px; margin: 0 auto 30px; cursor: pointer; position: relative;
    .scanner-ring {
      width: 100%; height: 100%; border: 4px solid rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s;
      .icon { color: rgba(255,255,255,0.4); }
    }
    &:hover .scanner-ring { border-color: #007bff; .icon { color: #007bff; } }
    &.scanning { .scanner-ring { border-color: #007bff; } .icon { color: #007bff; animation: pulse 1s infinite; } }
    &.success { .scanner-ring { border-color: #28a745; background: rgba(40, 167, 69, 0.1); } .icon { color: #28a745; } }
    
    .sweep { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 50%; border-top: 4px solid #007bff; animation: rotate 2s linear infinite; }
  }
  .progress-bar { width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-top: 20px; overflow: hidden; .progress-fill { height: 100%; background: #007bff; } }
  .status-label { font-weight: 700; font-size: 0.9rem; color: #888; }
  .back-btn { margin-top: 40px; background: none; border: none; color: #666; display: flex; align-items: center; gap: 8px; cursor: pointer; margin: 40px auto 0; &:hover { color: #fff; } }

  @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
`;

const DashboardContainer = styled.div`
  display: flex; min-height: 100vh; background: #f8fafc;
  @media (max-width: 768px) { flex-direction: column; }
  .sidebar {
    width: 280px; background: #fff; border-right: 1px solid #e2e8f0; padding: 30px; display: flex; flex-direction: column;
    @media (max-width: 768px) { width: 100%; border-right: none; border-bottom: 1px solid #e2e8f0; padding: 15px 20px; }
    .sidebar-header { 
      display: flex; align-items: center; gap: 12px; margin-bottom: 50px; 
      @media (max-width: 768px) { margin-bottom: 15px; }
      span { font-weight: 900; font-size: 1.2rem; } 
    }
    nav {
      display: flex; flex-direction: column; gap: 10px; flex: 1;
      @media (max-width: 768px) { flex-direction: row; overflow-x: auto; padding-bottom: 10px; &::-webkit-scrollbar { display: none; } }
      button {
        display: flex; align-items: center; gap: 15px; padding: 15px; border-radius: 12px; border: none; background: none; color: #64748b; font-weight: 700; cursor: pointer; transition: all 0.2s;
        @media (max-width: 768px) { padding: 10px 15px; white-space: nowrap; font-size: 0.85rem; gap: 8px; }
        &.active { background: #007bff; color: #fff; box-shadow: 0 10px 20px rgba(0, 123, 255, 0.2); }
        &:hover:not(.active) { background: #f1f5f9; color: #1e293b; }
      }
    }
    .logout-btn { 
      display: flex; align-items: center; gap: 15px; padding: 15px; border: none; background: none; color: #ef4444; font-weight: 700; cursor: pointer; margin-top: auto; 
      @media (max-width: 768px) { padding: 10px; font-size: 0.85rem; margin-top: 0; }
    }
  }
`;

const MainArea = styled.div`
  flex: 1; padding: 40px;
  min-width: 0;
  @media (max-width: 768px) { padding: 20px; }
  .main-header {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;
    @media (max-width: 768px) { margin-bottom: 25px; }
    @media (max-width: 576px) {
      flex-direction: column-reverse;
      align-items: flex-start;
      gap: 15px;
      .avatar { width: 40px; height: 40px; }
    }
    h1 { font-size: 1.8rem; font-weight: 900; color: #1e293b; margin: 0; @media (max-width: 768px) { font-size: 1.4rem; } }
    p { color: #64748b; margin-top: 5px; @media (max-width: 768px) { font-size: 0.85rem; } }
    .avatar { width: 48px; height: 48px; background: #1e293b; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem; }
  }
  .stats-row { 
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; margin-bottom: 30px; 
    @media (max-width: 1024px) { grid-template-columns: 1fr; gap: 15px; }
  }
  .grid-2 { 
    display: grid; grid-template-columns: 1fr 1fr; gap: 30px; 
    @media (max-width: 1024px) { grid-template-columns: 1fr; gap: 20px; }
  }
  .card {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 30px;
    @media (max-width: 768px) { padding: 20px; border-radius: 16px; }
    h3 { font-weight: 800; font-size: 1rem; margin-bottom: 25px; color: #1e293b; }
    .view-all { background: none; border: none; color: #007bff; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 5px; margin-top: 20px; }
  }
  .card-header-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    h3 { margin-bottom: 0 !important; }
    @media (max-width: 576px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
  }
  .log-item { 
    display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #f1f5f9; 
    &:last-child { border: none; } 
    @media (max-width: 480px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      .times { font-size: 0.8rem; }
    }
    .date { font-weight: 700; font-size: 0.9rem; } 
    .status { font-size: 0.75rem; font-weight: 800; padding: 4px 10px; border-radius: 6px; &.present { background: #d1fae5; color: #065f46; } &.leave { background: #fee2e2; color: #991b1b; } &.permission { background: #fef3c7; color: #92400e; } } 
    .times { font-size: 0.85rem; color: #64748b; } 
  }
  .salary-mini { .row { display: flex; justify-content: space-between; margin-bottom: 15px; span { color: #64748b; font-weight: 600; } &.total { font-size: 1.2rem; margin-top: 20px; } } .divider { height: 1px; background: #e2e8f0; margin: 15px 0; } }
  .salary-header-card { 
    background: #1e293b; color: #fff; border-radius: 24px; padding: 40px; display: flex; justify-content: space-between; align-items: center; 
    @media (max-width: 768px) { flex-direction: column; align-items: flex-start; gap: 25px; padding: 25px; }
    label { font-size: 0.75rem; font-weight: 800; opacity: 0.6; letter-spacing: 1px; } 
    h2 { font-size: 2.5rem; font-weight: 900; margin: 10px 0; @media (max-width: 768px) { font-size: 1.8rem; } } 
    .status-badge { display: inline-block; background: rgba(255,255,255,0.1); padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; } 
    .download-btn { background: #007bff; border: none; color: #fff; padding: 15px 30px; border-radius: 12px; font-weight: 800; display: flex; align-items: center; gap: 10px; cursor: pointer; @media (max-width: 768px) { width: 100%; justify-content: center; } &:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0, 123, 255, 0.3); } } 
  }
  .table-wrapper { @media (max-width: 768px) { overflow-x: auto; &::-webkit-scrollbar { display: none; } } }
  .custom-table { width: 100%; border-collapse: collapse; @media (max-width: 768px) { min-width: 600px; } th { text-align: left; padding: 15px; font-size: 0.75rem; color: #94a3b8; border-bottom: 1px solid #e2e8f0; } td { padding: 20px 15px; font-weight: 600; font-size: 0.9rem; color: #1e293b; border-bottom: 1px solid #f1f5f9; } .badge { font-size: 0.7rem; font-weight: 800; padding: 4px 10px; border-radius: 6px; &.present { background: #d1fae5; color: #065f46; } &.leave { background: #fee2e2; color: #991b1b; } &.permission { background: #fef3c7; color: #92400e; } } }
`;

const StatCard = styled.div`
  background: #fff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 25px; position: relative; overflow: hidden;
  .label { font-size: 0.75rem; font-weight: 800; color: #64748b; letter-spacing: 0.5px; margin-bottom: 15px; }
  .value { font-size: 1.8rem; font-weight: 900; color: #1e293b; }
  .sub { font-size: 0.75rem; color: #94a3b8; font-weight: 600; margin-top: 5px; }
  &::after { content: ''; position: absolute; right: -20px; top: -20px; width: 80px; height: 80px; background: ${props => props.color}; opacity: 0.05; border-radius: 50%; }
`;

export default EmployeeDashboard;
