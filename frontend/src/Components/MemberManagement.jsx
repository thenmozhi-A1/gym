import React, { useState } from "react";
import styled from "styled-components";
import { MoreVertical, Trash2, X, User, Heart, CreditCard, Calendar, Activity, ChevronRight, Save, Eye, Edit2 } from "lucide-react";
import { useAdminStore } from "../store/useAdminStore";

const MemberManagement = ({ onAddUser }) => {
  const { users, payments, deleteUser, updateUser } = useAdminStore();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [openMenuRowId, setOpenMenuRowId] = useState(null);

  React.useEffect(() => {
    const handleClickOutside = () => setOpenMenuRowId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const success = await updateUser(editFormData.id || editFormData.memberId, editFormData);
    if (success) {
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
            {[...users].sort((a, b) => {
              if (!a.expiryDate) return 1;
              if (!b.expiryDate) return -1;
              return new Date(a.expiryDate) - new Date(b.expiryDate);
            }).map(u => (
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
                <td style={{ position: 'relative' }}>
                  <div onClick={e => e.stopPropagation()}>
                    <button className="btn-icon" onClick={(e) => { 
                      e.stopPropagation(); 
                      setOpenMenuRowId(openMenuRowId === (u.id || u.memberId) ? null : (u.id || u.memberId)); 
                    }}>
                      <MoreVertical size={16} />
                    </button>

                    {openMenuRowId === (u.id || u.memberId) && (
                      <div className="action-dropdown" style={{
                        position: 'absolute', right: '40px', top: '10px',
                        background: 'var(--card-bg, #1e293b)', border: '1px solid var(--border-color)',
                        borderRadius: '8px', padding: '4px 0', zIndex: 100, minWidth: '120px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)', overflow: 'hidden'
                      }}>
                        <div className="dropdown-item" onClick={() => { setSelectedUser(u); setOpenMenuRowId(null); }}>
                          <Eye size={14} style={{ marginRight: '8px' }} /> View
                        </div>
                        <div className="dropdown-item" onClick={() => { setEditFormData(u); setIsEditModalOpen(true); setOpenMenuRowId(null); }}>
                          <Edit2 size={14} style={{ marginRight: '8px' }} /> Edit
                        </div>
                        <div className="dropdown-item text-danger" onClick={() => { deleteUser(u.id || u.memberId); setOpenMenuRowId(null); }}>
                          <Trash2 size={14} style={{ marginRight: '8px' }} /> Delete
                        </div>
                      </div>
                    )}
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
          <div className="pay-slip-drawer animate-in">
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

            <div className="profile-grid">
              <div className="slip-section">
                <h5><User size={14} className="mr-2" style={{marginRight: '8px'}} /> PERSONAL DETAILS</h5>
              <div className="line-item"><span>Email</span> <span>{selectedUser.email || "N/A"}</span></div>
              <div className="line-item"><span>Mobile</span> <span>{selectedUser.phone || selectedUser.mobileNumber || "N/A"}</span></div>
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
              <div className="line-item"><span>Expiry Date</span> <span className="text-danger">{selectedUser.expiryDate ? selectedUser.expiryDate.split('T')[0] : "-"}</span></div>
            </div>

            {(() => {
              const userPayments = [...(payments?.filter(p => p.user?.fullName === selectedUser.fullName || p.userId === selectedUser.id) || [])].sort((a, b) => new Date(a.paymentDate) - new Date(b.paymentDate));
              const firstPayment = userPayments.length > 0 ? userPayments[0] : null;
              
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
            </div>

            <button className="btn-outline w-100 mt-3" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} onClick={() => { setEditFormData(selectedUser); setIsEditModalOpen(true); setSelectedUser(null); }}>
              Edit User Details <ChevronRight size={16} />
            </button>
          </div>

          {/* Edit Modal */}
          {isEditModalOpen && (
            <div className="modal-overlay" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div className="modal-content animate-in" style={{background: 'var(--card-bg, #1e293b)', padding: '24px', borderRadius: '16px', width: '450px', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                  <h3 style={{margin: 0, display: 'flex', alignItems: 'center', gap: '8px'}}><User size={20}/> Edit User Details</h3>
                  <button onClick={() => setIsEditModalOpen(false)} style={{background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'}}><X size={20}/></button>
                </div>
                
                <form onSubmit={handleEditSubmit}>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                    <div style={{display: 'flex', gap: '16px'}}>
                      <div style={{flex: 1}}>
                        <label style={{display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>FULL NAME</label>
                        <input 
                          type="text" 
                          value={editFormData.fullName || ''} 
                          onChange={e => setEditFormData({...editFormData, fullName: e.target.value})}
                          style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px'}}
                        />
                      </div>
                      <div style={{flex: 1}}>
                        <label style={{display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>EMAIL ADDRESS</label>
                        <input 
                          type="email" 
                          value={editFormData.email || ''} 
                          onChange={e => setEditFormData({...editFormData, email: e.target.value})}
                          style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px'}}
                        />
                      </div>
                    </div>

                    <div style={{display: 'flex', gap: '16px'}}>
                      <div style={{flex: 1}}>
                        <label style={{display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>PHONE NUMBER</label>
                        <input 
                          type="tel" 
                          value={editFormData.phone || editFormData.mobileNumber || ''} 
                          onChange={e => setEditFormData({...editFormData, phone: e.target.value, mobileNumber: e.target.value})}
                          style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px'}}
                        />
                      </div>
                      <div style={{flex: 1}}>
                        <label style={{display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>CITY</label>
                        <input 
                          type="text" 
                          value={editFormData.city || ''} 
                          onChange={e => setEditFormData({...editFormData, city: e.target.value})}
                          style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px'}}
                        />
                      </div>
                    </div>

                    <div style={{display: 'flex', gap: '16px'}}>
                      <div style={{flex: 1}}>
                        <label style={{display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>GENDER</label>
                        <select 
                          value={editFormData.gender || ''} 
                          onChange={e => setEditFormData({...editFormData, gender: e.target.value})}
                          style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px'}}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div style={{flex: 1}}>
                        <label style={{display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>DATE OF BIRTH</label>
                        <input 
                          type="date" 
                          value={editFormData.dob || ''} 
                          onChange={e => {
                            const newDob = e.target.value;
                            let ageNum = 0;
                            if (newDob) {
                              const birthDate = new Date(newDob);
                              const today = new Date();
                              ageNum = today.getFullYear() - birthDate.getFullYear();
                              const m = today.getMonth() - birthDate.getMonth();
                              if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) ageNum--;
                            }
                            setEditFormData({...editFormData, dob: newDob, age: ageNum.toString()});
                          }}
                          style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px', colorScheme: 'dark'}}
                        />
                      </div>
                    </div>

                    <div style={{display: 'flex', gap: '16px'}}>
                      <div style={{flex: 1}}>
                        <label style={{display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>HEIGHT (cm)</label>
                        <input 
                          type="number" 
                          value={editFormData.height || ''} 
                          onChange={e => {
                            const h = e.target.value;
                            let newBmi = editFormData.bmi;
                            if (h && editFormData.weight) {
                              const hM = parseFloat(h) / 100;
                              const wK = parseFloat(editFormData.weight);
                              if (hM > 0 && wK > 0) newBmi = (wK / (hM * hM)).toFixed(1).toString();
                            }
                            setEditFormData({...editFormData, height: h, bmi: newBmi});
                          }}
                          style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px'}}
                        />
                      </div>
                      <div style={{flex: 1}}>
                        <label style={{display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>WEIGHT (kg)</label>
                        <input 
                          type="number" 
                          value={editFormData.weight || ''} 
                          onChange={e => {
                            const w = e.target.value;
                            let newBmi = editFormData.bmi;
                            if (editFormData.height && w) {
                              const hM = parseFloat(editFormData.height) / 100;
                              const wK = parseFloat(w);
                              if (hM > 0 && wK > 0) newBmi = (wK / (hM * hM)).toFixed(1).toString();
                            }
                            setEditFormData({...editFormData, weight: w, bmi: newBmi});
                          }}
                          style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px'}}
                        />
                      </div>
                    </div>

                    <div style={{display: 'flex', gap: '16px'}}>
                      <div style={{flex: 1}}>
                        <label style={{display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>BLOOD GROUP</label>
                        <select 
                          value={editFormData.bloodGroup || ''} 
                          onChange={e => setEditFormData({...editFormData, bloodGroup: e.target.value})}
                          style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px'}}
                        >
                          <option value="">Select</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>
                      <div style={{flex: 1}}>
                        <label style={{display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>FITNESS GOAL</label>
                        <select 
                          value={editFormData.fitnessGoal || ''} 
                          onChange={e => setEditFormData({...editFormData, fitnessGoal: e.target.value})}
                          style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px'}}
                        >
                          <option value="Weight Loss">Weight Loss</option>
                          <option value="Weight Gain">Weight Gain</option>
                          <option value="Muscle Building">Muscle Building</option>
                          <option value="General Fitness">General Fitness</option>
                        </select>
                      </div>
                    </div>

                    <div style={{display: 'flex', gap: '16px'}}>
                      <div style={{flex: 1}}>
                        <label style={{display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>PLAN NAME</label>
                        <input 
                          type="text" 
                          value={editFormData.membershipPlan || editFormData.membershipType || ''} 
                          onChange={e => {
                            const newPlan = e.target.value;
                            let newExpiry = null;
                            if (editFormData.startDate && newPlan) {
                              const start = new Date(editFormData.startDate);
                              if (!isNaN(start.getTime())) {
                                const expiry = new Date(start);
                                const planLower = newPlan.toLowerCase();
                                if (planLower.includes("monthly") || planLower === "1 month") expiry.setMonth(expiry.getMonth() + 1);
                                else if (planLower.includes("quarterly") || planLower.includes("quaterly") || planLower === "3 months") expiry.setMonth(expiry.getMonth() + 3);
                                else if (planLower.includes("half-yearly") || planLower.includes("half yearly") || planLower === "6 months") expiry.setMonth(expiry.getMonth() + 6);
                                else if (planLower.includes("annual") || planLower.includes("yearly") || planLower === "1 year") expiry.setFullYear(expiry.getFullYear() + 1);
                                
                                newExpiry = `${expiry.getFullYear()}-${String(expiry.getMonth() + 1).padStart(2, '0')}-${String(expiry.getDate()).padStart(2, '0')}`;
                              }
                            }
                            setEditFormData({...editFormData, membershipPlan: newPlan, ...(newExpiry ? {expiryDate: newExpiry} : {})});
                          }}
                          style={{width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px'}}
                        />
                      </div>
                    </div>
                    
                    <div style={{display: 'flex', gap: '16px'}}>
                      <div style={{flex: 1}}>
                        <label style={{display: 'block', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)'}}>START DATE</label>
                        <input 
                          type="date" 
                          value={editFormData.startDate || ''} 
                          onChange={e => {
                            const newStart = e.target.value;
                            const plan = editFormData.membershipPlan || editFormData.membershipType;
                            let newExpiry = null;
                            if (newStart && plan) {
                              const start = new Date(newStart);
                              if (!isNaN(start.getTime())) {
                                const expiry = new Date(start);
                                const planLower = plan.toLowerCase();
                                if (planLower.includes("monthly") || planLower === "1 month") expiry.setMonth(expiry.getMonth() + 1);
                                else if (planLower.includes("quarterly") || planLower.includes("quaterly") || planLower === "3 months") expiry.setMonth(expiry.getMonth() + 3);
                                else if (planLower.includes("half-yearly") || planLower.includes("half yearly") || planLower === "6 months") expiry.setMonth(expiry.getMonth() + 6);
                                else if (planLower.includes("annual") || planLower.includes("yearly") || planLower === "1 year") expiry.setFullYear(expiry.getFullYear() + 1);
                                
                                newExpiry = `${expiry.getFullYear()}-${String(expiry.getMonth() + 1).padStart(2, '0')}-${String(expiry.getDate()).padStart(2, '0')}`;
                              }
                            }
                            setEditFormData({...editFormData, startDate: newStart, ...(newExpiry ? {expiryDate: newExpiry} : {})});
                          }}
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

  .dropdown-item {
    padding: 10px 16px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    color: var(--text-color);
    &:hover { background: rgba(255,255,255,0.05); }
    &.text-danger { color: #ef4444; }
    &.text-danger:hover { background: rgba(239, 68, 68, 0.1); }
  }

  /* Drawer Styles */
  .drawer-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 9998;
  }
  .pay-slip-drawer {
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    background: var(--card-bg, #1e293b); width: 90%; max-width: 900px; max-height: 90vh; z-index: 9999;
    border-radius: 16px; border: 1px solid var(--border-color);
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    display: flex; flex-direction: column; overflow-y: auto; padding: 32px; color: var(--text-color);
    
    .drawer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid var(--border-color); padding-bottom: 16px; h3 { margin: 0; } button { background: none; border: none; color: inherit; cursor: pointer; } }
    .slip-profile { display: flex; gap: 20px; align-items: center; margin-bottom: 30px; }
    .big-avatar { background: var(--accent-glow); color: var(--accent-color); display: flex; align-items: center; justify-content: center; border-radius: 50%; width: 70px !important; height: 70px !important; font-size: 1.8rem !important; }
    .info h4 { margin: 0 0 4px 0; font-size: 1.5rem; } .info p { margin: 0; color: var(--text-muted); font-size: 0.9rem; }
    
    .profile-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .slip-section {
      background: rgba(0,0,0,0.2); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 0;
      h5 { margin: 0 0 16px 0; font-size: 0.85rem; color: var(--accent-color); letter-spacing: 1px; display: flex; align-items: center; }
      .line-item { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.9rem; span:first-child { color: var(--text-muted); } }
      .line-item:last-child { margin-bottom: 0; }
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
