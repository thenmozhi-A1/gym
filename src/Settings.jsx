import React, { useEffect } from "react";
import styled from "styled-components";
import { User, Lock, Bell, CreditCard, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "./api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import useAuthStore from "./store/authStore";

// ── Schemas ────────────────────────────────────────────────────────────────────
const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name is too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens and apostrophes"),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-().]{7,15}$/, "Enter a valid phone number (7–15 digits)")
    .or(z.literal("")),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[0-9]/, "Must include a number"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ── Styled components ──────────────────────────────────────────────────────────
const Container = styled.div`
  min-height: 100vh;
  padding: 120px 20px 60px;
  background-color: #0a0a0a;
  color: #fff;
  font-family: 'Inter', sans-serif;
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
  p { color: #888; font-size: 1.1rem; }
`;

const SettingsWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  gap: 30px;
  align-items: flex-start;
  @media (max-width: 768px) { flex-direction: column; }
`;

const Sidebar = styled.div`
  width: 250px;
  background: #111;
  border-radius: 12px;
  padding: 20px 10px;
  border: 1px solid rgba(255,255,255,0.05);
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
  background: ${(p) => (p.$active ? "rgba(255,193,7,0.1)" : "transparent")};
  color: ${(p) => (p.$active ? "#ffc107" : "#aaa")};
  border: none;
  border-left: 3px solid ${(p) => (p.$active ? "#ffc107" : "transparent")};
  border-radius: 0 8px 8px 0;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 5px;
  &:hover { color: #ffc107; background: rgba(255,193,7,0.05); }
  @media (max-width: 768px) {
    border-left: none;
    border-bottom: 3px solid ${(p) => (p.$active ? "#ffc107" : "transparent")};
    border-radius: 8px 8px 0 0;
    white-space: nowrap;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  background: #111;
  border-radius: 12px;
  padding: 40px;
  border: 1px solid rgba(255,255,255,0.05);
  @media (max-width: 768px) { padding: 20px; }
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
    border-bottom: 1px solid rgba(255,255,255,0.1);
    padding-bottom: 15px;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 22px;

  label {
    display: block;
    margin-bottom: 6px;
    color: #94a3b8;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input {
    width: 100%;
    padding: 12px 15px;
    background: #1a1a1a;
    border: 1.5px solid ${(p) => (p.$hasError ? "#ef4444" : "rgba(255,255,255,0.1)")};
    border-radius: 8px;
    color: #fff;
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: ${(p) => (p.$hasError ? "#ef4444" : "#ffc107")};
      box-shadow: 0 0 0 3px ${(p) =>
        p.$hasError ? "rgba(239,68,68,0.1)" : "rgba(255,193,7,0.1)"};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const FieldError = styled.p`
  color: #ef4444;
  font-size: 0.78rem;
  margin: 5px 0 0;
  display: flex;
  align-items: center;
  gap: 4px;
  &::before { content: "⚠"; font-size: 0.7rem; }
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
  &:hover:not(:disabled) {
    background: #ffcf33;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255,193,7,0.3);
  }
  &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
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
  .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 28px;
  }
  .switch input { opacity: 0; width: 0; height: 0; }
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
  input:checked + .slider { background-color: #ffc107; }
  input:checked + .slider:before { transform: translateX(22px); }
  .slider.round { border-radius: 34px; }
  .slider.round:before { border-radius: 50%; }
`;

const BillingCard = styled.div`
  background: #1a1a1a;
  padding: 25px;
  border-radius: 12px;
  border: 1px solid rgba(255,193,7,0.2);
  h3 { margin-top: 0; span { color: #ffc107; } }
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
    &:hover { background: #ffc107; color: #000; }
  }
`;

// ── Component ──────────────────────────────────────────────────────────────────
const Settings = () => {
  const [activeTab, setActiveTab] = React.useState("profile");
  const user = useAuthStore((state) => state.user) || {};

  // ── Profile form ────────────────────────────────────────────────────────────
  const {
    register: regProfile,
    handleSubmit: handleProfile,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: savingProfile },
  } = useForm({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    resetProfile({
      fullName: user.fullName || localStorage.getItem("userName") || "",
      phone: user.phone || localStorage.getItem("userPhone") || "",
    });
  }, [user, resetProfile]);

  const onSaveProfile = async (data) => {
    const userId = user.id || localStorage.getItem("userId");
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }
    try {
      const response = await axiosInstance.put(`/users/${userId}`, {
        ...user,
        fullName: data.fullName,
        phone: data.phone,
      });
      useAuthStore.getState().setUser(response.data);
      localStorage.setItem("userName", response.data.fullName);
      if (response.data.phone) localStorage.setItem("userPhone", response.data.phone);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  // ── Password form ───────────────────────────────────────────────────────────
  const {
    register: regPwd,
    handleSubmit: handlePwd,
    reset: resetPwd,
    watch: watchPwd,
    formState: { errors: pwdErrors, isSubmitting: savingPwd },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    mode: "onTouched",
  });

  const newPwd = watchPwd("newPassword", "");
  const pwdRules = [
    { label: "At least 8 characters", met: newPwd.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(newPwd) },
    { label: "One number", met: /[0-9]/.test(newPwd) },
  ];

  const onSavePassword = async (data) => {
    const userId = user.id || localStorage.getItem("userId");
    if (!userId) {
      toast.error("User ID not found. Please log in again.");
      return;
    }
    try {
      await axiosInstance.put(`/users/${userId}/password`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully!");
      resetPwd();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update password. Check your current password.";
      toast.error(msg);
    }
  };

  return (
    <Container>
      <Toaster position="top-right" />
      <PageHeader>
        <h1>Account Settings</h1>
        <p>Manage your profile, security, and preferences.</p>
      </PageHeader>

      <SettingsWrapper>
        <Sidebar>
          <Tab $active={activeTab === "profile"} onClick={() => setActiveTab("profile")}>
            <User size={20} /> Profile Details
          </Tab>
          <Tab $active={activeTab === "security"} onClick={() => setActiveTab("security")}>
            <Lock size={20} /> Security & Password
          </Tab>
          <Tab $active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")}>
            <Bell size={20} /> Notifications
          </Tab>
          <Tab $active={activeTab === "billing"} onClick={() => setActiveTab("billing")}>
            <CreditCard size={20} /> Membership & Billing
          </Tab>
        </Sidebar>

        <ContentArea>
          {/* ── PROFILE TAB ───────────────────────────────────────────────── */}
          {activeTab === "profile" && (
            <Section>
              <h2><User size={24} /> Profile Information</h2>
              <form onSubmit={handleProfile(onSaveProfile)} noValidate>
                <FormGroup $hasError={!!profileErrors.fullName}>
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Jane Doe"
                    {...regProfile("fullName")}
                  />
                  {profileErrors.fullName && (
                    <FieldError>{profileErrors.fullName.message}</FieldError>
                  )}
                </FormGroup>

                <FormGroup>
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={user.email || localStorage.getItem("userEmail") || ""}
                    disabled
                  />
                </FormGroup>

                <FormGroup $hasError={!!profileErrors.phone}>
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    {...regProfile("phone")}
                  />
                  {profileErrors.phone && (
                    <FieldError>{profileErrors.phone.message}</FieldError>
                  )}
                </FormGroup>

                <SaveButton type="submit" disabled={savingProfile}>
                  {savingProfile ? "Saving…" : "Save Changes"}
                </SaveButton>
              </form>
            </Section>
          )}

          {/* ── SECURITY TAB ──────────────────────────────────────────────── */}
          {activeTab === "security" && (
            <Section>
              <h2><Lock size={24} /> Security Settings</h2>
              <form onSubmit={handlePwd(onSavePassword)} noValidate>
                <FormGroup $hasError={!!pwdErrors.currentPassword}>
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    {...regPwd("currentPassword")}
                  />
                  {pwdErrors.currentPassword && (
                    <FieldError>{pwdErrors.currentPassword.message}</FieldError>
                  )}
                </FormGroup>

                <FormGroup $hasError={!!pwdErrors.newPassword}>
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    {...regPwd("newPassword")}
                  />
                  {newPwd && (
                    <ul style={{ listStyle: "none", padding: "6px 0 0", margin: 0 }}>
                      {pwdRules.map((r) => (
                        <li
                          key={r.label}
                          style={{
                            fontSize: "0.75rem",
                            color: r.met ? "#22c55e" : "#64748b",
                            marginBottom: "2px",
                          }}
                        >
                          {r.met ? "✓" : "○"} {r.label}
                        </li>
                      ))}
                    </ul>
                  )}
                  {pwdErrors.newPassword && (
                    <FieldError>{pwdErrors.newPassword.message}</FieldError>
                  )}
                </FormGroup>

                <FormGroup $hasError={!!pwdErrors.confirmPassword}>
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...regPwd("confirmPassword")}
                  />
                  {pwdErrors.confirmPassword && (
                    <FieldError>{pwdErrors.confirmPassword.message}</FieldError>
                  )}
                </FormGroup>

                <div
                  style={{
                    marginTop: "20px",
                    padding: "15px",
                    background: "rgba(255,193,7,0.1)",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,193,7,0.3)",
                  }}
                >
                  <h4
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "#ffc107",
                      margin: "0 0 10px",
                    }}
                  >
                    <Shield size={20} /> Biometric Login
                  </h4>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#ddd" }}>
                    Your fingerprint is currently enrolled for fast, secure access.
                  </p>
                </div>

                <SaveButton type="submit" style={{ marginTop: "20px" }} disabled={savingPwd}>
                  {savingPwd ? "Updating…" : "Update Password"}
                </SaveButton>
              </form>
            </Section>
          )}

          {/* ── NOTIFICATIONS TAB ─────────────────────────────────────────── */}
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
              <SaveButton
                type="button"
                onClick={() => toast.success("Notification preferences saved!")}
              >
                Save Preferences
              </SaveButton>
            </Section>
          )}

          {/* ── BILLING TAB ───────────────────────────────────────────────── */}
          {activeTab === "billing" && (
            <Section>
              <h2><CreditCard size={24} /> Membership & Billing</h2>
              <BillingCard>
                <h3>
                  Current Plan: <span>Elite Annual</span>
                </h3>
                <p>
                  Status:{" "}
                  <span style={{ color: "#4caf50", fontWeight: "bold" }}>Active</span>
                </p>
                <p>
                  Next billing date: <strong>Dec 31, 2026</strong>
                </p>
                <button className="btn-outline">Manage Subscription</button>
              </BillingCard>
            </Section>
          )}
        </ContentArea>
      </SettingsWrapper>
    </Container>
  );
};

export default Settings;
