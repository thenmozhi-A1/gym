import React from "react";
import styled, { keyframes } from "styled-components";

// ── Shimmer animation ────────────────────────────────────────────────────────
const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`;

const shimmerLight = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`;

// ── Base bone ─────────────────────────────────────────────────────────────────
const Bone = styled.div`
  border-radius: ${(p) => p.$radius || "8px"};
  width: ${(p) => p.$w || "100%"};
  height: ${(p) => p.$h || "16px"};
  margin: ${(p) => p.$m || "0"};
  flex-shrink: 0;

  /* Dark variant (admin dashboard, employee dashboard) */
  background: ${(p) =>
    p.$light
      ? "linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%)"
      : "linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%)"};
  background-size: 1200px 100%;
  animation: ${(p) => (p.$light ? shimmerLight : shimmer)} 1.4s infinite linear;
`;

// ── Composite skeletons ───────────────────────────────────────────────────────

/** Full-page loading overlay for dashboards */
const OverlayWrap = styled.div`
  position: fixed;
  inset: 0;
  background: ${(p) => (p.$light ? "#f8fafc" : "#0a0a0a")};
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SpinnerWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 4px solid ${(p) => (p.$light ? "#e2e8f0" : "#1e293b")};
  border-top-color: ${(p) => (p.$light ? "#3b82f6" : "#ffc107")};
  animation: ${spin} 0.8s linear infinite;
`;

const SpinnerLabel = styled.p`
  color: ${(p) => (p.$light ? "#64748b" : "#94a3b8")};
  font-size: 0.9rem;
  font-family: "Inter", sans-serif;
  letter-spacing: 0.5px;
  margin: 0;
`;

export const PageSpinner = ({ light = false, label = "Loading…" }) => (
  <OverlayWrap $light={light}>
    <SpinnerWrap>
      <Spinner $light={light} />
      <SpinnerLabel $light={light}>{label}</SpinnerLabel>
    </SpinnerWrap>
  </OverlayWrap>
);

// ── Table row skeleton ─────────────────────────────────────────────────────────
const TableSkeletonWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 0;
`;

const TableRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 12px 16px;
  border-radius: 10px;
  background: ${(p) => (p.$light ? "#fff" : "#1e293b")};
  box-shadow: ${(p) =>
    p.$light
      ? "0 1px 3px rgba(0,0,0,0.06)"
      : "0 1px 3px rgba(0,0,0,0.3)"};
`;

export const TableSkeleton = ({ rows = 5, light = false }) => (
  <TableSkeletonWrap>
    {Array.from({ length: rows }).map((_, i) => (
      <TableRow key={i} $light={light}>
        <Bone $light={light} $w="36px" $h="36px" $radius="50%" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          <Bone $light={light} $h="14px" $w="55%" />
          <Bone $light={light} $h="11px" $w="35%" />
        </div>
        <Bone $light={light} $h="22px" $w="70px" $radius="12px" />
        <Bone $light={light} $h="14px" $w="80px" />
      </TableRow>
    ))}
  </TableSkeletonWrap>
);

// ── Card grid skeleton ─────────────────────────────────────────────────────────
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: ${(p) => p.$cols || "repeat(auto-fill, minmax(240px, 1fr))"};
  gap: 20px;
`;

const CardShell = styled.div`
  border-radius: 16px;
  padding: 24px;
  background: ${(p) => (p.$light ? "#fff" : "#1e293b")};
  box-shadow: ${(p) =>
    p.$light
      ? "0 1px 3px rgba(0,0,0,0.06)"
      : "0 4px 12px rgba(0,0,0,0.3)"};
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const CardSkeleton = ({ count = 4, cols, light = false }) => (
  <CardGrid $cols={cols}>
    {Array.from({ length: count }).map((_, i) => (
      <CardShell key={i} $light={light}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Bone $light={light} $w="48px" $h="48px" $radius="12px" />
          <Bone $light={light} $w="60px" $h="20px" $radius="20px" />
        </div>
        <Bone $light={light} $h="12px" $w="50%" />
        <Bone $light={light} $h="28px" $w="70%" />
        <Bone $light={light} $h="10px" $w="40%" />
      </CardShell>
    ))}
  </CardGrid>
);

// ── Testimonial / feedback card skeleton ──────────────────────────────────────
const FeedbackCardShell = styled.div`
  border-radius: 20px;
  padding: 28px;
  background: ${(p) => (p.$light ? "#fff" : "rgba(255,255,255,0.04)")};
  border: 1px solid ${(p) => (p.$light ? "#e2e8f0" : "rgba(255,255,255,0.08)")};
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FeedbackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
`;

export const FeedbackSkeleton = ({ count = 3, light = false }) => (
  <FeedbackGrid>
    {Array.from({ length: count }).map((_, i) => (
      <FeedbackCardShell key={i} $light={light}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Bone $light={light} $w="44px" $h="44px" $radius="50%" />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
            <Bone $light={light} $h="13px" $w="60%" />
            <Bone $light={light} $h="10px" $w="40%" />
          </div>
        </div>
        <Bone $light={light} $h="11px" $w="90%" />
        <Bone $light={light} $h="11px" $w="75%" />
        <Bone $light={light} $h="11px" $w="50%" />
        <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
          {[...Array(5)].map((_, s) => (
            <Bone key={s} $light={light} $w="16px" $h="16px" $radius="3px" />
          ))}
        </div>
      </FeedbackCardShell>
    ))}
  </FeedbackGrid>
);

// ── Employee profile card skeleton ────────────────────────────────────────────
const ProfileCardShell = styled.div`
  border-radius: 24px;
  padding: 40px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  max-width: 480px;
  margin: 0 auto;
`;

export const ProfileSkeleton = () => (
  <ProfileCardShell>
    <Bone $w="90px" $h="90px" $radius="50%" />
    <Bone $h="20px" $w="50%" />
    <Bone $h="14px" $w="35%" />
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
      <Bone $h="14px" $w="100%" />
      <Bone $h="14px" $w="80%" />
      <Bone $h="14px" $w="65%" />
    </div>
    <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginTop: "8px" }}>
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
          <Bone $w="60px" $h="60px" $radius="12px" />
          <Bone $h="11px" $w="80%" />
        </div>
      ))}
    </div>
  </ProfileCardShell>
);

export default Bone;
