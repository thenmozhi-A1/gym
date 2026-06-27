import React, { useState } from "react";
import styled from "styled-components";
import { Search, Eye, Filter } from "lucide-react";
import { useAdminStore } from "../store/useAdminStore";

const MembershipUserDetails = () => {
  const { users } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return <span className="badge bg-success-light">Active</span>;
      case 'expired': return <span className="badge bg-danger-light">Expired</span>;
      case 'suspended': return <span className="badge bg-warning-light" style={{color: '#b45309'}}>Suspended</span>;
      default: return <span className="badge bg-success-light">{status || 'Active'}</span>;
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
      (u.memberId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.mobileNumber || u.phone || "").includes(searchTerm);
    
    const status = (u.membershipStatus || u.status || "active").toUpperCase();
    const matchesStatus = statusFilter === "ALL" || status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (!a.expiryDate) return 1;
    if (!b.expiryDate) return -1;
    return new Date(a.expiryDate) - new Date(b.expiryDate);
  });

  return (
    <Container className="animate-in">
      <div className="table-header">
        <h2>MEMBERSHIP <small>USER DETAILS</small></h2>
        <div className="header-actions">
          <div className="search-bar">
            <Search size={16} />
            <input 
              placeholder="Search member by name, ID or phone..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-dropdown">
            <Filter size={16} />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="table interactive-table">
          <thead>
            <tr>
              <th>MEMBER</th>
              <th>MEMBERSHIP PLAN</th>
              <th>START DATE</th>
              <th>EXPIRY DATE</th>
              <th>STATUS</th>
              <th>CONTACT</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => {
              let daysLeftText = "";
              let statusColor = "var(--text-muted)";
              if (u.expiryDate) {
                const today = new Date();
                today.setHours(0,0,0,0);
                const expDate = new Date(u.expiryDate);
                expDate.setHours(0,0,0,0);
                const diffTime = expDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays > 0) {
                  daysLeftText = `(${diffDays} days left)`;
                  if (diffDays <= 7) statusColor = "#f59e0b"; // Warning for <= 7 days
                } else if (diffDays === 0) {
                  daysLeftText = `(Expires today)`;
                  statusColor = "#f59e0b";
                } else {
                  daysLeftText = `(${Math.abs(diffDays)} days ago)`;
                  statusColor = "#ef4444"; // Danger for already expired
                }
              }

              return (
                <tr key={u.id || u.memberId}>
                  <td>
                    <div className="u-cell">
                      <div className="avatar-small">{(u.fullName || "U").charAt(0)}</div>
                      <div>
                        <div className="u-name">{u.fullName || "User"}</div>
                        <div className="u-email">{u.memberId || `MBR-${u.id || '0000'}`}</div>
                      </div>
                    </div>
                  </td>
                  <td className="fw-bolder text-primary">
                    {u.membershipPlan || u.membershipType || "Standard"}
                  </td>
                  <td className="sub-text">
                    {u.joiningDate ? u.joiningDate.split('T')[0] : "N/A"}
                  </td>
                  <td>
                    <div className="fw-bold" style={{ color: (u.membershipStatus || u.status)?.toLowerCase() === 'expired' ? '#ef4444' : 'inherit' }}>
                      {u.expiryDate ? u.expiryDate.split('T')[0] : "N/A"}
                    </div>
                    {daysLeftText && (
                      <div style={{ fontSize: '0.75rem', color: statusColor, marginTop: '2px' }}>
                        {daysLeftText}
                      </div>
                    )}
                  </td>
                  <td>{getStatusBadge(u.membershipStatus || u.status)}</td>
                  <td className="sub-text">{u.mobileNumber || u.phone || "N/A"}</td>
                </tr>
              );
            })}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  No members found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

const Container = styled.div`
  background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; padding: 24px; box-shadow: var(--shadow);
  display: flex; flex-direction: column; gap: 20px;
  
  .table-header {
    display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 20px; flex-wrap: wrap; gap: 16px;
    h2 { margin: 0; font-size: 1.2rem; font-weight: 700; color: var(--text-color); display: flex; align-items: center; gap: 8px; }
    small { font-weight: 400; color: var(--text-muted); font-size: 0.85rem; letter-spacing: 1px; }
    
    .header-actions {
      display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
      
      .search-bar {
        display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); padding: 8px 16px; border-radius: 8px;
        input { background: transparent; border: none; color: var(--text-color); font-size: 0.9rem; outline: none; width: 250px; }
        color: var(--text-muted);
      }
      
      .filter-dropdown {
        display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); padding: 8px 12px; border-radius: 8px; color: var(--text-muted);
        select { background: transparent; border: none; color: var(--text-color); font-size: 0.9rem; outline: none; cursor: pointer; }
      }
    }
  }

  .table-responsive {
    overflow-x: auto;
    .table {
      width: 100%; border-collapse: separate; border-spacing: 0 8px;
      th { text-align: left; padding: 12px 16px; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase; }
      td { padding: 16px; background: rgba(0,0,0,0.1); border-top: 1px solid rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.02); font-size: 0.95rem; color: var(--text-color); }
      td:first-child { border-left: 1px solid rgba(255,255,255,0.02); border-top-left-radius: 12px; border-bottom-left-radius: 12px; }
      td:last-child { border-right: 1px solid rgba(255,255,255,0.02); border-top-right-radius: 12px; border-bottom-right-radius: 12px; }
      
      .interactive-table tbody tr { transition: all 0.2s ease; cursor: pointer; }
      .interactive-table tbody tr:hover td { background: rgba(255,255,255,0.05); transform: scale(1.005); }

      .u-cell { display: flex; align-items: center; gap: 12px; }
      .avatar-small { width: 40px; height: 40px; background: var(--accent-color, #38bdf8); color: #fff; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; }
      .u-name { font-weight: 700; font-size: 1rem; color: var(--text-color); }
      .u-email { font-size: 0.8rem; color: var(--text-muted); font-family: monospace; }
      .sub-text { color: var(--text-muted); font-size: 0.85rem; }
      .text-primary { color: var(--accent-color, #38bdf8); }
      
      .badge { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
      .bg-success-light { background: rgba(16, 185, 129, 0.15); color: #10b981; }
      .bg-danger-light { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
      .bg-warning-light { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
    }
  }
`;

export default MembershipUserDetails;
