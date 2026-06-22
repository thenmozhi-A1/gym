import React, { useState } from "react";
import styled from "styled-components";
import { Download, Search, CreditCard, DollarSign, PieChart } from "lucide-react";
import { generateInvoicePDF } from "../utils/pdfTemplates";
import { useAdminStore } from "../store/useAdminStore";

const PaymentModule = () => {
  const { payments, staffs } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayments = payments.filter(p => 
    ((p.user?.fullName || p.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(p.id || "").toLowerCase().includes(searchTerm.toLowerCase())) &&
    Number(p.amount) > 0
  );

  const userFirstPayments = {};
  payments.forEach(p => {
    const uid = p.user?.id || p.userId || p.fullName;
    if (uid) {
      if (!userFirstPayments[uid] || new Date(p.paymentDate) < new Date(userFirstPayments[uid].paymentDate)) {
        userFirstPayments[uid] = p;
      }
    }
  });
  
  const originalIncome = Object.values(userFirstPayments).reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const totalIncome = originalIncome; // Use original income for net revenue calculation as requested
  const totalOutcome = staffs.reduce((acc, s) => {
    const salary = parseFloat(s.salary) || 0;
    return acc + salary;
  }, 0);
  const netRevenue = totalIncome - totalOutcome;

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
          <button
            className="btn-primary"
            onClick={() => filteredPayments.forEach(p => generateInvoicePDF(p))}
            title="Download all filtered invoices as PDFs"
          >
            <Download size={14} style={{ marginRight: 6 }} />
            Export All
          </button>
        </div>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="icon"><DollarSign size={24} /></div>
          <div className="info">
            <label>Original Income (Users)</label>
            <h3 className="text-success">₹{totalIncome.toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="icon warning"><CreditCard size={24} /></div>
          <div className="info">
            <label>Total Outcome (Employees)</label>
            <h3 className="text-danger">₹{totalOutcome.toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="icon success"><PieChart size={24} /></div>
          <div className="info">
            <label>Net Revenue</label>
            <h3 className="text-primary">₹{netRevenue.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px'}}>
        <h3 style={{color: 'var(--text-color)', margin: 0, fontSize: '1.05rem'}}>Member Invoices (Income)</h3>
      </div>

      <div className="table-card table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>INVOICE #</th>
              <th>MEMBER</th>
              <th>AMOUNT</th>
              <th>PLAN</th>
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
                <td>{p.planName || "Standard"}</td>
                <td>{p.paymentMethod || p.paymentMode || "Card"}</td>
                <td>{Array.isArray(p.paymentDate) ? `${p.paymentDate[0]}-${String(p.paymentDate[1]).padStart(2, '0')}-${String(p.paymentDate[2]).padStart(2, '0')}` : new Date(p.paymentDate).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${p.paymentStatus === 'SUCCESS' ? 'bg-success' : 'bg-warning'}`}>
                    {p.paymentStatus}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-icon"
                    title="Download Invoice"
                    onClick={() => generateInvoicePDF(p)}
                  >
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredPayments.length === 0 && (
              <tr><td colSpan="8" className="text-center py-4">No payments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px'}}>
        <h3 style={{color: 'var(--text-color)', margin: 0, fontSize: '1.05rem'}}>Staff Payroll (Outcome / Expenses)</h3>
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>STAFF ID</th>
              <th>NAME</th>
              <th>ROLE</th>
              <th>MONTHLY SALARY</th>
              <th>PAYMENT STATUS</th>
            </tr>
          </thead>
          <tbody>
            {staffs.map((s, i) => (
              <tr key={i}>
                <td className="fw-bold text-muted">{s.id || `EMP-${1000 + i}`}</td>
                <td className="fw-bold">{s.name || s.fullName}</td>
                <td>{s.role || "Staff"}</td>
                <td className="fw-bold text-danger">₹{parseFloat(s.salary || 0).toLocaleString()}</td>
                <td>
                  <span className="badge bg-success">PAID</span>
                </td>
              </tr>
            ))}
            {staffs.length === 0 && (
              <tr><td colSpan="5" className="text-center py-4">No employee records found.</td></tr>
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
    flex-wrap: wrap; gap: 16px;

    @media (max-width: 768px) {
      flex-direction: column; align-items: stretch;
    }

    h2 { margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--text-color); display: flex; align-items: center; gap: 8px; }
    small { font-weight: 400; color: var(--text-muted); font-size: 0.8rem; letter-spacing: 1px; }
    
    .actions { display: flex; gap: 12px; flex-wrap: wrap; }
    .search-box {
      display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); border-radius: 8px; padding: 6px 12px; color: var(--text-muted);
      flex: 1; min-width: 200px;
      input { border: none; background: transparent; outline: none; color: var(--text-color); font-size: 0.9rem; width: 100%; }
    }
    .btn-primary { background: var(--accent-color, #38bdf8); color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  }

  .stats-cards {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;
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
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; overflow-x: auto; box-shadow: var(--shadow);
    .table {
      width: 100%; border-collapse: collapse; min-width: 600px;
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
