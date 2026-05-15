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
  Trash2
} from "lucide-react";

const API_BASE = "https://gymj-9.onrender.com/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "ADMIN") navigate("/login");
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoints = activeTab === "dashboard" || activeTab === "users"
        ? ["users", "payments", "attendance", "consultations"]
        : [activeTab];

      const results = await Promise.all(
        endpoints.map(ep => fetch(`${API_BASE}/${ep}`).then(r => r.json()))
      );

      if (activeTab === "dashboard" || activeTab === "users") {
        setUsers(results[0]); setPayments(results[1]); setAttendance(results[2]); setConsultations(results[3]);
        // Mock trainers data for the new section
        setTrainers([
          { id: 1, name: "Alex Johnson", specialty: "Bodybuilding", students: 12, times: "06:00 AM - 11:00 AM" },
          { id: 2, name: "Maya Patel", specialty: "Yoga & Flexibility", students: 18, times: "04:00 PM - 08:00 PM" },
          { id: 3, name: "Chris Lee", specialty: "Crossfit", students: 15, times: "07:00 AM - 12:00 PM" },
          { id: 4, name: "Sophia Martinez", specialty: "HIIT & Cardio", students: 22, times: "05:00 PM - 09:00 PM" }
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
            { id: "trainers", icon: <Layers size={18} />, label: "Trainers" },
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
              {activeTab === "dashboard" && (
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
                        <div className="line-sim">
                          <svg width="100%" height="200" viewBox="0 0 1000 200" preserveAspectRatio="none">
                            <path d="M0,150 L100,120 L200,160 L300,100 L400,130 L500,80 L600,110 L700,60 L800,100 L900,50 L1000,90" fill="none" stroke="#007bff" strokeWidth="3" />
                            <path d="M0,160 L100,140 L200,170 L300,130 L400,150 L500,110 L600,130 L700,90 L800,120 L900,80 L1000,110" fill="none" stroke="#28a745" strokeWidth="2" strokeDasharray="5,5" />
                          </svg>
                        </div>
                        <div className="chart-footer">
                          <div className="f-stat"><span>275K</span><small>New Users</small></div>
                          <div className="f-stat"><span>3m 12s</span><small>Avg. Session</small></div>
                          <div className="f-stat"><span>3.72 M</span><small>Subscribers</small></div>
                          <div className="f-stat"><span>523K</span><small>Page View</small></div>
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
              )}

              {activeTab !== "dashboard" && (
                <TableCard>
                  <div className="table-header">
                    <h2>{activeTab.toUpperCase()} <small>MANAGEMENT</small></h2>
                    <button onClick={fetchData} className="refresh-btn">REFRESH SYSTEM</button>
                  </div>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          {activeTab === "users" && <><th>WARRIOR</th><th>STATUS</th><th>TYPE</th><th>ACTIONS</th></>}
                          {activeTab === "payments" && <><th>WARRIOR</th><th>AMOUNT</th><th>STATUS</th><th>DATE</th></>}
                          {activeTab === "attendance" && <><th>WARRIOR</th><th>DATE</th><th>IN</th><th>STATE</th></>}
                          {activeTab === "consultations" && <><th>WARRIOR INFO</th><th>MESSAGE / GOALS</th><th>DATE</th></>}
                          {activeTab === "trainers" && <><th>TRAINER</th><th>SPECIALTY</th><th>STUDENTS</th><th>HANDLING TIME</th></>}
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
                        {activeTab === "trainers" && trainers.map(t => (
                          <tr key={t.id}>
                            <td>
                              <div className="u-cell">
                                <div className="avatar-small bg-primary-light text-primary">{t.name.charAt(0)}</div>
                                <div className="fw-bold">{t.name}</div>
                              </div>
                            </td>
                            <td>{t.specialty}</td>
                            <td><span className="badge bg-success-light">{t.students} Students</span></td>
                            <td className="fw-bold text-secondary">{t.times}</td>
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

const TableCard = styled.div`
  background: #fff; border: 1px solid #e9ecef; border-radius: 20px; padding: 30px;
  .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; h2 { font-weight: 900; margin: 0; small { font-size: 0.6rem; color: #007bff; letter-spacing: 2px; display: block; } } .refresh-btn { background: #1e293b; color: #fff; border: none; padding: 10px 20px; border-radius: 10px; font-size: 0.8rem; font-weight: 700; } }
  .table { width: 100%; th { background: #f8f9fa; color: #64748b; font-size: 0.75rem; font-weight: 800; padding: 15px; border: none; } td { padding: 20px 15px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; } }
  .u-cell { display: flex; align-items: center; gap: 12px; .avatar-small { width: 32px; height: 32px; background: #e2e8f0; color: #1e293b; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; } .u-name { font-weight: 700; font-size: 0.9rem; } .u-email { font-size: 0.7rem; color: #64748b; } }
  .badge { padding: 6px 12px; border-radius: 8px; font-size: 0.7rem; font-weight: 700; border: none; }
  .bg-success-light { background: #d1fae5; color: #065f46; } .bg-danger-light { background: #fee2e2; color: #991b1b; } .bg-primary-light { background: #dbeafe; color: #1e40af; }
  .sync-badge { color: #007bff; font-weight: 900; font-size: 0.7rem; }
`;

const LoaderArea = styled.div` display: flex; align-items: center; justify-content: center; height: 300px; .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } } `;
const Overlay = styled.div` position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 450; `;

export default AdminDashboard;
