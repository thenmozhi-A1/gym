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
  XCircle
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
        const res = await fetch(`${API_BASE}/users`);
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
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
      <Sidebar>
        <Logo>
          <div className="icon">GD</div>
          <span>GymDash Admin</span>
        </Logo>

        <NavMenu>
          <NavItem active={activeTab === "users"} onClick={() => setActiveTab("users")}>
            <Users size={20} /> Users Management
          </NavItem>
          <NavItem active={activeTab === "payments"} onClick={() => setActiveTab("payments")}>
            <CreditCard size={20} /> Payment Records
          </NavItem>
          <NavItem active={activeTab === "attendance"} onClick={() => setActiveTab("attendance")}>
            <Clock size={20} /> Attendance Logs
          </NavItem>
        </NavMenu>

        <LogoutBtn onClick={handleLogout}>
          <LogOut size={20} /> Logout
        </LogoutBtn>
      </Sidebar>

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
            <Table>
              {activeTab === "users" && (
                <>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Joined Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td className="fw-bold">{user.fullName}</td>
                        <td>{user.email}</td>
                        <td><StatusBadge status={user.status}>{user.status}</StatusBadge></td>
                        <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</td>
                        <td>
                          <ActionGroup>
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
                    ))}
                  </tbody>
                </>
              )}

              {activeTab === "payments" && (
                <>
                  <thead>
                    <tr>
                      <th>TXN ID</th>
                      <th>User</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map(payment => (
                      <tr key={payment.id}>
                        <td>{payment.transactionId}</td>
                        <td>{payment.user?.fullName || "N/A"}</td>
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
                      <th>Check Out</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.map(log => (
                      <tr key={log.id}>
                        <td className="fw-bold">{log.user?.fullName}</td>
                        <td>{log.attendanceDate}</td>
                        <td className="text-success fw-bold">{log.checkInTime}</td>
                        <td className="text-danger fw-bold">{log.checkOutTime || "Pending"}</td>
                        <td>{calculateDuration(log.checkInTime, log.checkOutTime)}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}
            </Table>
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
  z-index: 100;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 50px;
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
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
`;

const TitleArea = styled.div`
  h1 {
    font-size: 2.2rem;
    font-weight: 800;
    color: #1b2559;
    margin-bottom: 5px;
  }
  p {
    color: #a3aed0;
    font-weight: 500;
  }
`;

const SearchArea = styled.div`
  display: flex;
  gap: 15px;
  .search-box {
    background: #fff;
    border-radius: 50px;
    padding: 12px 25px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border: 1px solid #e2e8f0;
    width: 300px;
    input {
      border: none;
      outline: none;
      width: 100%;
      font-weight: 500;
      color: #1b2559;
    }
    svg { color: #a3aed0; }
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-bottom: 40px;
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
    width: 56px;
    height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    svg { size: 24px; }
    
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
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  thead th {
    text-align: left;
    padding: 15px;
    color: #a3aed0;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 1px solid #f4f7fe;
  }
  
  tbody td {
    padding: 20px 15px;
    color: #1b2559;
    font-size: 0.95rem;
    border-bottom: 1px solid #f4f7fe;
  }
  
  tbody tr:last-child td { border-bottom: none; }
  
  .fw-bold { font-weight: 700; }
`;

const StatusBadge = styled.span`
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
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

const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &.success { color: #05cd99; &:hover { background: #e2f9ef; } }
  &.warning { color: #ffbc11; &:hover { background: #fff9e7; } }
  &.danger { color: #ff5b5b; &:hover { background: #fff5f5; } }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #a3aed0;
  font-weight: 600;
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  background: #fff5f5;
  color: #ff5b5b;
  padding: 15px 20px;
  border-radius: 12px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 50px;
  color: #a3aed0;
  font-weight: 500;
`;

export default AdminDashboard;
