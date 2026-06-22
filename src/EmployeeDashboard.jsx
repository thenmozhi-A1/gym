import React, { useState, useEffect } from "react";
import useAuthStore from "./store/authStore";
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
  ArrowLeft,
  Building2,
  Briefcase,
  Camera,
  Save,
  Phone,
  Info,
  Link,
  GraduationCap,
  CalendarDays,
  FileCheck2,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { generatePayslipPDF } from "./utils/pdfTemplates";

import axiosInstance from "./api/axiosInstance";
import log from "./utils/logger";
import { useEmployeeStore } from "./store/useEmployeeStore";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [scanState, setScanState] = useState("idle"); // idle, scanning, success, error
  const [scanProgress, setScanProgress] = useState(0);
  const { employeeData, leaves, fetchEmployeeData, updateProfile, checkIn, requestCorrection, applyLeave, cancelLeave } = useEmployeeStore();
  const [activeView, setActiveView] = useState("home"); // home, profile, salary, attendance
  
  const [profileForm, setProfileForm] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [leaveForm, setLeaveForm] = useState({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
  const [submittingLeave, setSubmittingLeave] = useState(false);

  const user = useAuthStore((state) => state.user);
  
  // Fetch real data for the specific staff member from the database
  useEffect(() => {
    const email = user?.email;
    if (!email) {
      navigate('/login');
      return;
    }
    fetchEmployeeData(email);
  }, [navigate, fetchEmployeeData, user]);

  useEffect(() => {
    if (employeeData && !profileForm) {
      setProfileForm(employeeData);
    }
  }, [employeeData]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    const success = await updateProfile(employeeData.id, profileForm);
    if (success) {
      setIsEditingProfile(false);
    }
    setSavingProfile(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm(prev => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckIn = async (isCheckedIn, logId) => {
    if (!employeeData) return;
    const success = await checkIn(isCheckedIn, logId, employeeData.id);
    if (success) {
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleCorrectionRequest = async (logId) => {
    const reason = prompt("Enter reason for correction (e.g. Forgot to checkout at 18:00):");
    if (!reason) return;
    const success = await requestCorrection(logId, reason);
    if (success) {
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    if (!employeeData) return;
    setSubmittingLeave(true);
    const success = await applyLeave(employeeData.id, leaveForm);
    if (success) {
      setLeaveForm({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
    }
    setSubmittingLeave(false);
  };

  const handleCancelLeave = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this leave request?")) return;
    await cancelLeave(id);
  };

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
    useAuthStore.getState().logout();
  };

  const handleDownloadSlip = () => {
    if (!employeeData) return;
    const netPay = calculateNetPay();
    generatePayslipPDF(employeeData, netPay);
  };

  // Removed redundant secondary lock screen to show dashboard content immediately
  // if (!isVerified) { ... }

  return (
    <DashboardContainer>
      <Toaster position="top-right" />
      <div className="sidebar">
        <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <img src="/logo.png" alt="B&Y Fitness" style={{ height: '60px', objectFit: 'contain' }} />
        </div>
        <nav>
          <button className={activeView === 'home' ? 'active' : ''} onClick={() => setActiveView('home')}>
            <Calendar size={20} /> Dashboard
          </button>
          <button className={activeView === 'profile' ? 'active' : ''} onClick={() => { setActiveView('profile'); setIsEditingProfile(false); setProfileForm(employeeData); }}>
            <User size={20} /> My Profile
          </button>
          <button className={activeView === 'salary' ? 'active' : ''} onClick={() => setActiveView('salary')}>
            <CreditCard size={20} /> My Salary
          </button>
          <button className={activeView === 'attendance' ? 'active' : ''} onClick={() => setActiveView('attendance')}>
            <Clock size={20} /> Attendance
          </button>
          <button className={activeView === 'leave' ? 'active' : ''} onClick={() => setActiveView('leave')}>
            <CalendarDays size={20} /> Leave Mgmt
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
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {(() => {
              const today = new Date();
              const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
              const todayLog = employeeData?.attendance?.find(log => log.date === todayStr);
              const isCheckedIn = todayLog && (todayLog.checkOut === '-' || !todayLog.checkOut);
              const hasCheckedOut = todayLog && todayLog.checkOut !== '-';
              
              if (hasCheckedOut) {
                return (
                  <button 
                    disabled
                    style={{
                      background: '#6c757d', color: '#fff', border: 'none', 
                      padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold',
                      cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                  >
                    <Clock size={18} /> Shift Completed
                  </button>
                );
              }

              return (
                <button 
                  onClick={() => handleCheckIn(isCheckedIn, todayLog?.id)}
                  style={{
                    background: isCheckedIn ? '#ef4444' : '#28a745', color: '#fff', border: 'none', 
                    padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                  }}
                >
                  <Clock size={18} /> {isCheckedIn ? 'Check Out' : 'Check In'}
                </button>
              );
            })()}
            <div className="user-profile">
              <div className="avatar" style={{ overflow: 'hidden' }}>
                {employeeData?.profilePhoto ? (
                  <img src={employeeData.profilePhoto} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  (employeeData?.fullName || employeeData?.name || "E").charAt(0).toUpperCase()
                )}
              </div>
            </div>
          </div>
        </header>

        {activeView === 'home' && (
          <div className="view-content animate-in">
            <div className="stats-row">
              <StatCard color="#007bff">
                <div className="label">Employee ID</div>
                <div className="value" style={{fontSize: '1.4rem'}}>{employeeData?.id ? `EMP-${String(employeeData.id).padStart(4, '0')}` : 'N/A'}</div>
                <div className="sub">{employeeData?.department || 'General'} Dept</div>
              </StatCard>
              <StatCard color="#28a745">
                <div className="label">Days Worked</div>
                <div className="value">{employeeData?.daysWorked || 0}</div>
                <div className="sub">Current Month</div>
              </StatCard>
              <StatCard color="#ef4444">
                <div className="label">Total Leaves</div>
                <div className="value">{employeeData?.leaves || 0}</div>
                <div className="sub">This Month</div>
              </StatCard>
            </div>

            <div className="grid-2" style={{ marginBottom: '30px' }}>
              <div className="card">
                <h3><Info size={16} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: '5px'}}/> Employee Summary</h3>
                <div className="salary-mini">
                  <div className="row"><span>Joining Date</span> <strong>{employeeData?.joiningDate || 'Not specified'}</strong></div>
                  <div className="row"><span>Department</span> <strong>{employeeData?.department || 'Not specified'}</strong></div>
                  <div className="row"><span>Designation</span> <strong>{employeeData?.role || 'Staff'}</strong></div>
                  <div className="row"><span>Specialty</span> <strong>{employeeData?.specialty || 'N/A'}</strong></div>
                </div>
              </div>

              <div className="card">
                <h3><Calendar size={16} style={{display: 'inline', verticalAlign: 'text-bottom', marginRight: '5px'}}/> Pending Tasks & Events</h3>
                <div className="attendance-list">
                  <div className="log-item" style={{ borderLeft: '3px solid #facc15', paddingLeft: '10px' }}>
                    <div className="date">Complete mandatory safety training</div>
                    <div className="status" style={{background: '#fef3c7', color: '#92400e'}}>Pending</div>
                  </div>
                  <div className="log-item" style={{ borderLeft: '3px solid #3b82f6', paddingLeft: '10px' }}>
                    <div className="date">Team Building Event</div>
                    <div className="times">Next Friday, 4:00 PM</div>
                  </div>
                  <div className="log-item" style={{ borderLeft: '3px solid #10b981', paddingLeft: '10px' }}>
                    <div className="date">Monthly Performance Review</div>
                    <div className="times">May 28th</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="card">
                <h3>Recent Attendance</h3>
                <div className="attendance-list">
                  {employeeData?.attendance.slice(0, 3).map((log, i) => (
                    <div key={i} className="log-item">
                      <div className="date">{log.date}</div>
                      <div className={`status ${log.status.toLowerCase()}`}>{log.status}</div>
                      <div className="times">{log.checkIn} - {log.checkOut}</div>
                    </div>
                  ))}
                </div>
                <button className="view-all" onClick={() => setActiveView('attendance')}>View Detailed Logs <ChevronRight size={14} /></button>
              </div>
              <div className="card">
                <h3>Salary Breakdown</h3>
                <div className="salary-mini">
                  <div className="row"><span>Gross Salary</span> <strong>₹{employeeData?.salary?.toLocaleString() || 0}</strong></div>
                  <div className="row text-danger"><span>Deductions</span> <strong>-₹{(employeeData?.salary - calculateNetPay()).toLocaleString()}</strong></div>
                  <div className="divider" />
                  <div className="row total"><span>Net Payable</span> <strong>₹{calculateNetPay().toLocaleString()}</strong></div>
                </div>
                <button className="view-all" onClick={() => setActiveView('salary')}>View Pay Slips <ChevronRight size={14} /></button>
              </div>
            </div>
          </div>
        )}

        {activeView === 'profile' && (
          <div className="view-content animate-in">
            <div className="card" style={{ marginBottom: '25px' }}>
              <div className="card-header-flex">
                <h3>My Profile</h3>
                {!isEditingProfile ? (
                  <button onClick={() => setIsEditingProfile(true)} style={{ background: '#007bff', color: '#fff', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Edit Profile</button>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => { setIsEditingProfile(false); setProfileForm(employeeData); }} style={{ background: '#e2e8f0', color: '#1e293b', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={handleProfileUpdate} disabled={savingProfile} style={{ background: '#10b981', color: '#fff', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Save size={14} /> {savingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                {/* Avatar Section */}
                <div style={{ textAlign: 'center', minWidth: '150px' }}>
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#f1f5f9', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', color: '#94a3b8', position: 'relative', overflow: 'hidden' }}>
                    {(isEditingProfile ? profileForm?.profilePhoto : employeeData?.profilePhoto) ? (
                      <img src={isEditingProfile ? profileForm.profilePhoto : employeeData.profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Camera size={40} opacity={0.5} />
                    )}
                    {isEditingProfile && (
                      <label style={{ position: 'absolute', bottom: '0', background: 'rgba(0,0,0,0.6)', width: '100%', padding: '5px 0', fontSize: '0.7rem', color: '#fff', cursor: 'pointer', textAlign: 'center', margin: 0 }}>
                        Upload
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                      </label>
                    )}
                  </div>
                  <h4 style={{ margin: '0 0 5px 0' }}>{employeeData?.fullName}</h4>
                  <p style={{ margin: '0', fontSize: '0.8rem', color: '#64748b' }}>{employeeData?.role}</p>
                </div>

                {/* Forms Area */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {/* Personal Info */}
                  <div className="form-section" style={{ gridColumn: '1 / -1' }}>
                    <h4 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '15px', color: '#007bff' }}><User size={14} style={{verticalAlign: 'text-bottom'}} /> Personal Details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <FormGroup>
                        <label>Full Name</label>
                        <input type="text" value={isEditingProfile ? profileForm?.fullName : employeeData?.fullName} onChange={e => setProfileForm({...profileForm, fullName: e.target.value})} disabled={!isEditingProfile} />
                      </FormGroup>
                      <FormGroup>
                        <label>Phone Number</label>
                        <input type="text" value={isEditingProfile ? profileForm?.phone : employeeData?.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} disabled={!isEditingProfile} />
                      </FormGroup>
                      <FormGroup>
                        <label>Department</label>
                        <input type="text" placeholder="E.g. Training, Admin" value={isEditingProfile ? (profileForm?.department || '') : (employeeData?.department || '')} onChange={e => setProfileForm({...profileForm, department: e.target.value})} disabled={!isEditingProfile} />
                      </FormGroup>
                      <FormGroup>
                        <label>Joining Date</label>
                        <input type="date" value={isEditingProfile ? (profileForm?.joiningDate || '') : (employeeData?.joiningDate || '')} onChange={e => setProfileForm({...profileForm, joiningDate: e.target.value})} disabled={!isEditingProfile} />
                      </FormGroup>
                      <FormGroup style={{ gridColumn: '1 / -1' }}>
                        <label>Address</label>
                        <input type="text" value={isEditingProfile ? profileForm?.address : employeeData?.address} onChange={e => setProfileForm({...profileForm, address: e.target.value})} disabled={!isEditingProfile} />
                      </FormGroup>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="form-section">
                    <h4 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '15px', color: '#ef4444' }}><Phone size={14} style={{verticalAlign: 'text-bottom'}} /> Emergency Contact</h4>
                    <FormGroup>
                      <label>Contact Name</label>
                      <input type="text" placeholder="E.g. Jane Doe (Wife)" value={isEditingProfile ? (profileForm?.emergencyContactName || '') : (employeeData?.emergencyContactName || '')} onChange={e => setProfileForm({...profileForm, emergencyContactName: e.target.value})} disabled={!isEditingProfile} />
                    </FormGroup>
                    <FormGroup>
                      <label>Contact Phone</label>
                      <input type="text" placeholder="E.g. +91 9876543210" value={isEditingProfile ? (profileForm?.emergencyContactPhone || '') : (employeeData?.emergencyContactPhone || '')} onChange={e => setProfileForm({...profileForm, emergencyContactPhone: e.target.value})} disabled={!isEditingProfile} />
                    </FormGroup>
                  </div>

                  {/* Bank Details */}
                  <div className="form-section">
                    <h4 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '15px', color: '#28a745' }}><Building2 size={14} style={{verticalAlign: 'text-bottom'}} /> Bank Details</h4>
                    <FormGroup>
                      <label>Bank Name</label>
                      <input type="text" placeholder="E.g. HDFC Bank" value={isEditingProfile ? (profileForm?.bankName || '') : (employeeData?.bankName || '')} onChange={e => setProfileForm({...profileForm, bankName: e.target.value})} disabled={!isEditingProfile} />
                    </FormGroup>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                      <FormGroup>
                        <label>Account No.</label>
                        <input type="password" placeholder="••••••••" value={isEditingProfile ? (profileForm?.accountNumber || '') : (employeeData?.accountNumber ? '••••••••'+employeeData.accountNumber.slice(-4) : '')} onChange={e => setProfileForm({...profileForm, accountNumber: e.target.value})} disabled={!isEditingProfile} />
                      </FormGroup>
                      <FormGroup>
                        <label>IFSC Code</label>
                        <input type="text" placeholder="HDFC0001234" value={isEditingProfile ? (profileForm?.ifscCode || '') : (employeeData?.ifscCode || '')} onChange={e => setProfileForm({...profileForm, ifscCode: e.target.value})} disabled={!isEditingProfile} />
                      </FormGroup>
                    </div>
                  </div>

                  {/* Documents Upload */}
                  <div className="form-section" style={{ gridColumn: '1 / -1' }}>
                    <h4 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '15px', color: '#8b5cf6' }}><Link size={14} style={{verticalAlign: 'text-bottom'}} /> Documents & Certificates</h4>
                    <FormGroup>
                      <label>Document URLs (Comma separated links to your ID / Certs)</label>
                      <input type="text" placeholder="https://drive.google.com/..., https://..." value={isEditingProfile ? (profileForm?.documents || '') : (employeeData?.documents || '')} onChange={e => setProfileForm({...profileForm, documents: e.target.value})} disabled={!isEditingProfile} />
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '5px' }}>Note: Secure file upload integration is pending. Please provide secure links to your documents for now.</div>
                    </FormGroup>
                  </div>
                </div>
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
                    <tr><th>Date</th><th>Status</th><th>Check In</th><th>Check Out</th><th>Work Hours</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {employeeData?.attendance.map((log, i) => (
                      <tr key={i}>
                        <td>{log.date}</td>
                        <td>
                          <span className={`badge ${log.status.toLowerCase()}`}>{log.status}</span>
                          {log.isLate && <span className="badge" style={{background: '#fee2e2', color: '#991b1b', marginLeft: '5px'}}>Late</span>}
                        </td>
                        <td>{log.checkIn}</td>
                        <td>{log.checkOut}</td>
                        <td>{log.duration || (log.checkIn !== '-' && log.checkOut === '-' ? 'Working' : '-')}</td>
                        <td>
                          {log.correctionStatus === 'PENDING' ? (
                            <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 'bold' }}><AlertCircle size={14} style={{verticalAlign:'text-bottom'}}/> Correction Pending</span>
                          ) : (
                            <button onClick={() => handleCorrectionRequest(log.id)} style={{ background: 'none', border: '1px solid #e2e8f0', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b' }}>
                              Request Correction
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeView === 'leave' && (
          <div className="view-content animate-in">
            <div className="grid-2">
              <div className="card">
                <h3>Apply for Leave</h3>
                <form onSubmit={handleLeaveSubmit}>
                  <FormGroup>
                    <label>Leave Type</label>
                    <select value={leaveForm.leaveType} onChange={e => setLeaveForm({...leaveForm, leaveType: e.target.value})} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}>
                      <option value="CASUAL">Casual Leave</option>
                      <option value="SICK">Sick Leave</option>
                      <option value="PAID">Paid Leave</option>
                    </select>
                  </FormGroup>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <FormGroup>
                      <label>Start Date</label>
                      <input type="date" required value={leaveForm.startDate} onChange={e => setLeaveForm({...leaveForm, startDate: e.target.value})} />
                    </FormGroup>
                    <FormGroup>
                      <label>End Date</label>
                      <input type="date" required value={leaveForm.endDate} onChange={e => setLeaveForm({...leaveForm, endDate: e.target.value})} />
                    </FormGroup>
                  </div>
                  <FormGroup>
                    <label>Reason</label>
                    <textarea rows="3" required placeholder="Reason for leave..." value={leaveForm.reason} onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'vertical' }}></textarea>
                  </FormGroup>
                  <button type="submit" disabled={submittingLeave} style={{ background: '#007bff', color: '#fff', width: '100%', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                    {submittingLeave ? 'Submitting...' : 'Submit Leave Request'}
                  </button>
                </form>
              </div>

              <div className="card">
                <h3>Leave Balance Summary</h3>
                <div className="salary-mini" style={{ marginBottom: '30px' }}>
                  <div className="row"><span>Casual Leaves Remaining</span> <strong>12</strong></div>
                  <div className="row"><span>Sick Leaves Remaining</span> <strong>6</strong></div>
                  <div className="row"><span>Paid Leaves</span> <strong>{employeeData?.leaves || 0} used</strong></div>
                </div>
                
                <h3>Recent Requests</h3>
                <div className="attendance-list">
                  {leaves.length === 0 ? (
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No recent leave requests.</p>
                  ) : (
                    leaves.slice(0, 4).map(l => (
                      <div key={l.id} className="log-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <div className="date">{l.leaveType} Leave</div>
                          <div className="status" style={{ background: l.status === 'APPROVED' ? '#d1fae5' : l.status === 'REJECTED' || l.status === 'CANCELLED' ? '#fee2e2' : '#fef3c7', color: l.status === 'APPROVED' ? '#065f46' : l.status === 'REJECTED' || l.status === 'CANCELLED' ? '#991b1b' : '#92400e', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>{l.status}</div>
                        </div>
                        <div className="times">{l.startDate} to {l.endDate}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="card" style={{ marginTop: '30px' }}>
              <h3>Leave History</h3>
              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr><th>Type</th><th>Dates</th><th>Reason</th><th>Status</th><th>Applied On</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {leaves.map(l => (
                      <tr key={l.id}>
                        <td><strong>{l.leaveType}</strong></td>
                        <td>{l.startDate} <ArrowLeft size={10} style={{margin:'0 5px'}}/> {l.endDate}</td>
                        <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.reason}</td>
                        <td>
                          <span style={{ background: l.status === 'APPROVED' ? '#d1fae5' : l.status === 'REJECTED' || l.status === 'CANCELLED' ? '#fee2e2' : '#fef3c7', color: l.status === 'APPROVED' ? '#065f46' : l.status === 'REJECTED' || l.status === 'CANCELLED' ? '#991b1b' : '#92400e', fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                            {l.status}
                          </span>
                        </td>
                        <td>{new Date(l.appliedAt).toLocaleDateString()}</td>
                        <td>
                          {l.status === 'PENDING' && (
                            <button onClick={() => handleCancelLeave(l.id)} style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                          )}
                        </td>
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
  .table-wrapper { width: 100%; }
  .custom-table { width: 100%; border-collapse: collapse; th { text-align: left; padding: 15px; font-size: 0.75rem; color: #94a3b8; border-bottom: 1px solid #e2e8f0; } td { padding: 20px 15px; font-weight: 600; font-size: 0.9rem; color: #1e293b; border-bottom: 1px solid #f1f5f9; } .badge { font-size: 0.7rem; font-weight: 800; padding: 4px 10px; border-radius: 6px; &.present { background: #d1fae5; color: #065f46; } &.leave { background: #fee2e2; color: #991b1b; } &.permission { background: #fef3c7; color: #92400e; } } }
`;

const FormGroup = styled.div`
  display: flex; flex-direction: column; gap: 6px; margin-bottom: 15px;
  label { font-size: 0.8rem; font-weight: 700; color: #64748b; }
  input { padding: 10px 14px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem; color: #1e293b; background: #fff; transition: all 0.2s; 
    &:focus { outline: none; border-color: #007bff; box-shadow: 0 0 0 3px rgba(0,123,255,0.1); }
    &:disabled { background: #f8fafc; color: #94a3b8; border-color: #e2e8f0; cursor: not-allowed; }
  }
`;

const StatCard = styled.div`
  background: #fff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 25px; position: relative; overflow: hidden;
  .label { font-size: 0.75rem; font-weight: 800; color: #64748b; letter-spacing: 0.5px; margin-bottom: 15px; }
  .value { font-size: 1.8rem; font-weight: 900; color: #1e293b; }
  .sub { font-size: 0.75rem; color: #94a3b8; font-weight: 600; margin-top: 5px; }
  &::after { content: ''; position: absolute; right: -20px; top: -20px; width: 80px; height: 80px; background: ${props => props.color}; opacity: 0.05; border-radius: 50%; }
`;

export default EmployeeDashboard;
