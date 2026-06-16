import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Clock, QrCode, Smartphone, Zap } from "lucide-react";
import axiosInstance from '../api/axiosInstance';

const AttendanceModule = ({ attendanceData }) => {
  const [activeTab, setActiveTab] = useState("members"); // members or staff
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axiosInstance.get('/attendance/stats/today')
      .then(r => setStats(r.data))
      .catch(() => {});
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayLogs = (attendanceData || []).filter(log => (log.date || log.attendanceDate) === today);

  const filterLogs = (type) => {
    return attendanceData.filter(log => {
      const roleStr = (log.role || log.staff?.role || log.user?.role || "").toString().toUpperCase();
      const isStaff = ["TRAINER", "FRONT OFFICE", "STAFF"].some(r => roleStr.includes(r));
      return type === "staff" ? isStaff : !isStaff;
    });
  };

  const logs = filterLogs(activeTab);



  return (
    <Container className="animate-in">
      <div className="module-header">
        <div className="title-area">
          <h2>ATTENDANCE <small>& ACCESS CONTROL</small></h2>
        </div>
        <div className="tab-buttons">
          <button className={activeTab === "members" ? "active" : ""} onClick={() => setActiveTab("members")}>Members</button>
          <button className={activeTab === "staff" ? "active" : ""} onClick={() => setActiveTab("staff")}>Staff</button>
        </div>
      </div>

      <div className="top-row">
        <div className="stats-card">
          <h3>Today's Overview ({stats?.today ?? today})</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="label">Total Check-ins</span>
              <span className="value">{stats?.totalCheckIns ?? todayLogs.length}</span>
            </div>
            <div className="stat-item">
              <span className="label">Peak Hour</span>
              <span className="value text-primary">{stats?.peakHour ?? '—'}</span>
            </div>
            <div className="stat-item">
              <span className="label">Active Inside</span>
              <span className="value text-success">{stats?.activeInside ?? 42}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="logs-table-card">
        <div className="card-header">
          <h3>{activeTab === "members" ? "Member Logs" : "Staff Logs"}</h3>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
            <tr>
              <th>NAME</th>
              <th>DATE</th>
              <th>CHECK-IN</th>
              <th>CHECK-OUT</th>
              {activeTab === "staff" && <th>ROLE</th>}
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i}>
                <td className="fw-bold">{log.staff?.fullName || log.user?.fullName || log.fullName || log.name || log.email || "Unknown Member"}</td>
                <td>{log.date || log.attendanceDate}</td>
                <td className="text-success fw-bold"><Clock size={14} className="mr-2" style={{marginRight: '4px'}} /> {log.entry || log.checkInTime}</td>
                <td className="text-danger fw-bold">{log.exit || log.checkOutTime ? <><Clock size={14} className="mr-2" style={{marginRight: '4px'}} /> {log.exit || log.checkOutTime}</> : "-"}</td>
                {activeTab === "staff" && (
                  <td>
                    <span className="badge">
                      {log.staff?.role || log.user?.role || log.role}
                    </span>
                  </td>
                )}
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={activeTab === "members" ? 4 : 5} className="text-center py-4">No logs found.</td></tr>
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

  .module-header {
    display: flex; justify-content: space-between; align-items: center;
    h2 { margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--text-color); display: flex; align-items: center; gap: 8px; }
    small { font-weight: 400; color: var(--text-muted); font-size: 0.8rem; letter-spacing: 1px; }
    
    .tab-buttons {
      display: flex; background: rgba(0,0,0,0.1); border-radius: 8px; padding: 4px;
      button { background: transparent; border: none; padding: 6px 16px; border-radius: 6px; color: var(--text-muted); cursor: pointer; font-weight: 500; }
      button.active { background: var(--card-bg, #1e293b); color: var(--text-color); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    }
  }

  .top-row {
    display: grid; grid-template-columns: 1fr; gap: 24px;
  }

  .stats-card {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; padding: 24px; box-shadow: var(--shadow);
  }

  .stats-card {
    h3 { margin: 0 0 20px 0; font-size: 1.1rem; color: var(--text-color); }
    .stats-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
      .stat-item {
        display: flex; flex-direction: column; gap: 8px; background: rgba(0,0,0,0.1); padding: 16px; border-radius: 8px;
        .label { font-size: 0.8rem; color: var(--text-muted); }
        .value { font-size: 1.5rem; font-weight: 700; color: var(--text-color); }
        .text-primary { color: var(--accent-color, #38bdf8); }
        .text-success { color: #10b981; }
      }
    }
  }

  .logs-table-card {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; overflow: hidden; box-shadow: var(--shadow);
    .card-header { padding: 20px; border-bottom: 1px solid var(--border-color); h3 { margin: 0; font-size: 1.1rem; color: var(--text-color); } }
    .table {
      width: 100%; border-collapse: collapse;
      th { text-align: left; padding: 12px 20px; font-size: 0.75rem; color: var(--text-muted); border-bottom: 1px solid var(--border-color); }
      td { padding: 16px 20px; font-size: 0.9rem; border-bottom: 1px solid var(--border-color); color: var(--text-color); }
      .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; background: rgba(255,255,255,0.05); }
      .text-success { color: #10b981; }
      .text-danger { color: #ef4444; }
    }
  }
`;

export default AttendanceModule;
