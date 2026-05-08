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
  Edit3,
  CheckCircle,
  XCircle,
  Menu as MenuIcon,
  X
} from "lucide-react";

const API_BASE = "https://gymj-9.onrender.com/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
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
      }
    } catch (err) {
      setError("Failed to fetch data. Please check if the server is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
        alert("User deleted successfully!");
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
        alert(`User status updated to ${newStatus}`);
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
    p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.paymentStatus?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAttendance = attendance.filter(a =>
    a.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        <div className="logo">GD</div>
        <button onClick={() => setIsSidebarOpen(true)}><MenuIcon /></button>
      </MobileHeader>

      <Sidebar isOpen={isSidebarOpen}>
        <div className="sidebar-header">
          <Logo>
            <div className="icon">GD</div>
            <span>GymDash Admin</span>
          </Logo>
          <CloseButton onClick={() => setIsSidebarOpen(false)}><X /></CloseButton>
        </div>

        <NavMenu>
          <NavItem active={activeTab === "users"} onClick={() => { setActiveTab("users"); setIsSidebarOpen(false); }}>
            <Users size={20} /> Users Management
          </NavItem>
          <NavItem active={activeTab === "payments"} onClick={() => { setActiveTab("payments"); setIsSidebarOpen(false); }}>
            <CreditCard size={20} /> Payment Records
          </NavItem>
          <NavItem active={activeTab === "attendance"} onClick={() => { setActiveTab("attendance"); setIsSidebarOpen(false); }}>
            <Clock size={20} /> Attendance Logs
          </NavItem>
        </NavMenu>

        <LogoutBtn onClick={handleLogout}>
          <LogOut size={20} /> Logout
        </LogoutBtn>
      </Sidebar>

      {isSidebarOpen && <Overlay onClick={() => setIsSidebarOpen(false)} />}

      <MainContent>
        <Header>
          <TitleArea>
            <h1>{activeTab === "users" ? "Users Details" : activeTab === "payments" ? "Payments History" : "In/Out Timings"}</h1>
            <p>Manage and monitor your gym's {activeTab} activity.</p>
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

        <StatsRow>
          <StatCard>
            <div className="icon users"><Users /></div>
            <div className="info">
              <span className="label">Total Users</span>
              <span className="value">{users.length}</span>
            </div>
          </StatCard>
          <StatCard>
            <div className="icon payments"><CreditCard /></div>
            <div className="info">
              <span className="label">Total Revenue</span>
              <span className="value">₹{payments.reduce((acc, p) => acc + (p.amount || 0), 0)}</span>
            </div>
          </StatCard>
          <StatCard>
            <div className="icon attendance"><Clock /></div>
            <div className="info">
              <span className="label">Total Records</span>
              <span className="value">{attendance.length}</span>
            </div>
          </StatCard>
        </StatsRow>

        {error && (
          <ErrorMessage>
            <AlertCircle size={20} /> {error}
          </ErrorMessage>
        )}

        <TableContainer>
          {loading ? (
            <LoadingState>Fetching records...</LoadingState>
          ) : (
            <div className="responsive-table">
              <Table>
                {activeTab === "users" && (
                  <>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <React.Fragment key={user.id}>
                          <tr 
                            onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}
                            style={{ cursor: 'pointer' }}
                            className={expandedUserId === user.id ? "expanded-row" : ""}
                          >
                            <td className="fw-bold">
                              <div>{user.fullName}</div>
                              <div style={{fontSize: '0.8rem', color: '#a3aed0', fontWeight: '400'}}>{user.email}</div>
                            </td>
                            <td><StatusBadge status={user.status}>{user.status}</StatusBadge></td>
                            <td>
                              <ActionGroup onClick={(e) => e.stopPropagation()}>
                                <ActionButton 
                                  title="Set Active" 
                                  onClick={() => handleUpdateStatus(user, "ACTIVE")}
                                  className="success"
                                >
                                  <CheckCircle size={18} />
                                </ActionButton>
                                <ActionButton 
                                  title="Set Inactive" 
                                  onClick={() => handleUpdateStatus(user, "INACTIVE")}
                                  className="warning"
                                >
                                  <XCircle size={18} />
                                </ActionButton>
                                <ActionButton 
                                  title="Delete User" 
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="danger"
                                >
                                  <Trash2 size={18} />
                                </ActionButton>
                              </ActionGroup>
                            </td>
                          </tr>
                          {expandedUserId === user.id && (
                            <tr>
                              <td colSpan="3" style={{ padding: '0' }}>
                                <ExpandedDetails>
                                  <div className="details-section">
                                    <h6><CreditCard size={16} /> Recent Payments</h6>
                                    {payments.filter(p => p.user?.id === user.id).length > 0 ? (
                                      <ul className="details-list">
                                        {payments.filter(p => p.user?.id === user.id).slice(0, 5).map(p => (
                                          <li key={p.id}>
                                            <span>₹{p.amount} - {p.planName}</span>
                                            <StatusBadge status={p.paymentStatus}>{p.paymentStatus}</StatusBadge>
                                            <span className="date">{new Date(p.paymentDate).toLocaleDateString()}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : <p className="empty-msg">No payment history found.</p>}
                                  </div>
                                  <div className="details-section">
                                    <h6><Clock size={16} /> Recent Attendance</h6>
                                    {attendance.filter(a => a.user?.id === user.id).length > 0 ? (
                                      <ul className="details-list">
                                        {attendance.filter(a => a.user?.id === user.id).slice(0, 5).map(a => (
                                          <li key={a.id}>
                                            <span>{a.attendanceDate}</span>
                                            <span className="time">{a.checkInTime} - {a.checkOutTime || "Ongoing"}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : <p className="empty-msg">No attendance logs found.</p>}
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
                      <tr>
                        <th>User</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.map(payment => (
                        <tr key={payment.id}>
                          <td className="fw-bold">{payment.user?.fullName || "N/A"}</td>
                          <td className="fw-bold">₹{payment.amount}</td>
                          <td><StatusBadge status={payment.paymentStatus}>{payment.paymentStatus}</StatusBadge></td>
                          <td>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {activeTab === "attendance" && (
                  <>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Date</th>
                        <th>Check In</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendance.map(log => (
                        <tr key={log.id}>
                          <td className="fw-bold">{log.user?.fullName}</td>
                          <td>{log.attendanceDate}</td>
                          <td className="text-success fw-bold">{log.checkInTime}</td>
                          <td>{calculateDuration(log.checkInTime, log.checkOutTime)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}
              </Table>
            </div>
          )}
          {!loading && activeTab === "users" && filteredUsers.length === 0 && <EmptyState>No users found.</EmptyState>}
          {!loading && activeTab === "payments" && filteredPayments.length === 0 && <EmptyState>No payments found.</EmptyState>}
          {!loading && activeTab === "attendance" && filteredAttendance.length === 0 && <EmptyState>No attendance records found.</EmptyState>}
        </TableContainer>
      </MainContent>
    </DashboardContainer>
  );
};

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f4f7fe;
  font-family: 'Inter', sans-serif;
  @media (max-width: 992px) { flex-direction: column; }
`;

const MobileHeader = styled.div`
  display: none;
  @media (max-width: 992px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
    position: sticky;
    top: 0;
    z-index: 150;
    .logo { background: #ffc107; color: #000; padding: 5px 10px; border-radius: 8px; font-weight: 800; }
    button { background: none; border: none; cursor: pointer; color: #1b2559; }
  }
`;

const Sidebar = styled.div`
  width: 280px;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 30px 20px;
  position: fixed;
  height: 100vh;
  z-index: 200;
  transition: transform 0.3s ease;

  @media (max-width: 992px) {
    transform: ${props => props.isOpen ? "translateX(0)" : "translateX(-100%)"};
    width: 250px;
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 50px;
  }
`;

const CloseButton = styled.button`
  display: none;
  @media (max-width: 992px) {
    display: block;
    background: none;
    border: none;
    color: #a3aed0;
    cursor: pointer;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  z-index: 190;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  .icon {
    background: #ffc107;
    color: #000;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 1.2rem;
  }
  span {
    font-weight: 800;
    font-size: 1.2rem;
    color: #1b2559;
  }
`;

const NavMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  color: ${props => props.active ? "#fff" : "#a3aed0"};
  background: ${props => props.active ? "#ffc107" : "transparent"};
  box-shadow: ${props => props.active ? "0 10px 20px rgba(255, 193, 7, 0.2)" : "none"};

  &:hover {
    background: ${props => props.active ? "#ffc107" : "#f4f7fe"};
    color: ${props => props.active ? "#fff" : "#1b2559"};
  }
`;

const LogoutBtn = styled.button`
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  border-radius: 12px;
  border: none;
  background: #fff5f5;
  color: #ff5b5b;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: #ffe0e0;
    transform: translateY(-2px);
  }
`;

const MainContent = styled.div`
  margin-left: 280px;
  flex: 1;
  padding: 40px;
  @media (max-width: 992px) { margin-left: 0; padding: 20px; }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
  @media (max-width: 768px) { flex-direction: column; align-items: flex-start; gap: 20px; }
`;

const TitleArea = styled.div`
  h1 { font-size: 2.2rem; font-weight: 800; color: #1b2559; margin-bottom: 5px; }
  p { color: #a3aed0; font-weight: 500; }
  @media (max-width: 480px) { h1 { font-size: 1.8rem; } }
`;

const SearchArea = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
  max-width: 400px;
  .search-box {
    background: #fff;
    border-radius: 50px;
    padding: 12px 25px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border: 1px solid #e2e8f0;
    width: 100%;
    input { border: none; outline: none; width: 100%; font-weight: 500; color: #1b2559; }
    svg { color: #a3aed0; }
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-bottom: 40px;
  @media (max-width: 1200px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 768px) { grid-template-columns: 1fr; gap: 15px; }
`;

const StatCard = styled.div`
  background: #fff;
  padding: 25px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  .icon {
    width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center;
    &.users { background: #e7e9fb; color: #4318ff; }
    &.payments { background: #e2f9ef; color: #05cd99; }
    &.attendance { background: #ffede8; color: #ff5b5b; }
  }
  .info {
    .label { color: #a3aed0; font-size: 0.9rem; font-weight: 600; display: block; }
    .value { color: #1b2559; font-size: 1.5rem; font-weight: 800; }
  }
`;

const TableContainer = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  min-height: 400px;
  .responsive-table { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  @media (max-width: 480px) { padding: 15px; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 400px;
  thead th { text-align: left; padding: 15px; color: #a3aed0; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #f4f7fe; }
  tbody td { padding: 20px 15px; color: #1b2559; font-size: 0.95rem; border-bottom: 1px solid #f4f7fe; }
  .fw-bold { font-weight: 700; }
`;

const StatusBadge = styled.span`
  padding: 6px 14px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;
  background: ${props => {
    switch (props.status) {
      case "ACTIVE": case "SUCCESS": return "#e2f9ef";
      case "PENDING": return "#fff9e7";
      case "INACTIVE": case "FAILED": return "#fff5f5";
      default: return "#f4f7fe";
    }
  }};
  color: ${props => {
    switch (props.status) {
      case "ACTIVE": case "SUCCESS": return "#05cd99";
      case "PENDING": return "#ffbc11";
      case "INACTIVE": case "FAILED": return "#ff5b5b";
      default: return "#a3aed0";
    }
  }};
`;

const ActionGroup = styled.div` display: flex; gap: 8px; `;

const ActionButton = styled.button`
  background: none; border: none; cursor: pointer; padding: 5px; border-radius: 6px; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center;
  &.success { color: #05cd99; &:hover { background: #e2f9ef; } }
  &.warning { color: #ffbc11; &:hover { background: #fff9e7; } }
  &.danger { color: #ff5b5b; &:hover { background: #fff5f5; } }
`;

const ExpandedDetails = styled.div`
  background: #fcfdfe;
  padding: 20px 30px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  border-bottom: 2px solid #ffc107;
  animation: fadeIn 0.3s ease;

  @media (max-width: 768px) { grid-template-columns: 1fr; }

  h6 {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    color: #1b2559;
    margin-bottom: 15px;
    font-size: 0.9rem;
    svg { color: #ffc107; }
  }

  .details-list {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f4f7fe;
      font-size: 0.85rem;
      &:last-child { border-bottom: none; }
      .date, .time { color: #a3aed0; }
    }
  }

  .empty-msg { color: #a3aed0; font-size: 0.85rem; font-style: italic; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const LoadingState = styled.div` display: flex; justify-content: center; align-items: center; height: 300px; color: #a3aed0; font-weight: 600; `;
const ErrorMessage = styled.div` background: #fff5f5; color: #ff5b5b; padding: 15px 20px; border-radius: 12px; margin-bottom: 25px; display: flex; align-items: center; gap: 12px; font-weight: 600; `;
const EmptyState = styled.div` text-align: center; padding: 50px; color: #a3aed0; font-weight: 500; `;

export default AdminDashboard;
