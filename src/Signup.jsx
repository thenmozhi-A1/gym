import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "./api/axiosInstance";
import toast, { Toaster } from "react-hot-toast";

// ── Zod schema ────────────────────────────────────────────────────────────────
const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name is too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens and apostrophes"),
  phone: z
    .string()
    .min(7, "Phone number is too short")
    .max(15, "Phone number is too long")
    .regex(/^\+?[0-9\s\-().]+$/, "Enter a valid phone number"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[0-9]/, "Password must include at least one number"),
});

// ── Styled components ─────────────────────────────────────────────────────────
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #0f172a;
  color: #fff;
  font-family: 'Inter', sans-serif;
  padding: 20px;
`;

const Card = styled.div`
  background: #1e293b;
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255,255,255,0.05);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 8px;
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #64748b;
  margin-bottom: 30px;
  font-size: 0.9rem;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1.5px solid ${(p) => (p.$hasError ? "#ef4444" : "#334155")};
  background: #0f172a;
  color: white;
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${(p) => (p.$hasError ? "#ef4444" : "#3b82f6")};
    box-shadow: 0 0 0 3px ${(p) => (p.$hasError ? "rgba(239,68,68,0.15)" : "rgba(59,130,246,0.15)")};
  }

  &::placeholder {
    color: #475569;
  }
`;

const FieldError = styled.p`
  color: #ef4444;
  font-size: 0.78rem;
  margin: 5px 0 0;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: "⚠";
    font-size: 0.7rem;
  }
`;

const PasswordHint = styled.ul`
  margin: 6px 0 0;
  padding: 0 0 0 16px;
  list-style: none;
`;

const HintItem = styled.li`
  font-size: 0.75rem;
  color: ${(p) => (p.$met ? "#22c55e" : "#64748b")};
  margin-bottom: 2px;

  &::before {
    content: "${(p) => (p.$met ? "✓" : "○")}";
    margin-right: 5px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.35);
  }

  &:disabled {
    background: #334155;
    color: #475569;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const FooterText = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 0.85rem;
  color: #64748b;

  a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 600;
    &:hover { text-decoration: underline; }
  }
`;

// ── Component ─────────────────────────────────────────────────────────────────
const Signup = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const role = params.get("role");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
  });

  const password = watch("password", "");
  const passwordRules = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
  ];

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post("/users/register", {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        password: data.password,
        role: role === "admin" ? "ADMIN" : "MEMBER",
        status: "ACTIVE",
        membershipType: "Standard",
      });

      toast.success("Account created! Redirecting to login…");
      setTimeout(() => navigate(`/login?role=${role || ""}`), 1500);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <Container>
      <Toaster position="top-center" />
      <Card>
        <Title>{role === "admin" ? "Admin Sign Up" : "Create Account"}</Title>
        <Subtitle>Join B&Y Fitness — your journey starts here.</Subtitle>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Full Name */}
          <FormGroup>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Jane Doe"
              $hasError={!!errors.fullName}
              {...register("fullName")}
            />
            {errors.fullName && <FieldError>{errors.fullName.message}</FieldError>}
          </FormGroup>

          {/* Phone */}
          <FormGroup>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              $hasError={!!errors.phone}
              {...register("phone")}
            />
            {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
          </FormGroup>

          {/* Email */}
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              $hasError={!!errors.email}
              {...register("email")}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </FormGroup>

          {/* Password */}
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              $hasError={!!errors.password}
              {...register("password")}
            />
            {password && (
              <PasswordHint>
                {passwordRules.map((rule) => (
                  <HintItem key={rule.label} $met={rule.met}>
                    {rule.label}
                  </HintItem>
                ))}
              </PasswordHint>
            )}
            {errors.password && <FieldError>{errors.password.message}</FieldError>}
          </FormGroup>

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Sign Up"}
          </SubmitButton>
        </form>

        <FooterText>
          Already have an account?{" "}
          <a href={`/login?role=${role || ""}`}>Sign in</a>
        </FooterText>
      </Card>
    </Container>
  );
};

export default Signup;
