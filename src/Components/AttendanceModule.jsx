import React, { useState } from "react";
import styled from "styled-components";
import { Clock, QrCode, Smartphone, Zap, Fingerprint } from "lucide-react";
import { verifyFingerprint } from "../api/webauthnApi";

const AttendanceModule = ({ attendanceData }) => {
  const [activeTab, setActiveTab] = useState("members"); // members or staff
  const [checkInMethod] = useState("Fingerprint");
  const [scanEmail, setScanEmail] = useState("");
  const [scanStatus, setScanStatus] = useState("idle");
  const [scanMessage, setScanMessage] = useState("Ready to scan Fingerprint");

  const today = new Date().toISOString().split('T')[0];
  const todayLogs = attendanceData.filter(log => (log.date || log.attendanceDate) === today);

  const filterLogs = (type) => {
    return attendanceData.filter(log => {
      const roleStr = (log.role || log.staff?.role || log.user?.role || "").toString().toUpperCase();
      const isStaff = ["TRAINER", "FRONT OFFICE", "STAFF"].some(r => roleStr.includes(r));
      return type === "staff" ? isStaff : !isStaff;
    });
  };

  const logs = filterLogs(activeTab);

  const handleFingerprintScan = async () => {
    if (!scanEmail) {
      setScanMessage("Please enter email first");
      setScanStatus("error");
      return;
    }

    setScanStatus("scanning");
    setScanMessage("Prompting fingerprint scan...");

    try {
      const result = await verifyFingerprint(scanEmail);
      
      setScanStatus("success");
      setScanMessage(`${result.action === 'CHECK_IN' ? 'Check-in' : 'Check-out'} successful: ${result.userName}`);
      setTimeout(() => window.location.reload(), 3000);
    } catch (err) {
      setScanStatus("error");
      if (err.message.includes("cancelled")) {
        setScanMessage("Scan cancelled. Please try again.");
      } else if (err.message.includes("registered")) {
        setScanMessage("Please enrol your fingerprint first. Visit the front desk.");
      } else if (err.message.includes("FingerprintNotEnrolledException")) {
        setScanMessage("No fingerprint found. Contact admin.");
      } else {
        setScanMessage("Connection error or scan failed.");
      }
    }
  };

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
        <div className="scanner-card">
          <div className="scanner-header">
            <h3>Check-In Terminal</h3>
            <span className="method-select" style={{background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-color)'}}>
              Biometric Required
            </span>
          </div>
          
          <div className="scanner-display" style={{ padding: '20px' }}>
            <Fingerprint size={64} className="method-icon" style={{ color: scanStatus === 'success' ? '#10b981' : scanStatus === 'error' ? '#ef4444' : '#38bdf8' }} />
            
            <p className="scanner-status" style={{ color: scanStatus === 'success' ? '#10b981' : scanStatus === 'error' ? '#ef4444' : 'var(--text-muted)' }}>
              {scanMessage}
            </p>
            {scanStatus === "scanning" && <div className="scan-animation"></div>}
            
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', width: '100%' }}>
              <input 
                type="email" 
                placeholder="Member Email" 
                value={scanEmail} 
                onChange={(e) => setScanEmail(e.target.value)}
                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #334155', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
              />
              <button 
                onClick={handleFingerprintScan}
                disabled={scanStatus === 'scanning'}
                style={{ padding: '8px 12px', background: '#38bdf8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Scan
              </button>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <h3>Today's Overview ({today})</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="label">Total Check-ins</span>
              <span className="value">{todayLogs.length}</span>
            </div>
            <div className="stat-item">
              <span className="label">Peak Hour</span>
              <span className="value text-primary">06:00 AM</span>
            </div>
            <div className="stat-item">
              <span className="label">Active Inside</span>
              <span className="value text-success">42</span>
            </div>
          </div>
        </div>
      </div>

      <div className="logs-table-card">
        <div className="card-header">
          <h3>{activeTab === "members" ? "Member Logs" : "Staff Logs"}</h3>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>DATE</th>
              <th>CHECK-IN</th>
              <th>CHECK-OUT</th>
              <th>{activeTab === "members" ? "METHOD" : "ROLE"}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i}>
                <td className="fw-bold">{log.staff?.fullName || log.user?.fullName || log.fullName || log.name || log.email || "Unknown Member"}</td>
                <td>{log.date || log.attendanceDate}</td>
                <td className="text-success fw-bold"><Clock size={14} className="mr-2" style={{marginRight: '4px'}} /> {log.entry || log.checkInTime}</td>
                <td className="text-danger fw-bold">{log.exit || log.checkOutTime ? <><Clock size={14} className="mr-2" style={{marginRight: '4px'}} /> {log.exit || log.checkOutTime}</> : "-"}</td>
                <td>
                  <span className="badge">
                    {activeTab === "members" ? "QR Code" : (log.staff?.role || log.user?.role || log.role)}
                  </span>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan="5" className="text-center py-4">No logs found.</td></tr>
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
    
    .tab-buttons {
      display: flex; background: rgba(0,0,0,0.1); border-radius: 8px; padding: 4px;
      button { background: transparent; border: none; padding: 6px 16px; border-radius: 6px; color: var(--text-muted); cursor: pointer; font-weight: 500; }
      button.active { background: var(--card-bg, #1e293b); color: var(--text-color); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    }
  }

  .top-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
  }

  .scanner-card, .stats-card {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; padding: 24px; box-shadow: var(--shadow);
  }

  .scanner-header {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
    h3 { margin: 0; font-size: 1.1rem; color: var(--text-color); }
    .method-select { background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); color: var(--text-color); padding: 6px 12px; border-radius: 6px; }
  }

  .scanner-display {
    height: 150px; background: rgba(0,0,0,0.2); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden;
    .method-icon { color: var(--accent-color, #38bdf8); opacity: 0.8; margin-bottom: 12px; }
    .scanner-status { color: var(--text-muted); font-size: 0.9rem; margin: 0; }
    .scan-animation { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--accent-color, #38bdf8); box-shadow: 0 0 10px var(--accent-color, #38bdf8); animation: scan 2s infinite linear; }
  }

  @keyframes scan { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }

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
