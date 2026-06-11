import React from "react";
import styled from "styled-components";
import { CheckCircle, Clock, AlertTriangle, Shield } from "lucide-react";

const MembershipModule = ({ users, onAddUser }) => {
  const activeMembers = users.filter(u => (u.membershipStatus || u.status)?.toLowerCase() === 'active').length;
  const expiredMembers = users.filter(u => (u.membershipStatus || u.status)?.toLowerCase() === 'expired').length;
  
  // Calculate renewals due in 7 days
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const renewalsDue = users.filter(u => {
    if (!u.expiryDate) return false;
    const expDate = new Date(u.expiryDate);
    return expDate >= today && expDate <= nextWeek;
  }).length;

  return (
    <Container className="animate-in">
      <div className="header-actions">
        <h2>MEMBERSHIP <small>PLANS</small></h2>
        <div className="stats-row">
          <div className="stat-pill success"><CheckCircle size={14}/> Active: {activeMembers}</div>
          <div className="stat-pill danger"><AlertTriangle size={14}/> Expired: {expiredMembers}</div>
          <div className="stat-pill warning"><Clock size={14}/> Renewals (7d): {renewalsDue}</div>
        </div>
      </div>

      <div className="plans-grid">
        {/* Monthly Plan */}
        <div className="plan-card">
          <div className="plan-header">
            <h3>Monthly</h3>
            <div className="price">₹1,500<span>/mo</span></div>
          </div>
          <ul className="features">
            <li><CheckCircle size={14} className="text-success" /> Full Gym Access</li>
            <li><CheckCircle size={14} className="text-success" /> Free Fitness Assessment</li>
            <li><CheckCircle size={14} className="text-muted" /> Personal Trainer (Paid)</li>
          </ul>
          <button className="btn-assign" onClick={onAddUser}>Assign to Member</button>
        </div>

        {/* Quarterly Plan */}
        <div className="plan-card popular">
          <div className="popular-badge">MOST POPULAR</div>
          <div className="plan-header">
            <h3>Quarterly</h3>
            <div className="price">₹4,000<span>/3mo</span></div>
          </div>
          <ul className="features">
            <li><CheckCircle size={14} className="text-success" /> Full Gym Access</li>
            <li><CheckCircle size={14} className="text-success" /> Free Diet Plan</li>
            <li><CheckCircle size={14} className="text-success" /> 2 PT Sessions Free</li>
          </ul>
          <button className="btn-assign primary" onClick={onAddUser}>Assign to Member</button>
        </div>

        {/* Half-Yearly Plan */}
        <div className="plan-card">
          <div className="plan-header">
            <h3>Half-Yearly</h3>
            <div className="price">₹7,500<span>/6mo</span></div>
          </div>
          <ul className="features">
            <li><CheckCircle size={14} className="text-success" /> Full Gym Access</li>
            <li><CheckCircle size={14} className="text-success" /> Advanced Diet Plan</li>
            <li><CheckCircle size={14} className="text-success" /> 5 PT Sessions Free</li>
          </ul>
          <button className="btn-assign" onClick={onAddUser}>Assign to Member</button>
        </div>

        {/* Annual Plan */}
        <div className="plan-card premium">
          <div className="plan-header">
            <h3>Annual VIP</h3>
            <div className="price">₹14,000<span>/yr</span></div>
          </div>
          <ul className="features">
            <li><Shield size={14} className="text-warning" /> VIP Access All Branches</li>
            <li><CheckCircle size={14} className="text-success" /> Free Diet & Supplements Consult</li>
            <li><CheckCircle size={14} className="text-success" /> 12 PT Sessions Free</li>
          </ul>
          <button className="btn-assign warning" onClick={onAddUser}>Assign to Member</button>
        </div>
      </div>

      <div className="renewal-section">
        <h3>Upcoming Renewals (Next 7 Days)</h3>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr><th>MEMBER</th><th>PLAN</th><th>EXPIRY DATE</th><th>CONTACT</th><th>ACTION</th></tr>
            </thead>
            <tbody>
              {users.filter(u => {
                if (!u.expiryDate) return false;
                const expDate = new Date(u.expiryDate);
                return expDate >= today && expDate <= nextWeek;
              }).map(u => (
                <tr key={u.id || u.memberId}>
                  <td className="fw-bold">{u.fullName}</td>
                  <td>{u.membershipPlan || "Standard"}</td>
                  <td className="text-danger fw-bold">{new Date(u.expiryDate).toLocaleDateString()}</td>
                  <td className="sub-text">{u.mobileNumber || "N/A"}</td>
                  <td><button className="btn-renew">Send Reminder</button></td>
                </tr>
              ))}
              {renewalsDue === 0 && (
                <tr><td colSpan="5" className="text-center py-4 text-muted">No renewals due in the next 7 days.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex; flex-direction: column; gap: 24px;
  
  .header-actions {
    display: flex; justify-content: space-between; align-items: center;
    h2 { margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--text-color); display: flex; align-items: center; gap: 8px; }
    small { font-weight: 400; color: var(--text-muted); font-size: 0.8rem; letter-spacing: 1px; }
  }

  .stats-row {
    display: flex; gap: 12px;
    .stat-pill {
      display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;
      &.success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
      &.danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
      &.warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    }
  }

  .plans-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;
  }

  .plan-card {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; padding: 24px;
    position: relative; overflow: hidden; display: flex; flex-direction: column; box-shadow: var(--shadow);
    
    &.popular { border-color: var(--accent-color, #38bdf8); }
    &.premium { border-color: #f59e0b; }
    
    .popular-badge { position: absolute; top: 0; right: 0; background: var(--accent-color, #38bdf8); color: #fff; font-size: 0.6rem; font-weight: bold; padding: 4px 12px; border-bottom-left-radius: 12px; letter-spacing: 1px; }
    
    .plan-header {
      margin-bottom: 20px; border-bottom: 1px dashed var(--border-color); padding-bottom: 20px;
      h3 { margin: 0 0 8px 0; color: var(--text-color); font-size: 1.2rem; }
      .price { font-size: 1.8rem; font-weight: 800; color: var(--text-color); span { font-size: 0.9rem; color: var(--text-muted); font-weight: 500; } }
    }

    .features {
      list-style: none; padding: 0; margin: 0 0 24px 0; flex: 1;
      li { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 0.9rem; color: var(--text-color); }
      .text-success { color: #10b981; }
      .text-muted { color: var(--text-muted); }
      .text-warning { color: #f59e0b; }
    }

    .btn-assign {
      width: 100%; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;
      background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); color: var(--text-color);
      &:hover { background: rgba(255,255,255,0.05); }
      &.primary { background: var(--accent-color, #38bdf8); border-color: var(--accent-color, #38bdf8); color: #fff; }
      &.warning { background: #f59e0b; border-color: #f59e0b; color: #fff; }
    }
  }

  .renewal-section {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; padding: 24px; box-shadow: var(--shadow);
    h3 { margin: 0 0 20px 0; font-size: 1.1rem; color: var(--text-color); }
    
    .table {
      width: 100%; border-collapse: collapse;
      th { text-align: left; padding: 12px; font-size: 0.75rem; color: var(--text-muted); border-bottom: 1px solid var(--border-color); }
      td { padding: 12px; font-size: 0.9rem; border-bottom: 1px solid var(--border-color); }
      .text-danger { color: #ef4444; }
      .btn-renew { background: rgba(56, 189, 248, 0.1); color: var(--accent-color, #38bdf8); border: 1px solid var(--accent-color, #38bdf8); padding: 4px 12px; border-radius: 4px; font-size: 0.8rem; cursor: pointer; }
    }
  }
`;

export default MembershipModule;
