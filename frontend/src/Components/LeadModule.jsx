import React, { useState } from "react";
import styled from "styled-components";
import { Users, Phone, Mail, Instagram, Facebook, Globe, Calendar, CheckCircle, X } from "lucide-react";
import { useAdminStore } from "../store/useAdminStore";

const LeadModule = () => {
  const { consultations: leads, addConsultation, updateConsultationStatus, deleteConsultation } = useAdminStore();
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [newLead, setNewLead] = useState({ fullName: '', phone: '', email: '', source: 'Walk-In', goals: '' });
  const [submitting, setSubmitting] = useState(false);

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

  const markConverted = async (id) => {
    await updateConsultationStatus(id, 'CONVERTED');
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await addConsultation({ ...newLead, status: 'NEW', createdAt: new Date().toISOString() });
    if (success) {
      setIsAddLeadOpen(false);
      setNewLead({ fullName: '', phone: '', email: '', source: 'Walk-In', goals: '' });
    }
    setSubmitting(false);
  };

  return (
    <Container className="animate-in">
      <div className="module-header">
        <div className="title-area">
          <h2>LEADS <small>MARKETING FUNNEL</small></h2>
        </div>
        <button className="btn-primary" onClick={() => setIsAddLeadOpen(true)}>Add New Lead</button>
      </div>

      <div className="funnel-metrics">
        <div className="metric-card">
          <div className="label">Total Leads</div>
          <div className="value">{leads.length}</div>
        </div>
        <div className="metric-card">
          <div className="label">Follow-Ups Today</div>
          <div className="value text-warning">0</div>
        </div>
        <div className="metric-card">
          <div className="label">Conversion Rate</div>
          <div className="value text-success">
            0%
          </div>
        </div>
      </div>

      <div className="table-card table-responsive">
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
            {leads.map(lead => (
              <tr key={lead.id}>
                <td>
                  <div className="fw-bold">{lead.fullName || 'Unknown'}</div>
                  <div className="sub-text">C-{lead.id}</div>
                </td>
                <td>
                  <div className="contact-info">
                    <span><Phone size={12} /> {lead.phone}</span>
                    <span><Mail size={12} /> {lead.email}</span>
                  </div>
                </td>
                <td>
                  <div className="source-badge">
                    {getSourceIcon(lead.source)}
                    <span>{lead.source}</span>
                  </div>
                </td>
                <td className="fw-bold">{lead.goals}</td>
                <td>
                  <div className="followup-info">
                    <Calendar size={14} /> {new Date(lead.createdAt).toLocaleDateString()}
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
            {leads.length === 0 && (
              <tr><td colSpan="7" className="text-center py-4">No active leads.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isAddLeadOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-scale">
            <div className="modal-header">
              <h2>Add New Lead</h2>
              <button className="close-btn" onClick={() => setIsAddLeadOpen(false)}><X size={24}/></button>
            </div>
            <form className="modal-body" onSubmit={handleAddLead}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={newLead.fullName} onChange={e => setNewLead({...newLead, fullName: e.target.value})} required />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Phone</label>
                  <input type="text" value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Source</label>
                <select value={newLead.source} onChange={e => setNewLead({...newLead, source: e.target.value})}>
                  <option value="Walk-In">Walk-In</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Google Ads">Google Ads</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes / Goals</label>
                <textarea rows="3" value={newLead.goals} onChange={e => setNewLead({...newLead, goals: e.target.value})}></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsAddLeadOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
    @media (max-width: 992px) { grid-template-columns: 1fr 1fr; }
    @media (max-width: 768px) { grid-template-columns: 1fr; }
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
