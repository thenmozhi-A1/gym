import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { X, User, Heart, CreditCard, Calendar, Fingerprint } from "lucide-react";

const AddUserModal = ({ isOpen, onClose, onAddUser }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollProgress, setEnrollProgress] = useState(0);
  const holdTimer = useRef(null);
  const progressTimer = useRef(null);
  
  const [formData, setFormData] = useState({
    // Personal Details
    memberId: `MBR-${Math.floor(Math.random() * 90000) + 10000}`,
    fingerprintEnrolled: false,
    fingerprintHash: "",
    fullName: "",
    gender: "",
    dob: "",
    age: "",
    mobileNumber: "",
    email: "",
    address: "",
    city: "",
    state: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    
    // Health Information
    height: "",
    weight: "",
    bmi: "",
    bloodGroup: "",
    medicalConditions: "",
    allergies: "",
    fitnessGoal: "General Fitness",
    previousInjuries: "",
    doctorAdvice: "",

    // Membership Details
    membershipPlan: "Monthly",
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: "",
    membershipStatus: "Active",
    discountApplied: "0",
    referralSource: "Walk-In",

    // Payment Management
    paymentAmount: "",
    paymentMode: "Cash",
    transactionRef: "",
  });

  useEffect(() => {
    // Auto-calculate age from dob
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  }, [formData.dob]);

  useEffect(() => {
    // Auto-calculate BMI
    if (formData.height && formData.weight) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const weightInKg = parseFloat(formData.weight);
      if (heightInMeters > 0 && weightInKg > 0) {
        const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
        setFormData(prev => ({ ...prev, bmi: bmi.toString() }));
      }
    }
  }, [formData.height, formData.weight]);

  const startScan = (e) => {
    if (e) e.preventDefault();
    if (!formData.email) {
      alert("Please enter the user's email before scanning fingerprint.");
      return;
    }
    if (formData.fingerprintEnrolled) return;

    setIsEnrolling(true);
    setEnrollProgress(0);

  const bufferToBase64 = (buffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

  const startScan = async () => {
    if (!formData.email) {
      alert("Please enter email address before scanning fingerprint");
      return;
    }
    setIsEnrolling(true);
    setEnrollProgress(50);

    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const userId = new TextEncoder().encode(formData.email);
      
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "B&Y Fitness Gym", id: window.location.hostname },
          user: { id: userId, name: formData.email, displayName: formData.fullName || formData.email },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
          authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required", requireResidentKey: false },
          timeout: 60000,
          attestation: "none",
        }
      });

      const credentialId = bufferToBase64(credential.rawId);
      
      const stored = JSON.parse(localStorage.getItem("webauthnCredentials") || "{}");
      stored[formData.email] = credentialId;
      localStorage.setItem("webauthnCredentials", JSON.stringify(stored));
      localStorage.setItem("lastEnrolledEmail", formData.email);

      setEnrollProgress(100);
      setTimeout(() => {
        setFormData(prev => ({ ...prev, fingerprintEnrolled: true, fingerprintHash: credentialId }));
        setIsEnrolling(false);
      }, 500);
    } catch (err) {
      console.error(err);
      setIsEnrolling(false);
      setEnrollProgress(0);
      alert(`Biometric capture failed: ${err.message || err.name}`);
    }
  };

  const cancelScan = () => {
    clearTimeout(holdTimer.current);
    clearInterval(progressTimer.current);
    if (isEnrolling) {
      setIsEnrolling(false);
      setEnrollProgress(0);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fingerprintEnrolled) {
      alert("Biometric enrollment is required. Please capture the member's fingerprint.");
      return;
    }
    onAddUser(formData);
    onClose();
  };

  if (!isOpen) return null;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-section animate-in">
            <h4><User size={18} /> Personal Details</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Member ID (Auto Generated)</label>
                <input type="text" value={formData.memberId} readOnly className="read-only" />
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="text" name="age" value={formData.age} readOnly className="read-only" />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} />
              </div>
              
              <div className="form-group full-width" style={{ marginTop: '10px' }}>
                <label>BIOMETRIC ENROLLMENT <span style={{ color: '#ffc107', fontSize: '0.7rem', marginLeft: '10px' }}>REQUIRED FOR REGISTRATION</span></label>
                <div
                  className={`biometric-enroll-pad ${formData.fingerprintEnrolled ? 'success' : isEnrolling ? 'scanning' : ''}`}
                  onTouchStart={!formData.fingerprintEnrolled ? startScan : undefined}
                  onTouchEnd={!formData.fingerprintEnrolled ? cancelScan : undefined}
                  onMouseDown={!formData.fingerprintEnrolled ? startScan : undefined}
                  onMouseUp={!formData.fingerprintEnrolled ? cancelScan : undefined}
                  onMouseLeave={!formData.fingerprintEnrolled ? cancelScan : undefined}
                  style={{ userSelect: 'none', cursor: formData.fingerprintEnrolled ? 'default' : 'pointer', WebkitUserSelect: 'none' }}
                >
                  <div className="pad-content">
                    <Fingerprint size={32} />
                    <span>
                      {formData.fingerprintEnrolled
                        ? "✓ FINGERPRINT CAPTURED"
                        : isEnrolling
                          ? `SCANNING... ${enrollProgress}%`
                          : "PRESS & HOLD TO SCAN FINGERPRINT"}
                    </span>
                  </div>
                  {isEnrolling && <div className="progress-bar"><div className="fill" style={{ width: `${enrollProgress}%` }}></div></div>}
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-section animate-in">
            <h4><Heart size={18} /> Health Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Height (cm)</label>
                <input type="number" name="height" value={formData.height} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>BMI</label>
                <input type="text" name="bmi" value={formData.bmi} readOnly className="read-only" />
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
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
              <div className="form-group full-width">
                <label>Fitness Goal</label>
                <select name="fitnessGoal" value={formData.fitnessGoal} onChange={handleChange}>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Weight Gain">Weight Gain</option>
                  <option value="Muscle Building">Muscle Building</option>
                  <option value="General Fitness">General Fitness</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-section animate-in">
            <h4><Calendar size={18} /> Membership Details</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Membership Plan</label>
                <select name="membershipPlan" value={formData.membershipPlan} onChange={handleChange}>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Half-Yearly">Half-Yearly</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Referral Source</label>
                <select name="referralSource" value={formData.referralSource} onChange={handleChange}>
                  <option value="Walk-In">Walk-In</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="form-section animate-in">
            <h4><CreditCard size={18} /> Payment Management</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Payment Amount (₹)</label>
                <input type="number" name="paymentAmount" value={formData.paymentAmount} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Payment Mode</label>
                <select name="paymentMode" value={formData.paymentMode} onChange={handleChange}>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Transaction Reference Number (If applicable)</label>
                <input type="text" name="transactionRef" value={formData.transactionRef} onChange={handleChange} />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ModalOverlay>
      <ModalContent className="modal-large">
        <div className="modal-header">
          <h3>Enlist New Member</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="stepper">
          {[1, 2, 3, 4].map(step => (
            <div key={step} className={`step ${currentStep === step ? 'active' : currentStep > step ? 'completed' : ''}`}>
              <div className="step-circle">{step}</div>
              <span className="step-label">
                {step === 1 ? 'Personal' : step === 2 ? 'Health' : step === 3 ? 'Membership' : 'Payment'}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="modal-body scrollable">
          {renderStepContent()}
          
          <div className="modal-footer-actions">
            {currentStep > 1 && (
              <button type="button" className="btn-outline" onClick={() => setCurrentStep(prev => prev - 1)}>Back</button>
            )}
            {currentStep < 4 ? (
              <button type="button" className="btn-primary" onClick={() => setCurrentStep(prev => prev + 1)}>Next</button>
            ) : (
              <button type="submit" className="btn-success">Complete Registration</button>
            )}
          </div>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

// Reusing styles from AdminDashboard theme or local styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex; justify-content: center; alignItems: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: var(--card-bg, #1e293b);
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--border-color, #334155);
  color: var(--text-color, #f8fafc);
  
  .modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color, #334155);
    display: flex; justify-content: space-between; alignItems: center;
    h3 { margin: 0; font-size: 1.25rem; font-weight: 600; @media (max-width: 600px) { font-size: 1rem; } }
    .close-btn { background: none; border: none; color: var(--text-muted, #94a3b8); cursor: pointer; padding: 4px; }
  }

  .stepper {
    display: flex; justify-content: space-between;
    padding: 20px 40px;
    background: rgba(0,0,0,0.1);
    
    @media (max-width: 600px) {
      padding: 15px;
    }
    
    .step {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      opacity: 0.5;
      &.active { opacity: 1; .step-circle { background: var(--accent-color, #38bdf8); color: #fff; border-color: var(--accent-color, #38bdf8); } }
      &.completed { opacity: 1; .step-circle { background: #10b981; color: #fff; border-color: #10b981; } }
      
      .step-circle {
        width: 32px; height: 32px; border-radius: 50%;
        border: 2px solid var(--text-muted, #94a3b8);
        display: flex; align-items: center; justify-content: center;
        font-weight: bold; transition: all 0.3s;
      }
      .step-label { 
        font-size: 0.8rem; font-weight: 500; 
        @media (max-width: 600px) { display: none; }
      }
    }
  }

  .modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
    @media (max-width: 600px) { padding: 16px; }
    
    h4 { display: flex; alignItems: center; gap: 8px; margin-top: 0; margin-bottom: 20px; color: var(--accent-color, #38bdf8); }
    
    .form-grid {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
      .full-width { grid-column: span 2; }
      
      @media (max-width: 600px) {
        grid-template-columns: 1fr;
        .full-width { grid-column: span 1; }
      }
    }
    
    .form-group {
      display: flex; flex-direction: column; gap: 6px;
      label { font-size: 0.85rem; font-weight: 500; color: var(--text-muted, #94a3b8); }
      input, select {
        padding: 10px 12px;
        border-radius: 6px;
        border: 1px solid var(--border-color, #334155);
        background: rgba(0,0,0,0.1);
        color: inherit;
        font-family: inherit;
        &:focus { outline: none; border-color: var(--accent-color, #38bdf8); }
        &.read-only { opacity: 0.7; background: rgba(0,0,0,0.2); cursor: not-allowed; }
      }
    }
  }

  .modal-footer-actions {
    margin-top: 30px;
    display: flex; justify-content: flex-end; gap: 12px;
    padding-top: 20px; border-top: 1px solid var(--border-color, #334155);
    
    @media (max-width: 600px) {
      flex-direction: column-reverse;
      gap: 10px;
      button { width: 100%; }
    }
    
    button {
      padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer; border: none;
      &.btn-outline { background: transparent; border: 1px solid var(--border-color, #334155); color: inherit; }
      &.btn-primary { background: var(--accent-color, #38bdf8); color: #fff; }
      &.btn-success { background: #10b981; color: #fff; }
    }
  }

  .biometric-enroll-pad {
    position: relative;
    border: 2px dashed var(--border-color, #334155);
    border-radius: 12px;
    padding: 24px;
    background: rgba(0,0,0,0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    transition: all 0.3s ease;
    margin-top: 10px;

    &.scanning { border-color: var(--accent-color, #38bdf8); background: rgba(56, 189, 248, 0.05); }
    &.success { border-color: #10b981; background: rgba(16, 185, 129, 0.05); color: #10b981; }

    .pad-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      color: inherit;
      z-index: 2;

      span { font-size: 0.9rem; font-weight: 600; letter-spacing: 1px; }
    }

    .progress-bar {
      position: absolute;
      bottom: 0; left: 0; right: 0; height: 6px;
      background: rgba(255,255,255,0.1);
      .fill { height: 100%; background: var(--accent-color, #38bdf8); transition: width 0.1s linear; }
    }
  }
`;

export default AddUserModal;
