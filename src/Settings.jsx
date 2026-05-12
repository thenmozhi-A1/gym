import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { User, Lock, Bell, CreditCard, Shield } from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "");
    setUserEmail(localStorage.getItem("userEmail") || "");
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings updated successfully!");
  };

  return (
    <Container>
      <PageHeader>
        <h1>Account Settings</h1>
        <p>Manage your profile, security, and preferences.</p>
      </PageHeader>

      <SettingsWrapper>
        <Sidebar>
          <Tab active={activeTab === "profile"} onClick={() => setActiveTab("profile")}>
            <User size={20} /> Profile Details
          </Tab>
          <Tab active={activeTab === "security"} onClick={() => setActiveTab("security")}>
            <Lock size={20} /> Security & Password
          </Tab>
          <Tab active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")}>
            <Bell size={20} /> Notifications
          </Tab>
          <Tab active={activeTab === "billing"} onClick={() => setActiveTab("billing")}>
            <CreditCard size={20} /> Membership & Billing
          </Tab>
        </Sidebar>

        <ContentArea>
          {activeTab === "profile" && (
            <Section>
              <h2><User size={24} /> Profile Information</h2>
              <form onSubmit={handleSave}>
                <FormGroup>
                  <label>Full Name</label>
                  <input type="text" defaultValue={userName} />
                </FormGroup>
                <FormGroup>
                  <label>Email Address</label>
                  <input type="email" defaultValue={userEmail} disabled />
                </FormGroup>
                <FormGroup>
                  <label>Phone Number</label>
                  <input type="tel" placeholder="+1 (555) 000-0000" />
                </FormGroup>
                <SaveButton type="submit">Save Changes</SaveButton>
              </form>
            </Section>
          )}

          {activeTab === "security" && (
            <Section>
              <h2><Lock size={24} /> Security Settings</h2>
              <form onSubmit={handleSave}>
                <FormGroup>
                  <label>Current Password</label>
                  <input type="password" placeholder="••••••••" />
                </FormGroup>
                <FormGroup>
                  <label>New Password</label>
                  <input type="password" placeholder="••••••••" />
                </FormGroup>
                <FormGroup>
                  <label>Confirm New Password</label>
                  <input type="password" placeholder="••••••••" />
                </FormGroup>
                <div style={{ marginTop: "20px", padding: "15px", background: "rgba(255, 193, 7, 0.1)", borderRadius: "8px", border: "1px solid rgba(255,193,7,0.3)" }}>
                  <h4 style={{ display: "flex", alignItems: "center", gap: "10px", color: "#ffc107", margin: "0 0 10px" }}><Shield size={20}/> Biometric Login</h4>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#ddd" }}>Your fingerprint is currently enrolled for fast, secure access.</p>
                </div>
                <SaveButton type="submit" style={{ marginTop: "20px" }}>Update Password</SaveButton>
              </form>
            </Section>
          )}

          {activeTab === "notifications" && (
            <Section>
              <h2><Bell size={24} /> Notification Preferences</h2>
              <ToggleGroup>
                <div className="toggle-info">
                  <h4>Email Notifications</h4>
                  <p>Receive workout tips, gym news, and offers.</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </ToggleGroup>
              <ToggleGroup>
                <div className="toggle-info">
                  <h4>SMS Alerts</h4>
                  <p>Get notified about schedule changes and billing.</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </ToggleGroup>
              <SaveButton onClick={handleSave}>Save Preferences</SaveButton>
            </Section>
          )}

          {activeTab === "billing" && (
            <Section>
              <h2><CreditCard size={24} /> Membership & Billing</h2>
              <div className="billing-card">
                <h3>Current Plan: <span>Elite Annual</span></h3>
                <p>Status: <span style={{color: "#4caf50", fontWeight: "bold"}}>Active</span></p>
                <p>Next billing date: <strong>Dec 31, 2026</strong></p>
                <button className="btn-outline">Manage Subscription</button>
              </div>
            </Section>
          )}
        </ContentArea>
      </SettingsWrapper>
    </Container>
  );
};

export default Settings;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  padding: 120px 20px 60px;
  background-color: #0a0a0a;
  color: #fff;
`;

const PageHeader = styled.div`
  max-width: 1000px;
  margin: 0 auto 40px;
  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 10px;
    background: linear-gradient(90deg, #ffc107, #ff8f00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  p {
    color: #888;
    font-size: 1.1rem;
  }
`;

const SettingsWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  gap: 30px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 250px;
  background: #111;
  border-radius: 12px;
  padding: 20px 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    overflow-x: auto;
    padding: 10px;
  }
`;

const Tab = styled.button`
  width: 100%;
  text-align: left;
  padding: 15px 20px;
  background: ${props => props.active ? "rgba(255, 193, 7, 0.1)" : "transparent"};
  color: ${props => props.active ? "#ffc107" : "#aaa"};
  border: none;
  border-left: 3px solid ${props => props.active ? "#ffc107" : "transparent"};
  border-radius: 0 8px 8px 0;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 5px;

  &:hover {
    color: #ffc107;
    background: rgba(255, 193, 7, 0.05);
  }

  @media (max-width: 768px) {
    border-left: none;
    border-bottom: 3px solid ${props => props.active ? "#ffc107" : "transparent"};
    border-radius: 8px 8px 0 0;
    white-space: nowrap;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  background: #111;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Section = styled.div`
  animation: fadeIn 0.3s ease;

  h2 {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1.5rem;
    margin-bottom: 30px;
    color: #fff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 15px;
  }

  .billing-card {
    background: #1a1a1a;
    padding: 25px;
    border-radius: 12px;
    border: 1px solid rgba(255, 193, 7, 0.2);
    
    h3 {
      margin-top: 0;
      span { color: #ffc107; }
    }
    
    .btn-outline {
      margin-top: 15px;
      padding: 10px 20px;
      background: transparent;
      border: 1px solid #ffc107;
      color: #ffc107;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        background: #ffc107;
        color: #000;
      }
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    color: #aaa;
    font-size: 0.9rem;
  }
  
  input {
    width: 100%;
    padding: 12px 15px;
    background: #1a1a1a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: #fff;
    font-size: 1rem;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #ffc107;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

const SaveButton = styled.button`
  background: #ffc107;
  color: #000;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #ffcf33;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
  }
`;

const ToggleGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #1a1a1a;
  border-radius: 8px;
  margin-bottom: 15px;

  .toggle-info {
    h4 { margin: 0 0 5px; color: #fff; }
    p { margin: 0; color: #888; font-size: 0.9rem; }
  }

  /* Custom Switch */
  .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 28px;
  }
  
  .switch input { 
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: #333;
    transition: .4s;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
  }
  
  input:checked + .slider {
    background-color: #ffc107;
  }
  
  input:checked + .slider:before {
    transform: translateX(22px);
  }
  
  .slider.round {
    border-radius: 34px;
  }
  
  .slider.round:before {
    border-radius: 50%;
  }
`;
