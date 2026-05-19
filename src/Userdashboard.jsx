import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE = window.location.hostname === "localhost" ? "http://localhost:8080/api" : "https://gymj-10.onrender.com/api";

const Userdashboard = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", msg: "" });

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackMsg.trim()) return;

    setSubmitting(true);
    setSubmitStatus({ type: "", msg: "" });

    const userEmail = localStorage.getItem("userEmail") || "Anonymous";
    const userName = localStorage.getItem("userName") || "Anonymous";

    try {
      const res = await fetch(`${API_BASE}/feedbacks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          userName,
          message: feedbackMsg,
          rating
        })
      });

      if (res.ok) {
        setSubmitStatus({ type: "success", msg: "Thank you! Your feedback has been sent directly to our administration team." });
        setFeedbackMsg("");
        setRating(5);
      } else {
        const errData = await res.json();
        setSubmitStatus({ type: "danger", msg: errData.error || "Failed to submit feedback. Please try again." });
      }
    } catch (err) {
      setSubmitStatus({ type: "danger", msg: "Connection error. Failed to reach server." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="userdashboard-container text-white min-vh-100 d-flex flex-column align-items-center justify-content-start w-100 px-3 py-5"
      style={{ 
        background: '#0a0a0a', 
        backgroundImage: 'radial-gradient(circle at 50% 50%, #161616 0%, #0a0a0a 100%)',
        paddingTop: '100px !important'
      }}
    >
      {/* Hero Welcome Section */}
      <div className="container text-center mt-5 mb-4">
        <div
          className="mx-auto p-4 p-md-5 rounded-4 shadow-lg border border-warning border-opacity-25"
          style={{ maxWidth: '800px', background: 'rgba(20, 20, 20, 0.8)', backdropFilter: 'blur(10px)' }}
        >
          <h1 className="display-4 fw-bold mb-3" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}>
            Welcome Back, <span className="text-warning">{localStorage.getItem("userName")?.split(" ")[0] || "Champion"}</span>
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

      {/* Feedback Section */}
      <div className="container py-4" style={{ maxWidth: '600px' }}>
        <div
          className="p-4 rounded-4 shadow-lg border border-warning border-opacity-25"
          style={{ background: 'rgba(20, 20, 20, 0.8)', backdropFilter: 'blur(10px)' }}
        >
          <h3 className="h5 text-warning mb-3 fw-bold d-flex align-items-center justify-content-between">
            <span>Share Your Experience</span>
            <small className="text-secondary" style={{ fontSize: '0.75rem' }}>Direct Line to Management</small>
          </h3>
          <p className="text-secondary small mb-3">Tell us how we are doing! Your thoughts are displayed on the administration board instantly.</p>

          <form onSubmit={handleFeedbackSubmit}>
            <div className="mb-3">
              <label className="text-secondary small mb-2 d-block fw-bold" style={{ letterSpacing: '0.5px' }}>YOUR RATING</label>
              <div className="d-flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="border-0 bg-transparent p-0"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    <span 
                      style={{ 
                        fontSize: '2rem', 
                        color: star <= (hoveredRating || rating) ? '#ffc107' : '#333',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textShadow: star <= (hoveredRating || rating) ? '0 0 8px rgba(255, 193, 7, 0.5)' : 'none'
                      }}
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="text-secondary small mb-2 d-block fw-bold" style={{ letterSpacing: '0.5px' }}>FEEDBACK / SUGGESTION</label>
              <textarea
                className="form-control bg-dark border-secondary text-white rounded-3 p-3"
                rows="3"
                placeholder="What can we do to improve? Tell us your experience..."
                value={feedbackMsg}
                onChange={(e) => setFeedbackMsg(e.target.value)}
                required
                style={{ resize: 'none', border: '1px solid rgba(255,255,255,0.15)' }}
              />
            </div>

            {submitStatus.msg && (
              <div className={`alert py-2 px-3 rounded-3 small mb-3 ${submitStatus.type === 'success' ? 'alert-success border-success bg-success bg-opacity-10 text-success' : 'alert-danger border-danger bg-danger bg-opacity-10 text-danger'}`}>
                {submitStatus.msg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-warning w-100 fw-bold rounded-pill py-2 shadow-sm"
              style={{ transition: 'all 0.3s ease' }}
            >
              {submitting ? 'Submitting Feedback...' : 'Send Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Userdashboard;
