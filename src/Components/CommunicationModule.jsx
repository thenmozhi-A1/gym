import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  Send, MessageSquare, Mail, Phone, Bell, BellOff,
  Settings, Play, CheckCircle, Loader2, AlertCircle,
  ChevronDown
} from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import log from "../utils/logger";

const spin = keyframes`to { transform: rotate(360deg); }`;
const SpinIcon = styled(Loader2)`animation: ${spin} 0.7s linear infinite;`;

// ────────────────────────────────────────────────────────────────────────────

const CommunicationModule = () => {
  const [activeTab, setActiveTab] = useState("compose");
  const [msgType,   setMsgType]   = useState("Email");

  // ── Notification settings state ─────────────────────────────────────────
  const [notifSettings, setNotifSettings] = useState({
    enabled:         false,
    expiryDaysAhead: 7,
    fromEmail:       "",
    gymName:         "",
  });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving,  setSettingsSaving]  = useState(false);
  const [testRunning,     setTestRunning]     = useState(false);
  const [statusMsg,       setStatusMsg]       = useState(null); // { ok, text }

  // Load settings on mount
  useEffect(() => {
    axiosInstance.get("/notification-settings")
      .then(r => setNotifSettings(r.data))
      .catch(e => log.error("Failed to load notification settings", e))
      .finally(() => setSettingsLoading(false));
  }, []);

  const saveSettings = async (patch) => {
    const updated = { ...notifSettings, ...patch };
    setNotifSettings(updated);
    setSettingsSaving(true);
    setStatusMsg(null);
    try {
      await axiosInstance.put("/notification-settings", patch);
      setStatusMsg({ ok: true, text: "Settings saved." });
    } catch (e) {
      setStatusMsg({ ok: false, text: "Failed to save settings." });
      log.error("Save settings error", e);
    } finally {
      setSettingsSaving(false);
    }
  };

  const runTestNow = async () => {
    setTestRunning(true);
    setStatusMsg(null);
    try {
      const r = await axiosInstance.post("/notification-settings/test-run");
      setStatusMsg({ ok: true, text: r.data.message || "Scan triggered — check server logs." });
    } catch (e) {
      setStatusMsg({ ok: false, text: "Failed to trigger scan." });
    } finally {
      setTestRunning(false);
    }
  };

  // ── Compose send (UI only — wiring to real blast API is a separate task) ─
  const [recipients, setRecipients] = useState("All Active Members");
  const [subject,    setSubject]    = useState("");
  const [body,       setBody]       = useState("");
  const [sending,    setSending]    = useState(false);
  const [sendStatus, setSendStatus] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    setSendStatus(null);
    try {
      // Placeholder — swap with real blast endpoint when implemented
      await new Promise(r => setTimeout(r, 800));
      setSendStatus({ ok: true, text: `${msgType} queued for "${recipients}"` });
      setBody(""); setSubject("");
    } catch {
      setSendStatus({ ok: false, text: "Failed to send message." });
    } finally {
      setSending(false);
    }
  };

  return (
    <Container className="animate-in">
      {/* ── Header ── */}
      <div className="module-header">
        <div className="title-area">
          <h2>COMMUNICATION <small>CENTER</small></h2>
        </div>
        <div className="tab-buttons">
          {["compose", "automated", "history"].map(t => (
            <button key={t} className={activeTab === t ? "active" : ""} onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="layout-grid">

        {/* ══════════ COMPOSE TAB ══════════ */}
        {activeTab === "compose" && (
          <>
            <div className="compose-panel">
              <h3>New Message</h3>

              {/* Channel selector */}
              <div className="channel-selector">
                {[
                  { id: "SMS",      icon: MessageSquare, cls: "" },
                  { id: "WhatsApp", icon: Phone,         cls: "whatsapp" },
                  { id: "Email",    icon: Mail,          cls: "email" },
                ].map(({ id, icon: Icon, cls }) => (
                  <button
                    key={id}
                    className={`channel-btn ${msgType === id ? `active ${cls}` : ""}`}
                    onClick={() => setMsgType(id)}
                  >
                    <Icon size={18} /> {id}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSend}>
                <div className="form-group">
                  <label>Recipients</label>
                  <div className="select-wrap">
                    <select className="form-control" value={recipients} onChange={e => setRecipients(e.target.value)}>
                      <option>All Active Members</option>
                      <option>Members Expiring Next 7 Days</option>
                      <option>Leads</option>
                      <option>Custom Selection...</option>
                    </select>
                    <ChevronDown size={14} className="select-icon" />
                  </div>
                </div>

                {msgType === "Email" && (
                  <div className="form-group">
                    <label>Subject</label>
                    <input type="text" className="form-control" placeholder="e.g. Special Renewal Offer!" value={subject} onChange={e => setSubject(e.target.value)} />
                  </div>
                )}

                <div className="form-group">
                  <label>Message Content</label>
                  <textarea className="form-control" rows="6" placeholder={`Type your ${msgType} message here...`} value={body} onChange={e => setBody(e.target.value)} required />
                </div>

                {sendStatus && (
                  <div className={`inline-alert ${sendStatus.ok ? "ok" : "err"}`}>
                    {sendStatus.ok ? <CheckCircle size={14} /> : <AlertCircle size={14} />} {sendStatus.text}
                  </div>
                )}

                <button className="btn-send w-100" type="submit" disabled={sending}>
                  {sending ? <SpinIcon size={16} /> : <Send size={16} />}
                  {sending ? "Sending…" : `Send ${msgType} Blast`}
                </button>
              </form>
            </div>

            <div className="side-panel">
              <h3>Templates</h3>
              <div className="template-list">
                {[
                  { title: "Renewal Reminder",  body: "Hi [Name], your gym membership expires on [Date]. Renew now to keep your streak! 🏋️" },
                  { title: "Payment Overdue",    body: "Hi [Name], your payment of [Amount] is pending. Please clear your dues to continue access." },
                  { title: "Festival Offer",     body: "🎉 Special Offer! Get 20% off on Annual Memberships this week. Grab the deal now!" },
                  { title: "New Class Alert",    body: "Hi [Name], we just added a new Zumba class every Saturday at 7 AM. Book your spot!" },
                ].map(tpl => (
                  <div className="template-card" key={tpl.title}>
                    <h5>{tpl.title}</h5>
                    <p>{tpl.body}</p>
                    <button className="btn-link" onClick={() => setBody(tpl.body)}>Use Template</button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ══════════ AUTOMATED TAB ══════════ */}
        {activeTab === "automated" && (
          <div className="full-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ margin: 0 }}>Automated Workflows</h3>
              {settingsSaving && <SpinIcon size={16} color="var(--text-muted)" />}
            </div>

            {/* ── Expiry reminder card — live ── */}
            <div className={`workflow-card ${notifSettings.enabled ? "active" : ""}`}>
              <div className="w-header">
                <div>
                  <h4>Membership Expiry Reminder</h4>
                  <span className={`badge ${notifSettings.enabled ? "bg-success-light" : ""}`}>
                    {settingsLoading ? "Loading…" : notifSettings.enabled ? "Active" : "Inactive"}
                  </span>
                </div>
                {/* Live toggle */}
                <div
                  className={`toggle ${notifSettings.enabled ? "switch-on" : ""}`}
                  onClick={() => !settingsLoading && saveSettings({ enabled: !notifSettings.enabled })}
                  title={notifSettings.enabled ? "Disable" : "Enable"}
                />
              </div>
              <p>
                Sends a branded HTML email to members whose plan expires within{" "}
                <strong style={{ color: "var(--text-color)" }}>{notifSettings.expiryDaysAhead} days</strong>.
                Runs automatically every day at 08:00.
              </p>

              {/* Days-ahead control */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", minWidth: 120 }}>Days before expiry:</label>
                <input
                  type="number"
                  min={1} max={30}
                  value={notifSettings.expiryDaysAhead}
                  onChange={e => setNotifSettings(s => ({ ...s, expiryDaysAhead: +e.target.value }))}
                  onBlur={e => saveSettings({ expiryDaysAhead: +e.target.value })}
                  style={{
                    width: 70, padding: "6px 10px", background: "rgba(0,0,0,0.2)",
                    border: "1px solid var(--border-color)", borderRadius: 8,
                    color: "var(--text-color)", fontSize: "0.9rem", textAlign: "center"
                  }}
                />
              </div>

              {/* Status message */}
              {statusMsg && (
                <div className={`inline-alert ${statusMsg.ok ? "ok" : "err"}`} style={{ marginBottom: 12 }}>
                  {statusMsg.ok ? <CheckCircle size={13} /> : <AlertCircle size={13} />} {statusMsg.text}
                </div>
              )}

              {/* Manual run button */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn-test"
                  onClick={runTestNow}
                  disabled={testRunning || settingsLoading}
                >
                  {testRunning ? <SpinIcon size={14} /> : <Play size={14} />}
                  {testRunning ? "Running…" : "Run Now"}
                </button>
                <div className="w-stats">Runs daily at 08:00 server time</div>
              </div>
            </div>

            {/* ── Birthday wishes — static (future) ── */}
            <div className="workflow-card active" style={{ marginTop: 16 }}>
              <div className="w-header">
                <div>
                  <h4>Birthday Wishes</h4>
                  <span className="badge bg-success-light">Active</span>
                </div>
                <div className="toggle switch-on" style={{ opacity: 0.5, cursor: "not-allowed" }} title="Coming soon" />
              </div>
              <p>Sends a Happy Birthday email with a free PT session coupon on the member's birthday.</p>
              <div className="w-stats">Coming soon</div>
            </div>

            {/* ── Payment due — static (future) ── */}
            <div className="workflow-card" style={{ marginTop: 16 }}>
              <div className="w-header">
                <div>
                  <h4>Payment Due Alert</h4>
                  <span className="badge">Inactive</span>
                </div>
                <div className="toggle" style={{ opacity: 0.5, cursor: "not-allowed" }} title="Coming soon" />
              </div>
              <p>Sends an SMS if an invoice remains unpaid for 2 days after due date.</p>
              <div className="w-stats">Coming soon</div>
            </div>

            {/* ── SMTP setup hint ── */}
            <div style={{ marginTop: 20, padding: "14px 18px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.6 }}>
              <Settings size={13} style={{ marginRight: 6, verticalAlign: "middle" }} />
              <strong style={{ color: "#60a5fa" }}>SMTP Setup:</strong> Set the environment variables{" "}
              <code style={{ color: "#facc15" }}>MAIL_USERNAME</code>,{" "}
              <code style={{ color: "#facc15" }}>MAIL_PASSWORD</code>, and{" "}
              <code style={{ color: "#facc15" }}>NOTIFICATIONS_ENABLED=true</code> on the backend server to activate email delivery.
            </div>
          </div>
        )}

        {/* ══════════ HISTORY TAB ══════════ */}
        {activeTab === "history" && (
          <div className="full-panel">
            <h3>Message History</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Sent message history will appear here once the blast API is connected.
            </p>
          </div>
        )}
      </div>
    </Container>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const Container = styled.div`
  display: flex; flex-direction: column; gap: 24px;

  .module-header {
    display: flex; justify-content: space-between; align-items: center;
    h2 { margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--text-color); }
    small { font-weight: 400; color: var(--text-muted); font-size: 0.8rem; letter-spacing: 1px; }
    .tab-buttons {
      display: flex; background: rgba(0,0,0,0.1); border-radius: 8px; padding: 4px; gap: 2px;
      button { background: transparent; border: none; padding: 6px 16px; border-radius: 6px; color: var(--text-muted); cursor: pointer; font-weight: 500; font-size: 0.875rem; }
      button.active { background: var(--card-bg, #1e293b); color: var(--text-color); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    }
  }

  .layout-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
  .full-panel { grid-column: 1 / -1; }

  .compose-panel, .side-panel, .full-panel {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; padding: 24px; box-shadow: var(--shadow);
    h3 { margin: 0 0 20px 0; font-size: 1.05rem; color: var(--text-color); }
  }

  .channel-selector {
    display: flex; gap: 10px; margin-bottom: 20px;
    .channel-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-muted); font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 0.85rem; }
    .channel-btn.active        { background: rgba(56,189,248,0.1);  color: #38bdf8;  border-color: #38bdf8; }
    .channel-btn.active.whatsapp { background: rgba(16,185,129,0.1); color: #10b981; border-color: #10b981; }
    .channel-btn.active.email  { background: rgba(245,158,11,0.1);  color: #f59e0b;  border-color: #f59e0b; }
  }

  .form-group {
    margin-bottom: 16px;
    label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.4px; }
    .form-control { width: 100%; padding: 10px 12px; background: rgba(0,0,0,0.15); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-color); font-family: inherit; font-size: 0.9rem; resize: vertical; outline: none; box-sizing: border-box; &:focus { border-color: var(--accent-color); } }
    .select-wrap { position: relative; select { appearance: none; padding-right: 32px; cursor: pointer; } .select-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; } }
  }

  .btn-send { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 13px; background: var(--accent-color, #38bdf8); color: #fff; border: none; border-radius: 8px; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: opacity 0.2s; &:hover:not(:disabled) { opacity: 0.9; } &:disabled { opacity: 0.55; cursor: not-allowed; } }
  .btn-test  { display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3); color: #60a5fa; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: background 0.2s; &:hover:not(:disabled) { background: rgba(59,130,246,0.18); } &:disabled { opacity: 0.5; cursor: not-allowed; } }
  .w-100 { width: 100%; }

  .inline-alert { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-radius: 8px; font-size: 0.8rem; margin-bottom: 12px; }
  .inline-alert.ok  { background: rgba(16,185,129,0.1); border: 1px solid rgba(52,211,153,0.3); color: #34d399; }
  .inline-alert.err { background: rgba(239,68,68,0.1);  border: 1px solid rgba(248,113,113,0.3); color: #f87171; }

  .template-list { display: flex; flex-direction: column; gap: 14px; }
  .template-card {
    background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); border-radius: 8px; padding: 14px;
    h5 { margin: 0 0 8px 0; color: var(--text-color); font-size: 0.9rem; }
    p  { margin: 0 0 10px 0; font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; }
    .btn-link { background: none; border: none; color: var(--accent-color, #38bdf8); font-size: 0.82rem; font-weight: 600; cursor: pointer; padding: 0; }
  }

  .workflow-card {
    background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;
    &.active { border-color: rgba(16,185,129,0.3); }
    .w-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; h4 { margin: 0 0 6px 0; color: var(--text-color); font-size: 0.95rem; } }
    .badge { padding: 3px 8px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; background: rgba(255,255,255,0.05); color: var(--text-muted); }
    .bg-success-light { background: rgba(16,185,129,0.1); color: #10b981; }
    .toggle { width: 44px; height: 24px; background: var(--border-color); border-radius: 12px; position: relative; cursor: pointer; flex-shrink: 0; transition: background 0.3s; }
    .toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: var(--text-muted); border-radius: 50%; transition: all 0.3s; }
    .toggle.switch-on { background: rgba(16,185,129,0.25); }
    .toggle.switch-on::after { left: 22px; background: #10b981; }
    p { margin: 0 0 14px 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; }
    .w-stats { font-size: 0.75rem; color: var(--accent-color, #38bdf8); font-weight: 600; display: flex; align-items: center; }
  }
`;

export default CommunicationModule;
