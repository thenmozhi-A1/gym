import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { User, Mail, Lock, UserPlus, LogIn } from "lucide-react";

const API_BASE = "https://gymj-9.onrender.com/api";

const Login = () => {
  const navigate = useNavigate();
  const [isNewUser, setIsNewUser] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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

        alert("Account created successfully! Welcome to GymDash 🎉");
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

  return (
    <Container>
      <AuthCard>
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
                )}

                {error && (
                  <ErrorBox>{error}</ErrorBox>
                )}

                <SubmitButton type="submit" disabled={loading}>
                  {loading
                    ? (isNewUser ? "Creating Account..." : "Logging in...")
                    : (isNewUser ? "Create Account" : "Login to GymDash")
                  }
                </SubmitButton>
              </form>
              
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

export default Login;
