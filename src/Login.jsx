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

// ── Mobile helpers ────────────────────────────────────────────
const isMobileDevice = () =>
  ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

const buildMobileHash = (samples) => {
  if (!samples.length) return `fp_${Date.now()}`;
  const n = samples.length;
  const rx = Math.round(samples.reduce((s, t) => s + t.rx, 0) / n);
  const ry = Math.round(samples.reduce((s, t) => s + t.ry, 0) / n);
  const f  = Math.round(samples.reduce((s, t) => s + t.f,  0) / n * 20);
  const key = `${rx}:${ry}:${f}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = (h * 0x01000193) >>> 0; }
  return `M${h.toString(16)}`;
};

const Login = () => {
  const navigate = useNavigate();
  const [isNewUser, setIsNewUser] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [enrollError, setEnrollError] = useState("");
  const [loginMethod, setLoginMethod] = useState("password");
  const [biometricState, setBiometricState] = useState("idle");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [attendanceLog, setAttendanceLog] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const touchSamples = React.useRef([]);
  const holdTimer    = React.useRef(null);
  const progressTimer = React.useRef(null);
  const IS_MOBILE = React.useMemo(() => isMobileDevice(), []);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isEmployeeLogin, setIsEmployeeLogin] = useState(false);
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
    setIsAdminLogin(false);
  }, [isNewUser, isForgotPassword]);

  const handleInputChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ── Mobile touch handlers (no PIN, pure touch) ───────────────
  const startMobileScan = (e, onComplete) => {
    e.preventDefault();
    if (biometricState === 'success') return;
    setEnrollError(""); setError("");
    touchSamples.current = [];
    setScanProgress(0);
    setBiometricState('scanning');
    const t = e.touches[0];
    touchSamples.current.push({ rx: t.radiusX || 14, ry: t.radiusY || 14, f: t.force || 0.5 });
    // Progress bar over 2.5s
    let p = 0;
    progressTimer.current = setInterval(() => { p = Math.min(p + 2, 100); setScanProgress(p); }, 50);
    holdTimer.current = setTimeout(() => {
      clearInterval(progressTimer.current);
      setScanProgress(100);
      onComplete(touchSamples.current);
    }, 2500);
  };

  const moveMobileScan = (e) => {
    e.preventDefault();
    if (biometricState !== 'scanning') return;
    const t = e.touches[0];
    touchSamples.current.push({ rx: t.radiusX || 14, ry: t.radiusY || 14, f: t.force || 0.5 });
  };

  const cancelMobileScan = () => {
    clearTimeout(holdTimer.current); clearInterval(progressTimer.current);
    if (biometricState === 'scanning') {
      setBiometricState('idle'); setScanProgress(0);
      setEnrollError('Hold your finger steady for 2–3 seconds.');
    }
  };

  // ── Desktop mouse handler (click & hold 2.5s) ──────────────
  const startDesktopScan = (e, onComplete) => {
    if (biometricState === 'success') return;
    setEnrollError(""); setError("");
    touchSamples.current = [{ rx: 14, ry: 14, f: 0.5 }];
    setScanProgress(0);
    setBiometricState('scanning');
    let p = 0;
    progressTimer.current = setInterval(() => { p = Math.min(p + 2, 100); setScanProgress(p); }, 50);
    holdTimer.current = setTimeout(() => {
      clearInterval(progressTimer.current);
      setScanProgress(100);
      onComplete(touchSamples.current);
    }, 2500);
  };

  const cancelScan = () => {
    clearTimeout(holdTimer.current); clearInterval(progressTimer.current);
    if (biometricState === 'scanning') {
      setBiometricState('idle'); setScanProgress(0);
      setEnrollError('Hold your finger steady for the full 2–3 seconds.');
    }
  };

  const completeMobileEnroll = (samples) => {
    const hash = buildMobileHash(samples);
    const store = JSON.parse(localStorage.getItem('webauthnCredentials') || '{}');
    store[formData.email] = hash;
    localStorage.setItem('webauthnCredentials', JSON.stringify(store));
    localStorage.setItem('lastEnrolledEmail', formData.email);
    setBiometricState('success'); setIsEnrolled(true);
  };

  const completeMobileLogin = async (samples) => {
    const hash = buildMobileHash(samples);
    setBiometricState('scanning');
    setError("");

    try {
      const res = await fetch(`${API_BASE}/users/biometric-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprintHash: hash })
      });

      const user = await res.json();

      if (!res.ok) {
        setBiometricState('error');
        setError(user.error || "Fingerprint not recognized on database.");
        return;
      }

      const now = new Date(); const ts = now.toLocaleTimeString(); const dk = now.toLocaleDateString();
      const att = JSON.parse(localStorage.getItem('attendance') || '{}');
      if (!att[dk]) { att[dk] = { entry: ts, exit: null }; setAttendanceLog(`Entry recorded at ${ts}`); }
      else if (!att[dk].exit) { att[dk].exit = ts; setAttendanceLog(`Exit recorded at ${ts}`); }
      else setAttendanceLog('Session complete for today.');
      localStorage.setItem('attendance', JSON.stringify(att));

      setBiometricState('success');
      localStorage.setItem('isLoggedIn','true'); 
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.fullName); 
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userRole', user.role);

      const redirectUser = (role) => {
        const r = (role || "").toString().trim().toUpperCase();
        if (r === 'ADMIN') window.location.href = '/AdminDashboard';
        else if (r === 'TRAINER' || r === 'FRONT OFFICE' || r === 'STAFF' || r.includes('TRAINER') || r.includes('OFFICE')) window.location.href = '/EmployeeDashboard';
        else window.location.href = '/userdashboard';
      };

      setTimeout(() => { 
        redirectUser(user.role);
      }, 1500);
    } catch { 
      setBiometricState('error'); 
      setError('Cannot connect to server.'); 
    }
  };

  // ── Desktop WebAuthn enroll ───────────────────────────────────
  const handleBiometricEnroll = async () => {
    setEnrollError("");
    if (!formData.email) { setEnrollError("Enter your email first."); return; }
    if (!isWebAuthnSupported()) { setEnrollError("WebAuthn not supported on this browser."); return; }
    setBiometricState("scanning");
    try {
      const challenge = new Uint8Array(32); window.crypto.getRandomValues(challenge);
      const userId = new TextEncoder().encode(formData.email);
      const credential = await navigator.credentials.create({ publicKey: {
        challenge, rp: { name: "B&Y Fitness Gym", id: window.location.hostname },
        user: { id: userId, name: formData.email, displayName: formData.name || formData.email },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required", requireResidentKey: false },
        timeout: 60000, attestation: "none",
      }});
      const credentialId = bufferToBase64(credential.rawId);
      const stored = JSON.parse(localStorage.getItem("webauthnCredentials") || "{}");
      stored[formData.email] = credentialId;
      localStorage.setItem("webauthnCredentials", JSON.stringify(stored));
      localStorage.setItem("lastEnrolledEmail", formData.email);
      setBiometricState("success"); setIsEnrolled(true);
    } catch (err) {
      setBiometricState("idle");
      if (err.name === "InvalidStateError") { setBiometricState("success"); setIsEnrolled(true); }
      else setEnrollError(`Enrollment failed: ${err.message || err.name}`);
    }
  };

  // ── Admin password login (no fingerprint required) ──────────
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Invalid credentials."); return; }
      if (data.role !== "ADMIN") { setError("Access denied. This login is for admins only."); return; }
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId",    data.id);
      localStorage.setItem("userName",  data.fullName);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userRole",  data.role);
      navigate("/AdminDashboard");
    } catch { setError("Cannot connect to server."); }
    finally   { setLoading(false); }
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
        const stored = JSON.parse(localStorage.getItem("webauthnCredentials") || "{}");
        const activeHash = stored[formData.email] || `fp_${formData.email.replace(/[^a-zA-Z0-9]/g, "")}`;

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
            fingerprintEnrolled: true,
            fingerprintHash: activeHash
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
        alert("Account created and Fingerprint Enrolled successfully! Welcome to B&Y Fitness 🎉");
        window.location.href = data.role === "ADMIN" ? "/AdminDashboard" : "/subscription";

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

        console.log("Login Data Detected:", data.role);
        const upperRole = data.role?.toUpperCase();
        if (upperRole === 'ADMIN') window.location.href = '/AdminDashboard';
        else if (upperRole === 'TRAINER' || upperRole === 'FRONT OFFICE' || data.role === 'Trainer' || data.role === 'Front Office') window.location.href = '/EmployeeDashboard';
        else window.location.href = '/userdashboard';
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

      // ── Step 3: Match scanned credential ID ────────────────────
      const assertedCredId = bufferToBase64(assertion.rawId);

      // ── Step 4: Verify directly against database ──────────────
      const res = await fetch(`${API_BASE}/users/biometric-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprintHash: assertedCredId })
      });

      const user = await res.json();

      if (!res.ok) {
        setBiometricState("error");
        setError(user.error || "Biometric hash not matched in database.");
        return;
      }

      // ── Step 5: Record attendance ──────────────────────────────
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

      // ── Step 6: Login ──────────────────────────────────────────
      setBiometricState("success");
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.fullName);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userRole", user.role);

      setTimeout(() => {
        const r = (user.role || "").toString().trim().toUpperCase();
        if (r === 'ADMIN') {
          window.location.href = '/AdminDashboard';
        } else if (r === 'TRAINER' || r === 'FRONT OFFICE' || r === 'STAFF' || r.includes('TRAINER') || r.includes('OFFICE')) {
          window.location.href = '/EmployeeDashboard';
        } else {
          window.location.href = '/userdashboard';
        }
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
              <h2>{isNewUser ? "Join the Elite" : isAdminLogin ? "Admin Secure Access" : isEmployeeLogin ? "Employee Secure Access" : "Biometric Access Control"}</h2>
              <p className="subtitle">
                {isNewUser 
                  ? "Start your fitness journey with B&Y Fitness today." 
                  : isEmployeeLogin
                    ? "Scan your staff fingerprint to access the B&Y Fitness operations dashboard."
                    : "Please scan your fingerprint to enter the gym."}
              </p>

              {!isNewUser && !isAdminLogin && (
                <BiometricSection>
                  {IS_MOBILE ? (
                    /* ── MOBILE LOGIN: touch pad ── */
                    <>
                      <MobileTouchPad
                        state={biometricState}
                        enrolled={biometricState === 'success'}
                        onTouchStart={biometricState !== 'success' ? (e) => startMobileScan(e, completeMobileLogin) : undefined}
                        onTouchMove={moveMobileScan}
                        onTouchEnd={biometricState !== 'success' ? cancelMobileScan : undefined}
                        style={{ margin: '0 auto 20px' }}
                      >
                        <div className="pad-ring">
                          <Fingerprint size={62} className="fp-icon" />
                          {biometricState === 'scanning' && <div className="sweep" />}
                        </div>
                        {biometricState === 'scanning' && (
                          <div className="progress-bar"><div className="progress-fill" style={{ width: `${scanProgress}%` }} /></div>
                        )}
                        <p className="pad-label">
                          {biometricState === 'success' ? `✓ Access Granted — ${attendanceLog || ''}` : biometricState === 'scanning' ? 'Hold still…' : 'Press & hold fingerprint to enter'}
                        </p>
                        {biometricState === 'error' && <p className="pad-error"><ShieldAlert size={13} /> {error}</p>}
                      </MobileTouchPad>
                      <InputGroup>
                        <label><Mail size={16} /> Email (if not auto-detected)</label>
                        <input type="email" name="email" placeholder="your@email.com" onChange={handleInputChange} />
                      </InputGroup>
                    </>
                  ) : (
                    /* ── DESKTOP LOGIN: WebAuthn ── */
                    <>
                      <div className="fingerprint-container">
                        <div className={`scanner ${biometricState}`}>
                          <Fingerprint size={80} className="icon" />
                          <div className="scan-line"></div>
                        </div>
                      </div>
                      <div className="status-info">
                        {biometricState === 'idle'    && <p>Click below to scan fingerprint</p>}
                        {biometricState === 'scanning' && <p className="scanning-text">Verifying…</p>}
                        {biometricState === 'success'  && <div className="success-msg"><ShieldCheck color="#4caf50" size={24} /><p>Access Granted! {attendanceLog}</p></div>}
                        {biometricState === 'error'    && <div className="error-msg"><ShieldAlert color="#ff5252" size={24} /><p>{error}</p></div>}
                      </div>
                      <InputGroup style={{ marginTop: '20px' }}>
                        <label><Mail size={16} /> Email (optional)</label>
                        <input type="email" name="email" placeholder="Auto-recognition enabled" onChange={handleInputChange} />
                      </InputGroup>
                      <ScanButton onClick={handleBiometricScan} disabled={biometricState === 'scanning'}>
                        {biometricState === 'scanning' ? 'Verifying…' : 'Scan Fingerprint to Login'}
                      </ScanButton>
                    </>
                  )}
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
                      {/* Universal fingerprint pad — works for ALL users (touch + mouse) */}
                      <MobileTouchPad
                        state={biometricState}
                        enrolled={isEnrolled}
                        onTouchStart={isEnrolled ? undefined : (e) => startMobileScan(e, completeMobileEnroll)}
                        onTouchMove={moveMobileScan}
                        onTouchEnd={isEnrolled ? undefined : cancelMobileScan}
                        onMouseDown={isEnrolled ? undefined : (e) => startDesktopScan(e, completeMobileEnroll)}
                        onMouseUp={isEnrolled ? undefined : cancelScan}
                        onMouseLeave={isEnrolled ? undefined : cancelScan}
                      >
                        <div className="pad-ring">
                          <Fingerprint size={52} className="fp-icon" />
                          {biometricState === 'scanning' && <div className="sweep" />}
                        </div>
                        {biometricState === 'scanning' && (
                          <div className="progress-bar"><div className="progress-fill" style={{ width: `${scanProgress}%` }} /></div>
                        )}
                        <p className="pad-label">
                          {isEnrolled
                            ? '✓ Fingerprint Captured — Ready to Register'
                            : biometricState === 'scanning'
                              ? `Scanning… ${scanProgress}%`
                              : IS_MOBILE ? 'Press & hold finger here (2.5 sec)' : 'Click & hold here (2.5 sec)'}
                        </p>
                        {enrollError && <p className="pad-error"><ShieldAlert size={13} /> {enrollError}</p>}
                      </MobileTouchPad>
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

              
              {isAdminLogin && (
                <AdminLoginBox>
                  <div className="admin-badge">
                    <span className="lock">🔒</span>
                    <div>
                      <span className="title">Admin Secure Access</span>
                      <span className="sub">Enter your admin credentials below</span>
                    </div>
                  </div>
                  <form onSubmit={handleAdminLogin}>
                    <InputGroup>
                      <label><Mail size={16} /> Admin Email</label>
                      <input type="email" name="email" placeholder="admin@gymhoney.com" required onChange={handleInputChange} />
                    </InputGroup>
                    <InputGroup>
                      <label><Lock size={16} /> Admin Password</label>
                      <input type="password" name="password" placeholder="••••••••" required onChange={handleInputChange} />
                    </InputGroup>
                    {error && <ErrorBox>{error}</ErrorBox>}
                    <SubmitButton type="submit" disabled={loading}>
                      {loading ? 'Authenticating…' : '🔒 Login as Admin'}
                    </SubmitButton>
                  </form>
                </AdminLoginBox>
              )}

              <div className="auth-footer">
                {!isNewUser && !isAdminLogin && !isEmployeeLogin ? (
                  <a href="#" onClick={(e) => { e.preventDefault(); setIsNewUser(true); }}>
                    New User? Create Account
                  </a>
                ) : isAdminLogin || isEmployeeLogin ? (
                  <a href="#" onClick={(e) => { e.preventDefault(); setIsAdminLogin(false); setIsEmployeeLogin(false); }}>
                    ← Back to Member Login
                  </a>
                ) : (
                  <a href="#" onClick={(e) => { e.preventDefault(); setIsNewUser(false); }}>
                    Already have an account? Login
                  </a>
                )}
                {!isAdminLogin && !isNewUser && !isEmployeeLogin && (
                  <>
                    <a href="#" className="admin-link" onClick={(e) => { e.preventDefault(); setIsAdminLogin(true); setIsNewUser(false); setIsEmployeeLogin(false); setError(""); }}>
                      🔒 Admin Access
                    </a>
                    <span className="divider">|</span>
                    <a href="#" className="admin-link" onClick={(e) => { e.preventDefault(); setIsEmployeeLogin(true); setIsAdminLogin(false); setIsNewUser(false); setError(""); }}>
                      👤 Employee Login
                    </a>
                  </>
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
    flex-wrap: wrap;
    
    a {
      color: #888;
      text-decoration: none;
      font-size: 0.85rem;
      transition: color 0.3s ease;
      &:hover { color: #ffc107; }
    }

    .admin-link {
      color: #444;
      font-size: 0.75rem;
      border: 1px solid #2a2a2a;
      padding: 3px 10px;
      border-radius: 20px;
      &:hover { color: #ffc107; border-color: #ffc107; }
    }

    .divider {
      color: #333;
      font-size: 0.8rem;
    }
  }

  @media (max-width: 480px) {
    padding: 30px 15px;
    h2 { font-size: 1.5rem; text-align: center; }
    .subtitle { margin-bottom: 25px; font-size: 0.88rem; text-align: center; }
    .auth-footer { flex-direction: column; gap: 15px; }
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

const MobileTouchPad = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  background: #0e0e0e;
  border: 2px solid ${p => p.enrolled ? '#4caf50' : p.state === 'scanning' ? '#ffc107' : p.state === 'error' ? '#ff5252' : '#2a2a2a'};
  border-radius: 20px;
  padding: 24px 16px 18px;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
  box-shadow: ${p => p.enrolled
    ? '0 0 24px rgba(76,175,80,0.2)'
    : p.state === 'scanning'
      ? '0 0 28px rgba(255,193,7,0.25)'
      : 'none'};

  .pad-ring {
    position: relative;
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: #1a1a1a;
    border: 2px solid ${p => p.enrolled ? '#4caf50' : p.state === 'scanning' ? '#ffc107' : '#333'};
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: border-color 0.4s ease;
  }

  .fp-icon {
    color: ${p => p.enrolled ? '#4caf50' : p.state === 'scanning' ? '#ffc107' : '#444'};
    transition: color 0.4s ease;
    animation: ${p => p.state === 'scanning' ? 'fpPulse 1s ease-in-out infinite' : 'none'};
  }

  .sweep {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #ffc107, transparent);
    box-shadow: 0 0 10px #ffc107;
    animation: sweep 1.2s linear infinite;
  }

  .progress-bar {
    width: 90%;
    height: 4px;
    background: #222;
    border-radius: 4px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: #ffc107;
    border-radius: 4px;
    transition: width 0.05s linear;
    box-shadow: 0 0 8px rgba(255,193,7,0.5);
  }

  .pad-label {
    margin: 0;
    font-size: 0.82rem;
    font-weight: 600;
    color: ${p => p.enrolled ? '#4caf50' : p.state === 'scanning' ? '#ffc107' : '#777'};
    text-align: center;
    transition: color 0.3s ease;
  }

  .pad-error {
    margin: 0;
    font-size: 0.78rem;
    color: #ff5252;
    display: flex;
    align-items: center;
    gap: 5px;
    text-align: center;
  }

  @keyframes fpPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%       { transform: scale(1.12); opacity: 0.75; }
  }
  @keyframes sweep {
    0%   { top: 0%; }
    100% { top: 100%; }
  }
`;

const AdminLoginBox = styled.div`
  background: #0d0d0d;
  border: 1px solid rgba(255, 193, 7, 0.25);
  border-top: 3px solid #ffc107;
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 10px;

  .admin-badge {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255,255,255,0.06);

    .lock {
      font-size: 1.6rem;
      line-height: 1;
    }

    div {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .title {
      color: #ffc107;
      font-weight: 800;
      font-size: 0.95rem;
      letter-spacing: 0.3px;
    }

    .sub {
      color: #555;
      font-size: 0.75rem;
    }
  }
`;

export default Login;
