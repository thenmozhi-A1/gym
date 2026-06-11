import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Activity, Weight, Ruler } from "lucide-react";

const BMICalculator = () => {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [bmi, setBMI] = useState(22.9);
  const [status, setStatus] = useState("Healthy");
  const [emoji, setEmoji] = useState("💪");

  useEffect(() => {
    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBMI(bmiValue);

    if (bmiValue < 18.5) { setStatus("Underweight"); setEmoji("⚡"); }
    else if (bmiValue < 25) { setStatus("Healthy"); setEmoji("💪"); }
    else if (bmiValue < 30) { setStatus("Overweight"); setEmoji("🔥"); }
    else { setStatus("Obese"); setEmoji("⚠️"); }
  }, [weight, height]);

  const getGradient = () => {
    if (status === "Healthy") return "linear-gradient(135deg, #f8a000, #ffc107)";
    if (status === "Underweight") return "linear-gradient(135deg, #00b4d8, #0077b6)";
    if (status === "Overweight") return "linear-gradient(135deg, #ff6b35, #ff4d00)";
    return "linear-gradient(135deg, #e63946, #c1121f)";
  };

  const getNeedlePos = () => {
    const min = 15, max = 40;
    return Math.min(Math.max(((bmi - min) / (max - min)) * 100, 0), 100);
  };

  return (
    <CardWrapper>
      {/* ── TOP GRADIENT PANEL ── */}
      <div className="top-panel" style={{ background: getGradient() }}>
        <div className="top-row">
          <div className="calc-title">
            <Activity size={20} />
            <span>BMI CALCULATOR</span>
          </div>
          <div className="emoji-badge">{emoji}</div>
        </div>

        <div className="big-result">
          <span className="result-num">{bmi}</span>
          <div className="result-meta">
            <span className="result-label">Body Mass Index</span>
            <span className="result-status">{status}</span>
          </div>
        </div>

        {/* Gauge Bar */}
        <div className="gauge-row">
          <div className="gauge-bg">
            <div className="gauge-fill" style={{ width: `${getNeedlePos()}%` }} />
            <div className="gauge-dot" style={{ left: `${getNeedlePos()}%` }} />
          </div>
          <div className="gauge-ticks">
            <span>15</span>
            <span>18.5</span>
            <span>25</span>
            <span>30</span>
            <span>40</span>
          </div>
        </div>
      </div>

      {/* ── BOTTOM INPUT PANEL ── */}
      <div className="bottom-panel">
        <div className="slider-group">
          <div className="slider-header">
            <div className="slider-label">
              <Weight size={16} className="icon" />
              <span>Weight</span>
            </div>
            <div className="slider-val">{weight} <span>kg</span></div>
          </div>
          <input
            type="range"
            min="30"
            max="150"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="styled-slider"
            style={{ "--pct": `${((weight - 30) / 120) * 100}%` }}
          />
        </div>

        <div className="slider-group">
          <div className="slider-header">
            <div className="slider-label">
              <Ruler size={16} className="icon" />
              <span>Height</span>
            </div>
            <div className="slider-val">{height} <span>cm</span></div>
          </div>
          <input
            type="range"
            min="100"
            max="220"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="styled-slider"
            style={{ "--pct": `${((height - 100) / 120) * 100}%` }}
          />
        </div>

        {/* Status hint */}
        <div className="hint-row">
          <div className="hint-pill" style={{ background: status === "Healthy" ? "#fef3c7" : "#fee2e2", color: status === "Healthy" ? "#92400e" : "#991b1b" }}>
            {status === "Healthy"
              ? "✅ You're in the ideal BMI range. Keep it up!"
              : "💡 Speak to a B&Y Fitness coach for a personalised plan."}
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};

const popIn = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const CardWrapper = styled.div`
  width: 100%;
  max-width: 480px;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0,0,0,0.4);
  animation: ${popIn} 0.5s ease;
  font-family: 'Inter', sans-serif;

  /* ── TOP PANEL ── */
  .top-panel {
    padding: 30px;
    color: #fff;
    position: relative;
    transition: background 0.5s ease;

    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;

      .calc-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.75rem;
        font-weight: 900;
        letter-spacing: 2px;
        opacity: 0.9;
      }

      .emoji-badge {
        width: 44px;
        height: 44px;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4rem;
        backdrop-filter: blur(10px);
      }
    }

    .big-result {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 25px;

      .result-num {
        font-size: 5rem;
        font-weight: 950;
        line-height: 1;
        letter-spacing: -3px;
      }

      .result-meta {
        display: flex;
        flex-direction: column;
        gap: 5px;
        .result-label { font-size: 0.7rem; opacity: 0.7; font-weight: 700; }
        .result-status { font-size: 1.4rem; font-weight: 900; }
      }
    }

    .gauge-row {
      .gauge-bg {
        height: 6px;
        background: rgba(255,255,255,0.2);
        border-radius: 10px;
        position: relative;
        margin-bottom: 8px;

        .gauge-fill {
          height: 100%;
          background: rgba(255,255,255,0.7);
          border-radius: 10px;
          transition: width 0.5s ease;
        }

        .gauge-dot {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 14px;
          height: 14px;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: left 0.5s ease;
        }
      }

      .gauge-ticks {
        display: flex;
        justify-content: space-between;
        span { font-size: 0.55rem; opacity: 0.6; font-weight: 700; }
      }
    }
  }

  /* ── BOTTOM PANEL ── */
  .bottom-panel {
    background: #fff;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .slider-group {
      .slider-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .slider-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #444;
          .icon { color: #ffc107; }
        }

        .slider-val {
          font-size: 1.3rem;
          font-weight: 900;
          color: #111;
          span { font-size: 0.75rem; color: #888; margin-left: 3px; }
        }
      }

      .styled-slider {
        -webkit-appearance: none;
        width: 100%;
        height: 6px;
        border-radius: 10px;
        background: linear-gradient(to right, #ffc107 var(--pct, 0%), #e5e7eb var(--pct, 0%));
        outline: none;
        cursor: pointer;
        transition: background 0.3s ease;

        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffc107;
          box-shadow: 0 2px 8px rgba(255, 193, 7, 0.5);
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        &::-webkit-slider-thumb:hover { transform: scale(1.2); }
        &::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffc107;
          border: none;
          cursor: pointer;
        }
      }
    }

    .hint-pill {
      border-radius: 50px;
      padding: 12px 18px;
      font-size: 0.8rem;
      font-weight: 700;
      line-height: 1.4;
    }
  }

  @media (max-width: 480px) {
    border-radius: 24px;
    .top-panel { padding: 20px; .big-result .result-num { font-size: 4rem; } }
    .bottom-panel { padding: 20px; }
  }
`;

export default BMICalculator;
