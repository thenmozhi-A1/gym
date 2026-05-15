import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
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
  Shield,
  Bell,
  Cpu,
  Globe,
  Database,
  Terminal,
  ChevronRight
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

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn || role !== "ADMIN") {
      alert("UNAUTHORIZED ACCESS DETECTED");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "overview" || activeTab === "users") {
        const [uRes, pRes, aRes, cRes] = await Promise.all([
          fetch(`${API_BASE}/users`),
          fetch(`${API_BASE}/payments`),
          fetch(`${API_BASE}/attendance`),
          fetch(`${API_BASE}/consultations`)
        ]);
        const [u, p, a, c] = await Promise.all([uRes.json(), pRes.json(), aRes.json(), cRes.json()]);
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
    } catch (err) {
      setError("System sync failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredData = () => {
    const term = searchTerm.toLowerCase();
    if (activeTab === "users") return users.filter(u => u.fullName?.toLowerCase().includes(term));
    if (activeTab === "payments") return payments.filter(p => (p.user?.fullName || p.fullName || "").toLowerCase().includes(term));
    if (activeTab === "attendance") return attendance.filter(a => (a.user?.fullName || a.fullName || "").toLowerCase().includes(term));
    return consultations;
  };

  return (
    <HUDWrapper>
      <ScannerLine />
      <HeaderHUD>
        <div className="brand">
          <Cpu className="pulse-icon" size={28} />
          <div className="brand-text">
            <h1>SLAYFIT <span className="highlight">OS_v2.0</span></h1>
            <div className="system-status">
              <span className="dot active"></span>
              CORE_SYSTEM: ONLINE | MEM_COUNT: {users.length}
            </div>
          </div>
        </div>

        <TopControls>
          <div className="search-hud">
            <Terminal size={16} />
            <input 
              placeholder="RUN SEARCH_QUERY..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="admin-status">
            <Bell size={20} className="shake-hover" />
            <div className="v-divider" />
            <div className="profile-chip">
              <div className="rank">LEVEL 10</div>
              <div className="name">ROOT_ADMIN</div>
            </div>
            <button className="mobile-btn" onClick={() => setIsSidebarOpen(true)}><MenuIcon /></button>
          </div>
        </TopControls>
      </HeaderHUD>

      <ContentArea>
        <SidebarHUD isOpen={isSidebarOpen}>
          <NavGroup>
            {[
              { id: "overview", icon: <Layout size={20} />, label: "NEURAL_OVERVIEW" },
              { id: "users", icon: <Users size={20} />, label: "WARRIOR_SYNC" },
              { id: "payments", icon: <Database size={20} />, label: "REVENUE_STREAM" },
              { id: "attendance", icon: <Globe size={20} />, label: "ARENA_LOGS" },
              { id: "consultations", icon: <MessageSquare size={20} />, label: "INQUIRIES" }
            ].map(item => (
              <HUDNavItem 
                key={item.id} 
                active={activeTab === item.id}
                onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              >
                <div className="nav-accent" />
                {item.icon}
                <span>{item.label}</span>
                {activeTab === item.id && <ChevronRight className="chevron" size={14} />}
              </HUDNavItem>
            ))}
          </NavGroup>

          <LogoutHUD onClick={handleLogout}>
            <LogOut size={20} /> TERMINATE_SESSION
          </LogoutHUD>
        </SidebarHUD>

        <MainDisplay>
          {activeTab === "overview" && (
            <div className="overview-grid">
              <div className="hero-stats">
                <HUDCard glow="#4318ff">
                  <StatHeader>
                    <Users size={18} /> <span>WARRIOR_POPULATION</span>
                  </StatHeader>
                  <div className="big-value">{users.length}</div>
                  <MiniGraph>
                    {[40, 20, 60, 30, 80, 50, 90].map((h, i) => <div key={i} className="m-bar" style={{ height: `${h}%` }} />)}
                  </MiniGraph>
                </HUDCard>

                <HUDCard glow="#05cd99">
                  <StatHeader>
                    <CreditCard size={18} /> <span>TOTAL_REVENUE</span>
                  </StatHeader>
                  <div className="big-value">₹{payments.reduce((acc, p) => acc + (p.amount || 0), 0).toLocaleString()}</div>
                  <div className="trend-box"><TrendingUp size={14} /> +12.5% PERFORMANCE</div>
                </HUDCard>

                <HUDCard glow="#ffc107">
                  <StatHeader>
                    <Zap size={18} /> <span>ACTIVE_UPLINKS</span>
                  </StatHeader>
                  <div className="big-value">{attendance.length}</div>
                  <div className="status-label">SYS_STABLE</div>
                </HUDCard>
              </div>

              <div className="bottom-row">
                <HUDCard className="flex-2" glow="rgba(255,255,255,0.1)">
                  <StatHeader><Activity size={18} /> <span>ARENA_THROUGHPUT</span></StatHeader>
                  <BigChart>
                    <div className="chart-line"></div>
                    <div className="chart-bars">
                      {[30, 50, 70, 40, 90, 60, 85, 45, 95, 75].map((h, i) => (
                        <div key={i} className="main-bar" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                  </BigChart>
                </HUDCard>

                <HUDCard className="flex-1" glow="#ff5b5b">
                  <StatHeader><Terminal size={18} /> <span>SYSTEM_LOG</span></StatHeader>
                  <LogStream>
                    {[...payments.slice(0, 3), ...attendance.slice(0, 3)].map((item, i) => (
                      <div className="log-entry" key={i}>
                        <span className="log-time">[{item.attendanceDate || "PAYMENT"}]</span>
                        <span className="log-text">{item.user?.fullName || "UNKNOWN"} initialized action.</span>
                      </div>
                    ))}
                  </LogStream>
                </HUDCard>
              </div>
            </div>
          )}

          {activeTab !== "overview" && (
            <HUDTableCard>
              <table className="hud-table">
                <thead>
                  <tr>
                    {activeTab === "users" && <><th>WARRIOR_ID</th><th>STATUS</th><th>LVL</th><th>OPERATIONS</th></>}
                    {activeTab === "payments" && <><th>USER_CREDENTIALS</th><th>TX_AMOUNT</th><th>STATUS</th><th>TS_STAMP</th></>}
                    {activeTab === "attendance" && <><th>ARENA_WARRIOR</th><th>TS_DATE</th><th>CHECK_IN</th><th>SYNC_STATE</th></>}
                  </tr>
                </thead>
                <tbody>
                  {filteredData().map((u, idx) => (
                    <tr key={idx}>
                      {activeTab === "users" && (
                        <>
                          <td><div className="warrior-cell"><div className="w-icon">{u.fullName.charAt(0)}</div><div>{u.fullName}</div></div></td>
                          <td><HUDStatus status={u.status}>{u.status}</HUDStatus></td>
                          <td>{u.membershipType || "STD"}</td>
                          <td>
                            <div className="ops">
                              <button className="op-btn tick"><CheckCircle size={14} /></button>
                              <button className="op-btn trash"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </>
                      )}
                      {activeTab === "payments" && (
                        <>
                          <td>{u.user?.fullName || u.fullName || "---"}</td>
                          <td className="text-warning">₹{u.amount}</td>
                          <td><HUDStatus status={u.paymentStatus}>{u.paymentStatus}</HUDStatus></td>
                          <td className="dim">{u.paymentDate || "---"}</td>
                        </>
                      )}
                      {activeTab === "attendance" && (
                        <>
                          <td>{u.user?.fullName || u.fullName || "---"}</td>
                          <td>{u.attendanceDate}</td>
                          <td className="text-success">{u.checkInTime}</td>
                          <td><span className="sync-dot"></span> SYNCED</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </HUDTableCard>
          )}
        </MainDisplay>
      </ContentArea>

      {isSidebarOpen && <HUDOverlay onClick={() => setIsSidebarOpen(false)} />}
    </HUDWrapper>
  );
};

// ── STYLED COMPONENTS (Advanced "Aegis HUD" Model) ──

const scanMove = keyframes`
  0% { top: -100px; }
  100% { top: 100vh; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
`;

const growBar = keyframes`
  from { height: 0; }
  to { height: var(--h); }
`;

const HUDWrapper = styled.div`
  min-height: 100vh; background: #000; color: #00f2ff;
  font-family: 'Share Tech Mono', 'Inter', monospace;
  position: relative; overflow: hidden;
  &::before {
    content: ''; position: fixed; inset: 0;
    background-image: radial-gradient(circle at 50% 50%, rgba(0, 242, 255, 0.05) 0%, transparent 80%);
    pointer-events: none;
  }
`;

const ScannerLine = styled.div`
  position: fixed; left: 0; width: 100%; height: 2px;
  background: linear-gradient(to right, transparent, #00f2ff, transparent);
  box-shadow: 0 0 20px #00f2ff;
  opacity: 0.1; z-index: 1000;
  animation: ${scanMove} 8s linear infinite;
`;

const HeaderHUD = styled.header`
  padding: 20px 40px; display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid rgba(0, 242, 255, 0.1); background: rgba(0,0,0,0.8); backdrop-filter: blur(10px);
  position: sticky; top: 0; z-index: 500;

  .brand {
    display: flex; align-items: center; gap: 20px;
    .pulse-icon { color: #00f2ff; animation: ${pulse} 2s infinite; }
    h1 { font-size: 1.5rem; font-weight: 900; letter-spacing: 2px; margin: 0; 
      .highlight { color: #ffc107; font-size: 0.7rem; vertical-align: top; }
    }
    .system-status { font-size: 0.6rem; color: #555; letter-spacing: 1px; margin-top: 5px; display: flex; align-items: center; gap: 8px;
      .dot { width: 6px; height: 6px; border-radius: 50%; background: #222; &.active { background: #00f2ff; box-shadow: 0 0 5px #00f2ff; } }
    }
  }
`;

const TopControls = styled.div`
  display: flex; align-items: center; gap: 30px;
  .search-hud {
    background: rgba(0, 242, 255, 0.05); border: 1px solid rgba(0, 242, 255, 0.2);
    padding: 10px 20px; border-radius: 4px; display: flex; align-items: center; gap: 15px; width: 300px;
    input { background: none; border: none; outline: none; color: #00f2ff; width: 100%; font-size: 0.8rem; letter-spacing: 1px; }
    svg { color: #00f2ff; opacity: 0.5; }
  }
  .admin-status {
    display: flex; align-items: center; gap: 20px;
    .v-divider { width: 1px; height: 30px; background: rgba(255,255,255,0.1); }
    .profile-chip { text-align: right; .rank { font-size: 0.6rem; color: #ffc107; font-weight: 900; } .name { font-size: 0.9rem; font-weight: 900; } }
    .mobile-btn { display: none; background: none; border: none; color: #00f2ff; @media (max-width: 992px) { display: block; } }
  }
`;

const ContentArea = styled.div` display: flex; padding: 20px; gap: 20px; height: calc(100vh - 90px); `;

const SidebarHUD = styled.div`
  width: 260px; display: flex; flex-direction: column; gap: 40px;
  @media (max-width: 992px) {
    position: fixed; left: 0; top: 0; height: 100vh; background: #000; padding: 40px;
    transform: ${props => props.isOpen ? "translateX(0)" : "translateX(-100%)"};
    transition: transform 0.4s ease; z-index: 600;
  }
`;

const HUDNavItem = styled.div`
  padding: 15px 25px; cursor: pointer; display: flex; align-items: center; gap: 15px;
  color: ${props => props.active ? "#00f2ff" : "#555"}; font-weight: 900; letter-spacing: 1.5px;
  position: relative; transition: all 0.3s ease; font-size: 0.8rem;
  
  .nav-accent { position: absolute; left: 0; top: 15%; height: 70%; width: 3px; background: #00f2ff; transform: scaleY(${props => props.active ? 1 : 0}); transition: transform 0.3s ease; box-shadow: 0 0 10px #00f2ff; }
  .chevron { margin-left: auto; color: #ffc107; }
  &:hover { color: #00f2ff; background: rgba(0, 242, 255, 0.05); }
`;

const NavGroup = styled.div` display: flex; flex-direction: column; gap: 5px; `;

const LogoutHUD = styled.div`
  margin-top: auto; padding: 20px; border: 1px solid rgba(255, 91, 91, 0.2);
  color: #ff5b5b; font-size: 0.7rem; font-weight: 900; text-align: center; cursor: pointer;
  transition: all 0.3s ease; &:hover { background: #ff5b5b; color: white; }
`;

const MainDisplay = styled.main`
  flex: 1; overflow-y: auto; padding-right: 10px;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(0, 242, 255, 0.2); border-radius: 10px; }
`;

const HUDCard = styled.div`
  background: rgba(0, 242, 255, 0.02); border: 1px solid rgba(0, 242, 255, 0.1);
  padding: 25px; position: relative; border-radius: 2px;
  box-shadow: inset 0 0 15px rgba(0, 0, 242, 0.05);
  
  &::before { content: ''; position: absolute; top: 0; left: 0; width: 10px; height: 10px; border-top: 2px solid ${props => props.glow}; border-left: 2px solid ${props => props.glow}; }
  &::after { content: ''; position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; border-bottom: 2px solid ${props => props.glow}; border-right: 2px solid ${props => props.glow}; }
`;

const StatHeader = styled.div`
  display: flex; align-items: center; gap: 10px; color: #555; font-size: 0.65rem; font-weight: 900; letter-spacing: 1px; margin-bottom: 15px;
  span { color: #888; }
`;

const BigChart = styled.div`
  height: 200px; position: relative; margin-top: 30px;
  .chart-bars { display: flex; align-items: flex-end; justify-content: space-between; height: 100%; gap: 5px; }
  .main-bar { width: 8%; background: #00f2ff; opacity: 0.6; animation: ${growBar} 1s ease forwards; box-shadow: 0 0 15px #00f2ff; }
`;

const LogStream = styled.div`
  height: 200px; overflow-y: auto; font-size: 0.7rem; color: #444; margin-top: 20px;
  .log-entry { margin-bottom: 10px; .log-time { color: #00f2ff; margin-right: 10px; } .log-text { color: #aaa; } }
`;

const HUDTableCard = styled(HUDCard)` padding: 0; background: transparent; border: none;
  .hud-table {
    width: 100%; border-collapse: separate; border-spacing: 0 10px;
    th { padding: 15px 20px; text-align: left; font-size: 0.7rem; color: #555; border-bottom: 1px solid rgba(0, 242, 255, 0.1); }
    td { padding: 20px; background: rgba(0, 242, 255, 0.03); font-size: 0.85rem; border-top: 1px solid rgba(0, 242, 255, 0.05); border-bottom: 1px solid rgba(0, 242, 255, 0.05); }
    .warrior-cell { display: flex; align-items: center; gap: 15px; .w-icon { width: 32px; height: 32px; background: #00f2ff22; border: 1px solid #00f2ff; color: #00f2ff; display: flex; align-items: center; justify-content: center; font-weight: 900; } }
    .ops { display: flex; gap: 10px; .op-btn { background: none; border: 1px solid #333; color: #444; padding: 5px; cursor: pointer; &:hover { border-color: #00f2ff; color: #00f2ff; } } }
  }
`;

const HUDStatus = styled.span`
  font-size: 0.65rem; font-weight: 900; padding: 4px 10px; border: 1px solid;
  color: ${props => props.status === "ACTIVE" ? "#00f2ff" : "#ff5b5b"};
  border-color: ${props => props.status === "ACTIVE" ? "#00f2ff55" : "#ff5b5b55"};
  background: ${props => props.status === "ACTIVE" ? "#00f2ff11" : "#ff5b5b11"};
`;

const MiniGraph = styled.div` display: flex; align-items: flex-end; gap: 3px; height: 30px; margin-top: 10px; .m-bar { width: 3px; background: #00f2ff; opacity: 0.5; } `;
const HUDOverlay = styled.div` position: fixed; inset: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(5px); z-index: 550; `;
const HUDCardGlow = styled.div` position: absolute; inset: 0; box-shadow: 0 0 30px ${props => props.color}; opacity: 0.1; pointer-events: none; `;

export default AdminDashboard;
