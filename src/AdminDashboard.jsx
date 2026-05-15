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
  Cpu,
  Globe,
  Database,
  Terminal,
  ChevronRight,
  TrendingDown,
  Award,
  Crown
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "ADMIN") navigate("/login");
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
    try {
      if (activeTab === "overview" || activeTab === "users") {
        const [u, p, a, c] = await Promise.all([
          fetch(`${API_BASE}/users`).then(r => r.json()),
          fetch(`${API_BASE}/payments`).then(r => r.json()),
          fetch(`${API_BASE}/attendance`).then(r => r.json()),
          fetch(`${API_BASE}/consultations`).then(r => r.json())
        ]);
        setUsers(Array.isArray(u) ? u : []);
        setPayments(Array.isArray(p) ? p : []);
        setAttendance(Array.isArray(a) ? a : []);
        setConsultations(Array.isArray(c) ? c : []);
      } else {
        const res = await fetch(`${API_BASE}/${activeTab}`);
        const data = await res.json();
        const setter = activeTab === "payments" ? setPayments : activeTab === "attendance" ? setAttendance : setConsultations;
        setter(Array.isArray(data) ? data : []);
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
    <Container>
      <AnimatedBackground />
      <Sidebar isOpen={isSidebarOpen}>
        <div className="sidebar-inner">
          <Brand>
            <div className="icon"><Crown size={24} /></div>
            <div className="text">
              <h3>SLAYFIT</h3>
              <span>ELITE ADMIN</span>
            </div>
          </Brand>

          <NavMenu>
            {[
              { id: "overview", icon: <Layout size={20} />, label: "Dashboard" },
              { id: "users", icon: <Users size={20} />, label: "Warriors" },
              { id: "payments", icon: <CreditCard size={20} />, label: "Revenue" },
              { id: "attendance", icon: <Clock size={20} />, label: "Arena Logs" },
              { id: "consultations", icon: <MessageSquare size={20} />, label: "Inquiries" }
            ].map(item => (
              <NavItem 
                key={item.id} 
                active={activeTab === item.id}
                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              >
                <div className="glow-bar" />
                {item.icon} <span>{item.label}</span>
              </NavItem>
            ))}
          </NavMenu>

          <LogoutBtn onClick={handleLogout}>
            <LogOut size={20} /> <span>LOGOUT SYSTEM</span>
          </LogoutBtn>
        </div>
      </Sidebar>

      <MainContent>
        <Header className="reveal">
          <div className="search-box">
            <Search size={18} />
            <input placeholder="SCAN SYSTEM RECORDS..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="actions">
            <button className="icon-btn"><Bell size={20} /></button>
            <div className="profile">
              <div className="avatar">AD</div>
              <div className="details">
                <span className="name">ROOT_ADMIN</span>
                <span className="status">SYNCED</span>
              </div>
            </div>
            <button className="mobile-btn" onClick={() => setIsSidebarOpen(true)}><MenuIcon /></button>
          </div>
        </Header>

        <DashboardGrid>
          <div className="welcome-section reveal">
            <Badge>ARENA STATUS: OPTIMAL</Badge>
            <h1>WELCOME BACK, <span className="text-gold">COMMANDER</span></h1>
            <p>Your gym arena is operating at maximum performance.</p>
          </div>

          <StatsGrid className="reveal">
            <StatCard color="linear-gradient(135deg, #4318ff 0%, #7d5fff 100%)">
              <div className="card-inner">
                <div className="header"><Users size={20} /> <span>WARRIORS</span></div>
                <div className="value">{users.length}</div>
                <div className="trend"><TrendingUp size={14} /> +12% GROWTH</div>
              </div>
            </StatCard>
            <StatCard color="linear-gradient(135deg, #05cd99 0%, #00e0b0 100%)">
              <div className="card-inner">
                <div className="header"><CreditCard size={20} /> <span>REVENUE</span></div>
                <div className="value">₹{payments.reduce((acc, p) => acc + (p.amount || 0), 0).toLocaleString()}</div>
                <div className="trend"><TrendingUp size={14} /> +8.5% TARGET</div>
              </div>
            </StatCard>
            <StatCard color="linear-gradient(135deg, #ffc107 0%, #ff9800 100%)">
              <div className="card-inner">
                <div className="header"><Zap size={20} /> <span>ENERGY</span></div>
                <div className="value">{attendance.length}</div>
                <div className="trend">SYSTEM ACTIVE</div>
              </div>
            </StatCard>
          </StatsGrid>

          <MainPanel className="reveal">
            {loading ? (
              <LoadingOverlay>
                <div className="spinner"></div>
                <span>UPDATING ARENA MODULES...</span>
              </LoadingOverlay>
            ) : (
              <div className="panel-content">
                {activeTab === "overview" && (
                  <OverviewTab>
                    <div className="row g-4">
                      <div className="col-lg-8">
                        <PanelCard>
                          <div className="card-header">
                            <h5>REVENUE FLOW (7D)</h5>
                            <TrendingUp size={16} className="text-gold" />
                          </div>
                          <ChartSim>
                            {[40, 65, 35, 80, 50, 95, 75].map((h, i) => (
                              <div className="bar-group" key={i}>
                                <div className="bar" style={{ height: `${h}%`, animationDelay: `${i*0.1}s` }} />
                                <span>D{i+1}</span>
                              </div>
                            ))}
                          </ChartSim>
                        </PanelCard>
                      </div>
                      <div className="col-lg-4">
                        <PanelCard>
                          <div className="card-header"><h5>WARRIOR MIX</h5></div>
                          <div className="mix-stats">
                            {['ELITE', 'PRO', 'BASIC'].map((t, i) => (
                              <div className="mix-item" key={t}>
                                <div className="d-flex justify-content-between mb-2">
                                  <span className="label">{t}</span>
                                  <span className="val">{70 - i*20}%</span>
                                </div>
                                <div className="progress"><div className="fill" style={{ width: `${70 - i*20}%`, background: i === 0 ? '#ffc107' : '#444' }} /></div>
                              </div>
                            ))}
                          </div>
                        </PanelCard>
                      </div>
                    </div>
                  </OverviewTab>
                )}

                {activeTab !== "overview" && (
                  <TableScroll>
                    <Table>
                      <thead>
                        <tr>
                          {activeTab === "users" && <><th>WARRIOR</th><th>STATUS</th><th>LEVEL</th><th>OPERATIONS</th></>}
                          {activeTab === "payments" && <><th>WARRIOR</th><th>AMOUNT</th><th>STATUS</th><th>DATE</th></>}
                          {activeTab === "attendance" && <><th>WARRIOR</th><th>DATE</th><th>IN</th><th>STATUS</th></>}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData().map((item, idx) => (
                          <tr key={idx}>
                            {activeTab === "users" && (
                              <>
                                <td>
                                  <div className="user-info">
                                    <div className="avatar">{item.fullName.charAt(0)}</div>
                                    <div><div className="name">{item.fullName}</div><div className="email">{item.email}</div></div>
                                  </div>
                                </td>
                                <td><StatusBadge status={item.status}>{item.status}</StatusBadge></td>
                                <td>{item.membershipType || "STANDARD"}</td>
                                <td>
                                  <div className="ops">
                                    <button className="op-btn tick"><CheckCircle size={16} /></button>
                                    <button className="op-btn trash"><Trash2 size={16} /></button>
                                  </div>
                                </td>
                              </>
                            )}
                            {activeTab === "payments" && (
                              <>
                                <td className="fw-bold">{item.user?.fullName || item.fullName || "WARRIOR"}</td>
                                <td className="text-gold fw-bold">₹{item.amount}</td>
                                <td><StatusBadge status={item.paymentStatus}>{item.paymentStatus}</StatusBadge></td>
                                <td className="sub-text">{item.paymentDate || "---"}</td>
                              </>
                            )}
                            {activeTab === "attendance" && (
                              <>
                                <td className="fw-bold">{item.user?.fullName || item.fullName || "WARRIOR"}</td>
                                <td>{item.attendanceDate}</td>
                                <td className="text-success fw-bold">{item.checkInTime}</td>
                                <td><StatusBadge status="ACTIVE">PRESENT</StatusBadge></td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </TableScroll>
                )}
              </div>
            )}
          </MainPanel>
        </DashboardGrid>
      </MainContent>

      {isSidebarOpen && <Overlay onClick={() => setIsSidebarOpen(false)} />}
    </Container>
  );
};

// ── STYLED COMPONENTS (The "Fantabulous" Solaris Model) ──

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const shine = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
  min-height: 100vh; background: #050505; color: white; display: flex;
  font-family: 'Outfit', sans-serif; overflow-x: hidden; position: relative;
`;

const AnimatedBackground = styled.div`
  position: fixed; inset: 0; z-index: 1; pointer-events: none;
  background: 
    radial-gradient(circle at 10% 10%, rgba(255, 193, 7, 0.05) 0%, transparent 40%),
    radial-gradient(circle at 90% 90%, rgba(67, 24, 255, 0.05) 0%, transparent 40%);
  &::before {
    content: ''; position: absolute; inset: 0;
    background-image: url("https://www.transparenttextures.com/patterns/carbon-fibre.png");
    opacity: 0.2;
  }
`;

const Sidebar = styled.div`
  width: 300px; height: 100vh; position: sticky; top: 0; z-index: 200;
  background: rgba(10, 10, 10, 0.8); backdrop-filter: blur(40px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  
  @media (max-width: 992px) {
    position: fixed; left: 0; transform: ${props => props.isOpen ? "translateX(0)" : "translateX(-100%)"};
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sidebar-inner { padding: 40px; display: flex; flex-direction: column; height: 100%; }
`;

const Brand = styled.div`
  display: flex; align-items: center; gap: 15px; margin-bottom: 60px;
  .icon { background: #ffc107; color: black; padding: 10px; border-radius: 12px; box-shadow: 0 0 20px rgba(255, 193, 7, 0.2); }
  h3 { font-size: 1.5rem; font-weight: 900; font-style: italic; margin: 0; letter-spacing: -1px; }
  span { font-size: 0.65rem; font-weight: 800; color: #ffc107; letter-spacing: 2px; }
`;

const NavMenu = styled.div` display: flex; flex-direction: column; gap: 10px; flex: 1; `;

const NavItem = styled.div`
  display: flex; align-items: center; gap: 15px; padding: 16px 20px; border-radius: 15px;
  cursor: pointer; transition: all 0.3s ease; font-weight: 800; color: ${props => props.active ? "#fff" : "#666"};
  background: ${props => props.active ? "rgba(255, 255, 255, 0.03)" : "transparent"};
  position: relative; overflow: hidden;

  &:hover { color: #fff; background: rgba(255, 255, 255, 0.05); }

  .glow-bar {
    position: absolute; left: 0; top: 0; width: 4px; height: 100%;
    background: #ffc107; transform: scaleY(${props => props.active ? 1 : 0});
    transition: transform 0.3s ease; box-shadow: 0 0 15px #ffc107;
  }
`;

const LogoutBtn = styled.button`
  background: none; border: 1px solid rgba(255, 255, 255, 0.05); color: #ff5b5b;
  padding: 16px; border-radius: 15px; font-weight: 900; cursor: pointer;
  display: flex; align-items: center; gap: 15px; transition: all 0.3s ease;
  &:hover { background: #ff5b5b; color: white; transform: scale(1.02); }
`;

const MainContent = styled.main`
  flex: 1; padding: 40px 60px; z-index: 2;
  @media (max-width: 992px) { padding: 30px 20px; }
  .reveal { opacity: 0; transform: translateY(20px); transition: all 0.8s ease; &.reveal-visible { opacity: 1; transform: translateY(0); } }
`;

const Header = styled.header`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 50px;
  
  .search-box {
    background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 50px; padding: 12px 30px; display: flex; align-items: center; gap: 15px; width: 400px;
    input { background: none; border: none; outline: none; color: white; width: 100%; font-weight: 600; font-size: 0.9rem; }
    svg { color: #ffc107; }
  }

  .actions {
    display: flex; align-items: center; gap: 30px;
    .icon-btn { background: none; border: none; color: #444; cursor: pointer; &:hover { color: #ffc107; } }
    .profile {
      display: flex; align-items: center; gap: 15px;
      .avatar { width: 42px; height: 42px; background: #ffc107; color: black; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; box-shadow: 0 0 20px rgba(255, 193, 7, 0.2); }
      .details { .name { display: block; font-weight: 900; font-size: 0.9rem; } .status { font-size: 0.65rem; color: #05cd99; font-weight: 800; letter-spacing: 1px; } }
    }
    .mobile-btn { display: none; background: none; border: none; color: white; @media (max-width: 992px) { display: block; } }
  }

  @media (max-width: 768px) { .search-box { display: none; } }
`;

const DashboardGrid = styled.div`
  .welcome-section {
    margin-bottom: 50px;
    h1 { font-size: 2.8rem; font-weight: 950; font-style: italic; letter-spacing: -1.5px; margin: 10px 0; }
    p { color: #666; font-weight: 600; font-size: 1.1rem; }
    .text-gold { color: #ffc107; text-shadow: 0 0 30px rgba(255, 193, 7, 0.3); }
  }
`;

const Badge = styled.span`
  background: rgba(255, 193, 7, 0.1); color: #ffc107; padding: 6px 15px;
  border-radius: 50px; font-weight: 900; font-size: 0.75rem; letter-spacing: 1px; border: 1px solid rgba(255, 193, 7, 0.2);
`;

const StatsGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 50px;
  @media (max-width: 1200px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const StatCard = styled.div`
  background: ${props => props.color}; border-radius: 30px; padding: 2px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3); position: relative; overflow: hidden;
  
  .card-inner {
    background: #0a0a0a; border-radius: 28px; padding: 30px; height: 100%;
    .header { display: flex; align-items: center; gap: 12px; color: #666; font-size: 0.75rem; font-weight: 900; letter-spacing: 1.5px; margin-bottom: 25px; svg { color: #ffc107; } }
    .value { font-size: 2.2rem; font-weight: 950; margin-bottom: 10px; }
    .trend { font-size: 0.75rem; font-weight: 800; color: #05cd99; display: flex; align-items: center; gap: 8px; }
  }
`;

const MainPanel = styled.div`
  background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 40px; padding: 40px; min-height: 500px; backdrop-filter: blur(20px);
  @media (max-width: 768px) { padding: 25px; }
`;

const PanelCard = styled.div`
  background: rgba(255, 255, 255, 0.02); border-radius: 25px; padding: 30px; border: 1px solid rgba(255, 255, 255, 0.03);
  h5 { font-size: 0.85rem; font-weight: 900; letter-spacing: 1.5px; color: #666; margin-bottom: 30px; }
  .mix-item {
    margin-bottom: 25px;
    .label { color: #fff; font-weight: 800; font-size: 0.85rem; }
    .val { color: #ffc107; font-weight: 900; }
    .progress { height: 6px; background: #111; border-radius: 10px; margin-top: 10px; overflow: hidden; .fill { height: 100%; border-radius: 10px; transition: width 1s ease; } }
  }
`;

const ChartSim = styled.div`
  height: 200px; display: flex; align-items: flex-end; justify-content: space-between;
  .bar-group { 
    width: 10%; display: flex; flex-direction: column; align-items: center; gap: 15px;
    .bar { width: 100%; background: linear-gradient(to top, #ffc107, #ff9800); border-radius: 6px; animation: ${slideUp} 1s ease forwards; box-shadow: 0 0 20px rgba(255, 193, 7, 0.2); }
    span { font-size: 0.65rem; font-weight: 800; color: #444; }
  }
`;

const TableScroll = styled.div` overflow-x: auto; `;
const Table = styled.table`
  width: 100%; border-collapse: collapse; min-width: 800px;
  thead th { text-align: left; padding: 20px; color: #ffc107; font-size: 0.75rem; font-weight: 950; letter-spacing: 1px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
  tbody td { padding: 25px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.02); font-size: 1rem; }
  .user-info {
    display: flex; align-items: center; gap: 15px;
    .avatar { width: 40px; height: 40px; background: #111; border-radius: 10px; border: 1px solid rgba(255, 193, 7, 0.3); display: flex; align-items: center; justify-content: center; font-weight: 900; color: #ffc107; }
    .name { font-weight: 800; } .email { font-size: 0.8rem; color: #555; }
  }
  .ops { display: flex; gap: 10px; .op-btn { background: rgba(255,255,255,0.02); border: none; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #444; transition: all 0.3s ease; &:hover { color: white; background: #ffc10722; border: 1px solid #ffc107; } &.trash:hover { color: #ff5b5b; border-color: #ff5b5b; background: #ff5b5b22; } } }
`;

const StatusBadge = styled.span`
  padding: 6px 14px; border-radius: 50px; font-size: 0.75rem; font-weight: 900;
  background: ${props => props.status === "ACTIVE" || props.status === "SUCCESS" ? "rgba(5,205,153,0.1)" : "rgba(255,255,255,0.05)"};
  color: ${props => props.status === "ACTIVE" || props.status === "SUCCESS" ? "#05cd99" : "#666"};
  border: 1px solid ${props => props.status === "ACTIVE" || props.status === "SUCCESS" ? "rgba(5,205,153,0.2)" : "rgba(255,255,255,0.1)"};
`;

const LoadingOverlay = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center; height: 400px; gap: 20px;
  .spinner { width: 45px; height: 45px; border: 4px solid #111; border-top-color: #ffc107; border-radius: 50%; animation: ${rotate} 1s linear infinite; }
  span { font-size: 0.8rem; font-weight: 900; letter-spacing: 2px; color: #444; }
`;

const Overlay = styled.div` position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); z-index: 150; `;

const OverviewTab = styled.div` animation: ${slideUp} 0.8s ease; `;

export default AdminDashboard;
