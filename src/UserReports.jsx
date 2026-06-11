import React from "react";
import styled from "styled-components";
import { Clock, CreditCard, User, Calendar, Activity, CheckCircle } from "lucide-react";

const UserReports = () => {
  const sessions = [
    { date: "2026-04-28", type: "Strength", duration: "55 mins", calories: "450 kcal" },
    { date: "2026-04-26", type: "Cardio", duration: "30 mins", calories: "320 kcal" },
    { date: "2026-04-25", type: "Yoga", duration: "45 mins", calories: "180 kcal" },
  ];

  const payments = [
    { id: "PAY-98210", date: "2026-04-01", plan: "Elite Yearly", amount: "₹12,000", status: "Success" },
    { id: "PAY-87122", date: "2025-04-01", plan: "Elite Yearly", amount: "₹12,000", status: "Success" },
  ];

  return (
    <ReportsContainer id="reports">
      <div className="section-title">
        <h2 className="text-warning fw-bold">Performance & Billing Reports</h2>
        <p className="text-muted">Track your progress and stay on top of your membership details.</p>
      </div>

      <div className="reports-grid">
        {/* Session Times Report */}
        <ReportCard>
          <div className="card-header">
            <Clock size={20} className="text-warning" />
            <h3>Recent Sessions</h3>
          </div>
          <div className="table-responsive">
            <table className="table table-dark table-hover mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Burn</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s, i) => (
                  <tr key={i}>
                    <td>{s.date}</td>
                    <td><span className="badge bg-secondary">{s.type}</span></td>
                    <td>{s.duration}</td>
                    <td className="text-warning">{s.calories}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ReportCard>

        {/* Payment Details Report */}
        <ReportCard>
          <div className="card-header">
            <CreditCard size={20} className="text-warning" />
            <h3>Payment History</h3>
          </div>
          <div className="table-responsive">
            <table className="table table-dark table-hover mb-0">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={i}>
                    <td className="small">{p.id}</td>
                    <td>{p.date}</td>
                    <td className="fw-bold">{p.amount}</td>
                    <td><span className="text-success"><CheckCircle size={14} className="me-1" /> {p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ReportCard>

        {/* User Summary Report */}
        <ReportCard className="full-width">
          <div className="card-header">
            <User size={20} className="text-warning" />
            <h3>Account Summary</h3>
          </div>
          <div className="summary-grid">
            <div className="summary-item">
              <Calendar size={24} className="text-muted" />
              <div>
                <small>Membership Type</small>
                <p>Elite Premium (Yearly)</p>
              </div>
            </div>
            <div className="summary-item">
              <Activity size={24} className="text-muted" />
              <div>
                <small>Overall Progress</small>
                <p>On Track (85% consistency)</p>
              </div>
            </div>
            <div className="summary-item">
              <CreditCard size={24} className="text-muted" />
              <div>
                <small>Next Billing Date</small>
                <p>April 01, 2027</p>
              </div>
            </div>
          </div>
        </ReportCard>
      </div>
    </ReportsContainer>
  );
};

const ReportsContainer = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 50px auto;
  padding: 0 20px;

  .section-title {
    text-align: center;
    margin-bottom: 40px;
  }

  .reports-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }
`;

const ReportCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  backdrop-filter: blur(10px);

  &.full-width {
    grid-column: 1 / -1;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 25px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 15px;

    h3 {
      font-size: 1.4rem;
      font-weight: 700;
      margin: 0;
      color: #fff;
    }
  }

  .table-dark {
    background: transparent !important;
    --bs-table-bg: transparent;
    font-size: 0.95rem;

    th {
      color: #888;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 1px;
      font-weight: 700;
    }

    td {
      vertical-align: middle;
      color: #ccc;
      padding: 15px 10px;
    }
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    .summary-item {
      display: flex;
      align-items: center;
      gap: 15px;
      background: rgba(255, 255, 255, 0.03);
      padding: 20px;
      border-radius: 15px;

      small {
        color: #888;
        display: block;
        margin-bottom: 4px;
        text-transform: uppercase;
        font-weight: 700;
        font-size: 0.7rem;
      }

      p {
        margin: 0;
        font-weight: 600;
        color: #fff;
      }
    }
  }
`;

export default UserReports;
