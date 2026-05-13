import React, { useState } from "react";
import styled from "styled-components";
import { Activity, Target, Weight } from "lucide-react";

const BMICalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBMI] = useState(null);
  const [status, setStatus] = useState("");

  const calculateBMI = (e) => {
    e.preventDefault();
    if (!weight || !height) return;

    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    setBMI(bmiValue);

    if (bmiValue < 18.5) {
      setStatus("Underweight");
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
      setStatus("Healthy Weight");
    } else if (bmiValue >= 25 && bmiValue <= 29.9) {
      setStatus("Overweight");
    } else {
      setStatus("Obese");
    }
  };

  return (
    <CalculatorContainer>
      <div className="calc-card">
        <div className="header">
          <Activity size={32} className="icon" />
          <h2>BMI <span className="text-warning">CALCULATOR</span></h2>
          <p>Track your health metrics instantly.</p>
        </div>

        <form onSubmit={calculateBMI}>
          <div className="input-group">
            <label>Weight (kg)</label>
            <div className="input-wrapper">
              <Weight size={18} className="input-icon" />
              <input
                type="number"
                placeholder="Ex: 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Height (cm)</label>
            <div className="input-wrapper">
              <Target size={18} className="input-icon" />
              <input
                type="number"
                placeholder="Ex: 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="calc-btn">
            Calculate Now
          </button>
        </form>

        {bmi && (
          <div className="result-area">
            <div className="bmi-value">{bmi}</div>
            <div className={`bmi-status ${status.toLowerCase().replace(" ", "-")}`}>
              {status}
            </div>
            <p className="bmi-info">
              {status === "Healthy Weight"
                ? "Excellent! Maintain your current lifestyle."
                : "Consult our trainers for a personalized plan."}
            </p>
          </div>
        )}
      </div>
    </CalculatorContainer>
  );
};

const CalculatorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  .calc-card {
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(16px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.4);
    padding: 40px;
    border-radius: 30px;
    width: 100%;
    max-width: 450px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.05);
    text-align: center;
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(255, 193, 7, 0.5);
      box-shadow: 0 30px 60px rgba(0,0,0,0.1);
    }
  }

  .header {
    margin-bottom: 30px;
    .icon { color: #ffc107; margin-bottom: 10px; }
    h2 { font-size: 1.8rem; font-weight: 800; color: #1a1a1a; margin-bottom: 5px; }
    p { color: #666; font-size: 0.9rem; font-weight: 500; }
  }

  .input-group {
    text-align: left;
    margin-bottom: 20px;
    label { font-size: 0.85rem; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; display: block; text-transform: uppercase; letter-spacing: 1px; }
  }

  .input-wrapper {
    position: relative;
    .input-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #888; }
    input {
      width: 100%;
      padding: 12px 15px 12px 45px;
      border-radius: 12px;
      border: 1px solid rgba(0,0,0,0.1);
      background: rgba(255,255,255,0.8);
      font-weight: 600;
      transition: all 0.3s ease;
      &:focus { outline: none; border-color: #ffc107; box-shadow: 0 0 0 4px rgba(255,193,7,0.1); }
    }
  }

  .calc-btn {
    width: 100%;
    padding: 15px;
    background: #ffc107;
    color: black;
    border: none;
    border-radius: 12px;
    font-weight: 800;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;

    &:hover {
      background: #e5ac00;
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(255,193,7,0.2);
    }
  }

  .result-area {
    margin-top: 30px;
    padding-top: 25px;
    border-top: 1px solid rgba(0,0,0,0.05);
    animation: fadeIn 0.5s ease;
  }

  .bmi-value { font-size: 3rem; font-weight: 900; color: #1a1a1a; line-height: 1; }
  .bmi-status { 
    display: inline-block;
    padding: 5px 15px;
    border-radius: 50px;
    font-size: 0.85rem;
    font-weight: 800;
    margin: 10px 0;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .healthy-weight { background: #d1fae5; color: #065f46; }
  .overweight { background: #fef3c7; color: #92400e; }
  .underweight { background: #e0f2fe; color: #075985; }
  .obese { background: #fee2e2; color: #991b1b; }

  .bmi-info { font-size: 0.85rem; color: #666; font-weight: 500; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default BMICalculator;
