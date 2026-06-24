import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Download, BarChart2, TrendingUp, Users, DollarSign, Activity, ShieldCheck, Search, RefreshCw } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import log from "../utils/logger";
import { useAdminStore } from "../store/useAdminStore";

// ── Action badge colours ──────────────────────────────────────────────────────
const ACTION_META = {
  ADD_MEMBER:    { label: "Add Member",    color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  DELETE_USER:   { label: "Delete User",   color: "#ef4444", bg: "rgba(239,68,68,0.1)"  },
  ADD_STAFF:     { label: "Add Staff",     color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  DELETE_STAFF:  { label: "Delete Staff",  color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  PAYMENT_UPDATE:{ label: "Payment",       color: "#a855f7", bg: "rgba(168,85,247,0.1)" },
};

const getActionMeta = (action) =>
  ACTION_META[action] || { label: action, color: "#94a3b8", bg: "rgba(148,163,184,0.1)" };

const ReportsModule = () => {
  const { payments } = useAdminStore();
  const [auditLogs,   setAuditLogs]   = useState([]);
  const [auditLoading, setAuditLoading] = useState(true);
  const [auditError,  setAuditError]  = useState(null);
  const [searchTerm,  setSearchTerm]  = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

  const fetchAuditLogs = async () => {
    setAuditLoading(true);
    setAuditError(null);
    try {
      const res = await axiosInstance.get("/audit-log");
      setAuditLogs(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      log.error("Failed to load audit log", e);
      setAuditError("Could not load audit log from server.");
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => { fetchAuditLogs(); }, []);

  const allActions = ["ALL", ...Object.keys(ACTION_META)];

  const filtered = auditLogs.filter(entry => {
    const matchesAction  = actionFilter === "ALL" || entry.action === actionFilter;
    const matchesSearch  = !searchTerm ||
      (entry.adminEmail || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.details    || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.targetType || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAction && matchesSearch;
  });

  const formatTs = (ts) => {
    if (!ts) return "—";
    const d = new Date(ts);
    return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const handleExportCSV = () => {
    const headers = ["Timestamp", "Action", "Admin Email", "Target Type", "Target ID", "Details"];
    const rows = filtered.map(e => [
      formatTs(e.timestamp), e.action, e.adminEmail, e.targetType, e.targetId, e.details
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c ?? ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url;
    a.download = `audit_log_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Container className="animate-in">
      {/* ── Header ── */}
      <div className="module-header">
        <div className="title-area">
          <h2>REPORTS <small>& DASHBOARDS</small></h2>
        </div>
        <div className="actions">
          <button className="btn-outline" onClick={handleExportCSV}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* ── KPI row (static) ── */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-icon blue"><DollarSign size={20} /></div>
          <div className="kpi-info">
            <label>Total Revenue</label>
            <h3>₹{(() => {
                const userFirstPayments = {};
                payments.forEach(p => {
                  const uid = p.user?.id || p.userId || p.fullName;
                  if (uid) {
                    if (!userFirstPayments[uid] || new Date(p.paymentDate) < new Date(userFirstPayments[uid].paymentDate)) {
                      userFirstPayments[uid] = p;
                    }
                  }
                });
                return Object.values(userFirstPayments).reduce((acc, p) => acc + (Number(p.amount) || 0), 0).toLocaleString();
            })()}</h3>
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
            <label>Audit Events</label>
            <h3>{auditLogs.length}</h3>
            <span className="trend positive"><ShieldCheck size={12} /> Tracked</span>
          </div>
        </div>
      </div>

      {/* ── Charts row (static) ── */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="c-header"><h3>Revenue Trend</h3></div>
          <div className="chart-area line-chart">
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
          <div className="c-header"><h3>Membership Distribution</h3></div>
          <div className="chart-area pie-chart">
            <div className="mock-pie" />
            <div className="pie-legend">
              <div className="leg-item"><span className="dot dot1" /> Annual (45%)</div>
              <div className="leg-item"><span className="dot dot2" /> Quarterly (35%)</div>
              <div className="leg-item"><span className="dot dot3" /> Monthly (20%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Audit Log ── */}
      <div className="reports-table-card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border-color)", flexWrap: "wrap", gap: 12 }}>
          <h3 style={{ margin: 0, fontSize: "1.05rem", color: "var(--text-color)", display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldCheck size={18} color="#10b981" /> Admin Audit Log
          </h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {/* Search */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(0,0,0,0.15)", border: "1px solid var(--border-color)", borderRadius: 8, padding: "6px 12px" }}>
              <Search size={14} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search admin, details…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ border: "none", background: "transparent", outline: "none", color: "var(--text-color)", fontSize: "0.85rem", width: 160 }}
              />
            </div>
            {/* Action filter */}
            <select
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
              style={{ background: "rgba(0,0,0,0.15)", border: "1px solid var(--border-color)", color: "var(--text-color)", padding: "6px 10px", borderRadius: 8, outline: "none", fontSize: "0.85rem" }}
            >
              {allActions.map(a => <option key={a} value={a}>{a === "ALL" ? "All Actions" : getActionMeta(a).label}</option>)}
            </select>
            {/* Refresh */}
            <button
              onClick={fetchAuditLogs}
              style={{ background: "transparent", border: "1px solid var(--border-color)", color: "var(--text-muted)", padding: "6px 10px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem" }}
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </div>

        {auditError && (
          <div style={{ padding: "12px 20px", color: "#f87171", fontSize: "0.85rem", background: "rgba(239,68,68,0.05)" }}>{auditError}</div>
        )}

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>TIMESTAMP</th>
                <th>ACTION</th>
                <th>ADMIN</th>
                <th>TARGET</th>
                <th>DETAILS</th>
              </tr>
            </thead>
          <tbody>
            {auditLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j}><div style={{ height: 14, borderRadius: 4, background: "linear-gradient(90deg,#1e293b 25%,#334155 50%,#1e293b 75%)", backgroundSize: "600px 100%", animation: "shimmer 1.4s infinite" }} /></td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "30px 0", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                {auditLogs.length === 0 ? "No audit events recorded yet." : "No results match your filter."}
              </td></tr>
            ) : (
              filtered.map((entry, i) => {
                const meta = getActionMeta(entry.action);
                return (
                  <tr key={i}>
                    <td style={{ fontSize: "0.8rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {formatTs(entry.timestamp)}
                    </td>
                    <td>
                      <span style={{ background: meta.bg, color: meta.color, padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                        {meta.label}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.85rem", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {entry.adminEmail}
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {entry.targetType}{entry.targetId ? ` #${entry.targetId}` : ""}
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "var(--text-muted)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {entry.details}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          </table>
        </div>
        <div style={{ padding: "10px 20px", borderTop: "1px solid var(--border-color)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
          Showing {filtered.length} of {auditLogs.length} events
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
    .actions { display: flex; gap: 12px; }
    .btn-outline { display: flex; align-items: center; gap: 8px; background: transparent; border: 1px solid var(--border-color); color: var(--text-color); padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: background 0.2s; &:hover { background: rgba(255,255,255,0.05); } }
  }

  .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; 
    @media (max-width: 992px) { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: 768px) { grid-template-columns: 1fr; }
  }
  .kpi-card {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px; box-shadow: var(--shadow);
    .kpi-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .kpi-icon.blue   { background: rgba(56,189,248,0.1);  color: #38bdf8; }
    .kpi-icon.green  { background: rgba(16,185,129,0.1);  color: #10b981; }
    .kpi-icon.yellow { background: rgba(245,158,11,0.1);  color: #f59e0b; }
    .kpi-icon.purple { background: rgba(168,85,247,0.1);  color: #a855f7; }
    .kpi-info { flex: 1; }
    label { font-size: 0.8rem; color: var(--text-muted); }
    h3 { margin: 4px 0 6px 0; font-size: 1.4rem; color: var(--text-color); }
    .trend { font-size: 0.75rem; display: inline-flex; align-items: center; gap: 4px; padding: 2px 6px; border-radius: 4px; font-weight: 600; }
    .trend.positive { background: rgba(16,185,129,0.1); color: #10b981; }
    .trend.negative { background: rgba(239,68,68,0.1);  color: #ef4444; }
  }

  .charts-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; 
    @media (max-width: 992px) { grid-template-columns: 1fr; }
  }
  .chart-card {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; padding: 24px; box-shadow: var(--shadow);
    .c-header { margin-bottom: 20px; h3 { margin: 0; font-size: 1.05rem; color: var(--text-color); } }
    .chart-area { height: 200px; display: flex; align-items: center; justify-content: center; position: relative; }
    .mock-chart { width: 100%; height: 100%; svg { width: 100%; height: 100%; } }
    .mock-pie { width: 150px; height: 150px; border-radius: 50%; background: conic-gradient(#10b981 0% 45%, #38bdf8 45% 80%, #f59e0b 80% 100%); }
    .pie-chart { display: flex; flex-direction: column; gap: 16px; }
    .pie-legend { display: flex; flex-direction: column; gap: 8px; width: 100%; .leg-item { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: var(--text-muted); } .dot { width: 10px; height: 10px; border-radius: 50%; } .dot1 { background: #10b981; } .dot2 { background: #38bdf8; } .dot3 { background: #f59e0b; } }
  }

  .reports-table-card {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; overflow: hidden; box-shadow: var(--shadow);
    .table {
      width: 100%; border-collapse: collapse;
      th { text-align: left; padding: 12px 20px; font-size: 0.72rem; color: var(--text-muted); border-bottom: 1px solid var(--border-color); }
      td { padding: 14px 20px; font-size: 0.875rem; border-bottom: 1px solid var(--border-color); color: var(--text-color); vertical-align: middle; }
      tr:last-child td { border-bottom: none; }
    }
  }

  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
`;

export default ReportsModule;
