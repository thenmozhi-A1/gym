import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Subscription from "./Subscription";
import BMICalculator from "./BMICalculator";
import Workouts from "./Workouts";
import Nutrition from "./Nutrition";
import UserReports from "./UserReports";

const Userdashboard = () => {
  const navigate = useNavigate();
  const [showBMI, setShowBMI] = useState(false);

  return (
    <div
      className="userdashboard-container text-white min-vh-100 d-flex flex-column align-items-center justify-content-center w-100 px-3"
      style={{ background: '#0a0a0a', backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 100%)' }}
    >
      {/* Hero Welcome Section */}
      <div className="container text-center py-5">
        <div
          className="mx-auto p-4 p-md-5 rounded-4 shadow-lg border border-warning border-opacity-25"
          style={{ maxWidth: '800px', background: 'rgba(20, 20, 20, 0.8)', backdropFilter: 'blur(10px)' }}
        >
          <h1 className="display-4 fw-bold mb-3" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}>
            Welcome Back, <span className="text-warning">Champion</span>
          </h1>
          <p className="lead text-secondary mb-4" style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.25rem)' }}>
            Your fitness journey is progressing beautifully. Ready to crush today's goals and reach new heights?
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <button
              className="btn btn-warning btn-lg fw-bold px-4 py-3 rounded-pill shadow-sm"
              style={{ minWidth: '200px' }}
              onClick={() => navigate("/workouts")}
            >
              Start Today's Workout
            </button>
            <button
              className="btn btn-outline-warning btn-lg fw-bold px-4 py-3 rounded-pill"
              style={{ minWidth: '200px' }}
              onClick={() => navigate("/dashboard/stats")}
            >
              View Performance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userdashboard;
