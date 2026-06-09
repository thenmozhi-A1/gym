import React, { useState } from "react";
import styled from "styled-components";
import { Users, Phone, Mail, Instagram, Facebook, Globe, Calendar, CheckCircle } from "lucide-react";

const LeadModule = () => {
  const [leads, setLeads] = useState([
    { id: "L-1001", name: "Alice Cooper", mobile: "9876543210", email: "alice@example.com", source: "Instagram", plan: "Annual VIP", followUp: "2026-06-10", status: "Hot", converted: false },
    { id: "L-1002", name: "Bob Martin", mobile: "9876543211", email: "bob@example.com", source: "Walk-In", plan: "Monthly", followUp: "2026-06-09", status: "Warm", converted: false },
    { id: "L-1003", name: "Charlie Brown", mobile: "9876543212", email: "charlie@example.com", source: "Facebook", plan: "Quarterly", followUp: "2026-06-12", status: "Cold", converted: false },
  ]);

  const getSourceIcon = (source) => {
    switch(source) {
      case 'Instagram': return <Instagram size={14} className="text-pink" />;
      case 'Facebook': return <Facebook size={14} className="text-blue" />;
      case 'Google Ads': return <Globe size={14} className="text-yellow" />;
      case 'Walk-In': return <Users size={14} className="text-green" />;
      default: return <Users size={14} />;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Hot': return <span className="badge bg-danger-light text-danger">HOT</span>;
      case 'Warm': return <span className="badge bg-warning-light text-warning">WARM</span>;
      case 'Cold': return <span className="badge bg-primary-light text-primary">COLD</span>;
      default: return <span className="badge">NEW</span>;
    }
  };

  const markConverted = (id) => {
    setLeads(leads.map(l => l.id === id ? { ...l, converted: true } : l));
    // In a real app, this would also open the AddUserModal pre-filled with lead data
  };

  return (
    <Container className="animate-in">
      <div className="module-header">
        <div className="title-area">
          <h2>LEADS <small>MARKETING FUNNEL</small></h2>
        </div>
        <button className="btn-primary">Add New Lead</button>
      </div>

      <div className="funnel-metrics">
        <div className="metric-card">
          <div className="label">Total Leads</div>
          <div className="value">{leads.length}</div>
        </div>
        <div className="metric-card">
          <div className="label">Follow-Ups Today</div>
          <div className="value text-warning">2</div>
        </div>
        <div className="metric-card">
          <div className="label">Conversion Rate</div>
          <div className="value text-success">
            {leads.length > 0 ? Math.round((leads.filter(l => l.converted).length / leads.length) * 100) : 0}%
          </div>
        </div>
      </div>

      <div className="table-card">
        <table className="table">
          <thead>
            <tr>
              <th>LEAD INFO</th>
              <th>CONTACT</th>
              <th>SOURCE</th>
              <th>INTERESTED PLAN</th>
              <th>FOLLOW-UP</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {leads.filter(l => !l.converted).map(lead => (
              <tr key={lead.id}>
                <td>
                  <div className="fw-bold">{lead.name}</div>
                  <div className="sub-text">{lead.id}</div>
                </td>
                <td>
                  <div className="contact-info">
                    <span><Phone size={12} /> {lead.mobile}</span>
                    <span><Mail size={12} /> {lead.email}</span>
                  </div>
                </td>
                <td>
                  <div className="source-badge">
                    {getSourceIcon(lead.source)}
                    <span>{lead.source}</span>
                  </div>
                </td>
                <td className="fw-bold">{lead.plan}</td>
                <td>
                  <div className="followup-info">
                    <Calendar size={14} /> {lead.followUp}
                  </div>
                </td>
                <td>{getStatusBadge(lead.status)}</td>
                <td>
                  <button className="btn-convert" onClick={() => markConverted(lead.id)} title="Convert to Member">
                    <CheckCircle size={16} /> Convert
                  </button>
                </td>
              </tr>
            ))}
            {leads.filter(l => !l.converted).length === 0 && (
              <tr><td colSpan="7" className="text-center py-4">No active leads.</td></tr>
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
    .btn-primary { background: var(--accent-color, #38bdf8); color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
  }

  .funnel-metrics {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
    .metric-card {
      background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; padding: 20px; text-align: center; box-shadow: var(--shadow);
      .label { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
      .value { font-size: 2rem; font-weight: 800; color: var(--text-color); }
      .text-warning { color: #f59e0b; }
      .text-success { color: #10b981; }
    }
  }

  .table-card {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; overflow: hidden; box-shadow: var(--shadow);
    
    .table {
      width: 100%; border-collapse: collapse;
      th { text-align: left; padding: 12px 20px; font-size: 0.75rem; color: var(--text-muted); border-bottom: 1px solid var(--border-color); }
      td { padding: 16px 20px; font-size: 0.9rem; border-bottom: 1px solid var(--border-color); color: var(--text-color); vertical-align: middle; }
      
      .sub-text { color: var(--text-muted); font-size: 0.8rem; }
      
      .contact-info { display: flex; flex-direction: column; gap: 4px; font-size: 0.8rem; color: var(--text-muted); span { display: flex; align-items: center; gap: 6px; } }
      
      .source-badge {
        display: inline-flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.1); padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; border: 1px solid var(--border-color);
        .text-pink { color: #ec4899; }
        .text-blue { color: #3b82f6; }
        .text-yellow { color: #eab308; }
        .text-green { color: #10b981; }
      }

      .followup-info { display: flex; align-items: center; gap: 6px; color: var(--text-muted); font-size: 0.85rem; }

      .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.5px; }
      .bg-danger-light { background: rgba(239, 68, 68, 0.1); }
      .text-danger { color: #ef4444; }
      .bg-warning-light { background: rgba(245, 158, 11, 0.1); }
      .text-warning { color: #f59e0b; }
      .bg-primary-light { background: rgba(56, 189, 248, 0.1); }
      .text-primary { color: var(--accent-color, #38bdf8); }

      .btn-convert {
        display: flex; align-items: center; gap: 6px; background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid #10b981; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: background 0.2s;
        &:hover { background: rgba(16, 185, 129, 0.2); }
      }
    }
  }
`;

export default LeadModule;
