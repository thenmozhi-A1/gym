import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
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
  ArrowUpRight,
  Shield,
  Activity as PulseIcon,
  Monitor
} from "lucide-react";

const API_BASE = "https://gymj-9.onrender.com/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "ADMIN") navigate("/login");
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoints = activeTab === "overview" || activeTab === "users" 
        ? ["users", "payments", "attendance", "consultations"]
        : [activeTab];
      
      const results = await Promise.all(
        endpoints.map(ep => fetch(`${API_BASE}/${ep}`).then(r => r.json()))
      );

      if (activeTab === "overview" || activeTab === "users") {
        setUsers(results[0]); setPayments(results[1]); setAttendance(results[2]); setConsultations(results[3]);
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

  const filteredData = () => {
    const t = searchTerm.toLowerCase();
    if (activeTab === "users") return users.filter(u => u.fullName?.toLowerCase().includes(t));
    if (activeTab === "payments") return payments.filter(p => (p.user?.fullName || p.fullName || "").toLowerCase().includes(t));
    if (activeTab === "attendance") return attendance.filter(a => (a.user?.fullName || a.fullName || "").toLowerCase().includes(t));
    return consultations;
  };

  return (
    <BentoWrapper>
      <StarField />
      
      {/* ── TOP NAV MODEL ── */}
      <TopNavigation>
        <div className="nav-container">
          <Brand>
            <div className="icon-box"><Shield size={20} /></div>
            <span>SLAYFIT <small>SYSTEMS</small></span>
          </Brand>

          <NavLinks>
            {[
              { id: "overview", label: "OVERVIEW", icon: <Layout size={16} /> },
              { id: "users", label: "WARRIORS", icon: <Users size={16} /> },
              { id: "payments", label: "REVENUE", icon: <CreditCard size={16} /> },
              { id: "attendance", label: "LOGS", icon: <Clock size={16} /> }
            ].map(link => (
              <NavLink 
                key={link.id} 
                active={activeTab === link.id}
                onClick={() => setActiveTab(link.id)}
              >
                {link.icon} <span>{link.label}</span>
              </NavLink>
            ))}
          </NavLinks>

          <UserActions>
            <div className="search-bar">
              <Search size={16} />
              <input placeholder="SYS_SEARCH..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button className="logout-icon" onClick={handleLogout}><LogOut size={20} /></button>
            <button className="mobile-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <MenuIcon />}
            </button>
          </UserActions>
        </div>
      </TopNavigation>

      {isMobileMenuOpen && (
        <MobileMenu>
          {["overview", "users", "payments", "attendance"].map(id => (
            <button key={id} onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }}>{id.toUpperCase()}</button>
          ))}
          <button onClick={handleLogout} className="text-danger">LOGOUT</button>
        </MobileMenu>
      )}

      <MainContent>
        <div className="bento-grid reveal">
          {activeTab === "overview" && (
            <>
              {/* BENTO LARGE: Performance */}
              <BentoItem className="large-card" glow="#ffc107">
                <div className="card-header">
                  <h5>REVENUE PERFORMANCE</h5>
                  <span className="status">LIVE_SYNC</span>
                </div>
                <ChartContainer>
                  <div className="bars-area">
                    {[40, 65, 45, 85, 55, 95, 75, 60, 80, 50].map((h, i) => (
                      <div className="bar-wrap" key={i}>
                        <div className="bar" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}></div>
                      </div>
                    ))}
                  </div>
                  <div className="chart-info">
                    <div className="stat">
                      <span className="lab">TOTAL REVENUE</span>
                      <span className="val">₹{payments.reduce((acc, p) => acc + (p.amount || 0), 0).toLocaleString()}</span>
                    </div>
                    <div className="stat">
                      <span className="lab">GROWTH</span>
                      <span className="val text-success">+14.2%</span>
                    </div>
                  </div>
                </ChartContainer>
              </BentoItem>

              {/* BENTO SQUARE: Active Users */}
              <BentoItem className="square-card" glow="#4318ff">
                <div className="card-header"><h5>WARRIORS</h5></div>
                <div className="big-num">{users.length}</div>
                <p className="sub">Active Arena Members</p>
                <div className="user-stack">
                  {[1, 2, 3, 4].map(i => <div key={i} className="mini-avatar"></div>)}
                  <div className="more">+{users.length - 4}</div>
                </div>
              </BentoItem>

              {/* BENTO SQUARE: Attendance */}
              <BentoItem className="square-card" glow="#05cd99">
                <div className="card-header"><h5>LOGS</h5></div>
                <div className="big-num">{attendance.length}</div>
                <p className="sub">Daily Sessions Logged</p>
                <PulseRing><PulseIcon size={32} /></PulseRing>
              </BentoItem>

              {/* BENTO MEDIUM: Recent Activity */}
              <BentoItem className="medium-card" glow="#fff">
                <div className="card-header"><h5>SYSTEM ACTIVITY</h5></div>
                <ActivityList>
                  {[...payments.slice(0, 2), ...attendance.slice(0, 2)].map((item, i) => (
                    <div className="act-item" key={i}>
                      <div className="dot" />
                      <div className="text">
                        <span className="user">{item.user?.fullName || item.fullName || "Warrior"}</span>
                        <span className="desc">{item.amount ? `purchased a plan` : `checked into arena`}</span>
                      </div>
                      <span className="time">{item.paymentDate || item.attendanceDate}</span>
                    </div>
                  ))}
                </ActivityList>
              </BentoItem>

              {/* BENTO SMALL: Server Status */}
              <BentoItem className="small-card" glow="#ff5b5b">
                <div className="d-flex align-items-center gap-3">
                  <Monitor size={20} className="text-danger" />
                  <div>
                    <h6 className="m-0 fw-bold">SERVER_CORE</h6>
                    <small className="text-secondary">Uptime: 99.9%</small>
                  </div>
                </div>
              </BentoItem>
            </>
          )}

          {activeTab !== "overview" && (
            <BentoItem className="full-card">
              <div className="card-header border-bottom pb-3 mb-3">
                <h2 className="m-0 fw-black italic">{activeTab.toUpperCase()} <span className="text-warning">LIST</span></h2>
              </div>
              <TableWrapper>
                {loading ? (
                  <div className="p-5 text-center"><div className="spinner-border text-warning"></div></div>
                ) : (
                  <table className="table table-dark table-hover mb-0">
                    <thead>
                      <tr>
                        {activeTab === "users" && <><th>WARRIOR</th><th>STATUS</th><th>ACTIONS</th></>}
                        {activeTab === "payments" && <><th>USER</th><th>AMOUNT</th><th>STATUS</th></>}
                        {activeTab === "attendance" && <><th>USER</th><th>DATE</th><th>IN</th></>}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData().map((u, i) => (
                        <tr key={i}>
                          {activeTab === "users" && (
                            <>
                              <td className="fw-bold">{u.fullName}</td>
                              <td><span className={`badge ${u.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}>{u.status}</span></td>
                              <td><button className="btn btn-sm btn-outline-warning">MANAGE</button></td>
                            </>
                          )}
                          {activeTab === "payments" && (
                            <>
                              <td className="fw-bold">{u.user?.fullName || u.fullName || "---"}</td>
                              <td className="text-warning">₹{u.amount}</td>
                              <td>{u.paymentStatus}</td>
                            </>
                          )}
                          {activeTab === "attendance" && (
                            <>
                              <td className="fw-bold">{u.user?.fullName || u.fullName || "---"}</td>
                              <td>{u.attendanceDate}</td>
                              <td className="text-success">{u.checkInTime}</td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </TableWrapper>
            </BentoItem>
          )}
        </div>
      </MainContent>
    </BentoWrapper>
  );
};

// ── STYLED COMPONENTS (The "Bento Grid" Model) ──

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const BentoWrapper = styled.div`
  min-height: 100vh; background: #000; color: #fff;
  font-family: 'Inter', sans-serif; position: relative;
`;

const StarField = styled.div`
  position: fixed; inset: 0;
  background-image: radial-gradient(1px 1px at 20px 30px, #eee, rgba(0,0,0,0)), radial-gradient(1px 1px at 40px 70px, #fff, rgba(0,0,0,0));
  background-size: 200px 200px; opacity: 0.1; pointer-events: none;
`;

const TopNavigation = styled.nav`
  position: sticky; top: 20px; z-index: 1000; padding: 0 40px;
  @media (max-width: 768px) { padding: 0 20px; top: 10px; }

  .nav-container {
    background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px;
    padding: 12px 30px; display: flex; justify-content: space-between; align-items: center;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  }
`;

const Brand = styled.div`
  display: flex; align-items: center; gap: 12px;
  .icon-box { background: #ffc107; padding: 6px; border-radius: 8px; color: black; }
  span { font-weight: 900; letter-spacing: -0.5px; font-size: 1.1rem; }
  small { display: block; font-size: 0.5rem; letter-spacing: 2px; color: #ffc107; }
`;

const NavLinks = styled.div`
  display: flex; gap: 10px;
  @media (max-width: 992px) { display: none; }
`;

const NavLink = styled.button`
  background: ${props => props.active ? "rgba(255, 255, 255, 0.1)" : "transparent"};
  border: none; color: ${props => props.active ? "#ffc107" : "#888"};
  padding: 8px 18px; border-radius: 12px; font-weight: 700; font-size: 0.8rem;
  display: flex; align-items: center; gap: 10px; transition: all 0.3s ease;
  &:hover { color: white; background: rgba(255, 255, 255, 0.05); }
`;

const UserActions = styled.div`
  display: flex; align-items: center; gap: 20px;
  .search-bar {
    background: rgba(0, 0, 0, 0.2); border-radius: 10px; padding: 6px 15px;
    display: flex; align-items: center; gap: 10px; width: 200px;
    input { background: none; border: none; outline: none; color: white; font-size: 0.75rem; width: 100%; }
    svg { color: #555; }
    @media (max-width: 768px) { display: none; }
  }
  .logout-icon { background: none; border: none; color: #ff5b5b; cursor: pointer; &:hover { transform: scale(1.1); } }
  .mobile-btn { display: none; background: none; border: none; color: white; @media (max-width: 992px) { display: block; } }
`;

const MobileMenu = styled.div`
  position: fixed; top: 80px; left: 20px; right: 20px; background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px); padding: 20px; border-radius: 20px; z-index: 999;
  display: flex; flex-direction: column; gap: 15px; border: 1px solid #222;
  button { background: none; border: none; color: white; font-weight: 800; padding: 10px; text-align: left; }
`;

const MainContent = styled.main`
  padding: 40px; margin-top: 20px;
  .reveal { animation: ${slideUp} 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  
  .bento-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 200px; gap: 20px;
    @media (max-width: 1200px) { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: 768px) { grid-template-columns: 1fr; grid-auto-rows: auto; }
  }

  .large-card { grid-column: span 2; grid-row: span 2; }
  .medium-card { grid-column: span 2; grid-row: span 1; }
  .full-card { grid-column: span 4; min-height: 500px; }
`;

const BentoItem = styled.div`
  background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 30px; padding: 30px; position: relative; overflow: hidden;
  transition: all 0.4s ease;
  
  &:hover {
    transform: translateY(-5px); border-color: ${props => props.glow};
    box-shadow: 0 10px 40px ${props => props.glow}11;
  }

  .card-header {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
    h5 { font-size: 0.75rem; font-weight: 900; color: #555; letter-spacing: 1.5px; margin: 0; }
    .status { font-size: 0.6rem; color: #ffc107; font-weight: 900; }
  }

  .big-num { font-size: 4rem; font-weight: 900; letter-spacing: -2px; line-height: 1; }
  .sub { color: #666; font-size: 0.85rem; font-weight: 600; margin-top: 10px; }
`;

const ChartContainer = styled.div`
  height: 100%; display: flex; flex-direction: column; justify-content: flex-end;
  .bars-area { height: 180px; display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 30px; }
  .bar-wrap { width: 8%; height: 100%; display: flex; align-items: flex-end; }
  .bar { width: 100%; background: #ffc107; border-radius: 6px; animation: ${slideUp} 1s ease forwards; }
  .chart-info { display: flex; gap: 40px; .stat { .lab { display: block; font-size: 0.65rem; color: #555; font-weight: 800; } .val { font-size: 1.5rem; font-weight: 900; } } }
`;

const ActivityList = styled.div`
  display: flex; flex-direction: column; gap: 15px;
  .act-item {
    display: flex; align-items: center; gap: 15px;
    .dot { width: 6px; height: 6px; background: #ffc107; border-radius: 50%; box-shadow: 0 0 10px #ffc107; }
    .text { flex: 1; .user { font-weight: 700; margin-right: 8px; } .desc { color: #666; font-size: 0.85rem; } }
    .time { font-size: 0.75rem; color: #444; font-weight: 700; }
  }
`;

const PulseRing = styled.div`
  position: absolute; bottom: 20px; right: 20px; color: #05cd99; animation: ${float} 3s ease-in-out infinite;
`;

const TableWrapper = styled.div`
  background: rgba(0,0,0,0.2); border-radius: 20px; overflow: hidden;
  .table { th { border: none; padding: 20px; font-size: 0.8rem; color: #555; font-weight: 900; } td { padding: 20px; border-color: rgba(255,255,255,0.02); } }
`;

export default AdminDashboard;
