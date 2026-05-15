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
  Target
} from "lucide-react";

const API_BASE = "https://gymj-9.onrender.com/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
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
      if (activeTab === "users") {
        const [uRes, pRes, aRes] = await Promise.all([
          fetch(`${API_BASE}/users`),
          fetch(`${API_BASE}/payments`),
          fetch(`${API_BASE}/attendance`)
        ]);
        const uData = await uRes.json();
        const pData = await pRes.json();
        const aData = await aRes.json();
        setUsers(Array.isArray(uData) ? uData : []);
        setPayments(Array.isArray(pData) ? pData : []);
        setAttendance(Array.isArray(aData) ? aData : []);
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
      setError("Failed to fetch data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure? This action is permanent.")) return;
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
      }
    } catch (err) {
      alert("Failed to delete user.");
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
      alert("Failed to update status.");
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
    (p.user?.fullName || p.fullName || p.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.paymentStatus?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAttendance = attendance.filter(a =>
    (a.user?.fullName || a.fullName || a.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.attendanceDate?.toString().includes(searchTerm)
  );

  const calculateDuration = (inTime, outTime) => {
    if (!inTime || !outTime) return "---";
    try {
      const [inH, inM] = inTime.split(':').map(Number);
      const [outH, outM] = outTime.split(':').map(Number);
      const diff = (outH * 60 + outM) - (inH * 60 + inM);
      if (diff < 0) return "---";
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      return `${h}h ${m}m`;
    } catch (e) { return "---"; }
  };

  return (
    <DashboardContainer>
      <MobileHeader>
        <div className="logo">SF</div>
        <button onClick={() => setIsSidebarOpen(true)}><MenuIcon color="#ffc107" /></button>
      </MobileHeader>

      <Sidebar isOpen={isSidebarOpen}>
        <div className="sidebar-header">
          <Logo>
            <div className="icon"><Zap size={20} /></div>
            <span>SLAYFIT <small>ADMIN</small></span>
          </Logo>
          <CloseButton onClick={() => setIsSidebarOpen(false)}><X /></CloseButton>
        </div>

        <NavMenu>
          {[
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
              {item.icon} {item.label}
            </NavItem>
          ))}
        </NavMenu>

        <LogoutBtn onClick={handleLogout}>
          <LogOut size={20} /> LOGOUT
        </LogoutBtn>
      </Sidebar>

      {isSidebarOpen && <Overlay onClick={() => setIsSidebarOpen(false)} />}

      <MainContent>
        <Header className="reveal">
          <TitleArea>
            <h1>{activeTab.toUpperCase()} <span className="text-warning">COMMAND</span></h1>
            <p>Real-time analytics and management for the SlayFit Arena.</p>
          </TitleArea>

          <SearchArea>
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </SearchArea>
        </Header>

        <StatsRow className="reveal">
          <StatCard color="#4318ff">
            <div className="card-top">
              <Users size={24} />
              <TrendingUp size={16} className="trend" />
            </div>
            <div className="card-bottom">
              <span className="value">{users.length}</span>
              <span className="label">ACTIVE WARRIORS</span>
            </div>
          </StatCard>
          <StatCard color="#05cd99">
            <div className="card-top">
              <CreditCard size={24} />
              <Activity size={16} className="trend" />
            </div>
            <div className="card-bottom">
              <span className="value">₹{payments.reduce((acc, p) => acc + (p.amount || 0), 0).toLocaleString()}</span>
              <span className="label">TOTAL REVENUE</span>
            </div>
          </StatCard>
          <StatCard color="#ff5b5b">
            <div className="card-top">
              <Clock size={24} />
              <Target size={16} className="trend" />
            </div>
            <div className="card-bottom">
              <span className="value">{attendance.length}</span>
              <span className="label">LOGGED SESSIONS</span>
            </div>
          </StatCard>
        </StatsRow>

        {error && (
          <ErrorMessage className="reveal">
            <AlertCircle size={20} /> {error}
          </ErrorMessage>
        )}

        <TableContainer className="reveal">
          {loading ? (
            <LoadingState>
              <div className="spinner"></div>
              <span>Synchronizing Arena Data...</span>
            </LoadingState>
          ) : (
            <div className="responsive-table">
              <Table>
                {activeTab === "users" && (
                  <>
                    <thead>
                      <tr>
                        <th>NAME & EMAIL</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <React.Fragment key={user.id}>
                          <tr 
                            onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}
                            className={expandedUserId === user.id ? "expanded-row" : ""}
                          >
                            <td>
                              <div className="user-info">
                                <div className="avatar">{user.fullName.charAt(0)}</div>
                                <div>
                                  <div className="fw-bold">{user.fullName}</div>
                                  <div className="sub-text">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td><StatusBadge status={user.status}>{user.status}</StatusBadge></td>
                            <td>
                              <ActionGroup onClick={(e) => e.stopPropagation()}>
                                <ActionButton className="success" onClick={() => handleUpdateStatus(user, "ACTIVE")}>
                                  <CheckCircle size={18} />
                                </ActionButton>
                                <ActionButton className="warning" onClick={() => handleUpdateStatus(user, "INACTIVE")}>
                                  <XCircle size={18} />
                                </ActionButton>
                                <ActionButton className="danger" onClick={() => handleDeleteUser(user.id)}>
                                  <Trash2 size={18} />
                                </ActionButton>
                              </ActionGroup>
                            </td>
                          </tr>
                          {expandedUserId === user.id && (
                            <tr>
                              <td colSpan="3" className="expanded-cell">
                                <ExpandedDetails>
                                  <div className="details-col">
                                    <h6><Zap size={16} /> RECENT REVENUE</h6>
                                    {payments.filter(p => p.user?.id === user.id).length > 0 ? (
                                      <ul className="details-list">
                                        {payments.filter(p => p.user?.id === user.id).slice(0, 3).map(p => (
                                          <li key={p.id}>
                                            <span>{p.planName}</span>
                                            <span className="price">₹{p.amount}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : <p className="empty-msg">No transactions found.</p>}
                                  </div>
                                  <div className="details-col">
                                    <h6><Activity size={16} /> RECENT LOGS</h6>
                                    {attendance.filter(a => a.user?.id === user.id).length > 0 ? (
                                      <ul className="details-list">
                                        {attendance.filter(a => a.user?.id === user.id).slice(0, 3).map(a => (
                                          <li key={a.id}>
                                            <span>{a.attendanceDate}</span>
                                            <span className="time">{a.checkInTime}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : <p className="empty-msg">No logs found.</p>}
                                  </div>
                                </ExpandedDetails>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </>
                )}

                {activeTab === "payments" && (
                  <>
                    <thead>
                      <tr><th>USER</th><th>AMOUNT</th><th>STATUS</th><th>DATE</th></tr>
                    </thead>
                    <tbody>
                      {filteredPayments.map(p => (
                        <tr key={p.id}>
                          <td>
                            <div className="fw-bold">{p.user?.fullName || p.fullName || p.userName || "Unknown Warrior"}</div>
                            <div className="sub-text">{p.user?.email || ""}</div>
                          </td>
                          <td className="text-warning fw-bold">₹{p.amount}</td>
                          <td><StatusBadge status={p.paymentStatus}>{p.paymentStatus}</StatusBadge></td>
                          <td className="sub-text">{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "---"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {activeTab === "attendance" && (
                  <>
                    <thead>
                      <tr><th>USER</th><th>DATE</th><th>IN</th><th>OUT</th><th>DURATION</th></tr>
                    </thead>
                    <tbody>
                      {filteredAttendance.map(log => (
                        <tr key={log.id}>
                          <td>
                            <div className="fw-bold">{log.user?.fullName || log.fullName || log.userName || "Unknown Warrior"}</div>
                            <div className="sub-text">{log.user?.email || ""}</div>
                          </td>
                          <td>{log.attendanceDate}</td>
                          <td className="text-success">{log.checkInTime}</td>
                          <td className="text-danger">{log.checkOutTime || "---"}</td>
                          <td className="fw-bold">{calculateDuration(log.checkInTime, log.checkOutTime)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {activeTab === "consultations" && (
                  <>
                    <thead>
                      <tr><th>WARRIOR INFO</th><th>MESSAGE / GOALS</th><th>DATE</th></tr>
                    </thead>
                    <tbody>
                      {consultations.map(msg => (
                        <tr key={msg.id}>
                          <td>
                            <div className="fw-bold">{msg.fullName}</div>
                            <div className="sub-text">{msg.email}</div>
                          </td>
                          <td style={{ maxWidth: '400px' }}><p className="mb-0 sub-text italic">{msg.goals}</p></td>
                          <td className="sub-text">{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : "---"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}
              </Table>
            </div>
          )}
        </TableContainer>
      </MainContent>
    </DashboardContainer>
  );
};

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #050505;
  color: white;
  font-family: 'Inter', sans-serif;
`;

const MobileHeader = styled.div`
  display: none;
  @media (max-width: 992px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: #0a0a0a;
    border-bottom: 1px solid #222;
    position: sticky; top: 0; z-index: 150;
    .logo { color: #ffc107; font-weight: 900; font-size: 1.5rem; }
  }
`;

const Sidebar = styled.div`
  width: 280px;
  background: #0a0a0a;
  border-right: 1px solid #222;
  display: flex;
  flex-direction: column;
  padding: 40px 25px;
  position: fixed; height: 100vh; z-index: 200;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 992px) {
    transform: ${props => props.isOpen ? "translateX(0)" : "translateX(-100%)"};
    width: 250px;
  }

  .sidebar-header {
    margin-bottom: 60px;
    display: flex; justify-content: space-between; align-items: center;
  }
`;

const Logo = styled.div`
  display: flex; align-items: center; gap: 15px;
  .icon {
    background: #ffc107; color: black; width: 42px; height: 42px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
  }
  span { font-weight: 950; font-style: italic; letter-spacing: -1px; font-size: 1.2rem;
    small { display: block; font-size: 0.6rem; letter-spacing: 2px; color: #ffc107; font-style: normal; }
  }
`;

const NavMenu = styled.div` display: flex; flex-direction: column; gap: 12px; flex: 1; `;

const NavItem = styled.div`
  display: flex; align-items: center; gap: 15px; padding: 16px 20px; border-radius: 15px;
  cursor: pointer; font-weight: 700; transition: all 0.3s ease;
  color: ${props => props.active ? "black" : "#666"};
  background: ${props => props.active ? "#ffc107" : "transparent"};
  box-shadow: ${props => props.active ? "0 10px 20px rgba(255, 193, 7, 0.3)" : "none"};

  &:hover {
    color: ${props => props.active ? "black" : "white"};
    background: ${props => props.active ? "#ffc107" : "rgba(255,255,255,0.05)"};
  }
`;

const LogoutBtn = styled.button`
  margin-top: auto; display: flex; align-items: center; gap: 15px; padding: 16px 20px;
  border-radius: 15px; border: 1px solid rgba(255,255,255,0.1); background: transparent;
  color: #ff5b5b; font-weight: 800; cursor: pointer; transition: all 0.3s ease;
  &:hover { background: rgba(255,91,91,0.1); border-color: #ff5b5b; }
`;

const MainContent = styled.div`
  margin-left: 280px; flex: 1; padding: 50px;
  @media (max-width: 992px) { margin-left: 0; padding: 25px; }

  .reveal {
    opacity: 0; transform: translateY(20px); transition: all 0.8s ease;
    &.reveal-visible { opacity: 1; transform: translateY(0); }
  }
`;

const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 50px;
  @media (max-width: 768px) { flex-direction: column; align-items: flex-start; gap: 20px; }
`;

const TitleArea = styled.div`
  h1 { font-size: 2.5rem; font-weight: 950; font-style: italic; margin: 0; }
  p { color: #666; font-weight: 500; margin-top: 5px; }
  .text-warning { color: #ffc107; }
`;

const SearchArea = styled.div`
  width: 100%; max-width: 350px;
  .search-box {
    background: #0a0a0a; border: 1px solid #222; border-radius: 12px; padding: 12px 20px;
    display: flex; align-items: center; gap: 12px;
    input { background: none; border: none; outline: none; color: white; width: 100%; font-weight: 500; }
    svg { color: #ffc107; }
  }
`;

const StatsRow = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-bottom: 50px;
  @media (max-width: 1200px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const StatCard = styled.div`
  background: #0a0a0a; border: 1px solid #222; padding: 30px; border-radius: 25px;
  position: relative; overflow: hidden;
  
  &::after {
    content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
    background: radial-gradient(circle, ${props => props.color}22 0%, transparent 70%);
  }

  .card-top {
    display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px;
    svg { color: #ffc107; }
    .trend { color: #666; }
  }

  .card-bottom {
    position: relative; z-index: 2;
    .value { display: block; font-size: 2.2rem; font-weight: 900; letter-spacing: -1px; }
    .label { color: #666; font-size: 0.75rem; font-weight: 900; letter-spacing: 1px; }
  }
`;

const TableContainer = styled.div`
  background: #0a0a0a; border: 1px solid #222; border-radius: 25px; padding: 30px;
  .responsive-table { overflow-x: auto; }
`;

const Table = styled.table`
  width: 100%; border-collapse: collapse;
  thead th { text-align: left; padding: 15px 20px; color: #ffc107; font-size: 0.75rem; font-weight: 900; letter-spacing: 1px; border-bottom: 1px solid #222; }
  tbody td { padding: 25px 20px; border-bottom: 1px solid #111; font-size: 0.95rem; }
  .user-info {
    display: flex; align-items: center; gap: 15px;
    .avatar { width: 40px; height: 40px; background: #222; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #ffc107; }
    .sub-text { font-size: 0.8rem; color: #666; }
  }
  .expanded-row { background: rgba(255,193,7,0.02); }
  .italic { font-style: italic; }
`;

const StatusBadge = styled.span`
  padding: 6px 14px; border-radius: 6px; font-size: 0.7rem; font-weight: 900; letter-spacing: 1px;
  background: ${props => props.status === "ACTIVE" || props.status === "SUCCESS" ? "rgba(5,205,153,0.1)" : "rgba(255,91,91,0.1)"};
  color: ${props => props.status === "ACTIVE" || props.status === "SUCCESS" ? "#05cd99" : "#ff5b5b"};
  border: 1px solid ${props => props.status === "ACTIVE" || props.status === "SUCCESS" ? "rgba(5,205,153,0.2)" : "rgba(255,91,91,0.2)"};
`;

const ActionGroup = styled.div` display: flex; gap: 10px; `;
const ActionButton = styled.button`
  background: none; border: none; cursor: pointer; color: #444; transition: all 0.3s ease;
  &:hover { color: white; transform: scale(1.1); }
  &.success:hover { color: #05cd99; }
  &.warning:hover { color: #ffbc11; }
  &.danger:hover { color: #ff5b5b; }
`;

const ExpandedDetails = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding: 30px;
  .details-col {
    h6 { display: flex; align-items: center; gap: 10px; font-weight: 800; color: #ffc107; font-size: 0.8rem; margin-bottom: 20px; }
    .details-list {
      list-style: none; padding: 0; margin: 0;
      li {
        display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #111; font-size: 0.85rem;
        .price, .time { color: white; font-weight: 700; }
        span:first-child { color: #666; }
      }
    }
  }
  .empty-msg { color: #444; font-size: 0.85rem; }
`;

const LoadingState = styled.div`
  display: flex; flex-direction: column; justify-content: center; align-items: center; height: 400px; gap: 20px; color: #666;
  .spinner { width: 40px; height: 40px; border: 4px solid #111; border-top-color: #ffc107; border-radius: 50%; animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const ErrorMessage = styled.div` background: rgba(255,91,91,0.1); color: #ff5b5b; padding: 20px; border-radius: 15px; border: 1px solid rgba(255,91,91,0.2); display: flex; align-items: center; gap: 15px; font-weight: 700; `;

const CloseButton = styled.button` display: none; @media (max-width: 992px) { display: block; background: none; border: none; color: #666; } `;
const Overlay = styled.div` position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 190; `;

export default AdminDashboard;
