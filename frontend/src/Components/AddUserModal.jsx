import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { X, User, Heart, CreditCard, Calendar, Fingerprint } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../api/axiosInstance";
import log from "../utils/logger";
import toast from "react-hot-toast";

// ── Validation Schema ─────────────────────────────────────────────────────────
const userSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens and apostrophes"),
  gender: z.string().min(1, "Select a gender"),
  dob: z.string().min(1, "Date of birth is required"),
  age: z.string().optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-().]{7,15}$/, "Enter a valid phone number (7–15 digits)"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  city: z.string().optional(),

  height: z.string().optional(),
  weight: z.string().optional(),
  bmi: z.string().optional(),
  bloodGroup: z.string().optional(),
  fitnessGoal: z.string().optional(),

  membershipPlan: z.string().min(1, "Select a plan"),
  startDate: z.string().min(1, "Start date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  referralSource: z.string().optional(),

  paymentAmount: z
    .string()
    .min(1, "Payment amount is required")
    .refine((v) => !isNaN(parseFloat(v)), "Must be a valid number"),
  paymentMode: z.string().min(1, "Select payment mode"),
  transactionRef: z.string().optional(),
});

// ── Component ─────────────────────────────────────────────────────────────────
const AddUserModal = ({ isOpen, onClose, onAddUser }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [plans, setPlans] = useState([]);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const generatedId = useRef(`MBR-${Math.floor(Math.random() * 90000) + 10000}`);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    trigger,
    formState: { errors, touchedFields },
  } = useForm({
    resolver: zodResolver(userSchema),
    mode: "onTouched",
    shouldUnregister: false,
    defaultValues: {
      fullName: "",
      gender: "",
      dob: "",
      age: "",
      phone: "",
      email: "",
      password: "",
      city: "",
      height: "",
      weight: "",
      bmi: "",
      bloodGroup: "",
      fitnessGoal: "General Fitness",
      membershipPlan: "Monthly",
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: "",
      referralSource: "Walk-In",
      paymentAmount: "",
      paymentMode: "Cash",
      transactionRef: "",
    }
  });

  const dob = watch("dob");
  const height = watch("height");
  const weight = watch("weight");
  const email = watch("email");
  const fullName = watch("fullName");
  const membershipPlan = watch("membershipPlan");
  const startDate = watch("startDate");

  useEffect(() => {
    if (isOpen) {
      axiosInstance.get('/membership-plans')
        .then(res => setPlans(res.data))
        .catch(err => log.error("Failed to fetch plans", err));
        
      let script = document.getElementById("razorpay-checkout-js");
      if (!script) {
        script = document.createElement("script");
        script.id = "razorpay-checkout-js";
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => setRazorpayLoaded(true);
        document.body.appendChild(script);
      } else {
        setRazorpayLoaded(true);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (membershipPlan && plans.length > 0) {
      const selectedPlan = plans.find(p => p.title === membershipPlan);
      if (selectedPlan && selectedPlan.price && selectedPlan.price.toLowerCase() !== "custom") {
        setValue("paymentAmount", selectedPlan.price.toString(), { shouldValidate: true });
      }
    }
  }, [membershipPlan, plans, setValue]);

  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let ageNum = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        ageNum--;
      }
      setValue("age", ageNum.toString(), { shouldValidate: true });
    }
  }, [dob, setValue]);

  useEffect(() => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      if (heightInMeters > 0 && weightInKg > 0) {
        const calculatedBmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
        setValue("bmi", calculatedBmi.toString(), { shouldValidate: true });
      }
    }
  }, [height, weight, setValue]);

  useEffect(() => {
    if (startDate && membershipPlan) {
      const start = new Date(startDate);
      if (!isNaN(start.getTime())) {
        const expiry = new Date(start);
        
        switch (membershipPlan) {
          case "Monthly":
            expiry.setMonth(expiry.getMonth() + 1);
            break;
          case "Quarterly":
            expiry.setMonth(expiry.getMonth() + 3);
            break;
          case "Half-Yearly":
            expiry.setMonth(expiry.getMonth() + 6);
            break;
          case "Annual":
            expiry.setFullYear(expiry.getFullYear() + 1);
            break;
          default:
            break;
        }
        
        const yyyy = expiry.getFullYear();
        const mm = String(expiry.getMonth() + 1).padStart(2, '0');
        const dd = String(expiry.getDate()).padStart(2, '0');
        const formattedExpiry = `${yyyy}-${mm}-${dd}`;
        
        setValue("expiryDate", formattedExpiry, { shouldValidate: true });
      }
    }
  }, [startDate, membershipPlan, setValue]);



  const handleNext = async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) fieldsToValidate = ["fullName", "gender", "dob", "phone", "email", "password", "city"];
    else if (currentStep === 2) fieldsToValidate = ["height", "weight", "bloodGroup", "fitnessGoal"];
    else if (currentStep === 3) fieldsToValidate = ["membershipPlan", "startDate", "expiryDate", "referralSource"];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.error("Please fix the errors before proceeding.");
    }
  };

  const onSubmit = (data) => {
    const completeData = {
      ...data,
      memberId: generatedId.current,
      membershipStatus: "Active",
      discountApplied: "0",
    };
    
    console.log("Submitting completeData to backend:", completeData);

    const onlineMethods = ["UPI", "Card", "Net Banking"];
    if (onlineMethods.includes(data.paymentMode) && !data.transactionRef) {
      if (!razorpayLoaded) {
        toast.error("Payment gateway is loading. Please try again.");
        return;
      }
      
      const prefillData = {};
      if (data.fullName) prefillData.name = data.fullName;
      if (data.email) prefillData.email = data.email;
      if (data.phone) prefillData.contact = data.phone;
      
      const options = {
        key: "rzp_test_T5P2c2t4n8vCwb",
        amount: Math.round(Number(data.paymentAmount) * 100), 
        currency: "INR",
        name: "B&Y Fitness Gym",
        description: `Payment for ${data.membershipPlan || 'Membership'}`,
        handler: function (response) {
          completeData.transactionRef = response.razorpay_payment_id;
          onAddUser(completeData);
          onClose();
        },
        prefill: prefillData,
        theme: {
          color: "#38bdf8",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response){
          toast.error("Payment Failed: " + response.error.description);
      });
      paymentObject.open();
    } else {
      onAddUser(completeData);
      onClose();
    }
  };

  const handleManualPay = () => {
    const data = getValues();
    const onlineMethods = ["UPI", "Card", "Net Banking"];
    
    if (!data.paymentAmount || isNaN(data.paymentAmount)) {
      toast.error("Please enter a valid payment amount first.");
      return;
    }
    
    if (!onlineMethods.includes(data.paymentMode)) {
      toast.error("Please select an online payment mode (UPI, Card, Net Banking) to use Razorpay.");
      return;
    }
    
    if (!razorpayLoaded) {
      toast.error("Payment gateway is loading. Please try again.");
      return;
    }
    
    const prefillData = {};
    if (data.fullName) prefillData.name = data.fullName;
    if (data.email) prefillData.email = data.email;
    if (data.phone) prefillData.contact = data.phone;

    const options = {
      key: "rzp_test_T5P2c2t4n8vCwb",
      amount: Math.round(Number(data.paymentAmount) * 100), 
      currency: "INR",
      name: "B&Y Fitness Gym",
      description: `Payment for ${data.membershipPlan || 'Membership'}`,
      handler: function (response) {
        setValue("transactionRef", response.razorpay_payment_id, { shouldValidate: true });
        toast.success("Payment successful! You can now complete the registration.");
      },
      prefill: prefillData,
      theme: {
        color: "#38bdf8",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', function (response){
        toast.error("Payment Failed: " + response.error.description);
    });
    paymentObject.open();
  };

  if (!isOpen) return null;

  const renderStepContent = () => {
    return (
      <>
        <div style={{ display: currentStep === 1 ? 'block' : 'none' }} className="form-section animate-in">
            <h4><User size={18} /> Personal Details</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Member ID (Auto Generated)</label>
                <input type="text" value={generatedId.current} readOnly className="read-only" />
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" $hasError={!!errors.fullName} {...register("fullName")} />
                {errors.fullName && <p className="error-text">⚠ {errors.fullName.message}</p>}
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select $hasError={!!errors.gender} {...register("gender")}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="error-text">⚠ {errors.gender.message}</p>}
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" $hasError={!!errors.dob} {...register("dob")} />
                {errors.dob && <p className="error-text">⚠ {errors.dob.message}</p>}
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="text" {...register("age")} readOnly className="read-only" />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input type="tel" placeholder="+91 98765 43210" $hasError={!!errors.phone} {...register("phone")} />
                {errors.phone && <p className="error-text">⚠ {errors.phone.message}</p>}
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" $hasError={!!errors.email} {...register("email")} />
                {errors.email && <p className="error-text">⚠ {errors.email.message}</p>}
              </div>
              <div className="form-group">
                <label>Login Password</label>
                <input type="text" placeholder="Initial Password" $hasError={!!errors.password} {...register("password")} />
                {errors.password && <p className="error-text">⚠ {errors.password.message}</p>}
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" placeholder="New York" $hasError={!!errors.city} {...register("city")} />
                {errors.city && <p className="error-text">⚠ {errors.city.message}</p>}
              </div>

            </div>
          </div>
        <div style={{ display: currentStep === 2 ? 'block' : 'none' }} className="form-section animate-in">
            <h4><Heart size={18} /> Health Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Height (cm)</label>
                <input type="number" placeholder="175" $hasError={!!errors.height} {...register("height")} />
                {errors.height && <p className="error-text">⚠ {errors.height.message}</p>}
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input type="number" placeholder="70" $hasError={!!errors.weight} {...register("weight")} />
                {errors.weight && <p className="error-text">⚠ {errors.weight.message}</p>}
              </div>
              <div className="form-group">
                <label>BMI</label>
                <input type="text" {...register("bmi")} readOnly className="read-only" />
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <select $hasError={!!errors.bloodGroup} {...register("bloodGroup")}>
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
                {errors.bloodGroup && <p className="error-text">⚠ {errors.bloodGroup.message}</p>}
              </div>
              <div className="form-group full-width">
                <label>Fitness Goal</label>
                <select $hasError={!!errors.fitnessGoal} {...register("fitnessGoal")}>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Weight Gain">Weight Gain</option>
                  <option value="Muscle Building">Muscle Building</option>
                  <option value="General Fitness">General Fitness</option>
                </select>
                {errors.fitnessGoal && <p className="error-text">⚠ {errors.fitnessGoal.message}</p>}
              </div>
            </div>
          </div>
        <div style={{ display: currentStep === 3 ? 'block' : 'none' }} className="form-section animate-in">
            <h4><Calendar size={18} /> Membership Details</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Membership Plan</label>
                <select $hasError={!!errors.membershipPlan} {...register("membershipPlan")}>
                  <option value="">Select a Plan</option>
                  {plans.length > 0 ? plans.map(plan => (
                    <option key={plan.id} value={plan.title}>{plan.title} (₹{plan.price})</option>
                  )) : (
                    <>
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Half-Yearly">Half-Yearly</option>
                      <option value="Annual">Annual</option>
                    </>
                  )}
                </select>
                {errors.membershipPlan && <p className="error-text">⚠ {errors.membershipPlan.message}</p>}
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" $hasError={!!errors.startDate} {...register("startDate")} />
                {errors.startDate && <p className="error-text">⚠ {errors.startDate.message}</p>}
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input type="date" $hasError={!!errors.expiryDate} {...register("expiryDate")} />
                {errors.expiryDate && <p className="error-text">⚠ {errors.expiryDate.message}</p>}
              </div>
              <div className="form-group">
                <label>Referral Source</label>
                <select $hasError={!!errors.referralSource} {...register("referralSource")}>
                  <option value="Walk-In">Walk-In</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Referral">Referral</option>
                </select>
                {errors.referralSource && <p className="error-text">⚠ {errors.referralSource.message}</p>}
              </div>
            </div>
          </div>
        <div style={{ display: currentStep === 4 ? 'block' : 'none' }} className="form-section animate-in">
            <h4><CreditCard size={18} /> Payment Management</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Payment Amount (₹)</label>
                <input type="number" placeholder="5000" $hasError={!!errors.paymentAmount} {...register("paymentAmount")} />
                {errors.paymentAmount && <p className="error-text">⚠ {errors.paymentAmount.message}</p>}
              </div>
              <div className="form-group">
                <label>Payment Mode</label>
                <select $hasError={!!errors.paymentMode} {...register("paymentMode")}>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
                {errors.paymentMode && <p className="error-text">⚠ {errors.paymentMode.message}</p>}
              </div>
              <div className="form-group full-width">
                <label>Transaction Reference Number (If applicable)</label>
                <input type="text" placeholder="TXN123456789" $hasError={!!errors.transactionRef} {...register("transactionRef")} />
                {errors.transactionRef && <p className="error-text">⚠ {errors.transactionRef.message}</p>}
              </div>
              
              <div className="form-group full-width" style={{ marginTop: '10px' }}>
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={handleManualPay}
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                >
                  <CreditCard size={18} /> Pay with Razorpay
                </button>
              </div>
            </div>
          </div>
      </>
    );
  };

  return (
    <ModalOverlay>
      <ModalContent className="modal-large">
        <div className="modal-header">
          <h3>Enlist New Member</h3>
          <button type="button" className="close-btn" onClick={onClose}><X size={20} /></button>
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

        <form onSubmit={handleSubmit(onSubmit)} className="modal-body scrollable">
          {renderStepContent()}

          <div className="modal-footer-actions">
            {currentStep > 1 && (
              <button type="button" className="btn-outline" onClick={() => setCurrentStep(prev => prev - 1)}>Back</button>
            )}
            {currentStep < 4 ? (
              <button type="button" className="btn-primary" onClick={handleNext}>Next</button>
            ) : (
              <button type="submit" className="btn-success">Complete Registration</button>
            )}
          </div>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

// ── Styled Components ────────────────────────────────────────────────────────
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
      input[aria-invalid="true"], select[aria-invalid="true"] {
        border-color: #ef4444;
      }
      .error-text {
        color: #ef4444;
        font-size: 0.75rem;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 4px;
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
