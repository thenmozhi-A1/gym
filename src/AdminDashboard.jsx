import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Users,
  CreditCard,
  Clock,
  LogOut,
  Search,
  Filter,
  AlertCircle,
  Trash2,
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
  Layers,
  PieChart,
  Shield,
  Bell
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
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState(null);

  // Role Protection
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn || role !== "ADMIN") {
      alert("Access Denied: Admins Only!");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("reveal-visible");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeTab, loading]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "overview" || activeTab === "users") {
        const [uRes, pRes, aRes, cRes] = await Promise.all([
          fetch(`${API_BASE}/users`),
          fetch(`${API_BASE}/payments`),
          fetch(`${API_BASE}/attendance`),
          fetch(`${API_BASE}/consultations`)
        ]);
        const uData = await uRes.json();
        const pData = await pRes.json();
        const aData = await aRes.json();
        const cData = await cRes.json();
        setUsers(Array.isArray(uData) ? uData : []);
        setPayments(Array.isArray(pData) ? pData : []);
        setAttendance(Array.isArray(aData) ? aData : []);
        setConsultations(Array.isArray(cData) ? cData : []);
      } else if (activeTab === "payments") {
        const res = await fetch(`${API_BASE}/payments`);
        const data = await res.json();
        setPayments(Array.isArray(data) ? data : []);
      } else if (activeTab === "attendance") {
        const res = await fetch(`${API_BASE}/attendance`);
        const data = await res.json();
        setAttendance(Array.isArray(data) ? data : []);
      } else if (activeTab === "consultations") {
        const res = await fetch(`${API_BASE}/consultations`);
        const data = await res.json();
        setConsultations(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError("Failed to sync arena data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (user, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, status: newStatus })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      }
    } catch (err) {
      alert("Status update failed.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Permanent deletion cannot be undone. Proceed?")) return;
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, { method: "DELETE" });
      if (res.ok) setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert("Deletion failed.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredUsers = users.filter(u =>
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayments = payments.filter(p =>
    (p.user?.fullName || p.fullName || p.userName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAttendance = attendance.filter(a =>
    (a.user?.fullName || a.fullName || a.userName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout>
      <BackgroundMesh />
      
      {/* ── FLOATING NAVIGATION ── */}
      <FloatingSidebar isOpen={isSidebarOpen}>
        <SidebarContent>
          <Brand>
            <div className="logo-box"><Shield size={24} color="black" /></div>
            <div className="text">
              <h3>SLAYFIT</h3>
              <span>COMMAND CENTER</span>
            </div>
          </Brand>

          <NavList>
            {[
              { id: "overview", icon: <Layout size={20} />, label: "Dashboard" },
              { id: "users", icon: <Users size={20} />, label: "Warriors" },
              { id: "payments", icon: <PieChart size={20} />, label: "Revenue" },
              { id: "attendance", icon: <Layers size={20} />, label: "Arena Logs" },
              { id: "consultations", icon: <MessageSquare size={20} />, label: "Inquiries" }
            ].map(item => (
              <NavItem 
                key={item.id} 
                active={activeTab === item.id}
                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              >
                {item.icon} <span>{item.label}</span>
              </NavItem>
            ))}
          </NavList>

          <LogoutArea>
            <button onClick={handleLogout}><LogOut size={20} /> <span>LOGOUT</span></button>
          </LogoutArea>
        </SidebarContent>
      </FloatingSidebar>

      <MainStage>
        {/* ── TOP ACTION BAR ── */}
        <TopBar className="reveal">
          <div className="search-wrapper">
            <Search size={18} />
            <input 
              type="text" 
              placeholder={`Search ${activeTab} records...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="user-actions">
            <button className="icon-btn"><Bell size={20} /></button>
            <div className="admin-profile">
              <div className="avatar">AD</div>
              <div className="info">
                <span className="name">Commander</span>
                <span className="role">Senior Admin</span>
              </div>
            </div>
            <button className="mobile-toggle" onClick={() => setIsSidebarOpen(true)}><MenuIcon /></button>
          </div>
        </TopBar>

        {/* ── DASHBOARD MODULES ── */}
        <div className="content-grid">
          <WelcomeHeader className="reveal">
            <h2>SYSTEM <span className="text-warning">STATUS</span>: OPTIMAL</h2>
            <p>Welcome back, Commander. Here's your daily arena report.</p>
          </WelcomeHeader>

          <ModulesRow className="reveal">
            <ModuleCard color="#4318ff">
              <div className="module-info">
                <span className="label">ACTIVE WARRIORS</span>
                <h4 className="value">{users.length}</h4>
                <span className="trend positive">+12% vs last month</span>
              </div>
              <div className="module-icon"><Users size={24} /></div>
            </ModuleCard>
            <ModuleCard color="#05cd99">
              <div className="module-info">
                <span className="label">MONTHLY REVENUE</span>
                <h4 className="value">₹{payments.reduce((acc, p) => acc + (p.amount || 0), 0).toLocaleString()}</h4>
                <span className="trend positive">+8.4% growth</span>
              </div>
              <div className="module-icon"><CreditCard size={24} /></div>
            </ModuleCard>
            <ModuleCard color="#ffc107">
              <div className="module-info">
                <span className="label">DAILY SESSIONS</span>
                <h4 className="value">{attendance.length}</h4>
                <span className="trend">System Stable</span>
              </div>
              <div className="module-icon"><Zap size={24} /></div>
            </ModuleCard>
          </ModulesRow>

          <MainPanel className="reveal">
            {loading ? (
              <GlassLoader>
                <div className="orbit"></div>
                <span>UPDATING SYSTEM...</span>
              </GlassLoader>
            ) : (
              <div className="panel-content">
                {activeTab === "overview" && (
                  <OverviewModule>
                    <div className="row g-4">
                      <div className="col-lg-8">
                        <ModulePane>
                          <h5>ARENA TRAFFIC (7D)</h5>
                          <div className="chart-area">
                            <div className="bar-chart">
                              {[35, 55, 45, 80, 60, 90, 75].map((h, i) => (
                                <div className="bar-wrap" key={i}>
                                  <div className="bar" style={{ height: `${h}%` }}></div>
                                  <span className="label">DAY {i+1}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </ModulePane>
                      </div>
                      <div className="col-lg-4">
                        <ModulePane>
                          <h5>DISTRIBUTION</h5>
                          <div className="dist-stats">
                            <div className="dist-item">
                              <div className="d-flex justify-content-between"><span>Elite</span><span>65%</span></div>
                              <div className="prog"><div className="fill" style={{width: '65%'}}></div></div>
                            </div>
                            <div className="dist-item">
                              <div className="d-flex justify-content-between"><span>Pro</span><span>25%</span></div>
                              <div className="prog"><div className="fill warning" style={{width: '25%'}}></div></div>
                            </div>
                            <div className="dist-item">
                              <div className="d-flex justify-content-between"><span>Guest</span><span>10%</span></div>
                              <div className="prog"><div className="fill danger" style={{width: '10%'}}></div></div>
                            </div>
                          </div>
                        </ModulePane>
                      </div>
                    </div>
                  </OverviewModule>
                )}

                {activeTab !== "overview" && (
                  <TableArea>
                    <table className="glass-table">
                      <thead>
                        <tr>
                          {activeTab === "users" && <><th style={{width: '300px'}}>WARRIOR</th><th>STATUS</th><th>LEVEL</th><th>ACTIONS</th></>}
                          {activeTab === "payments" && <><th>USER</th><th>PLAN</th><th>AMOUNT</th><th>STATUS</th><th>DATE</th></>}
                          {activeTab === "attendance" && <><th>WARRIOR</th><th>SESSION DATE</th><th>CHECK-IN</th><th>STATUS</th></>}
                          {activeTab === "consultations" && <><th>USER</th><th>MESSAGE / GOALS</th><th>DATE</th></>}
                        </tr>
                      </thead>
                      <tbody>
                        {activeTab === "users" && filteredUsers.map(u => (
                          <tr key={u.id}>
                            <td>
                              <div className="user-profile">
                                <div className="avatar">{u.fullName.charAt(0)}</div>
                                <div><div className="name">{u.fullName}</div><div className="email">{u.email}</div></div>
                              </div>
                            </td>
                            <td><StatusPill status={u.status}>{u.status}</StatusPill></td>
                            <td>{u.membershipType || "Standard"}</td>
                            <td>
                              <div className="actions">
                                <button className="act-btn tick" onClick={() => handleUpdateStatus(u, "ACTIVE")}><CheckCircle size={16} /></button>
                                <button className="act-btn cross" onClick={() => handleUpdateStatus(u, "INACTIVE")}><XCircle size={16} /></button>
                                <button className="act-btn trash" onClick={() => handleDeleteUser(u.id)}><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {activeTab === "payments" && filteredPayments.map(p => (
                          <tr key={p.id}>
                            <td className="fw-bold">{p.user?.fullName || p.fullName || p.userName || "Unknown"}</td>
                            <td>{p.planName || "Monthly"}</td>
                            <td className="text-warning fw-bold">₹{p.amount}</td>
                            <td><StatusPill status={p.paymentStatus}>{p.paymentStatus}</StatusPill></td>
                            <td className="sub-text">{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "---"}</td>
                          </tr>
                        ))}
                        {activeTab === "attendance" && filteredAttendance.map(log => (
                          <tr key={log.id}>
                            <td className="fw-bold">{log.user?.fullName || log.fullName || log.userName || "Unknown"}</td>
                            <td>{log.attendanceDate}</td>
                            <td className="text-success fw-bold">{log.checkInTime}</td>
                            <td><StatusPill status="ACTIVE">PRESENT</StatusPill></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableArea>
                )}
              </div>
            )}
          </MainPanel>
        </div>
      </MainStage>

      {isSidebarOpen && <Overlay onClick={() => setIsSidebarOpen(false)} />}
    </PageLayout>
  );
};

// ── STYLED COMPONENTS (New "Modular Command" Model) ──

const PageLayout = styled.div`
  min-height: 100vh;
  background: #050505;
  color: white;
  display: flex;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  position: relative;
`;

const BackgroundMesh = styled.div`
  position: fixed; inset: 0; pointer-events: none;
  background: 
    radial-gradient(circle at 0% 0%, rgba(67, 24, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 100% 100%, rgba(255, 193, 7, 0.05) 0%, transparent 50%);
  z-index: 1;
`;

const FloatingSidebar = styled.div`
  width: 300px;
  padding: 30px;
  height: 100vh;
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 992px) {
    position: fixed;
    left: 0;
    transform: ${props => props.isOpen ? "translateX(0)" : "translateX(-100%)"};
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const SidebarContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Brand = styled.div`
  display: flex; align-items: center; gap: 15px; margin-bottom: 60px;
  .logo-box { background: #ffc107; padding: 10px; border-radius: 12px; }
  h3 { font-size: 1.4rem; font-weight: 950; font-style: italic; margin: 0; }
  span { font-size: 0.65rem; font-weight: 800; color: #666; letter-spacing: 2px; }
`;

const NavList = styled.div` display: flex; flex-direction: column; gap: 8px; flex: 1; `;

const NavItem = styled.div`
  display: flex; align-items: center; gap: 15px; padding: 16px 20px; border-radius: 14px;
  cursor: pointer; transition: all 0.3s ease; font-weight: 700;
  color: ${props => props.active ? "black" : "#777"};
  background: ${props => props.active ? "#ffc107" : "transparent"};
  box-shadow: ${props => props.active ? "0 10px 25px rgba(255, 193, 7, 0.3)" : "none"};

  &:hover {
    color: ${props => props.active ? "black" : "white"};
    background: ${props => props.active ? "#ffc107" : "rgba(255,255,255,0.03)"};
  }

  span { font-size: 0.95rem; }
`;

const LogoutArea = styled.div`
  button {
    width: 100%; display: flex; align-items: center; gap: 12px; padding: 15px; border-radius: 14px;
    background: rgba(255, 91, 91, 0.05); border: 1px solid rgba(255, 91, 91, 0.1);
    color: #ff5b5b; font-weight: 800; cursor: pointer; transition: all 0.3s ease;
    &:hover { background: #ff5b5b; color: white; }
  }
`;

const MainStage = styled.div`
  flex: 1; padding: 40px 60px; z-index: 2;
  @media (max-width: 992px) { padding: 30px 20px; }
  
  .reveal {
    opacity: 0; transform: translateY(20px); transition: all 0.8s ease;
    &.reveal-visible { opacity: 1; transform: translateY(0); }
  }
`;

const TopBar = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 50px;
  
  .search-wrapper {
    background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 15px; padding: 12px 25px; display: flex; align-items: center; gap: 15px; width: 400px;
    input { background: none; border: none; outline: none; color: white; width: 100%; font-weight: 500; }
    svg { color: #ffc107; }
  }

  .user-actions {
    display: flex; align-items: center; gap: 25px;
    .icon-btn { background: none; border: none; color: #666; cursor: pointer; &:hover { color: #ffc107; } }
    .admin-profile {
      display: flex; align-items: center; gap: 15px;
      .avatar { width: 42px; height: 42px; background: #222; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #ffc107; }
      .info { .name { display: block; font-weight: 800; font-size: 0.9rem; } .role { font-size: 0.7rem; color: #666; font-weight: 600; } }
    }
    .mobile-toggle { display: none; background: none; border: none; color: #ffc107; cursor: pointer; @media (max-width: 992px) { display: block; } }
  }

  @media (max-width: 768px) { .search-wrapper { display: none; } }
`;

const WelcomeHeader = styled.div`
  margin-bottom: 40px;
  h2 { font-size: 2.2rem; font-weight: 950; font-style: italic; letter-spacing: -1px; }
  p { color: #666; font-weight: 500; }
  .text-warning { color: #ffc107; }
`;

const ModulesRow = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; margin-bottom: 40px;
  @media (max-width: 1200px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const ModuleCard = styled.div`
  background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px; padding: 30px; display: flex; justify-content: space-between; align-items: flex-end;
  position: relative; overflow: hidden;
  
  &::before {
    content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: ${props => props.color};
  }

  .module-info {
    .label { color: #666; font-size: 0.75rem; font-weight: 900; letter-spacing: 1px; display: block; margin-bottom: 8px; }
    .value { font-size: 1.8rem; font-weight: 900; margin: 0; }
    .trend { font-size: 0.75rem; font-weight: 700; color: #444; &.positive { color: #05cd99; } }
  }
  .module-icon { width: 50px; height: 50px; border-radius: 12px; background: rgba(255,255,255,0.02); display: flex; align-items: center; justify-content: center; color: ${props => props.color}; }
`;

const MainPanel = styled.div`
  background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 30px; padding: 40px; min-height: 500px;
  @media (max-width: 768px) { padding: 25px; }
`;

const OverviewModule = styled.div`
  .chart-area { height: 250px; display: flex; align-items: flex-end; padding-top: 30px; }
  .bar-chart { display: flex; align-items: flex-end; justify-content: space-between; width: 100%; height: 100%; }
  .bar-wrap { 
    width: 12%; display: flex; flex-direction: column; align-items: center; gap: 15px; 
    .bar { width: 100%; background: #ffc107; border-radius: 6px; min-height: 5px; transition: all 1s ease; box-shadow: 0 0 15px rgba(255, 193, 7, 0.2); }
    .label { font-size: 0.6rem; font-weight: 900; color: #444; }
  }
`;

const ModulePane = styled.div`
  background: rgba(0,0,0,0.2); border-radius: 20px; padding: 25px; border: 1px solid rgba(255,255,255,0.01); height: 100%;
  h5 { font-size: 0.8rem; font-weight: 900; letter-spacing: 1.5px; color: #ffc107; margin-bottom: 25px; }
  
  .dist-item {
    margin-bottom: 20px;
    span { font-size: 0.8rem; font-weight: 700; color: #666; }
    .prog { height: 5px; background: #111; border-radius: 10px; margin-top: 8px; overflow: hidden;
      .fill { height: 100%; background: #4318ff; &.warning { background: #ffc107; } &.danger { background: #ff5b5b; } }
    }
  }
`;

const TableArea = styled.div`
  overflow-x: auto;
  .glass-table {
    width: 100%; border-collapse: collapse; min-width: 800px;
    th { text-align: left; padding: 15px 20px; color: #666; font-size: 0.75rem; font-weight: 950; letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    td { padding: 25px 20px; border-bottom: 1px solid rgba(255,255,255,0.02); font-size: 0.95rem; }
  }
  .user-profile {
    display: flex; align-items: center; gap: 15px;
    .avatar { width: 42px; height: 42px; background: rgba(255,255,255,0.03); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #ffc107; }
    .name { font-weight: 800; } .email { font-size: 0.75rem; color: #555; }
  }
  .actions { display: flex; gap: 10px;
    .act-btn { background: rgba(255,255,255,0.02); border: none; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #444; cursor: pointer; transition: all 0.3s ease;
      &:hover { color: white; background: rgba(255,255,255,0.05); transform: translateY(-2px); }
      &.tick:hover { color: #05cd99; } &.cross:hover { color: #ffc107; } &.trash:hover { color: #ff5b5b; }
    }
  }
`;

const StatusPill = styled.span`
  padding: 6px 12px; border-radius: 8px; font-size: 0.7rem; font-weight: 900; letter-spacing: 1px;
  background: ${props => props.status === "ACTIVE" || props.status === "SUCCESS" ? "rgba(5,205,153,0.1)" : "rgba(255,193,7,0.05)"};
  color: ${props => props.status === "ACTIVE" || props.status === "SUCCESS" ? "#05cd99" : "#ffc107"};
  border: 1px solid ${props => props.status === "ACTIVE" || props.status === "SUCCESS" ? "rgba(5,205,153,0.1)" : "rgba(255,193,7,0.1)"};
`;

const GlassLoader = styled.div`
  display: flex; flex-direction: column; justify-content: center; align-items: center; height: 300px; gap: 20px;
  .orbit { width: 40px; height: 40px; border: 3px solid rgba(255,193,7,0.1); border-top-color: #ffc107; border-radius: 50%; animation: spin 0.8s linear infinite; }
  span { font-size: 0.8rem; font-weight: 900; color: #444; letter-spacing: 2px; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const Overlay = styled.div` position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); z-index: 190; `;

export default AdminDashboard;
