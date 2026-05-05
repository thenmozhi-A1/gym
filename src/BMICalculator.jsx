import React, { useState } from "react";

const BMICalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBMI] = useState(null);
  const [status, setStatus] = useState("");

  const calculateBMI = () => {
    if (!weight || !height) return;
    
    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    
    setBMI(bmiValue);

    if (bmiValue < 18.5) {
      setStatus("Underweight");
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
      setStatus("Normal weight");
    } else if (bmiValue >= 25 && bmiValue <= 29.9) {
      setStatus("Overweight");
    } else {
      setStatus("Obese");
    }
  };

  return (
    <div className="p-4 bg-light text-dark rounded">
      <h3 className="text-center">BMI Calculator</h3>
      <div className="mb-3">
        <label className="form-label">Weight (kg)</label>
        <input 
          type="number" 
          className="form-control" 
          value={weight} 
          onChange={(e) => setWeight(e.target.value)} 
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Height (cm)</label>
        <input 
          type="number" 
          className="form-control" 
          value={height} 
          onChange={(e) => setHeight(e.target.value)} 
        />
      </div>
      <button className="btn btn-primary w-100" onClick={calculateBMI}>
        Calculate BMI
      </button>
      
      {bmi && (
        <div className="text-center mt-3">
          <h4>Your BMI: {bmi}</h4>
          <h5 className={`text-${status === "Normal weight" ? "success" : "danger"}`}>{status}</h5>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;
