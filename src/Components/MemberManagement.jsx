import React, { useState } from "react";
import styled from "styled-components";
import { MoreVertical, Trash2, X, User, Heart, CreditCard, Calendar, Activity, ChevronRight, Save } from "lucide-react";

const MemberManagement = ({ users, onDeleteUser, onAddUser, onEditUser, payments = [] }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    if (onEditUser) {
      const success = await onEditUser(editFormData.id || editFormData.memberId, editFormData);
      if (success) {
        setSelectedUser(editFormData);
        setIsEditModalOpen(false);
      }
    } else {
      setSelectedUser(editFormData);
      setIsEditModalOpen(false);
    }
    setIsSaving(false);
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return <span className="badge bg-success-light">Active</span>;
      case 'expired': return <span className="badge bg-danger-light">Expired</span>;
      case 'suspended': return <span className="badge bg-warning-light" style={{color: '#b45309'}}>Suspended</span>;
      default: return <span className="badge bg-success-light">{status || 'Active'}</span>;
    }
  };

  return (
    <Container className="animate-in">
      <div className="table-header">
        <h2>USERS <small>MANAGEMENT</small></h2>
        <button 
          onClick={onAddUser} 
          style={{ background: 'var(--accent-color, #38bdf8)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
        >
          + New User
        </button>
      </div>
      <div className="table-responsive">
        <table className="table interactive-table">
          <thead>
            <tr>
              <th>USER</th>
              <th>STATUS</th>
              <th>TYPE</th>
              <th>CONTACT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id || u.memberId} onClick={() => setSelectedUser(u)}>
                <td>
                  <div className="u-cell">
                    <div className="avatar-small">{(u.fullName || "U").charAt(0)}</div>
                    <div>
                      <div className="u-name">{u.fullName || "User"}</div>
                      <div className="u-email">{u.memberId || `MBR-${u.id || '0000'}`}</div>
                    </div>
                  </div>
                </td>
                <td>{getStatusBadge(u.membershipStatus || u.status)}</td>
                <td>{u.membershipPlan || u.membershipType || "Standard"}</td>
                <td className="sub-text">{u.mobileNumber || u.phone || "N/A"}</td>
                <td>
                  <div className="d-flex gap-2" onClick={e => e.stopPropagation()}>
                    <button className="btn-icon text-danger" onClick={() => onDeleteUser(u.id || u.memberId)} title="Delete User">
                      <Trash2 size={16} />
                    </button>
                    <button className="btn-icon" onClick={() => setSelectedUser(u)}><MoreVertical size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">No users found. Click "Add User" to register a new member.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-out Drawer for Member Details */}
      {selectedUser && (
        <>
          <div className="drawer-overlay" onClick={() => setSelectedUser(null)} />
          <div className="pay-slip-drawer animate-slide-left" style={{ width: '450px' }}>
            <div className="drawer-header">
              <h3>Member Profile</h3>
              <button onClick={() => setSelectedUser(null)}><X size={20} /></button>
            </div>
            
            <div className="slip-profile">
              <div className="big-avatar" style={{width: '60px', height: '60px', fontSize: '1.5rem'}}>
                {(selectedUser.fullName || "U").charAt(0)}
              </div>
              <div className="info">
                <h4>{selectedUser.fullName || "User Name"}</h4>
                <p>{selectedUser.memberId || `MBR-${selectedUser.id || '0000'}`}</p>
                <div style={{marginTop: '5px'}}>{getStatusBadge(selectedUser.membershipStatus || selectedUser.status)}</div>
              </div>
            </div>

            <div className="slip-section">
              <h5><User size={14} className="mr-2" style={{marginRight: '8px'}} /> PERSONAL DETAILS</h5>
              <div className="line-item"><span>Email</span> <span>{selectedUser.email || "N/A"}</span></div>
              <div className="line-item"><span>Mobile</span> <span>{selectedUser.mobileNumber || "N/A"}</span></div>
              <div className="line-item"><span>DOB / Age</span> <span>{selectedUser.dob || "-"} / {selectedUser.age || "-"} yrs</span></div>
              <div className="line-item"><span>Gender</span> <span>{selectedUser.gender || "-"}</span></div>
              <div className="line-item"><span>Blood Group</span> <span>{selectedUser.bloodGroup || "-"}</span></div>
              <div className="line-item"><span>Emergency Contact</span> <span>{selectedUser.emergencyContactName ? `${selectedUser.emergencyContactName} (${selectedUser.emergencyContactNumber})` : "N/A"}</span></div>
            </div>

            <div className="slip-section">
              <h5><Heart size={14} className="mr-2" style={{marginRight: '8px'}} /> HEALTH & FITNESS</h5>
              <div className="line-item"><span>Height / Weight</span> <span>{selectedUser.height ? `${selectedUser.height} cm` : "-"} / {selectedUser.weight ? `${selectedUser.weight} kg` : "-"}</span></div>
              <div className="line-item"><span>BMI</span> <span>{selectedUser.bmi || "-"}</span></div>
              <div className="line-item"><span>Goal</span> <span className="text-primary">{selectedUser.fitnessGoal || "General Fitness"}</span></div>
              {(selectedUser.medicalConditions || selectedUser.allergies) && (
                <div className="mt-2 p-2" style={{background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', fontSize: '0.8rem'}}>
                  <strong className="text-danger">Medical Alert:</strong><br/>
                  {selectedUser.medicalConditions && <div>Conditions: {selectedUser.medicalConditions}</div>}
                  {selectedUser.allergies && <div>Allergies: {selectedUser.allergies}</div>}
                </div>
              )}
            </div>

            <div className="slip-section">
              <h5><Calendar size={14} className="mr-2" style={{marginRight: '8px'}} /> MEMBERSHIP</h5>
              <div className="line-item"><span>Plan Name</span> <strong>{selectedUser.membershipPlan || "Standard"}</strong></div>
              <div className="line-item"><span>Start Date</span> <span>{selectedUser.startDate || "-"}</span></div>
              <div className="line-item"><span>Expiry Date</span> <span className="text-danger">{selectedUser.expiryDate || "-"}</span></div>
            </div>

            {(() => {
              const userPayments = payments?.filter(p => p.user?.fullName === selectedUser.fullName || p.userId === selectedUser.id) || [];
              const firstPayment = userPayments.length > 0 ? userPayments[userPayments.length - 1] : null;
              
              return (
                <div className="slip-section">
                  <h5><CreditCard size={14} className="mr-2" style={{marginRight: '8px'}} /> PAYMENT HISTORY</h5>
                  {firstPayment ? (
                    <div className="line-item" style={{borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', marginBottom: '8px'}}>
                      <span>First Payment</span> 
                      <div style={{textAlign: 'right'}}>
                        <div><strong>₹{firstPayment.amount}</strong></div>
                        <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{firstPayment.paymentDate} • {firstPayment.paymentStatus}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="line-item"><span>First Payment</span> <span>N/A</span></div>
                  )}
                  
                  <div style={{marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px'}}>All Payments</div>
                  <div style={{maxHeight: '120px', overflowY: 'auto', paddingRight: '5px'}}>
                    {userPayments.length > 0 ? userPayments.map((p, idx) => (
                      <div key={p.id || idx} style={{display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed rgba(255,255,255,0.05)'}}>
                        <div style={{fontSize: '0.8rem'}}>
                          <div>₹{p.amount}</div>
                          <div style={{fontSize: '0.7rem', color: 'var(--text-muted)'}}>{p.paymentMode || 'Cash'}</div>
                        </div>
                        <div style={{textAlign: 'right', fontSize: '0.8rem'}}>
                          <div>{p.paymentDate}</div>
                          <div style={{fontSize: '0.7rem', color: p.paymentStatus === 'SUCCESS' ? '#10b981' : '#ef4444'}}>{p.paymentStatus}</div>
                        </div>
                      </div>
                    )) : <div style={{fontSize: '0.8rem'}}>No payment history found.</div>}
                  </div>
                </div>
              );
            })()}

            <div className="slip-section">
              <h5><Activity size={14} className="mr-2" style={{marginRight: '8px'}} /> RENEWAL DETAILS</h5>
              <div className="line-item"><span>Next Renewal Date</span> <span style={{color: '#f59e0b'}}>{selectedUser.expiryDate || "N/A"}</span></div>
              <div className="line-item"><span>Status</span> <span>{getStatusBadge(selectedUser.membershipStatus || selectedUser.status)}</span></div>
            </div>

            <button className="btn-outline w-100 mt-3" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} onClick={() => { setEditFormData(selectedUser); setIsEditModalOpen(true); }}>
              Edit Plan Details <ChevronRight size={16} />
            </button>
          </div>

          {/* Edit Modal */}
          {isEditModalOpen && (
            <div className="modal-overlay" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div className="modal-content animate-in" style={{background: 'var(--card-bg, #1e293b)', padding: '24px', borderRadius: '16px', width: '450px', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                  <h3 style={{margin: 0, display: 'flex', alignItems: 'center', gap: '8px'}}><User size={20}/> Edit Plan Details</h3>
                  <button onClick={() => setIsEditModalOpen(false)} style={{background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'}}><X size={20}/></button>
                </div>
                
                <form onSubmit={handleEditSubmit}>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>PLAN NAME</label>
                      <input 
                        type="text" 
                        value={editFormData.membershipPlan || editFormData.membershipType || ''} 
                        onChange={e => setEditFormData({...editFormData, membershipPlan: e.target.value})}
                        style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px'}}
                      />
                    </div>
                    
                    <div style={{display: 'flex', gap: '16px'}}>
                      <div style={{flex: 1}}>
                        <label style={{display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>START DATE</label>
                        <input 
                          type="date" 
                          value={editFormData.startDate || ''} 
                          onChange={e => setEditFormData({...editFormData, startDate: e.target.value})}
                          style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px', colorScheme: 'dark'}}
                        />
                      </div>
                      <div style={{flex: 1}}>
                        <label style={{display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>EXPIRY DATE</label>
                        <input 
                          type="date" 
                          value={editFormData.expiryDate || ''} 
                          onChange={e => setEditFormData({...editFormData, expiryDate: e.target.value})}
                          style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px', colorScheme: 'dark'}}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>STATUS</label>
                      <select 
                        value={editFormData.membershipStatus || editFormData.status || 'ACTIVE'} 
                        onChange={e => setEditFormData({...editFormData, membershipStatus: e.target.value, status: e.target.value})}
                        style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px'}}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="EXPIRED">EXPIRED</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                      </select>
                    </div>
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px'}}>
                    <button type="button" onClick={() => setIsEditModalOpen(false)} style={{padding: '10px 16px', background: 'transparent', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px', cursor: 'pointer'}}>Cancel</button>
                    <button type="submit" disabled={isSaving} style={{padding: '10px 16px', background: 'var(--accent-color, #38bdf8)', border: 'none', color: '#000', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <Save size={16}/> {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  background: var(--card-bg, #1e293b);
  border-radius: 12px;
  border: 1px solid var(--border-color, #334155);
  overflow: hidden;
  box-shadow: var(--shadow);
  
  .table-header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color, #334155);
    display: flex; justify-content: space-between; alignItems: center;
    h2 { margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--text-color); display: flex; align-items: center; gap: 8px; }
    small { font-weight: 400; color: var(--text-muted); font-size: 0.8rem; letter-spacing: 1px; }
  }

  .table-responsive {
    overflow-x: auto;
  }

  .table {
    width: 100%; border-collapse: collapse;
    th { text-align: left; padding: 12px 24px; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--border-color); }
    td { padding: 16px 24px; font-size: 0.9rem; color: var(--text-color); border-bottom: 1px solid var(--border-color); vertical-align: middle; }
    tbody tr { transition: background 0.2s; cursor: pointer; }
    tbody tr:hover { background: rgba(255,255,255,0.02); }
  }

  .u-cell {
    display: flex; align-items: center; gap: 12px;
    .avatar-small { width: 36px; height: 36px; border-radius: 50%; background: var(--accent-glow); color: var(--accent-color); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; }
    .u-name { font-weight: 600; }
    .u-email { font-size: 0.75rem; color: var(--text-muted); }
  }

  .badge {
    padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
    &.bg-success-light { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    &.bg-danger-light { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    &.bg-warning-light { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    &.bg-primary-light { background: var(--accent-glow); color: var(--accent-color); }
  }

  .sub-text { color: var(--text-muted); font-size: 0.85rem; }
  
  .btn-icon {
    background: none; border: none; padding: 6px; border-radius: 6px; cursor: pointer; color: var(--text-muted); transition: all 0.2s;
    &:hover { background: rgba(255,255,255,0.05); color: var(--text-color); }
    &.text-danger:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
  }

  /* Drawer Styles */
  .drawer-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 100;
  }
  .pay-slip-drawer {
    position: fixed; top: 0; right: 0; bottom: 0; background: var(--card-bg, #1e293b); width: 400px; max-width: 100vw; z-index: 101;
    box-shadow: -10px 0 30px rgba(0,0,0,0.5); border-left: 1px solid var(--border-color);
    display: flex; flex-direction: column; overflow-y: auto; padding: 24px; color: var(--text-color);
    
    .drawer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; h3 { margin: 0; } button { background: none; border: none; color: inherit; cursor: pointer; } }
    .slip-profile { display: flex; gap: 16px; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px dashed var(--border-color); }
    .big-avatar { background: var(--accent-glow); color: var(--accent-color); display: flex; align-items: center; justify-content: center; border-radius: 12px; font-weight: bold; }
    .info h4 { margin: 0 0 4px 0; font-size: 1.2rem; } .info p { margin: 0; color: var(--text-muted); font-size: 0.85rem; }
    
    .slip-section {
      margin-bottom: 24px;
      h5 { margin: 0 0 16px 0; font-size: 0.8rem; color: var(--text-muted); letter-spacing: 1px; display: flex; align-items: center; }
      .line-item { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.9rem; span:first-child { color: var(--text-muted); } }
    }

    .btn-outline {
      background: transparent; border: 1px solid var(--border-color); color: inherit; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: 500;
      &:hover { background: rgba(255,255,255,0.05); }
    }
    .w-100 { width: 100%; }
    .mt-3 { margin-top: 16px; }
  }
`;

export default MemberManagement;
