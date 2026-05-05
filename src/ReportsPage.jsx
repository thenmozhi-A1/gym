import React from "react";
import styled from "styled-components";
import { Users, Clock, DollarSign, TrendingUp, Download, Filter } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ReportsPage = () => {
  const currentUser = {
    name: "Dinesh Kumar",
    role: "Elite Member",
    memberSince: "Jan 2024",
    avatar: "https://ui-avatars.com/api/?name=Dinesh+Kumar&background=ffc107&color=000"
  };

  const mySessions = [
    { date: "29 Apr 2026", workout: "Heavy Chest Day", time: "06:30 AM", duration: "75m", intensity: "High" },
    { date: "27 Apr 2026", workout: "Morning Yoga", time: "07:00 AM", duration: "45m", intensity: "Low" },
    { date: "26 Apr 2026", workout: "HIIT Sprints", time: "05:15 PM", duration: "30m", intensity: "Max" },
    { date: "24 Apr 2026", workout: "Back & Bis", time: "06:00 PM", duration: "60m", intensity: "Medium" },
  ];

  const myPayments = [
    { id: "INV-98210", date: "01 Apr 2026", amount: "₹12,000", method: "Razorpay", plan: "Elite Yearly" },
    { id: "INV-87122", date: "01 Apr 2025", amount: "₹12,000", method: "UPI", plan: "Elite Yearly" },
  ];

  const handleDownload = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(26, 26, 26);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 193, 7);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("GYMDASH", 15, 25);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("PERSONAL FITNESS REPORT", 140, 25);

    // User Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Member: ${currentUser.name}`, 15, 55);
    doc.setFontSize(10);
    doc.text(`Plan: ${currentUser.role}`, 15, 62);
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 15, 69);

    // Session Table
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Training Session History", 15, 85);
    
    const sessionData = mySessions.map(s => [s.date, s.workout, s.time, s.duration, s.intensity]);
    autoTable(doc, {
      startY: 90,
      head: [['Date', 'Workout', 'Time', 'Duration', 'Intensity']],
      body: sessionData,
      theme: 'grid',
      headStyles: { fillColor: [26, 26, 26], textColor: [255, 193, 7] }
    });

    // Billing Table
    const finalY = doc.lastAutoTable.finalY || 150;
    doc.text("Billing & Payment History", 15, finalY + 20);
    
    const paymentData = myPayments.map(p => [p.id, p.date, p.plan, p.amount]);
    autoTable(doc, {
      startY: finalY + 25,
      head: [['Invoice ID', 'Date', 'Plan', 'Amount']],
      body: paymentData,
      theme: 'striped',
      headStyles: { fillColor: [26, 26, 26], textColor: [255, 193, 7] }
    });

    doc.save(`${currentUser.name.replace(/ /g, "_")}_Fitness_Report.pdf`);
  };

  return (
    <PageWrapper>
      <header className="report-header">
        <div className="user-profile">
          <img src={currentUser.avatar} alt={currentUser.name} className="avatar" />
          <div>
            <h1>My Personal Reports</h1>
            <p>Welcome back, <strong>{currentUser.name}</strong>. Here is your training and billing history.</p>
            <small className="text-muted">Membership: {currentUser.role} | Since {currentUser.memberSince}</small>
          </div>
        </div>
        <div className="header-actions">
          <button className="primary-btn" onClick={handleDownload}><Download size={18} /> Download My Data</button>
        </div>
      </header>

      <StatsRow>
        <StatCard>
          <div className="icon-box purple"><Clock size={24} /></div>
          <div className="stat-info">
            <small>Total Time Trained</small>
            <h3>210 <small>Hours</small></h3>
            <span className="trend positive">+12h this week</span>
          </div>
        </StatCard>
        <StatCard>
          <div className="icon-box green"><TrendingUp size={24} /></div>
          <div className="stat-info">
            <small>Personal Best Streak</small>
            <h3>14 <small>Days</small></h3>
            <span className="trend positive">Current: 6 Days</span>
          </div>
        </StatCard>
        <StatCard>
          <div className="icon-box gold"><DollarSign size={24} /></div>
          <div className="stat-info">
            <small>Loyalty Rewards</small>
            <h3>₹1,200</h3>
            <span className="trend positive">Available to redeem</span>
          </div>
        </StatCard>
      </StatsRow>

      <div className="reports-grid">
        {/* User Sessions Table */}
        <TableCard>
          <div className="table-header">
            <h3>My Recent Sessions</h3>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Workout</th>
                  <th>Time</th>
                  <th>Duration</th>
                  <th>Intensity</th>
                </tr>
              </thead>
              <tbody>
                {mySessions.map((s, i) => (
                  <tr key={i}>
                    <td>{s.date}</td>
                    <td><strong>{s.workout}</strong></td>
                    <td>{s.time}</td>
                    <td>{s.duration}</td>
                    <td><IntensityTag level={s.intensity}>{s.intensity}</IntensityTag></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableCard>

        {/* User Payment Details Table */}
        <TableCard>
          <div className="table-header">
            <h3>My Billing History</h3>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Date</th>
                  <th>Plan</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {myPayments.map((p, i) => (
                  <tr key={i}>
                    <td><code style={{ color: '#007bff' }}>{p.id}</code></td>
                    <td>{p.date}</td>
                    <td>{p.plan}</td>
                    <td className="fw-bold">{p.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableCard>
      </div>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  padding: 120px 50px 50px;
  background: #f4f7f6;
  min-height: 100vh;
  color: #333;

  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    
    .user-profile {
      display: flex;
      align-items: center;
      gap: 20px;

      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 3px solid #fff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }
    }

    h1 { font-size: 2.2rem; font-weight: 800; color: #1a1a1a; margin-bottom: 5px; }
    p { color: #555; margin: 0; font-size: 1.1rem; }
  }

  .header-actions {
    display: flex;
    gap: 15px;
  }

  .primary-btn {
    background: #1a1a1a;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    cursor: pointer;
  }

  .icon-btn {
    background: #fff;
    border: 1px solid #ddd;
    padding: 10px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    cursor: pointer;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 40px;

  @media (max-width: 992px) { grid-template-columns: 1fr; }
`;

const StatCard = styled.div`
  background: #fff;
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.03);
  display: flex;
  align-items: center;
  gap: 20px;

  .icon-box {
    width: 60px;
    height: 60px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;

    &.purple { background: #6f42c1; }
    &.green { background: #28a745; }
    &.gold { background: #ffc107; }
  }

  .stat-info {
    small { color: #888; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; }
    h3 { font-size: 1.8rem; font-weight: 800; margin: 5px 0; }
    .trend { font-size: 0.8rem; font-weight: 600; }
    .trend.positive { color: #28a745; }
  }
`;

const TableCard = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 25px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.03);
  margin-bottom: 30px;

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    h3 { font-size: 1.3rem; font-weight: 800; margin: 0; }
    .view-all { background: none; border: none; color: #007bff; font-weight: 700; cursor: pointer; }
  }

  .table {
    margin-bottom: 0;
    th { border-top: none; color: #999; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }
    td { padding: 18px 12px; vertical-align: middle; border-bottom: 1px solid #f1f1f1; }
  }

  .trainer-tag {
    background: #f0f4f8;
    color: #444;
    padding: 4px 12px;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 600;
  }
`;

const StatusBadge = styled.span`
  padding: 5px 15px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
  background: ${props => props.status === 'Paid' ? '#d4edda' : '#fff3cd'};
  color: ${props => props.status === 'Paid' ? '#155724' : '#856404'};
`;

const IntensityTag = styled.span`
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
  background: ${props => {
    switch(props.level) {
      case 'High': return '#f8d7da';
      case 'Max': return '#e2d9f3';
      case 'Medium': return '#fff3cd';
      case 'Low': return '#d4edda';
      default: return '#f0f4f8';
    }
  }};
  color: ${props => {
    switch(props.level) {
      case 'High': return '#721c24';
      case 'Max': return '#5a32a3';
      case 'Medium': return '#856404';
      case 'Low': return '#155724';
      default: return '#444';
    }
  }};
`;

export default ReportsPage;
