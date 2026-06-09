import React, { useState } from "react";
import styled from "styled-components";
import { Download, Search, CreditCard, DollarSign, PieChart } from "lucide-react";

const PaymentModule = ({ payments }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayments = payments.filter(p => 
    (p.user?.fullName || p.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.id || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const pendingPayments = payments.filter(p => p.paymentStatus !== "SUCCESS").length;

  return (
    <Container className="animate-in">
      <div className="module-header">
        <div className="title-area">
          <h2>REVENUE <small>& PAYMENTS</small></h2>
        </div>
        <div className="actions">
          <div className="search-box">
            <Search size={16} />
            <input type="text" placeholder="Search invoices..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <button className="btn-primary">Generate Invoice</button>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="icon"><DollarSign size={24} /></div>
          <div className="info">
            <label>Total Revenue</label>
            <h3>₹{totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="icon warning"><CreditCard size={24} /></div>
          <div className="info">
            <label>Pending Payments</label>
            <h3>{pendingPayments}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="icon success"><PieChart size={24} /></div>
          <div className="info">
            <label>GST Collected</label>
            <h3>₹{Math.floor(totalRevenue * 0.18).toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>INVOICE #</th>
              <th>MEMBER</th>
              <th>AMOUNT</th>
              <th>MODE</th>
              <th>DATE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(p => (
              <tr key={p.id}>
                <td className="fw-bold text-muted">{p.id || `INV-${Math.floor(Math.random() * 10000)}`}</td>
                <td className="fw-bold">{p.user?.fullName || p.fullName || "Member"}</td>
                <td className="fw-bold text-primary">₹{p.amount?.toLocaleString()}</td>
                <td>{p.paymentMode || "Card"}</td>
                <td>{p.paymentDate}</td>
                <td>
                  <span className={`badge ${p.paymentStatus === 'SUCCESS' ? 'bg-success' : 'bg-warning'}`}>
                    {p.paymentStatus}
                  </span>
                </td>
                <td>
                  <button className="btn-icon" title="Download Invoice"><Download size={16} /></button>
                </td>
              </tr>
            ))}
            {filteredPayments.length === 0 && (
              <tr><td colSpan="7" className="text-center py-4">No payments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex; flex-direction: column; gap: 24px;

  .module-header {
    display: flex; justify-content: space-between; align-items: center;
    h2 { margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--text-color); display: flex; align-items: center; gap: 8px; }
    small { font-weight: 400; color: var(--text-muted); font-size: 0.8rem; letter-spacing: 1px; }
    
    .actions { display: flex; gap: 12px; }
    .search-box {
      display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); border-radius: 8px; padding: 6px 12px; color: var(--text-muted);
      input { border: none; background: transparent; outline: none; color: var(--text-color); font-size: 0.9rem; }
    }
    .btn-primary { background: var(--accent-color, #38bdf8); color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
  }

  .stats-cards {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
    .stat-card {
      background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px; box-shadow: var(--shadow);
      .icon { width: 50px; height: 50px; border-radius: 12px; background: rgba(56, 189, 248, 0.1); color: var(--accent-color, #38bdf8); display: flex; align-items: center; justify-content: center; }
      .icon.warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
      .icon.success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
      .info label { font-size: 0.85rem; color: var(--text-muted); font-weight: 500; }
      .info h3 { margin: 4px 0 0 0; font-size: 1.5rem; color: var(--text-color); }
    }
  }

  .table-card {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; overflow: hidden; box-shadow: var(--shadow);
    .table {
      width: 100%; border-collapse: collapse;
      th { text-align: left; padding: 12px 20px; font-size: 0.75rem; color: var(--text-muted); border-bottom: 1px solid var(--border-color); }
      td { padding: 16px 20px; font-size: 0.9rem; border-bottom: 1px solid var(--border-color); color: var(--text-color); }
      .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
      .bg-success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
      .bg-warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
      .btn-icon { background: transparent; border: none; color: var(--text-muted); cursor: pointer; &:hover { color: var(--text-color); } }
      .text-primary { color: var(--accent-color, #38bdf8); }
    }
  }
`;

export default PaymentModule;
