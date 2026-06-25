import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CheckCircle, Clock, AlertTriangle, Shield, Plus, Edit2, Trash2, X } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import { useAdminStore } from "../store/useAdminStore";
import emailjs from '@emailjs/browser';

const MembershipModule = ({ onAddUser }) => {
  const { users } = useAdminStore();
  const [plans, setPlans] = useState([]);
  
  const handleSendReminder = async (user) => {
    try {
      if (!user.email) {
        alert("This user does not have an email address on file.");
        return;
      }
      
      const today = new Date();
      today.setHours(0,0,0,0);
      const expDate = user.expiryDate ? new Date(user.expiryDate) : new Date();
      expDate.setHours(0,0,0,0);
      const diffTime = expDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const templateParams = {
        to_email: user.email,
        to_name: user.fullName || "Member",
        plan_name: user.membershipPlan || "Gym Membership",
        expiry_date: user.expiryDate ? user.expiryDate.split('T')[0] : "N/A",
        days_left: diffDays >= 0 ? diffDays : 0,
      };

      await emailjs.send(
        'service_608qbca', // Your Service ID
        'template_hnfcdo9', // Your Template ID
        templateParams,
        'FgA_6_AkuJW7B2crn' // Your Public Key
      );

      alert(`Reminder sent to ${user.fullName} via EmailJS!`);
    } catch (err) {
      console.error("Failed to send reminder via EmailJS", err);
      alert("Failed to send reminder");
    }
  };
  
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axiosInstance.get('/membership-plans');
      setPlans(res.data);
    } catch (err) {
      console.error("Failed to fetch plans", err);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "", price: "", duration: "", badge: "", isPopular: false, isPremium: false, 
    features: "", imageUrl: "", accentColor: "#3b82f6", rating: 4.5, userCount: "", bonus: ""
  });

  const activeMembers = users.filter(u => (u.membershipStatus || u.status)?.toLowerCase() === 'active').length;
  const expiredMembers = users.filter(u => (u.membershipStatus || u.status)?.toLowerCase() === 'expired').length;
  
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const renewalsDue = users.filter(u => {
    if (!u.expiryDate) return false;
    const expDate = new Date(u.expiryDate);
    return expDate >= today && expDate <= nextWeek;
  }).length;

  const handleOpenModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        ...plan,
        features: plan.features ? plan.features.join("\n") : ""
      });
    } else {
      setEditingPlan(null);
      setFormData({ 
        title: "", price: "", duration: "", badge: "", isPopular: false, isPremium: false, 
        features: "", imageUrl: "", accentColor: "#3b82f6", rating: 4.5, userCount: "", bonus: "" 
      });
    }
    setIsModalOpen(true);
  };

  const handleSavePlan = async () => {
    const featureList = formData.features.split("\n").filter(f => f.trim() !== "");
    const planToSave = { 
      ...formData, 
      features: featureList,
      rating: parseFloat(formData.rating) || 0.0
    };
    
    try {
      if (editingPlan) {
        await axiosInstance.put(`/membership-plans/${editingPlan.id}`, planToSave);
      } else {
        await axiosInstance.post('/membership-plans', planToSave);
      }
      setIsModalOpen(false);
      fetchPlans();
    } catch (err) {
      console.error("Failed to save plan", err);
      alert("Error saving plan. Check console.");
    }
  };

  const handleDeletePlan = async (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await axiosInstance.delete(`/membership-plans/${id}`);
        fetchPlans();
      } catch (err) {
        console.error("Failed to delete plan", err);
      }
    }
  };

  return (
    <Container className="animate-in">
      <div className="header-actions">
        <div className="title-area">
          <h2>MEMBERSHIP <small>PLANS</small></h2>
          <button className="btn-add-plan" onClick={() => handleOpenModal()}>
            <Plus size={16} /> Add New Plan
          </button>
        </div>
        <div className="stats-row">
          <div className="stat-pill success"><CheckCircle size={14}/> Active: {activeMembers}</div>
          <div className="stat-pill danger"><AlertTriangle size={14}/> Expired: {expiredMembers}</div>
          <div className="stat-pill warning"><Clock size={14}/> Renewals (7d): {renewalsDue}</div>
        </div>
      </div>

      <div className="plans-grid">
        {plans.map(plan => (
          <div key={plan.id} className={`plan-card ${plan.isPopular ? 'popular' : ''} ${plan.isPremium ? 'premium' : ''}`}>
            {plan.isPopular && <div className="popular-badge">MOST POPULAR</div>}
            
            <div className="admin-actions">
              <button className="action-btn edit" onClick={() => handleOpenModal(plan)}><Edit2 size={14} /></button>
              <button className="action-btn delete" onClick={() => handleDeletePlan(plan.id)}><Trash2 size={14} /></button>
            </div>
            
            <div className="plan-header">
              <h3>{plan.title}</h3>
              <div className="price">₹{plan.price}<span>/{plan.duration}</span></div>
            </div>
            <ul className="features">
              {(plan.features || []).map((feature, i) => (
                <li key={i}>
                  {plan.isPremium && i === 0 ? <Shield size={14} className="text-warning" /> : <CheckCircle size={14} className="text-success" />} 
                  {feature}
                </li>
              ))}
            </ul>
            <button className={`btn-assign ${plan.isPopular ? 'primary' : plan.isPremium ? 'warning' : ''}`} onClick={onAddUser}>
              Assign to Member
            </button>
          </div>
        ))}
      </div>

      <div className="renewal-section">
        <h3>All Member Renewals</h3>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr><th>MEMBER</th><th>PLAN</th><th>EXPIRY DATE</th><th>CONTACT</th><th>ACTION</th></tr>
            </thead>
            <tbody>
              {[...users]
              .sort((a, b) => {
                if (!a.expiryDate) return 1;
                if (!b.expiryDate) return -1;
                return new Date(a.expiryDate) - new Date(b.expiryDate);
              })
              .map(u => {
                let daysLeftText = "";
                let statusColor = "var(--text-muted)";
                if (u.expiryDate) {
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  const expDate = new Date(u.expiryDate);
                  expDate.setHours(0,0,0,0);
                  const diffTime = expDate - today;
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays > 0) {
                    daysLeftText = `(${diffDays} days left)`;
                    if (diffDays <= 7) statusColor = "#f59e0b"; // Warning for <= 7 days
                  } else if (diffDays === 0) {
                    daysLeftText = `(Expires today)`;
                    statusColor = "#f59e0b";
                  } else {
                    daysLeftText = `(${Math.abs(diffDays)} days ago)`;
                    statusColor = "#ef4444"; // Danger for already expired
                  }
                }
                return (
                <tr key={u.id || u.memberId}>
                  <td className="fw-bold">{u.fullName}</td>
                  <td>{u.membershipPlan || "Standard"}</td>
                  <td className="text-danger fw-bold">
                    {u.expiryDate ? u.expiryDate.split('T')[0] : "N/A"}
                    {daysLeftText && (
                      <span style={{ fontSize: '0.8rem', color: statusColor, marginLeft: '8px', fontWeight: 'normal' }}>
                        {daysLeftText}
                      </span>
                    )}
                  </td>
                  <td className="sub-text">{u.phone || u.mobileNumber || "N/A"}</td>
                  <td><button className="btn-renew" onClick={() => handleSendReminder(u)}>Send Reminder</button></td>
                </tr>
              )})}
              {users.length === 0 && (
                <tr><td colSpan="5" className="text-center py-4 text-muted">No members found with an active plan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ModalOverlay>
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingPlan ? "Edit Plan" : "Add New Plan"}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Plan Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Monthly" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹ or Custom)</label>
                  <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. 1500 or Custom" />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="e.g. Per Month" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Badge Text</label>
                  <input type="text" value={formData.badge} onChange={e => setFormData({...formData, badge: e.target.value})} placeholder="e.g. Most Popular" />
                </div>
                <div className="form-group">
                  <label>Accent Color</label>
                  <input type="color" style={{height: '38px', width: '100%'}} value={formData.accentColor} onChange={e => setFormData({...formData, accentColor: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Rating</label>
                  <input type="number" step="0.1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} placeholder="e.g. 4.5" />
                </div>
                <div className="form-group">
                  <label>User Count Text</label>
                  <input type="text" value={formData.userCount} onChange={e => setFormData({...formData, userCount: e.target.value})} placeholder="e.g. 5k+ Members" />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Bonus Text</label>
                <input type="text" value={formData.bonus} onChange={e => setFormData({...formData, bonus: e.target.value})} placeholder="e.g. 7-Day Money Back Guarantee" />
              </div>
              <div className="form-group">
                <label>Features (One per line)</label>
                <textarea rows="4" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} placeholder="Full Gym Access&#10;Free Diet Plan"></textarea>
              </div>
              <div className="form-row checkboxes">
                <label className="check-label">
                  <input type="checkbox" checked={formData.isPopular} onChange={e => setFormData({...formData, isPopular: e.target.checked})} />
                  Mark as Most Popular
                </label>
                <label className="check-label">
                  <input type="checkbox" checked={formData.isPremium} onChange={e => setFormData({...formData, isPremium: e.target.checked})} />
                  Mark as Premium (VIP)
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSavePlan}>Save Plan</button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex; flex-direction: column; gap: 24px;
  
  .header-actions {
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 16px;
    
    @media (max-width: 768px) {
      flex-direction: column; align-items: flex-start;
    }

    .title-area {
      display: flex; align-items: center; gap: 16px;
      flex-wrap: wrap;
    }
    h2 { margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--text-color); display: flex; align-items: center; gap: 8px; }
    small { font-weight: 400; color: var(--text-muted); font-size: 0.8rem; letter-spacing: 1px; }
    
    .btn-add-plan {
      display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: var(--accent-color, #38bdf8);
      color: #fff; border: none; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer;
      &:hover { opacity: 0.9; }
    }
  }

  .stats-row {
    display: flex; gap: 12px; flex-wrap: wrap;
    .stat-pill {
      display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;
      &.success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
      &.danger { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
      &.warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    }
  }

  .plans-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;
  }

  .plan-card {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; padding: 24px;
    position: relative; overflow: hidden; display: flex; flex-direction: column; box-shadow: var(--shadow);
    
    &.popular { border-color: var(--accent-color, #38bdf8); }
    &.premium { border-color: #f59e0b; }
    
    .popular-badge { position: absolute; top: 0; right: 0; background: var(--accent-color, #38bdf8); color: #fff; font-size: 0.6rem; font-weight: bold; padding: 4px 12px; border-bottom-left-radius: 12px; letter-spacing: 1px; z-index: 1; }
    
    .admin-actions {
      position: absolute; top: 12px; right: 12px; display: flex; gap: 8px; z-index: 2;
      .action-btn {
        background: rgba(0,0,0,0.2); border: none; color: var(--text-muted); cursor: pointer; padding: 6px; border-radius: 4px; display: flex; align-items: center; justify-content: center;
        &:hover { color: #fff; background: rgba(255,255,255,0.1); }
        &.edit:hover { color: #38bdf8; }
        &.delete:hover { color: #ef4444; }
      }
    }
    
    .plan-header {
      margin-bottom: 20px; border-bottom: 1px dashed var(--border-color); padding-bottom: 20px;
      h3 { margin: 0 0 8px 0; color: var(--text-color); font-size: 1.2rem; }
      .price { font-size: 1.8rem; font-weight: 800; color: var(--text-color); span { font-size: 0.9rem; color: var(--text-muted); font-weight: 500; } }
    }

    .features {
      list-style: none; padding: 0; margin: 0 0 24px 0; flex: 1;
      li { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 0.9rem; color: var(--text-color); }
      .text-success { color: #10b981; }
      .text-muted { color: var(--text-muted); }
      .text-warning { color: #f59e0b; }
    }

    .btn-assign {
      width: 100%; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;
      background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); color: var(--text-color);
      &:hover { background: rgba(255,255,255,0.05); }
      &.primary { background: var(--accent-color, #38bdf8); border-color: var(--accent-color, #38bdf8); color: #fff; }
      &.warning { background: #f59e0b; border-color: #f59e0b; color: #fff; }
    }
  }

  .renewal-section {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; padding: 24px; box-shadow: var(--shadow);
    h3 { margin: 0 0 20px 0; font-size: 1.1rem; color: var(--text-color); }
    
    .table {
      width: 100%; border-collapse: collapse;
      th { text-align: left; padding: 12px; font-size: 0.75rem; color: var(--text-muted); border-bottom: 1px solid var(--border-color); }
      td { padding: 12px; font-size: 0.9rem; border-bottom: 1px solid var(--border-color); }
      .text-danger { color: #ef4444; }
      .btn-renew { background: rgba(56, 189, 248, 0.1); color: var(--accent-color, #38bdf8); border: 1px solid var(--accent-color, #38bdf8); padding: 4px 12px; border-radius: 4px; font-size: 0.8rem; cursor: pointer; }
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center; z-index: 1000;

  .modal-content {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155);
    border-radius: 12px; width: 100%; max-width: 500px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    
    .modal-header {
      padding: 16px 24px; border-bottom: 1px solid var(--border-color);
      display: flex; justify-content: space-between; align-items: center;
      h3 { margin: 0; color: var(--text-color); font-size: 1.1rem; }
      .close-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; }
    }
    
    .modal-body {
      padding: 24px; display: flex; flex-direction: column; gap: 16px;
      .form-row { display: flex; gap: 16px; }
      .form-group {
        display: flex; flex-direction: column; gap: 6px; flex: 1;
        label { font-size: 0.8rem; color: var(--text-muted); font-weight: 500; }
        input, textarea {
          background: rgba(0,0,0,0.1); border: 1px solid var(--border-color);
          padding: 10px; border-radius: 6px; color: var(--text-color); font-size: 0.9rem;
          &:focus { outline: none; border-color: var(--accent-color, #38bdf8); }
        }
        textarea { resize: vertical; }
      }
      .checkboxes {
        flex-direction: column; gap: 8px; margin-top: 8px;
        .check-label {
          display: flex; align-items: center; gap: 8px; color: var(--text-color); font-size: 0.9rem; cursor: pointer;
        }
      }
    }
    
    .modal-footer {
      padding: 16px 24px; border-top: 1px solid var(--border-color);
      display: flex; justify-content: flex-end; gap: 12px;
      
      .btn-cancel {
        padding: 8px 16px; background: transparent; border: 1px solid var(--border-color);
        color: var(--text-color); border-radius: 6px; cursor: pointer;
      }
      .btn-save {
        padding: 8px 16px; background: var(--accent-color, #38bdf8); border: none;
        color: #fff; border-radius: 6px; cursor: pointer; font-weight: 600;
      }
    }
  }
`;

export default MembershipModule;
