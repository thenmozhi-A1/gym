import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Users,
  CreditCard,
  Clock,
  LogOut,
  Search,
  CheckCircle,
  XCircle,
  Menu as MenuIcon,
  X,
  MessageSquare,
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
  ArrowUpRight,
  TrendingDown,
  BarChart3,
  Calendar,
  Layers,
  Award,
  Trash2,
  Plus,
  Phone,
  MapPin
} from "lucide-react";

const API_BASE = "https://gymj-9.onrender.com/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isPayrollDetailOpen, setIsPayrollDetailOpen] = useState(false);
  const [selectedStaffForSlip, setSelectedStaffForSlip] = useState(null);
  const [newStaff, setNewStaff] = useState({ name: "", specialty: "", salary: "", times: "", email: "", role: "Trainer", phone: "", address: "" });

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "ADMIN") navigate("/login");
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "payroll") {
        setLoading(false);
        return;
      }

      const endpoints = activeTab === "dashboard" || activeTab === "users"
        ? ["users", "payments", "attendance", "consultations"]
        : [activeTab];

      const results = await Promise.all(
        endpoints.map(ep => fetch(`${API_BASE}/${ep}`).then(r => r.json()))
      );

      if (activeTab === "dashboard" || activeTab === "users") {
        setUsers(results[0]); setPayments(results[1]); setAttendance(results[2]); setConsultations(results[3]);
        // Mock staffs data
        setStaffs([
          { id: 1, name: "Alex Johnson", specialty: "Bodybuilding", students: 12, times: "06:00 AM - 11:00 AM", salary: "₹45,000", role: "Trainer" },
          { id: 2, name: "Maya Patel", specialty: "Yoga & Flexibility", students: 18, times: "04:00 PM - 08:00 PM", salary: "₹52,000", role: "Trainer" },
          { id: 5, name: "Jessica Smith", specialty: "Customer Relations", students: 0, times: "09:00 AM - 05:00 PM", salary: "₹35,000", role: "Front Office" },
          { id: 6, name: "David Miller", specialty: "Sales & Billing", students: 0, times: "10:00 AM - 06:00 PM", salary: "₹38,000", role: "Front Office" }
        ]);
      } else {
        const data = results[0];
        if (activeTab === "payments") setPayments(data);
        else if (activeTab === "attendance") setAttendance(data);
        else setConsultations(data);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Permanent deletion cannot be undone. Proceed?")) return;
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        alert("Failed to delete warrior.");
      }
    } catch (err) {
      alert("Error processing deletion.");
    }
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.role) return;
    const staffToAdd = { ...newStaff, id: Date.now(), students: 0, status: "ACTIVE" };
    setStaffs([staffToAdd, ...staffs]);
    setNewStaff({ name: "", specialty: "", salary: "", times: "", email: "", role: "Trainer", phone: "", address: "" });
    setIsAddStaffModalOpen(false);
    alert("STAFF MEMBER ADDED TO SYSTEM SUCCESSFULLY!");
  };

  return (
    <AuroraWrapper>
      {/* ── SIDEBAR ── */}
      <Sidebar isOpen={isSidebarOpen}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon"><Zap size={24} /></div>
            <span>SLAYFIT</span>
          </div>
        </div>

        <NavSection>
          {[
            { id: "dashboard", icon: <Layout size={18} />, label: "Dashboard" },
            { id: "users", icon: <Users size={18} />, label: "Warriors" },
            { id: "payments", icon: <CreditCard size={18} />, label: "Revenue" },
            { id: "attendance", icon: <Clock size={18} />, label: "Arena Logs" },
            { id: "staffs", icon: <Layers size={18} />, label: "Staffs" },
            { id: "payroll", icon: <CreditCard size={18} />, label: "Payroll" },
            { id: "consultations", icon: <MessageSquare size={18} />, label: "Inquiries" }
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

      <MainArea>
        {/* ── HEADER ── */}
        <Header>
          <div className="search-bar">
            <Search size={18} />
            <input placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="header-actions">
            <button className="h-btn"><Globe size={18} /></button>
            <button className="h-btn"><Settings size={18} /></button>
            <button className="h-btn"><Bell size={18} /><div className="notif-dot"></div></button>
            <div className="profile-chip">
              <div className="avatar">AD</div>
            </div>
            <button className="mobile-toggle" onClick={() => setIsSidebarOpen(true)}><MenuIcon /></button>
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
                    <StatBox color="#007bff">
                      <div className="lab">Total Warriors</div>
                      <div className="icon-row"><Users size={24} /></div>
                      <div className="val">{users.length}</div>
                      <div className="footer-text">See in-depth <span>Warrior source</span></div>
                    </StatBox>
                    <StatBox color="#fd7e14">
                      <div className="lab">Retention Rate</div>
                      <div className="icon-row"><TrendingUp size={24} /></div>
                      <div className="val">84.22%</div>
                      <div className="footer-text">See page-wise <span>Performance</span></div>
                    </StatBox>
                    <StatBox color="#28a745">
                      <div className="lab">Growth</div>
                      <div className="icon-row"><CreditCard size={24} /></div>
                      <div className="val">₹{payments.reduce((acc, p) => acc + (p.amount || 0), 0).toLocaleString()}</div>
                      <div className="footer-text">See last week's <span>Revenue</span></div>
                    </StatBox>
                    <StatBox color="#17a2b8">
                      <div className="lab">Active Logs</div>
                      <div className="icon-row"><Zap size={24} /></div>
                      <div className="val">{attendance.length}</div>
                      <div className="footer-text">See all inbound <span>Logs</span></div>
                    </StatBox>
                  </StatsRow>

                  <div className="charts-row mt-4">
                    <ChartCard className="flex-2">
                      <div className="chart-header">
                        <div className="tabs">
                          <button className="active">New Warriors</button>
                          <button>Avg. Session</button>
                          <button>Inquiries</button>
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
                <PayrollContainer className="animate-in" style={{ position: 'relative', overflow: 'hidden' }}>
                  {!isPayrollDetailOpen ? (
                    <>
                      <div className="payroll-main">
                        <header className="payroll-header">
                          <h1 className="welcome">Welcome Slayfit!</h1>
                          <div className="pay-run-status">
                            <span>Process Pay Run for May 2024</span>
                            <span className="badge-approved">APPROVED</span>
                          </div>
                        </header>

                        <div className="hero-card">
                          <div className="hero-stats">
                            <div className="stat-group">
                              <label>EMPLOYEES' NET PAY</label>
                              <div className="amount">₹17,25,23.00</div>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat-group">
                              <label>PAYMENT DATE</label>
                              <div className="date">31 May 2024</div>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat-group">
                              <label>NO. OF EMPLOYEES</label>
                              <div className="count">1308</div>
                            </div>
                            <button className="btn-black" onClick={() => setIsPayrollDetailOpen(true)}>View Details</button>
                          </div>
                          <p className="hero-note">
                            <Clock size={12} /> Pay your employees on 31/05/2024. Record it here once you made the payment.
                          </p>
                        </div>

                        <div className="payroll-grid">
                          <div className="grid-card deduction-card">
                            <div className="card-header">
                              <h5>DEDUCTION SUMMARY</h5>
                              <select className="small-select"><option>Previous Month</option></select>
                            </div>
                            <div className="deduction-row">
                              <div className="deduction-item">
                                <div className="icon-circle"><Layers size={14} /></div>
                                <label>EPF</label>
                                <div className="val">₹39,73,913.00</div>
                                <span className="link">View Details</span>
                              </div>
                              <div className="deduction-item">
                                <div className="icon-circle gold"><Award size={14} /></div>
                                <label>ESI</label>
                                <div className="val">₹91,010.00</div>
                                <span className="link">View Details</span>
                              </div>
                              <div className="deduction-item">
                                <div className="icon-circle red"><TrendingDown size={14} /></div>
                                <label>TDS DEDUCTION</label>
                                <div className="val">₹1,15,89,089.00</div>
                                <span className="link">View Details</span>
                              </div>
                            </div>
                          </div>

                          <div className="grid-card summary-card">
                            <h5>EMPLOYEE SUMMARY</h5>
                            <div className="summary-body">
                              <label>ACTIVE EMPLOYEES</label>
                              <div className="big-count">1308</div>
                              <span className="link">View Employees</span>
                            </div>
                          </div>
                        </div>

                        <div className="chart-section">
                          <div className="card-header">
                            <h5>PAYROLL COST SUMMARY</h5>
                            <select className="small-select"><option>This year</option></select>
                          </div>
                          <div className="chart-mockup">
                            <div className="bars">
                              {[80, 100, 90, 70, 60, 40, 85, 95, 110, 105, 98, 115].map((h, i) => (
                                <div key={i} className="bar-stack">
                                  <div className="segment red" style={{ height: `${h * 0.2}%` }} />
                                  <div className="segment orange" style={{ height: `${h * 0.3}%` }} />
                                  <div className="segment dark" style={{ height: `${h * 0.5}%` }} />
                                </div>
                              ))}
                            </div>
                            <div className="chart-legend">
                              <div className="legend-item"><span className="dot red" /> Net Pay: ₹13,40,50,440.00</div>
                              <div className="legend-item"><span className="dot orange" /> Taxes: ₹1,51,56,551.00</div>
                              <div className="legend-item"><span className="dot dark" /> Statutories: ₹50,16,123.00</div>
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
                              <div className="task-info">
                                <h6>{task.label}</h6>
                                <p>{task.sub}</p>
                              </div>
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
                          <h2>Payroll <small>DETAILS / MAY 2024</small></h2>
                        </div>
                        <div className="d-flex gap-3">
                          <button className="export-btn pdf"><Activity size={14} /> EXPORT PDF</button>
                          <button className="export-btn csv"><Globe size={14} /> EXPORT CSV</button>
                        </div>
                      </div>
                      
                      <TableCard style={{ border: 'none', padding: 0, background: 'transparent' }}>
                        <div className="table-responsive">
                          <table className="table interactive-table">
                            <thead>
                              <tr>
                                <th>EMPLOYEE</th>
                                <th>ROLE</th>
                                <th>GROSS PAY</th>
                                <th>DEDUCTIONS</th>
                                <th>NET PAY</th>
                                <th>STATUS</th>
                              </tr>
                            </thead>
                            <tbody>
                              {staffs.map(s => (
                                <tr key={s.id} onClick={() => setSelectedStaffForSlip(s)}>
                                  <td>
                                    <div className="u-cell">
                                      <div className="avatar-small">{s.name.charAt(0)}</div>
                                      <div className="fw-bold">{s.name}</div>
                                    </div>
                                  </td>
                                  <td><span className="badge bg-primary-light">{s.role}</span></td>
                                  <td className="fw-bold">{s.salary}</td>
                                  <td className="text-danger">₹2,450 <small style={{ display: 'block', fontSize: '0.6rem', opacity: 0.6 }}>TDS + PF</small></td>
                                  <td className="fw-black text-primary">₹{(parseInt(s.salary.replace(/[^\d]/g, '')) - 2450).toLocaleString()}</td>
                                  <td><span className="sync-badge">PAID</span></td>
                                </tr>
                              ))}
                              {/* Extra mock rows for "high fidelity" */}
                              {[1,2,3,4,5,6,7].map(i => (
                                <tr key={`mock-${i}`} onClick={() => setSelectedStaffForSlip({ name: `Employee #${1300 + i}`, role: "Staff", salary: "₹42,000" })}>
                                  <td>
                                    <div className="u-cell">
                                      <div className="avatar-small">E</div>
                                      <div className="fw-bold">Employee #{1300 + i}</div>
                                    </div>
                                  </td>
                                  <td><span className="badge bg-primary-light">Staff</span></td>
                                  <td className="fw-bold">₹42,000</td>
                                  <td className="text-danger">₹1,200 <small style={{ display: 'block', fontSize: '0.6rem', opacity: 0.6 }}>TDS + PF</small></td>
                                  <td className="fw-black text-primary">₹40,800</td>
                                  <td><span className="sync-badge">PAID</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </TableCard>

                      {/* ── PAY SLIP DRAWER ── */}
                      {selectedStaffForSlip && (
                        <>
                          <div className="drawer-overlay" onClick={() => setSelectedStaffForSlip(null)} />
                          <div className="pay-slip-drawer animate-slide-left">
                            <div className="drawer-header">
                              <h3>Employee Pay Slip</h3>
                              <button onClick={() => setSelectedStaffForSlip(null)}><X size={20} /></button>
                            </div>
                            
                            <div className="slip-profile">
                              <div className="big-avatar">{selectedStaffForSlip.name.charAt(0)}</div>
                              <div className="info">
                                <h4>{selectedStaffForSlip.name}</h4>
                                <p>{selectedStaffForSlip.role} • ID: SF-2024-{Math.floor(Math.random() * 9000) + 1000}</p>
                              </div>
                            </div>

                            <div className="slip-summary-cards">
                              <div className="s-card green">
                                <label>EARNINGS</label>
                                <div className="val">{selectedStaffForSlip.salary}</div>
                              </div>
                              <div className="s-card red">
                                <label>DEDUCTIONS</label>
                                <div className="val">₹2,450</div>
                              </div>
                            </div>

                            <div className="slip-section">
                              <h5>EARNINGS BREAKDOWN</h5>
                              <div className="line-item"><span>Basic Salary</span> <span>{selectedStaffForSlip.salary}</span></div>
                              <div className="line-item"><span>HRA</span> <span>₹0.00</span></div>
                              <div className="line-item"><span>Performance Bonus</span> <span>₹0.00</span></div>
                            </div>

                            <div className="slip-section">
                              <h5>DEDUCTIONS</h5>
                              <div className="line-item"><span>Provident Fund (PF)</span> <span>₹1,800</span></div>
                              <div className="line-item"><span>Professional Tax</span> <span>₹450</span></div>
                              <div className="line-item"><span>TDS Deduction</span> <span>₹200</span></div>
                            </div>

                            <div className="slip-total">
                              <div className="total-row">
                                <span>NET PAYABLE</span>
                                <span className="final-val">₹{(parseInt(selectedStaffForSlip.salary.replace(/[^\d]/g, '')) - 2450).toLocaleString()}</span>
                              </div>
                              <p>Payment via Bank Transfer • May 31, 2024</p>
                            </div>

                            <button className="download-btn-full">DOWNLOAD SLIP (PDF)</button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </PayrollContainer>
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
                          {activeTab === "users" && <><th>WARRIOR</th><th>STATUS</th><th>TYPE</th><th>ACTIONS</th></>}
                          {activeTab === "payments" && <><th>WARRIOR</th><th>AMOUNT</th><th>STATUS</th><th>DATE</th></>}
                          {activeTab === "attendance" && <><th>WARRIOR</th><th>DATE</th><th>IN</th><th>STATE</th></>}
                          {activeTab === "consultations" && <><th>WARRIOR INFO</th><th>MESSAGE / GOALS</th><th>DATE</th></>}
                          {activeTab === "staffs" && <><th>STAFF NAME</th><th>ROLE</th><th>SPECIALTY / TASK</th><th>SHIFT TIME</th><th>SALARY</th></>}
                        </tr>
                      </thead>
                      <tbody>
                        {activeTab === "users" && users.map(u => (
                          <tr key={u.id}>
                            <td>
                              <div className="u-cell">
                                <div className="avatar-small">{u.fullName.charAt(0)}</div>
                                <div><div className="u-name">{u.fullName}</div><div className="u-email">{u.email}</div></div>
                              </div>
                            </td>
                            <td><span className={`badge ${u.status === 'ACTIVE' ? 'bg-success-light' : 'bg-danger-light'}`}>{u.status}</span></td>
                            <td>{u.membershipType || "Standard"}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <button className="btn-icon text-danger" onClick={() => handleDeleteUser(u.id)} title="Delete Warrior">
                                  <Trash2 size={16} />
                                </button>
                                <button className="btn-icon"><MoreVertical size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {activeTab === "payments" && payments.map(p => (
                          <tr key={p.id}>
                            <td className="fw-bold">{p.user?.fullName || p.fullName || "Warrior"}</td>
                            <td className="text-primary fw-bold">₹{p.amount}</td>
                            <td><span className="badge bg-primary-light">{p.paymentStatus}</span></td>
                            <td className="sub-text">{p.paymentDate}</td>
                          </tr>
                        ))}
                        {activeTab === "attendance" && attendance.map(log => (
                          <tr key={log.id}>
                            <td className="fw-bold">{log.user?.fullName || log.fullName || "Warrior"}</td>
                            <td>{log.attendanceDate}</td>
                            <td className="text-success fw-bold">{log.checkInTime}</td>
                            <td><span className="sync-badge">PRESENT</span></td>
                          </tr>
                        ))}
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
                        {activeTab === "staffs" && staffs.map(s => (
                          <tr key={s.id}>
                            <td>
                              <div className="u-cell">
                                <div className="avatar-small bg-primary-light text-primary">{s.name.charAt(0)}</div>
                                <div className="fw-bold">{s.name}</div>
                              </div>
                            </td>
                            <td><span className={`badge ${s.role === 'Trainer' ? 'bg-success-light' : 'bg-primary-light'}`}>{s.role}</span></td>
                            <td>{s.specialty}</td>
                            <td className="fw-bold text-secondary">{s.times}</td>
                            <td className="fw-black text-primary">{s.salary}</td>
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
                  <p>Register a new member to the SlayFit operations team.</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setIsAddStaffModalOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddStaff}>
              <div className="form-grid">
                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label>STAFF FULL NAME</label>
                      <div className="input-wrap">
                        <Users size={18} />
                        <input type="text" placeholder="e.g. Marcus Aurelius" value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} required />
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
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
                    <input type="email" placeholder="staff@slayfit.com" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} required />
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label>PHONE NUMBER</label>
                      <div className="input-wrap">
                        <Phone size={18} />
                        <input type="text" placeholder="+91 98765 43210" value={newStaff.phone} onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })} required />
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label>HOME ADDRESS</label>
                      <div className="input-wrap">
                        <MapPin size={18} />
                        <input type="text" placeholder="City, State" value={newStaff.address} onChange={e => setNewStaff({ ...newStaff, address: e.target.value })} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>SPECIALTY / MAIN TASK</label>
                  <div className="input-wrap">
                    <Target size={18} />
                    <input type="text" placeholder="e.g. Yoga Expert or Receptionist" value={newStaff.specialty} onChange={e => setNewStaff({ ...newStaff, specialty: e.target.value })} required />
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label>MONTHLY SALARY</label>
                      <div className="input-wrap">
                        <CreditCard size={18} />
                        <input type="text" placeholder="₹55,000" value={newStaff.salary} onChange={e => setNewStaff({ ...newStaff, salary: e.target.value })} />
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label>SHIFT HOURS</label>
                      <div className="input-wrap">
                        <Clock size={18} />
                        <input type="text" placeholder="6AM - 11AM" value={newStaff.times} onChange={e => setNewStaff({ ...newStaff, times: e.target.value })} />
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

      {isSidebarOpen && <Overlay onClick={() => setIsSidebarOpen(false)} />}
    </AuroraWrapper>
  );
};

// ── STYLED COMPONENTS (The "Aurora" Model) ──

const AuroraWrapper = styled.div`
  display: flex; min-height: 100vh; background: #f4f7fa; color: #333;
  font-family: 'Inter', sans-serif;
`;

const Sidebar = styled.div`
  width: 260px; background: #fff; border-right: 1px solid #e9ecef;
  display: flex; flex-direction: column; padding: 25px 0;
  position: sticky; top: 0; height: 100vh; z-index: 500;

  @media (max-width: 992px) {
    position: fixed; left: 0; transform: ${props => props.isOpen ? "translateX(0)" : "translateX(-100%)"};
    transition: transform 0.3s ease; box-shadow: 20px 0 50px rgba(0,0,0,0.1);
  }

  .sidebar-header {
    padding: 0 25px; margin-bottom: 30px;
    .logo { display: flex; align-items: center; gap: 12px;
      .logo-icon { background: #28a745; color: #fff; padding: 6px; border-radius: 8px; }
      span { font-size: 1.5rem; font-weight: 800; color: #1e293b; }
    }
  }
`;

const NavSection = styled.div` flex: 1; display: flex; flex-direction: column; gap: 4px; padding: 0 15px; `;

const NavItem = styled.div`
  display: flex; align-items: center; gap: 15px; padding: 12px 20px; border-radius: 8px;
  cursor: pointer; transition: all 0.2s ease; font-weight: 500; font-size: 0.9rem;
  color: ${props => props.active ? "#007bff" : "#64748b"};
  background: ${props => props.active ? "rgba(0, 123, 255, 0.08)" : "transparent"};

  &:hover { background: rgba(0, 123, 255, 0.05); color: #007bff; }
`;

const PromoCard = styled.div`
  margin: 20px;
  .promo-inner {
    background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 16px; padding: 20px; text-align: center;
    .promo-icon { background: rgba(40, 167, 69, 0.1); color: #28a745; width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; }
    h6 { font-weight: 700; margin-bottom: 5px; }
    p { font-size: 0.8rem; color: #64748b; margin-bottom: 15px; .price { color: #28a745; font-weight: 700; } }
    .promo-list { list-style: none; padding: 0; margin-bottom: 20px; text-align: left;
      li { font-size: 0.75rem; color: #333; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;
        &::before { content: '✓'; color: #28a745; font-weight: 900; }
      }
    }
    .explore-btn { width: 100%; background: #1e293b; color: #fff; border: none; padding: 10px; border-radius: 10px; font-weight: 600; font-size: 0.85rem; }
  }
`;

const MainArea = styled.main` flex: 1; display: flex; flex-direction: column; min-width: 0; `;

const Header = styled.header`
  padding: 20px 40px; background: #fff; border-bottom: 1px solid #e9ecef;
  display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 400;

  .search-bar {
    background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 12px; padding: 10px 20px;
    display: flex; align-items: center; gap: 15px; width: 400px;
    input { background: none; border: none; outline: none; width: 100%; font-size: 0.9rem; }
    svg { color: #94a3b8; }
  }

  .header-actions {
    display: flex; align-items: center; gap: 15px;
    .h-btn { background: none; border: none; color: #64748b; position: relative; padding: 8px; border-radius: 8px; &:hover { background: #f8f9fa; } }
    .notif-dot { position: absolute; top: 10px; right: 10px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; border: 2px solid #fff; }
    .profile-chip { .avatar { width: 40px; height: 40px; background: #1e293b; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; } }
    .mobile-toggle { display: none; @media (max-width: 992px) { display: block; background: none; border: none; color: #333; } }
  }
`;

const ContentContainer = styled.div` padding: 40px; @media (max-width: 768px) { padding: 20px; } `;

const StatsRow = styled.div` display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px; @media (max-width: 1200px) { grid-template-columns: repeat(2, 1fr); } @media (max-width: 768px) { grid-template-columns: 1fr; } `;

const StatBox = styled.div`
  background: #fff; border: 1px solid #e9ecef; border-radius: 20px; padding: 25px;
  position: relative; overflow: hidden;
  
  .lab { font-size: 0.85rem; color: #64748b; font-weight: 600; margin-bottom: 20px; }
  .icon-row { color: ${props => props.color}; margin-bottom: 15px; }
  .val { font-size: 2rem; font-weight: 800; color: #1e293b; margin-bottom: 15px; }
  .footer-text { font-size: 0.75rem; color: #94a3b8; span { color: #007bff; font-weight: 600; cursor: pointer; } }

  &::after { content: ''; position: absolute; right: -20px; top: -20px; width: 80px; height: 80px; background: ${props => props.color}; opacity: 0.03; border-radius: 50%; }
`;

const ChartCard = styled.div`
  background: #fff; border: 1px solid #e9ecef; border-radius: 20px; padding: 30px;
  &.flex-2 { flex: 2; } &.flex-1 { flex: 1; }

  .chart-header {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;
    h5 { font-weight: 800; color: #1e293b; margin: 0; }
    .tabs { display: flex; gap: 20px; button { background: none; border: none; color: #94a3b8; font-weight: 700; font-size: 0.85rem; padding-bottom: 10px; &.active { color: #007bff; border-bottom: 2px solid #007bff; } } }
    .legend { display: flex; gap: 20px; span { font-size: 0.75rem; color: #64748b; display: flex; align-items: center; gap: 8px; &::before { content: ''; width: 15px; height: 3px; border-radius: 2px; } &.actual::before { background: #007bff; } &.projected::before { background: #28a745; border-top: 1px dashed #28a745; } } }
    .dropdown { background: #f8f9fa; border: 1px solid #e9ecef; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 8px; }
  }

  .main-chart { position: relative; }
  .chart-footer { display: flex; justify-content: space-between; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px;
    .f-stat { span { display: block; font-size: 1.2rem; font-weight: 800; } small { color: #94a3b8; font-size: 0.75rem; } }
  }

  .bar-chart { height: 200px; display: flex; align-items: flex-end; justify-content: space-between; .bar-group { width: 12%; height: 100%; display: flex; align-items: flex-end; .bar { width: 100%; background: #007bff; border-radius: 6px; } } }
`;

const PayrollContainer = styled.div`
  display: flex; gap: 30px; animation: fadeIn 0.5s ease;
  @media (max-width: 1200px) { flex-direction: column; }

  .payroll-main {
    flex: 1; display: flex; flex-direction: column; gap: 30px;
    .payroll-header {
      display: flex; justify-content: space-between; align-items: center;
      .welcome { font-size: 1.8rem; font-weight: 900; margin: 0; color: #1e293b; }
      .pay-run-status { 
        display: flex; align-items: center; gap: 15px; background: #fff; padding: 10px 20px; border-radius: 12px; border: 1px solid #e2e8f0;
        span { font-size: 0.85rem; font-weight: 700; color: #64748b; }
        .badge-approved { background: #d1fae5; color: #065f46; padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; }
      }
    }
  }

  .hero-card {
    background: linear-gradient(135deg, #fff 0%, #f8faff 100%); border: 1px solid #e2e8f0; border-radius: 24px; padding: 35px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.02);
    .hero-stats {
      display: flex; align-items: center; justify-content: space-between;
      .stat-group {
        label { display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; letter-spacing: 1px; margin-bottom: 8px; }
        .amount { font-size: 2.2rem; font-weight: 900; color: #1e293b; }
        .date, .count { font-size: 1.4rem; font-weight: 800; color: #1e293b; }
      }
      .stat-divider { width: 1px; height: 50px; background: #e2e8f0; }
      .btn-black { background: #1e293b; color: #fff; border: none; padding: 15px 30px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: all 0.2s; &:hover { transform: scale(1.05); background: #000; } }
    }
    .hero-note { margin-top: 25px; padding-top: 20px; border-top: 1px solid #f1f5f9; display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #64748b; font-weight: 500; }
  }

  .payroll-grid {
    display: grid; grid-template-columns: 2fr 1fr; gap: 25px;
    .grid-card {
      background: #fff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 25px;
      h5 { font-weight: 800; margin: 0 0 20px 0; font-size: 0.9rem; color: #1e293b; }
      .link { color: #007bff; font-weight: 700; font-size: 0.8rem; cursor: pointer; &:hover { text-decoration: underline; } }
    }
    .deduction-row {
      display: flex; justify-content: space-between; margin-top: 20px;
      .deduction-item {
        text-align: center; flex: 1;
        .icon-circle { 
          width: 40px; height: 40px; background: #f1f5f9; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; color: #64748b;
          &.gold { background: #fef3c7; color: #d97706; }
          &.red { background: #fee2e2; color: #dc2626; }
        }
        label { display: block; font-size: 0.65rem; font-weight: 800; color: #94a3b8; margin-bottom: 5px; }
        .val { font-size: 0.95rem; font-weight: 800; color: #1e293b; margin-bottom: 5px; }
      }
    }
    .summary-body {
      .big-count { font-size: 2.5rem; font-weight: 900; color: #1e293b; margin: 10px 0; }
      label { font-size: 0.7rem; font-weight: 800; color: #94a3b8; }
    }
  }

  .chart-section {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 30px;
    .chart-mockup {
      margin-top: 25px;
      .bars { 
        height: 150px; display: flex; align-items: flex-end; gap: 15px; margin-bottom: 30px;
        .bar-stack { 
          flex: 1; display: flex; flex-direction: column; gap: 2px;
          .segment { border-radius: 2px; width: 100%; transition: all 0.3s; &:hover { opacity: 0.8; } }
          .segment.red { background: #ef4444; }
          .segment.orange { background: #f97316; }
          .segment.dark { background: #1e293b; }
        }
      }
      .chart-legend {
        display: flex; gap: 30px; padding-top: 20px; border-top: 1px solid #f1f5f9;
        .legend-item { 
          display: flex; align-items: center; gap: 10px; font-size: 0.75rem; font-weight: 700; color: #64748b;
          .dot { width: 10px; height: 10px; border-radius: 3px; }
          .dot.red { background: #ef4444; }
          .dot.orange { background: #f97316; }
          .dot.dark { background: #1e293b; }
        }
      }
    }
  }

  .payroll-sidebar {
    width: 320px; background: #fff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 25px;
    @media (max-width: 1200px) { width: 100%; }
    h5 { font-weight: 800; margin-bottom: 25px; color: #1e293b; }
    .task-list {
      display: flex; flex-direction: column; gap: 15px;
      .task-item {
        background: #f8fafc; border-radius: 16px; padding: 18px; display: flex; justify-content: space-between; align-items: center;
        .task-info {
          h6 { margin: 0; font-weight: 800; font-size: 0.85rem; color: #1e293b; }
          p { margin: 4px 0 0; font-size: 0.75rem; color: #94a3b8; font-weight: 600; }
        }
        .btn-outline { background: #fff; border: 1px solid #e2e8f0; color: #1e293b; font-weight: 800; font-size: 0.7rem; padding: 6px 12px; border-radius: 8px; cursor: pointer; &:hover { background: #1e293b; color: #fff; border-color: #1e293b; } }
      }
    }
  }
`;

const TableCard = styled.div`
  background: #fff; border: 1px solid #e9ecef; border-radius: 20px; padding: 30px;
  .table-header { 
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; 
    h2 { font-weight: 900; margin: 0; small { font-size: 0.6rem; color: #007bff; letter-spacing: 2px; display: block; } } 
    .refresh-btn { background: #f1f5f9; color: #64748b; border: none; padding: 10px 20px; border-radius: 10px; font-size: 0.8rem; font-weight: 700; }
    .add-btn { background: #1e293b; color: #fff; border: none; padding: 10px 20px; border-radius: 10px; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 8px; &:hover { background: #000; } }
  }
  .table { width: 100%; th { background: #f8f9fa; color: #64748b; font-size: 0.75rem; font-weight: 800; padding: 15px; border: none; } td { padding: 20px 15px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; } }
  .u-cell { display: flex; align-items: center; gap: 12px; .avatar-small { width: 32px; height: 32px; background: #e2e8f0; color: #1e293b; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; } .u-name { font-weight: 700; font-size: 0.9rem; } .u-email { font-size: 0.7rem; color: #64748b; } }
  .badge { padding: 6px 12px; border-radius: 8px; font-size: 0.7rem; font-weight: 700; border: none; }
  .bg-success-light { background: #d1fae5; color: #065f46; } .bg-danger-light { background: #fee2e2; color: #991b1b; } .bg-primary-light { background: #dbeafe; color: #1e40af; }
  .sync-badge { color: #007bff; font-weight: 900; font-size: 0.7rem; }
`;

const LoaderArea = styled.div` display: flex; align-items: center; justify-content: center; height: 300px; .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } } `;

const ModalOverlay = styled.div`
  position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px);
  display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;
  animation: fadeIn 0.3s ease;
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

const ModalContent = styled.div`
  background: #fff; width: 100%; max-width: 600px; border-radius: 32px; padding: 40px;
  box-shadow: 0 40px 100px rgba(0,0,0,0.3); position: relative;
  &.animate-in { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  
  .modal-header {
    display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;
    .title-area { 
      display: flex; gap: 20px; 
      .icon-wrap { background: #1e293b; color: #fff; padding: 12px; border-radius: 16px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
      h3 { margin: 0; font-weight: 900; letter-spacing: -1px; font-size: 1.5rem; }
      p { margin: 5px 0 0; font-size: 0.85rem; color: #64748b; font-weight: 500; }
    }
    .close-btn { background: #f1f5f9; border: none; color: #64748b; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; &:hover { background: #e2e8f0; color: #000; } }
  }

  .form-group {
    margin-bottom: 25px;
    label { display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; letter-spacing: 1px; margin-bottom: 10px; }
    .input-wrap {
      display: flex; align-items: center; gap: 12px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 4px 18px; transition: all 0.2s;
      svg { color: #cbd5e1; transition: color 0.2s; }
      input { width: 100%; background: none; border: none; outline: none; padding: 12px 0; font-weight: 600; font-size: 0.95rem; color: #1e293b; &::placeholder { color: #94a3b8; } }
      &:focus-within { border-color: #007bff; box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.1); svg { color: #007bff; } }
    }
  }

  .modal-footer {
    display: flex; gap: 20px; margin-top: 40px;
    button { flex: 1; padding: 16px; border-radius: 16px; font-weight: 800; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
    .cancel-btn { background: #f1f5f9; color: #64748b; border: none; &:hover { background: #e2e8f0; } }
    .submit-btn { background: #1e293b; color: #fff; border: none; box-shadow: 0 10px 25px rgba(30, 41, 59, 0.2); &:hover { background: #000; transform: translateY(-3px); box-shadow: 0 15px 30px rgba(0,0,0,0.2); } }
  }

  .payroll-detail-overlay {
    position: absolute; inset: 0; background: #f8fafc; z-index: 100; padding: 40px; display: flex; flex-direction: column; gap: 30px;
    &.animate-in { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
    
    .detail-header {
      display: flex; justify-content: space-between; align-items: center;
      .back-btn { background: none; border: none; color: #007bff; font-weight: 800; font-size: 0.8rem; display: flex; align-items: center; gap: 8px; cursor: pointer; &:hover { gap: 12px; } }
      h2 { font-weight: 900; margin: 0; small { font-size: 0.6rem; color: #94a3b8; letter-spacing: 2px; display: block; } }
      .export-btn { 
        background: #fff; border: 1.5px solid #e2e8f0; padding: 10px 18px; border-radius: 12px; font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; gap: 8px; cursor: pointer;
        transition: all 0.2s; &:hover { border-color: #007bff; color: #007bff; transform: translateY(-2px); }
        &.pdf { border-color: #fee2e2; color: #dc2626; &:hover { background: #fee2e2; } }
      }
    }

    .interactive-table {
      tr { cursor: pointer; transition: all 0.2s; &:hover { background: rgba(0, 123, 255, 0.03) !important; transform: scale(1.005); } }
    }

    .drawer-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); z-index: 1000; animation: fadeIn 0.3s ease; }
    .pay-slip-drawer {
      position: fixed; top: 0; right: 0; height: 100vh; width: 450px; background: #fff; z-index: 1100; padding: 40px; box-shadow: -20px 0 50px rgba(0,0,0,0.1);
      display: flex; flex-direction: column; gap: 30px;
      @media (max-width: 500px) { width: 100%; }
      &.animate-slide-left { animation: slideLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }

      .drawer-header {
        display: flex; justify-content: space-between; align-items: center;
        h3 { margin: 0; font-weight: 900; letter-spacing: -0.5px; }
        button { background: #f1f5f9; border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #64748b; &:hover { background: #e2e8f0; color: #000; } }
      }

      .slip-profile {
        display: flex; align-items: center; gap: 20px; background: #f8fafc; padding: 25px; border-radius: 24px;
        .big-avatar { width: 64px; height: 64px; background: #1e293b; color: #fff; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 900; }
        h4 { margin: 0; font-weight: 800; font-size: 1.2rem; }
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

export default AdminDashboard;
