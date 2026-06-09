import React, { useState } from "react";
import styled from "styled-components";
import { Send, MessageSquare, Mail, Phone, Calendar, Users, Filter } from "lucide-react";

const CommunicationModule = () => {
  const [activeTab, setActiveTab] = useState("compose"); // compose, automated, history
  const [msgType, setMsgType] = useState("SMS");

  return (
    <Container className="animate-in">
      <div className="module-header">
        <div className="title-area">
          <h2>COMMUNICATION <small>CENTER</small></h2>
        </div>
        <div className="tab-buttons">
          <button className={activeTab === "compose" ? "active" : ""} onClick={() => setActiveTab("compose")}>Compose</button>
          <button className={activeTab === "automated" ? "active" : ""} onClick={() => setActiveTab("automated")}>Automated</button>
          <button className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>History</button>
        </div>
      </div>

      <div className="layout-grid">
        {activeTab === "compose" && (
          <>
            <div className="compose-panel">
              <h3>New Message</h3>
              
              <div className="channel-selector">
                <button className={`channel-btn ${msgType === 'SMS' ? 'active' : ''}`} onClick={() => setMsgType("SMS")}>
                  <MessageSquare size={18} /> SMS
                </button>
                <button className={`channel-btn ${msgType === 'WhatsApp' ? 'active whatsapp' : ''}`} onClick={() => setMsgType("WhatsApp")}>
                  <Phone size={18} /> WhatsApp
                </button>
                <button className={`channel-btn ${msgType === 'Email' ? 'active email' : ''}`} onClick={() => setMsgType("Email")}>
                  <Mail size={18} /> Email
                </button>
              </div>

              <div className="form-group">
                <label>Recipients</label>
                <select className="form-control">
                  <option>All Active Members</option>
                  <option>Members Expiring Next 7 Days</option>
                  <option>Leads</option>
                  <option>Custom Selection...</option>
                </select>
              </div>

              {msgType === 'Email' && (
                <div className="form-group">
                  <label>Subject</label>
                  <input type="text" className="form-control" placeholder="e.g. Special Renewal Offer!" />
                </div>
              )}

              <div className="form-group">
                <label>Message Content</label>
                <textarea className="form-control" rows="6" placeholder={`Type your ${msgType} message here...`}></textarea>
              </div>

              <button className="btn-send w-100">
                <Send size={16} /> Send {msgType} Blast
              </button>
            </div>

            <div className="side-panel">
              <h3>Templates</h3>
              <div className="template-list">
                <div className="template-card">
                  <h5>Renewal Reminder</h5>
                  <p>Hi [Name], your gym membership expires on [Date]. Renew now to keep your streak! 🏋️</p>
                  <button className="btn-link">Use Template</button>
                </div>
                <div className="template-card">
                  <h5>Payment Overdue</h5>
                  <p>Hi [Name], your payment of [Amount] is pending. Please clear your dues to continue access.</p>
                  <button className="btn-link">Use Template</button>
                </div>
                <div className="template-card">
                  <h5>Festival Offer</h5>
                  <p>🎉 Special Offer! Get 20% off on Annual Memberships this week. Grab the deal now!</p>
                  <button className="btn-link">Use Template</button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "automated" && (
          <div className="full-panel">
            <h3>Automated Workflows</h3>
            <div className="workflows-grid">
              <div className="workflow-card active">
                <div className="w-header">
                  <div>
                    <h4>Membership Expiry Reminder</h4>
                    <span className="badge bg-success-light">Active</span>
                  </div>
                  <div className="toggle switch-on"></div>
                </div>
                <p>Sends SMS 3 days before expiry, and WhatsApp 1 day before expiry.</p>
                <div className="w-stats">24 triggered this week</div>
              </div>

              <div className="workflow-card active">
                <div className="w-header">
                  <div>
                    <h4>Birthday Wishes</h4>
                    <span className="badge bg-success-light">Active</span>
                  </div>
                  <div className="toggle switch-on"></div>
                </div>
                <p>Sends a Happy Birthday email with a free PT session coupon.</p>
                <div className="w-stats">5 triggered this week</div>
              </div>

              <div className="workflow-card">
                <div className="w-header">
                  <div>
                    <h4>Payment Due Alert</h4>
                    <span className="badge">Inactive</span>
                  </div>
                  <div className="toggle"></div>
                </div>
                <p>Sends SMS if invoice remains unpaid for 2 days.</p>
                <div className="w-stats">0 triggered this week</div>
              </div>
            </div>
          </div>
        )}
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

  .layout-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
  .full-panel { grid-column: 1 / -1; }

  .compose-panel, .side-panel, .full-panel {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; padding: 24px; box-shadow: var(--shadow);
    h3 { margin: 0 0 20px 0; font-size: 1.1rem; color: var(--text-color); }
  }

  .channel-selector {
    display: flex; gap: 12px; margin-bottom: 24px;
    .channel-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-muted); font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .channel-btn.active { background: rgba(56, 189, 248, 0.1); color: var(--accent-color, #38bdf8); border-color: var(--accent-color, #38bdf8); }
    .channel-btn.active.whatsapp { background: rgba(16, 185, 129, 0.1); color: #10b981; border-color: #10b981; }
    .channel-btn.active.email { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border-color: #f59e0b; }
  }

  .form-group {
    margin-bottom: 20px;
    label { display: block; font-size: 0.85rem; font-weight: 500; color: var(--text-muted); margin-bottom: 8px; }
    .form-control { width: 100%; padding: 12px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-color); font-family: inherit; font-size: 0.95rem; resize: vertical; outline: none; &:focus { border-color: var(--accent-color); } }
  }

  .btn-send { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px; background: var(--accent-color, #38bdf8); color: #fff; border: none; border-radius: 8px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: opacity 0.2s; &:hover { opacity: 0.9; } }
  .w-100 { width: 100%; }

  .template-list { display: flex; flex-direction: column; gap: 16px; }
  .template-card {
    background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px;
    h5 { margin: 0 0 8px 0; color: var(--text-color); font-size: 0.95rem; }
    p { margin: 0 0 12px 0; font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; }
    .btn-link { background: none; border: none; color: var(--accent-color, #38bdf8); font-size: 0.85rem; font-weight: 600; cursor: pointer; padding: 0; }
  }

  .workflows-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
  .workflow-card {
    background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;
    &.active { border-color: rgba(16, 185, 129, 0.3); }
    .w-header { display: flex; justify-content: space-between; margin-bottom: 16px; h4 { margin: 0 0 8px 0; color: var(--text-color); } }
    .badge { padding: 4px 8px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; background: rgba(255,255,255,0.05); color: var(--text-muted); }
    .bg-success-light { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    
    .toggle { width: 44px; height: 24px; background: var(--border-color); border-radius: 12px; position: relative; cursor: pointer; }
    .toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: var(--text-muted); border-radius: 50%; transition: 0.3s; }
    .toggle.switch-on { background: rgba(16, 185, 129, 0.2); }
    .toggle.switch-on::after { left: 22px; background: #10b981; }
    
    p { margin: 0 0 16px 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; }
    .w-stats { font-size: 0.75rem; color: var(--accent-color, #38bdf8); font-weight: 600; }
  }
`;

export default CommunicationModule;
