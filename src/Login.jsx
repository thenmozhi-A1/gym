import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { User, Mail, Lock, Fingerprint, ShieldCheck, ShieldAlert } from "lucide-react";

const API_BASE = "https://gymj-9.onrender.com/api";

// ── WebAuthn helpers ──────────────────────────────────────────
const bufferToBase64 = (buffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
};

const base64ToBuffer = (base64) => {
  const binary = atob(base64);
  const buf = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i);
  return buf.buffer;
};

const isWebAuthnSupported = () =>
  window.PublicKeyCredential !== undefined &&
  typeof window.PublicKeyCredential === "function";

const Login = () => {
  const navigate = useNavigate();
  const [isNewUser, setIsNewUser] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [enrollError, setEnrollError] = useState("");
  const [loginMethod, setLoginMethod] = useState("password");
  const [biometricState, setBiometricState] = useState("idle"); // idle, scanning, success, error
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [attendanceLog, setAttendanceLog] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Reset biometric states when switching views
  React.useEffect(() => {
    setBiometricState("idle");
    setIsEnrolled(false);
    setError("");
    setAttendanceLog(null);
  }, [isNewUser, isForgotPassword]);

  const handleInputChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBiometricEnroll = async () => {
    setEnrollError("");

    if (!isWebAuthnSupported()) {
      setEnrollError("Your browser or device does not support biometric authentication. Please use a modern browser on a device with a fingerprint sensor or Windows Hello.");
      return;
    }

    if (!formData.email) {
      setEnrollError("Please enter your email address first before enrolling your fingerprint.");
      return;
    }

    setBiometricState("scanning");

    try {
      // Create a random challenge
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // Encode the user email as a user ID buffer
      const userId = new TextEncoder().encode(formData.email);

      const publicKeyOptions = {
        challenge,
        rp: {
          name: "HoneyFit Gym",
          id: window.location.hostname,
        },
        user: {
          id: userId,
          name: formData.email,
          displayName: formData.name || formData.email,
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },   // ES256
          { type: "public-key", alg: -257 },  // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform", // Use built-in device authenticator (fingerprint/face)
          userVerification: "required",         // Force biometric verification
          requireResidentKey: false,
        },
        timeout: 60000,
        attestation: "none",
      };

      const credential = await navigator.credentials.create({ publicKey: publicKeyOptions });

      // Store credential ID in localStorage linked to the user's email
      const credentialId = bufferToBase64(credential.rawId);
      const stored = JSON.parse(localStorage.getItem("webauthnCredentials") || "{}");
      stored[formData.email] = credentialId;
      localStorage.setItem("webauthnCredentials", JSON.stringify(stored));
      localStorage.setItem("lastEnrolledEmail", formData.email);

      setBiometricState("success");
      setIsEnrolled(true);
    } catch (err) {
      setBiometricState("idle");
      if (err.name === "NotAllowedError") {
        setEnrollError("Fingerprint enrollment was cancelled or timed out. Please try again.");
      } else if (err.name === "InvalidStateError") {
        // Credential already registered — treat as enrolled
        setBiometricState("success");
        setIsEnrolled(true);
      } else if (err.name === "NotSupportedError") {
        setEnrollError("Your device does not have a compatible biometric sensor (fingerprint/face). Please use a device with Windows Hello or a fingerprint reader.");
      } else {
        setEnrollError(`Enrollment failed: ${err.message || err.name}. Make sure your device biometric is set up in system settings.`);
      }
    }
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
            status: "ACTIVE",
            fingerprintEnrolled: true
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
    setBiometricState("scanning");
    setError("");

    if (!isWebAuthnSupported()) {
      setBiometricState("error");
      setError("Your browser or device does not support biometric authentication.");
      return;
    }

    try {
      // ── Step 1: Determine which credential to use ──────────────
      const stored = JSON.parse(localStorage.getItem("webauthnCredentials") || "{}");
      const lastEnrolled = localStorage.getItem("lastEnrolledEmail");
      const targetEmail = formData.email || lastEnrolled;

      let allowCredentials = [];
      if (targetEmail && stored[targetEmail]) {
        allowCredentials = [{
          type: "public-key",
          id: base64ToBuffer(stored[targetEmail]),
          transports: ["internal"],
        }];
      }

      // ── Step 2: Trigger real device biometric ──────────────────
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge,
          rpId: window.location.hostname,
          allowCredentials,
          userVerification: "required",
          timeout: 60000,
        },
      });

      // ── Step 3: Match credential to a user in the backend ─────
      const assertedCredId = bufferToBase64(assertion.rawId);
      let matchedEmail = Object.keys(stored).find(email => stored[email] === assertedCredId);
      if (!matchedEmail && targetEmail) matchedEmail = targetEmail;

      if (!matchedEmail) {
        setBiometricState("error");
        setError("Fingerprint not recognized. Please enter your email to identify yourself.");
        return;
      }

      const checkRes = await fetch(`${API_BASE}/users`);
      const users = await checkRes.json();
      const user = users.find(u => u.email === matchedEmail);

      if (!user) {
        setBiometricState("error");
        setError("No account found linked to this fingerprint.");
        return;
      }

      if (!user.fingerprintEnrolled && user.role !== "ADMIN") {
        setBiometricState("error");
        setError("No biometric record found for this account. Please re-register.");
        return;
      }

      if (user.status !== "ACTIVE") {
        setBiometricState("error");
        setError("ACCESS DENIED: Membership expired or payment pending.");
        return;
      }

      // ── Step 4: Record attendance ──────────────────────────────
      const now = new Date();
      const timestamp = now.toLocaleTimeString();
      const dateKey = now.toLocaleDateString();
      const currentAttendance = JSON.parse(localStorage.getItem("attendance") || "{}");
      if (!currentAttendance[dateKey]) {
        currentAttendance[dateKey] = { entry: timestamp, exit: null };
        setAttendanceLog(`Entry recorded at ${timestamp}`);
      } else if (!currentAttendance[dateKey].exit) {
        currentAttendance[dateKey].exit = timestamp;
        setAttendanceLog(`Exit recorded at ${timestamp}`);
      } else {
        setAttendanceLog("Session for today already completed.");
      }
      localStorage.setItem("attendance", JSON.stringify(currentAttendance));

      // ── Step 5: Login ──────────────────────────────────────────
      setBiometricState("success");
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
      if (err.name === "NotAllowedError") {
        setBiometricState("error");
        setError("Fingerprint scan was cancelled or timed out. Please try again.");
      } else if (err.name === "SecurityError") {
        setBiometricState("error");
        setError("Security error: This feature requires HTTPS. Please access the site over a secure connection.");
      } else {
        setBiometricState("error");
        setError(`Biometric authentication failed: ${err.message || err.name}`);
      }
    }
  };

  return (
    <Container>
      <AuthCard>
        {/* Tabs removed to mandate Biometric Access */}
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
              <h2>{isNewUser ? "Join the Elite" : "Biometric Access Control"}</h2>
              <p className="subtitle">
                {isNewUser 
                  ? "Start your fitness journey with GymDash today." 
                  : "Please scan your fingerprint to enter the gym."}
              </p>

              {!isNewUser && (
                <BiometricSection>
                  <div className="fingerprint-container">
                    <div className={`scanner ${biometricState}`}>
                      <Fingerprint size={80} className="icon" />
                      <div className="scan-line"></div>
                    </div>
                  </div>

                  <div className="status-info">
                    {biometricState === "idle" && <p>Place your finger on the scanner</p>}
                    {biometricState === "scanning" && <p className="scanning-text">Searching Database...</p>}
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
                    {biometricState === "scanning" ? "Verifying..." : "Scan Fingerprint to Login"}
                  </ScanButton>
                </BiometricSection>
              )}

              {isNewUser && (
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
                      <label><Fingerprint size={16} /> Biometric Enrollment <RequiredBadge>Required</RequiredBadge></label>
                      <EnrollBox enrolled={isEnrolled} scanning={biometricState === 'scanning'}>
                        <div className="enroll-icon-row">
                          <div className={`enroll-scanner ${isEnrolled ? 'enrolled' : biometricState === 'scanning' ? 'scanning' : ''}`}>
                            <Fingerprint size={36} />
                            {biometricState === 'scanning' && <div className="pulse-ring" />}
                          </div>
                          <div className="enroll-text">
                            {isEnrolled
                              ? <><span className="enrolled-title">✓ Fingerprint Enrolled</span><span className="enrolled-sub">Your biometric is saved to this device</span></>
                              : biometricState === 'scanning'
                                ? <><span className="scanning-title">Waiting for fingerprint...</span><span className="enrolled-sub">Place your finger on the sensor now</span></>
                                : <><span className="idle-title">Fingerprint Required</span><span className="enrolled-sub">You must enroll your fingerprint to create an account</span></>
                            }
                          </div>
                        </div>
                        {enrollError && <div className="enroll-error"><ShieldAlert size={14} /> {enrollError}</div>}
                        {!isEnrolled && (
                          <ScanButton
                            type="button"
                            onClick={handleBiometricEnroll}
                            disabled={biometricState === 'scanning'}
                            style={{ marginTop: '12px', padding: '10px', fontSize: '0.85rem' }}
                          >
                            <Fingerprint size={16} style={{ marginRight: 8 }} />
                            {biometricState === 'scanning' ? 'Scanning — Place Finger on Sensor...' : 'Tap to Scan Your Fingerprint'}
                          </ScanButton>
                        )}
                      </EnrollBox>
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
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: #ffc107;
    color: #000;
  }
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const RequiredBadge = styled.span`
  display: inline-block;
  background: rgba(255, 82, 82, 0.2);
  color: #ff5252;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  border: 1px solid rgba(255, 82, 82, 0.4);
  margin-left: 8px;
  vertical-align: middle;
  letter-spacing: 0.5px;
`;

const EnrollBox = styled.div`
  background: #141414;
  border: 1px solid ${props => props.enrolled ? '#4caf50' : props.scanning ? '#ffc107' : 'rgba(255,255,255,0.1)'};
  border-radius: 14px;
  padding: 16px;
  transition: all 0.4s ease;
  box-shadow: ${props => props.enrolled
    ? '0 0 16px rgba(76, 175, 80, 0.15)'
    : props.scanning
      ? '0 0 20px rgba(255, 193, 7, 0.2)'
      : 'none'};

  .enroll-icon-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .enroll-scanner {
    position: relative;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #1e1e1e;
    border: 2px solid #333;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.4s ease;

    svg { color: #444; transition: color 0.4s ease; }

    &.scanning {
      border-color: #ffc107;
      svg { color: #ffc107; animation: fingerpulse 1.2s ease-in-out infinite; }
    }
    &.enrolled {
      border-color: #4caf50;
      background: rgba(76, 175, 80, 0.1);
      svg { color: #4caf50; }
    }
  }

  .pulse-ring {
    position: absolute;
    width: 84px;
    height: 84px;
    border-radius: 50%;
    border: 2px solid #ffc107;
    animation: ringpulse 1.2s ease-out infinite;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .enroll-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .idle-title {
    color: #aaa;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .scanning-title {
    color: #ffc107;
    font-size: 0.9rem;
    font-weight: 700;
    animation: textblink 1s ease-in-out infinite;
  }

  .enrolled-title {
    color: #4caf50;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .enrolled-sub {
    color: #666;
    font-size: 0.78rem;
  }

  .enroll-error {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-top: 12px;
    background: rgba(255, 82, 82, 0.1);
    border: 1px solid rgba(255, 82, 82, 0.3);
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 0.8rem;
    color: #ff5252;
    line-height: 1.4;
    svg { flex-shrink: 0; margin-top: 2px; }
  }

  @keyframes fingerpulse {
    0%   { transform: scale(1); opacity: 1; }
    50%  { transform: scale(1.15); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes ringpulse {
    0%   { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
    100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
  }

  @keyframes textblink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }
`;

export default Login;
