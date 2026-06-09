import React from "react";
import styled from "styled-components";
import { Download, BarChart2, TrendingUp, Users, DollarSign, Activity } from "lucide-react";

const ReportsModule = () => {
  return (
    <Container className="animate-in">
      <div className="module-header">
        <div className="title-area">
          <h2>REPORTS <small>& DASHBOARDS</small></h2>
        </div>
        <div className="actions">
          <select className="date-select">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
          <button className="btn-outline"><Download size={16} /> Export CSV</button>
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-icon blue"><DollarSign size={20} /></div>
          <div className="kpi-info">
            <label>Total Revenue</label>
            <h3>₹2,45,000</h3>
            <span className="trend positive"><TrendingUp size={12} /> +12.5%</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon green"><Users size={20} /></div>
          <div className="kpi-info">
            <label>New Signups</label>
            <h3>48</h3>
            <span className="trend positive"><TrendingUp size={12} /> +5.2%</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon yellow"><Activity size={20} /></div>
          <div className="kpi-info">
            <label>Avg. Attendance</label>
            <h3>156/day</h3>
            <span className="trend negative"><TrendingUp size={12} style={{transform:'rotate(180deg)'}} /> -2.1%</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon purple"><BarChart2 size={20} /></div>
          <div className="kpi-info">
            <label>Lead Conversion</label>
            <h3>22.4%</h3>
            <span className="trend positive"><TrendingUp size={12} /> +4.8%</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="c-header">
            <h3>Revenue Trend</h3>
          </div>
          <div className="chart-area line-chart">
            {/* CSS placeholder for chart */}
            <div className="mock-chart line">
              <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                <path d="M0,35 Q10,25 20,30 T40,20 T60,25 T80,10 T100,5" fill="none" stroke="var(--accent-color)" strokeWidth="1" />
                <path d="M0,35 Q10,25 20,30 T40,20 T60,25 T80,10 T100,5 L100,40 L0,40 Z" fill="url(#grad)" opacity="0.2" />
                <defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent-color)" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs>
              </svg>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="c-header">
            <h3>Membership Distribution</h3>
          </div>
          <div className="chart-area pie-chart">
            <div className="mock-pie">
              <div className="slice s1"></div>
              <div className="slice s2"></div>
              <div className="slice s3"></div>
            </div>
            <div className="pie-legend">
              <div className="leg-item"><span className="dot dot1"></span> Annual (45%)</div>
              <div className="leg-item"><span className="dot dot2"></span> Quarterly (35%)</div>
              <div className="leg-item"><span className="dot dot3"></span> Monthly (20%)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="reports-table-card">
        <h3>Recent Transactions</h3>
        <table className="table">
          <thead>
            <tr><th>DATE</th><th>DESCRIPTION</th><th>CATEGORY</th><th>AMOUNT</th></tr>
          </thead>
          <tbody>
            <tr><td>08 Jun 2026</td><td>Annual Membership - Alice</td><td>Subscription</td><td className="text-success fw-bold">+ ₹14,000</td></tr>
            <tr><td>08 Jun 2026</td><td>Monthly PT - Bob</td><td>Personal Training</td><td className="text-success fw-bold">+ ₹3,500</td></tr>
            <tr><td>07 Jun 2026</td><td>Quarterly Membership - Charlie</td><td>Subscription</td><td className="text-success fw-bold">+ ₹4,000</td></tr>
            <tr><td>06 Jun 2026</td><td>Equipment Maintenance</td><td>Expense</td><td className="text-danger fw-bold">- ₹2,500</td></tr>
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
    .date-select { background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); color: var(--text-color); padding: 8px 12px; border-radius: 8px; outline: none; }
    .btn-outline { display: flex; align-items: center; gap: 8px; background: transparent; border: 1px solid var(--border-color); color: var(--text-color); padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: background 0.2s; &:hover { background: rgba(255,255,255,0.05); } }
  }

  .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
  .kpi-card {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px; box-shadow: var(--shadow);
    .kpi-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .kpi-icon.blue { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }
    .kpi-icon.green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .kpi-icon.yellow { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    .kpi-icon.purple { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
    
    .kpi-info { flex: 1; }
    label { font-size: 0.8rem; color: var(--text-muted); }
    h3 { margin: 4px 0 6px 0; font-size: 1.4rem; color: var(--text-color); }
    .trend { font-size: 0.75rem; display: inline-flex; align-items: center; gap: 4px; padding: 2px 6px; border-radius: 4px; font-weight: 600; }
    .trend.positive { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .trend.negative { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
  }

  .charts-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
  .chart-card {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; padding: 24px; box-shadow: var(--shadow);
    .c-header { margin-bottom: 20px; h3 { margin: 0; font-size: 1.05rem; color: var(--text-color); } }
    
    .chart-area { height: 250px; display: flex; align-items: center; justify-content: center; position: relative; }
    
    .mock-chart { width: 100%; height: 100%; svg { width: 100%; height: 100%; } }
    
    .mock-pie {
      width: 180px; height: 180px; border-radius: 50%; position: relative;
      background: conic-gradient(#10b981 0% 45%, #38bdf8 45% 80%, #f59e0b 80% 100%);
    }
    .pie-chart { display: flex; flex-direction: column; gap: 20px; }
    .pie-legend {
      display: flex; flex-direction: column; gap: 10px; width: 100%;
      .leg-item { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-muted); }
      .dot { width: 10px; height: 10px; border-radius: 50%; }
      .dot1 { background: #10b981; } .dot2 { background: #38bdf8; } .dot3 { background: #f59e0b; }
    }
  }

  .reports-table-card {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; overflow: hidden; box-shadow: var(--shadow);
    h3 { margin: 0; padding: 20px; border-bottom: 1px solid var(--border-color); font-size: 1.05rem; color: var(--text-color); }
    .table {
      width: 100%; border-collapse: collapse;
      th { text-align: left; padding: 12px 20px; font-size: 0.75rem; color: var(--text-muted); border-bottom: 1px solid var(--border-color); }
      td { padding: 16px 20px; font-size: 0.9rem; border-bottom: 1px solid var(--border-color); color: var(--text-color); }
      .text-success { color: #10b981; }
      .text-danger { color: #ef4444; }
    }
  }
`;

export default ReportsModule;
