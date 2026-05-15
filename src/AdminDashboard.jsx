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
  Bell,
  MoreVertical,
  ArrowUpRight,
  Plus
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
    if (role !== "ADMIN") { navigate("/login"); }
    fetchData();
  }, [activeTab]);

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
    <PageWrapper>
      <Sidebar isOpen={isSidebarOpen}>
        <SidebarHeader>
          <div className="brand-logo">SF</div>
          <span>SLAYFIT <small>ADMIN</small></span>
          <button className="close-btn" onClick={() => setIsSidebarOpen(false)}><X /></button>
        </SidebarHeader>

        <NavGroup>
          <NavLabel>MAIN MENU</NavLabel>
          {[
            { id: "overview", icon: <Layout size={18} />, label: "Overview" },
            { id: "users", icon: <Users size={18} />, label: "Warriors" },
            { id: "payments", icon: <CreditCard size={18} />, label: "Revenue" },
            { id: "attendance", icon: <Clock size={18} />, label: "Arena Logs" },
            { id: "consultations", icon: <MessageSquare size={18} />, label: "Inquiries" }
          ].map(item => (
            <NavItem 
              key={item.id} 
              active={activeTab === item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
            >
              {item.icon} {item.label}
            </NavItem>
          ))}
        </NavGroup>

        <LogoutBtn onClick={handleLogout}>
          <LogOut size={18} /> Logout Session
        </LogoutBtn>
      </Sidebar>

      <MainArea>
        <Header>
          <div className="search-box">
            <Search size={18} />
            <input 
              placeholder={`Search ${activeTab}...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="top-actions">
            <button className="notify-btn"><Bell size={20} /></button>
            <div className="user-info">
              <div className="avatar">AD</div>
              <div className="text">
                <span className="name">Admin User</span>
                <span className="status">Online</span>
              </div>
            </div>
            <button className="mobile-toggle" onClick={() => setIsSidebarOpen(true)}><MenuIcon /></button>
          </div>
        </Header>

        <DashboardGrid>
          <div className="welcome-row">
            <h1>Good Morning, <span className="text-warning">Admin</span></h1>
            <p>Your gym arena is performing at its peak today.</p>
          </div>

          <StatsGrid>
            <StatCard color="#4318ff">
              <div className="card-top">
                <div className="icon-wrap"><Users size={20} /></div>
                <span className="badge">+5.2%</span>
              </div>
              <div className="card-bottom">
                <span className="val">{users.length}</span>
                <span className="lab">Total Warriors</span>
              </div>
            </StatCard>
            <StatCard color="#05cd99">
              <div className="card-top">
                <div className="icon-wrap"><CreditCard size={20} /></div>
                <span className="badge success">+12.4%</span>
              </div>
              <div className="card-bottom">
                <span className="val">₹{payments.reduce((acc, p) => acc + (p.amount || 0), 0).toLocaleString()}</span>
                <span className="lab">Total Revenue</span>
              </div>
            </StatCard>
            <StatCard color="#ffc107">
              <div className="card-top">
                <div className="icon-wrap"><Zap size={20} /></div>
                <span className="badge warning">Stable</span>
              </div>
              <div className="card-bottom">
                <span className="val">{attendance.length}</span>
                <span className="lab">Arena Check-ins</span>
              </div>
            </StatCard>
          </StatsGrid>

          <ContentPanel>
            {loading ? (
              <LoaderWrap>
                <div className="spinner"></div>
                <p>Synchronizing data...</p>
              </LoaderWrap>
            ) : (
              <>
                {activeTab === "overview" && (
                  <OverviewLayout>
                    <div className="row g-4">
                      <div className="col-lg-8">
                        <PanelCard>
                          <div className="card-header">
                            <h5>Revenue Analytics</h5>
                            <button className="more"><MoreVertical size={16} /></button>
                          </div>
                          <div className="chart-sim">
                            {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                              <div className="bar-group" key={i}>
                                <div className="bar" style={{ height: `${h}%` }}></div>
                                <span>Day {i+1}</span>
                              </div>
                            ))}
                          </div>
                        </PanelCard>
                      </div>
                      <div className="col-lg-4">
                        <PanelCard>
                          <div className="card-header"><h5>Member Growth</h5></div>
                          <div className="growth-items">
                            {['Monthly', 'Yearly', 'VIP'].map((t, i) => (
                              <div className="growth-item" key={t}>
                                <div className="d-flex justify-content-between mb-2">
                                  <span>{t}</span><span>{60 - i*20}%</span>
                                </div>
                                <div className="progress"><div className="fill" style={{ width: `${60 - i*20}%` }}></div></div>
                              </div>
                            ))}
                          </div>
                        </PanelCard>
                      </div>
                    </div>
                  </OverviewLayout>
                )}

                {activeTab !== "overview" && (
                  <TableScroll>
                    <Table>
                      <thead>
                        <tr>
                          {activeTab === "users" && <><th>WARRIOR</th><th>STATUS</th><th>LEVEL</th><th>ACTIONS</th></>}
                          {activeTab === "payments" && <><th>WARRIOR</th><th>PLAN</th><th>AMOUNT</th><th>STATUS</th><th>DATE</th></>}
                          {activeTab === "attendance" && <><th>WARRIOR</th><th>DATE</th><th>TIME</th><th>STATUS</th></>}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData().map((item, idx) => (
                          <tr key={idx}>
                            {activeTab === "users" && (
                              <>
                                <td>
                                  <div className="user-cell">
                                    <div className="avatar">{item.fullName.charAt(0)}</div>
                                    <div><div className="name">{item.fullName}</div><div className="email">{item.email}</div></div>
                                  </div>
                                </td>
                                <td><StatusPill status={item.status}>{item.status}</StatusPill></td>
                                <td>{item.membershipType || "Standard"}</td>
                                <td><ActionBtn><MoreVertical size={16} /></ActionBtn></td>
                              </>
                            )}
                            {activeTab === "payments" && (
                              <>
                                <td className="fw-bold">{item.user?.fullName || item.fullName || "---"}</td>
                                <td>{item.planName || "Standard"}</td>
                                <td className="text-warning fw-bold">₹{item.amount}</td>
                                <td><StatusPill status={item.paymentStatus}>{item.paymentStatus}</StatusPill></td>
                                <td className="sub-text">{item.paymentDate || "---"}</td>
                              </>
                            )}
                            {activeTab === "attendance" && (
                              <>
                                <td className="fw-bold">{item.user?.fullName || item.fullName || "---"}</td>
                                <td>{item.attendanceDate}</td>
                                <td className="text-success fw-bold">{item.checkInTime}</td>
                                <td><StatusPill status="ACTIVE">PRESENT</StatusPill></td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </TableScroll>
                )}
              </>
            )}
          </ContentPanel>
        </DashboardGrid>
      </MainArea>

      {isSidebarOpen && <Overlay onClick={() => setIsSidebarOpen(false)} />}
    </PageWrapper>
  );
};

// ── STYLED COMPONENTS (New "Obsidian Elite" Model) ──

const PageWrapper = styled.div`
  display: flex; min-height: 100vh; background: #080808; color: #fff;
  font-family: 'Inter', sans-serif;
`;

const Sidebar = styled.div`
  width: 280px; background: #111; border-right: 1px solid #222;
  display: flex; flex-direction: column; padding: 30px 20px;
  position: sticky; top: 0; height: 100vh; z-index: 200;
  @media (max-width: 992px) {
    position: fixed; left: 0; transform: ${props => props.isOpen ? "translateX(0)" : "translateX(-100%)"};
    transition: transform 0.4s ease; background: #0a0a0a;
  }
`;

const SidebarHeader = styled.div`
  display: flex; align-items: center; gap: 15px; margin-bottom: 50px;
  .brand-logo { background: #ffc107; color: black; padding: 8px 12px; border-radius: 10px; font-weight: 900; }
  span { font-weight: 800; letter-spacing: 1px; font-size: 1.1rem; 
    small { display: block; font-size: 0.6rem; color: #ffc107; letter-spacing: 2px; }
  }
  .close-btn { display: none; background: none; border: none; color: #444; @media (max-width: 992px) { display: block; margin-left: auto; } }
`;

const NavLabel = styled.div` font-size: 0.7rem; font-weight: 800; color: #444; letter-spacing: 2px; margin-bottom: 20px; `;

const NavGroup = styled.div` display: flex; flex-direction: column; gap: 8px; flex: 1; `;

const NavItem = styled.div`
  display: flex; align-items: center; gap: 15px; padding: 14px 20px; border-radius: 12px;
  cursor: pointer; transition: all 0.3s ease; font-weight: 600; color: ${props => props.active ? "#fff" : "#666"};
  background: ${props => props.active ? "#1a1a1a" : "transparent"};
  border: 1px solid ${props => props.active ? "#333" : "transparent"};

  &:hover { color: #fff; background: #1a1a1a; }
`;

const LogoutBtn = styled.button`
  margin-top: auto; background: none; border: 1px solid #222; color: #ff5b5b; padding: 14px;
  border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 10px; justify-content: center;
  &:hover { background: #ff5b5b; color: #fff; }
`;

const MainArea = styled.main` flex: 1; display: flex; flex-direction: column; `;

const Header = styled.header`
  padding: 20px 40px; border-bottom: 1px solid #222; display: flex; justify-content: space-between; align-items: center;
  background: #080808; position: sticky; top: 0; z-index: 100;

  .search-box {
    display: flex; align-items: center; gap: 15px; background: #111; padding: 10px 20px; border-radius: 12px; border: 1px solid #222; width: 350px;
    input { background: none; border: none; outline: none; color: #fff; width: 100%; font-size: 0.9rem; }
    svg { color: #444; }
  }

  .top-actions {
    display: flex; align-items: center; gap: 25px;
    .notify-btn { background: none; border: none; color: #444; &:hover { color: #ffc107; } }
    .user-info { display: flex; align-items: center; gap: 12px; .avatar { width: 36px; height: 36px; background: #ffc107; color: #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; } .text { .name { display: block; font-size: 0.85rem; font-weight: 700; } .status { font-size: 0.7rem; color: #05cd99; font-weight: 600; } } }
    .mobile-toggle { display: none; background: none; border: none; color: #ffc107; @media (max-width: 992px) { display: block; } }
  }
`;

const DashboardGrid = styled.div` padding: 40px; @media (max-width: 768px) { padding: 25px; } .welcome-row { margin-bottom: 40px; h1 { font-size: 2rem; font-weight: 900; } p { color: #666; font-weight: 500; } .text-warning { color: #ffc107; } } `;

const StatsGrid = styled.div` display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; margin-bottom: 40px; @media (max-width: 1200px) { grid-template-columns: repeat(2, 1fr); } @media (max-width: 768px) { grid-template-columns: 1fr; } `;

const StatCard = styled.div`
  background: #111; padding: 25px; border-radius: 20px; border: 1px solid #222;
  .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; .icon-wrap { width: 45px; height: 45px; background: rgba(255,255,255,0.02); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: ${props => props.color}; border: 1px solid rgba(255,255,255,0.05); } .badge { font-size: 0.7rem; font-weight: 800; padding: 4px 10px; border-radius: 20px; background: rgba(255,255,255,0.05); color: #666; &.success { color: #05cd99; background: rgba(5,205,153,0.05); } &.warning { color: #ffc107; background: rgba(255,193,7,0.05); } } }
  .card-bottom { .val { display: block; font-size: 1.8rem; font-weight: 900; } .lab { color: #666; font-size: 0.8rem; font-weight: 700; } }
`;

const ContentPanel = styled.div` background: #111; border: 1px solid #222; border-radius: 24px; padding: 30px; min-height: 400px; `;

const OverviewLayout = styled.div``;

const PanelCard = styled.div`
  background: #0a0a0a; border: 1px solid #222; padding: 25px; border-radius: 20px; height: 100%;
  .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; h5 { font-size: 0.9rem; font-weight: 800; margin: 0; } .more { background: none; border: none; color: #444; } }
  .chart-sim { height: 200px; display: flex; align-items: flex-end; justify-content: space-between; .bar-group { width: 10%; display: flex; flex-direction: column; align-items: center; gap: 10px; .bar { width: 100%; background: #ffc107; border-radius: 4px; transition: all 1s ease; } span { font-size: 0.6rem; font-weight: 700; color: #444; } } }
  .growth-item { margin-bottom: 20px; span { font-size: 0.8rem; font-weight: 700; color: #666; } .progress { height: 6px; background: #1a1a1a; border-radius: 10px; .fill { height: 100%; background: #ffc107; } } }
`;

const TableScroll = styled.div` overflow-x: auto; `;
const Table = styled.table`
  width: 100%; border-collapse: collapse; min-width: 800px;
  thead th { text-align: left; padding: 15px 20px; font-size: 0.75rem; color: #444; font-weight: 800; letter-spacing: 1px; border-bottom: 1px solid #222; }
  tbody td { padding: 20px; border-bottom: 1px solid #1a1a1a; font-size: 0.9rem; }
  .user-cell { display: flex; align-items: center; gap: 15px; .avatar { width: 40px; height: 40px; background: #1a1a1a; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #ffc107; } .name { font-weight: 700; } .email { font-size: 0.75rem; color: #444; } }
`;

const StatusPill = styled.span`
  padding: 5px 12px; border-radius: 8px; font-size: 0.7rem; font-weight: 800;
  background: ${props => props.status === "ACTIVE" || props.status === "SUCCESS" ? "rgba(5,205,153,0.05)" : "rgba(255,255,255,0.03)"};
  color: ${props => props.status === "ACTIVE" || props.status === "SUCCESS" ? "#05cd99" : "#666"};
  border: 1px solid ${props => props.status === "ACTIVE" || props.status === "SUCCESS" ? "rgba(5,205,153,0.1)" : "rgba(255,255,255,0.05)"};
`;

const ActionBtn = styled.button` background: none; border: none; color: #444; cursor: pointer; &:hover { color: #fff; } `;

const LoaderWrap = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; gap: 15px;
  .spinner { width: 30px; height: 30px; border: 3px solid #222; border-top-color: #ffc107; border-radius: 50%; animation: spin 1s linear infinite; }
  p { color: #444; font-size: 0.9rem; font-weight: 600; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const Overlay = styled.div` position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 150; `;

export default AdminDashboard;
