import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { User, Mail, Lock, UserPlus, LogIn, Fingerprint, Clock, ShieldCheck, ShieldAlert } from "lucide-react";

const API_BASE = "https://gymj-9.onrender.com/api";

const Login = () => {
  const navigate = useNavigate();
  const [isNewUser, setIsNewUser] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginMethod, setLoginMethod] = useState("password"); // "password" or "biometric"
  const [biometricState, setBiometricState] = useState("idle"); // idle, scanning, success, error
  const [isEnrolled, setIsEnrolled] = useState(false); // Track if finger scanned during signup
  const [attendanceLog, setAttendanceLog] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBiometricEnroll = () => {
    setBiometricState("scanning");
    setTimeout(() => {
      setBiometricState("success");
      setIsEnrolled(true);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isNewUser && !isEnrolled) {
      setError("Please scan your fingerprint to enroll before creating an account.");
      return;
    }
    setError("");

    // Forgot password flow (no API yet)
    if (isForgotPassword) {
      alert("Password reset link sent to: " + formData.email);
      setIsForgotPassword(false);
      return;
    }

    // Validate confirm password for new users
    if (isNewUser && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      if (isNewUser) {
        // ── CREATE ACCOUNT ── POST /api/users/register
        const res = await fetch(`${API_BASE}/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: formData.name,
            email: formData.email,
            password: formData.password,
            membershipType: "Monthly",
            status: "ACTIVE"
          })
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Registration failed. Please try again.");
          return;
        }

        // Store user info in localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userName", data.fullName);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userRole", data.role); // Store role

        // Store for biometric recognition simulation
        localStorage.setItem("lastEnrolledEmail", formData.email);
        alert("Account created and Fingerprint Enrolled successfully! Welcome to GymDash 🎉");
        navigate(data.role === "ADMIN" ? "/AdminDashboard" : "/subscription");
        window.location.reload();

      } else {
        // ── LOGIN ── POST /api/users/login
        const res = await fetch(`${API_BASE}/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Invalid email or password.");
          return;
        }

        // Store user info in localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userName", data.fullName);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userRole", data.role); // Store role

        navigate(data.role === "ADMIN" ? "/AdminDashboard" : "/userdashboard");
        window.location.reload();
      }
    } catch (err) {
      setError("Cannot connect to server. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricScan = async () => {
    // If not identifying by email, simulate "Recognition" of a nearby enrolled finger
    setBiometricState("scanning");
    setError("");

    // Simulate network delay for scan and recognition
    setTimeout(async () => {
      try {
        const checkRes = await fetch(`${API_BASE}/users`);
        const users = await checkRes.json();
        
        let user;
        if (formData.email) {
          user = users.find(u => u.email === formData.email);
        } else {
          // Simulate "Recognizing" the last enrolled user on this device
          const lastEnrolled = localStorage.getItem("lastEnrolledEmail");
          user = users.find(u => u.email === lastEnrolled);
        }

        if (!user) {
          setBiometricState("error");
          setError(formData.email ? "Fingerprint profile not found." : "Fingerprint not recognized. Please identify by email first.");
          return;
        }

        // ── MEMBERSHIP CHECK ──
        if (user.status !== "ACTIVE") {
          setBiometricState("error");
          setError("ACCESS DENIED: Membership expired or payment pending.");
          return;
        }

        // ── ATTENDANCE LOGIC ──
        const now = new Date();
        const timestamp = now.toLocaleTimeString();
        const dateKey = now.toLocaleDateString();
        
        // Record attendance in localStorage for this session
        const currentAttendance = JSON.parse(localStorage.getItem("attendance") || "{}");
        if (!currentAttendance[dateKey]) {
          currentAttendance[dateKey] = { entry: timestamp, exit: null };
          setAttendanceLog(`Entry recorded at ${timestamp}`);
        } else if (!currentAttendance[dateKey].exit) {
          currentAttendance[dateKey].exit = timestamp;
          setAttendanceLog(`Exit recorded at ${timestamp}`);
        } else {
          setAttendanceLog("You have already completed your session for today.");
        }
        localStorage.setItem("attendance", JSON.stringify(currentAttendance));

        setBiometricState("success");
        
        // Store user info
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userName", user.fullName);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userRole", user.role);

        setTimeout(() => {
          navigate(user.role === "ADMIN" ? "/AdminDashboard" : "/userdashboard");
          window.location.reload();
        }, 1500);

      } catch (err) {
        setBiometricState("error");
        setError("Biometric server timeout. Try again.");
      }
    }, 2000);
  };

  return (
    <Container>
      <AuthCard>
        <div className="tabs">
          <Tab active={loginMethod === "password"} onClick={() => setLoginMethod("password")}>
            <LogIn size={18} /> Password
          </Tab>
          <Tab active={loginMethod === "biometric"} onClick={() => setLoginMethod("biometric")}>
            <Fingerprint size={18} /> Biometric
          </Tab>
        </div>
        <FormContent>
          {isForgotPassword ? (
            <>
              <h2>Reset Password</h2>
              <p className="subtitle">Enter your email and we'll send you a link to reset your password.</p>
              <form onSubmit={handleSubmit}>
                <InputGroup>
                  <label><Mail size={16} /> Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="john@example.com" 
                    required 
                    onChange={handleInputChange}
                  />
                </InputGroup>
                <SubmitButton type="submit">Send Reset Link</SubmitButton>
                <div className="forgot-password">
                  <a href="#" onClick={(e) => { e.preventDefault(); setIsForgotPassword(false); }}>
                    Back to Login
                  </a>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2>{isNewUser ? "Join the Elite" : "Welcome Back"}</h2>
              <p className="subtitle">
                {isNewUser 
                  ? "Start your fitness journey with GymDash today." 
                  : "Login to access your personalized dashboard."}
              </p>

              {loginMethod === "password" && (
                <form onSubmit={handleSubmit}>
                  {isNewUser && (
                    <InputGroup>
                      <label><User size={16} /> Full Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        placeholder="John Doe" 
                        required 
                        onChange={handleInputChange}
                      />
                    </InputGroup>
                  )}

                  <InputGroup>
                    <label><Mail size={16} /> Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="john@example.com" 
                      required 
                      onChange={handleInputChange}
                    />
                  </InputGroup>

                  <InputGroup>
                    <div className="label-row">
                      <label><Lock size={16} /> Password</label>
                      <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); setIsForgotPassword(true); }}>
                        Forgot?
                      </a>
                    </div>
                    <input 
                      type="password" 
                      name="password" 
                      placeholder="••••••••" 
                      required 
                      onChange={handleInputChange}
                    />
                  </InputGroup>

                  {isNewUser && (
                    <>
                      <InputGroup>
                        <label><Lock size={16} /> Confirm Password</label>
                        <input 
                          type="password" 
                          name="confirmPassword" 
                          placeholder="••••••••" 
                          required 
                          onChange={handleInputChange}
                        />
                      </InputGroup>

                      <InputGroup>
                      <label><Fingerprint size={16} /> Biometric Enrollment</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#1a1a1a', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <div className={`scanner-small ${isEnrolled ? 'success' : biometricState === 'scanning' ? 'scanning' : ''}`}>
                            <Fingerprint size={24} color={isEnrolled ? "#4caf50" : "#ffc107"} />
                          </div>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: isEnrolled ? '#4caf50' : '#888' }}>
                            {isEnrolled ? 'Fingerprint Enrolled!' : 'Scan finger to complete registration'}
                          </p>
                        </div>
                        {!isEnrolled && (
                          <ScanButton 
                            type="button" 
                            onClick={handleBiometricEnroll}
                            disabled={biometricState === "scanning"}
                            style={{ padding: '8px', fontSize: '0.8rem' }}
                          >
                            {biometricState === "scanning" ? "Scanning..." : "Scan to Enroll"}
                          </ScanButton>
                        )}
                      </div>
                    </InputGroup>
                    </>
                  )}

                  {error && loginMethod === "password" && (
                    <ErrorBox>{error}</ErrorBox>
                  )}

                  <SubmitButton 
                    type="submit" 
                    disabled={loading || (isNewUser && !isEnrolled)}
                  >
                    {loading
                      ? (isNewUser ? "Creating Account..." : "Logging in...")
                      : (isNewUser ? "Create Account" : "Login to GymDash")
                    }
                  </SubmitButton>
                </form>
              )}

              {loginMethod === "biometric" && (
                <BiometricSection>
                  <div className="fingerprint-container">
                    <div className={`scanner ${biometricState}`}>
                      <Fingerprint size={80} className="icon" />
                      <div className="scan-line"></div>
                    </div>
                  </div>

                  <div className="status-info">
                    {biometricState === "idle" && <p>Place your finger on the scanner</p>}
                    {biometricState === "scanning" && <p className="scanning-text">Scanning Biometrics...</p>}
                    {biometricState === "success" && (
                      <div className="success-msg">
                        <ShieldCheck color="#4caf50" size={24} />
                        <p>Access Granted! {attendanceLog}</p>
                      </div>
                    )}
                    {biometricState === "error" && (
                      <div className="error-msg">
                        <ShieldAlert color="#ff5252" size={24} />
                        <p>{error}</p>
                      </div>
                    )}
                  </div>

                  <InputGroup style={{ marginTop: '20px' }}>
                    <label><Mail size={16} /> Identify Email (Optional)</label>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Auto-recognition enabled" 
                      onChange={handleInputChange}
                    />
                    <p style={{ fontSize: '0.75rem', color: '#555', marginTop: '8px' }}>If scan fails, enter email to identify</p>
                  </InputGroup>

                  <ScanButton 
                    onClick={handleBiometricScan} 
                    disabled={biometricState === "scanning"}
                  >
                    {biometricState === "scanning" ? "Verifying..." : "Scan Fingerprint"}
                  </ScanButton>
                </BiometricSection>
              )}
              
              <div className="auth-footer">
                {!isNewUser ? (
                  <a href="#" onClick={(e) => { e.preventDefault(); setIsNewUser(true); }}>
                    New User? Create Account
                  </a>
                ) : (
                  <a href="#" onClick={(e) => { e.preventDefault(); setIsNewUser(false); }}>
                    Already have an account? Login
                  </a>
                )}
              </div>
            </>
          )}
        </FormContent>
      </AuthCard>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0a;
  background-image: radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 100%);
  padding: 20px;
`;

const AuthCard = styled.div`
  background: #111;
  width: 100%;
  max-width: 450px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);

  .tabs {
    display: flex;
    background: #1a1a1a;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const Tab = styled.button`
  flex: 1;
  padding: 20px;
  border: none;
  background: ${props => props.active ? "#111" : "transparent"};
  color: ${props => props.active ? "#ffc107" : "#888"};
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: #ffc107;
    transform: scaleX(${props => props.active ? 1 : 0});
    transition: transform 0.3s ease;
  }

  &:hover {
    color: ${props => props.active ? "#ffc107" : "#fff"};
  }
`;

const FormContent = styled.div`
  padding: 40px;

  h2 {
    color: #fff;
    font-size: 1.8rem;
    font-weight: 800;
    margin-bottom: 10px;
  }

  .subtitle {
    color: #888;
    margin-bottom: 35px;
    font-size: 0.95rem;
  }

  .auth-footer {
    text-align: center;
    margin-top: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    
    a {
      color: #888;
      text-decoration: none;
      font-size: 0.85rem;
      transition: color 0.3s ease;
      &:hover { color: #ffc107; }
    }

    .divider {
      color: #333;
      font-size: 0.8rem;
    }
  }

  @media (max-width: 480px) {
    padding: 28px 20px;
    h2 { font-size: 1.5rem; }
    .subtitle { margin-bottom: 24px; font-size: 0.88rem; }
  }
`;

const InputGroup = styled.div`
  margin-bottom: 25px;

  .label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #ccc;
    font-size: 0.85rem;
    font-weight: 600;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .forgot-link {
    font-size: 0.75rem;
    color: #ffc107;
    text-decoration: none;
    font-weight: 600;
    &:hover { text-decoration: underline; }
  }

  input {
    width: 100%;
    background: #1a1a1a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 12px;
    color: #fff;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #ffc107;
      background: #222;
      box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.1);
    }

    &::placeholder {
      color: #555;
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: #ffc107;
  color: #000;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover {
    background: #ffca2c;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 193, 7, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorBox = styled.div`
  background: rgba(220, 53, 69, 0.15);
  border: 1px solid rgba(220, 53, 69, 0.4);
  color: #ff6b6b;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.88rem;
  margin-bottom: 15px;
  text-align: center;
`;

const BiometricSection = styled.div`
  text-align: center;
  padding: 20px 0;

  .fingerprint-container {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
  }

  .scanner {
    width: 140px;
    height: 140px;
    background: #1a1a1a;
    border: 2px solid #333;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;

    .icon {
      color: #333;
      transition: all 0.3s ease;
    }

    .scan-line {
      position: absolute;
      top: -100%;
      left: 0;
      width: 100%;
      height: 4px;
      background: #ffc107;
      box-shadow: 0 0 15px #ffc107;
      display: none;
    }

    &.scanning {
      border-color: #ffc107;
      .icon { color: #ffc107; animation: pulse 1.5s infinite; }
      .scan-line {
        display: block;
        animation: scan 2s linear infinite;
      }
    }

    &.success {
      border-color: #4caf50;
      background: rgba(76, 175, 80, 0.1);
      .icon { color: #4caf50; }
    }

    &.error {
      border-color: #ff5252;
      background: rgba(255, 82, 82, 0.1);
      .icon { color: #ff5252; }
    }
  }

  .status-info {
    min-height: 60px;
    p { margin: 0; color: #888; font-weight: 500; }
    .scanning-text { color: #ffc107; font-weight: 700; }
    .success-msg, .error-msg {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      p { color: #fff; font-size: 0.9rem; }
    }
    .error-msg p { color: #ff5252; }
  }

  @keyframes scan {
    0% { top: 0%; }
    100% { top: 100%; }
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.7; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const ScanButton = styled(SubmitButton)`
  background: transparent;
  border: 2px solid #ffc107;
  color: #ffc107;
  &:hover {
    background: #ffc107;
    color: #000;
  }
`;

export default Login;
