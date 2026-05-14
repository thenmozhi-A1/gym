import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { TrendingDown, Zap, CheckCircle, Flame, Leaf, Apple, Activity, Droplets, Info } from "lucide-react";

import styled from "styled-components";

const Nutrition = () => {
  const { hash } = useLocation();
  const [activeGoal, setActiveGoal] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    goals: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const API_BASE = "https://gymj-9.onrender.com/api";
      const res = await fetch(`${API_BASE}/consultations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          phone: formData.phone,
          email: formData.email,
          goals: formData.goals
        })
      });

      if (res.ok) {
        alert("Request submitted successfully! Our nutritionist will contact you soon.");
        setFormData({ name: "", phone: "", email: "", goals: "" });
      } else {
        alert("Failed to submit request. Please try again.");
      }
    } catch (err) {
      alert("Cannot connect to server. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (keeping goalDetails and useEffect logic the same)

  const goalDetails = {
    "Weight Loss": {
      description: "Focus on a caloric deficit by consuming 500-700 calories less than your maintenance level.",
      tips: [
        "Prioritize lean proteins like chicken, fish, and legumes to preserve muscle.",
        "Include plenty of leafy greens and high-fiber vegetables to stay full.",
        "Drink at least 3-4 liters of water daily to support metabolism."
      ],
      color: "primary",
      backgroundImage: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop"
    },
    "Muscle Gain": {
      description: "Requires a caloric surplus (250-500 calories above maintenance) and high protein intake.",
      tips: [
        "Aim for 1.8-2.2g of protein per kg of body weight.",
        "Fuel intense training with complex carbs like sweet potatoes and brown rice.",
        "Don't skip healthy fats; they are crucial for hormone production."
      ],
      color: "danger",
      backgroundImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
    },
    "Maintenance": {
      description: "Match your caloric intake with your energy expenditure for stable weight and performance.",
      tips: [
        "Focus on a balanced macro ratio (40% Carbs, 30% Protein, 30% Fats).",
        "Adjust intake based on daily activity levels.",
        "Excellent for improving strength and endurance without weight change."
      ],
      color: "success",
      backgroundImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop"
    },
    "Keto Diet": {
      description: "A very low-carb, high-fat diet that shifts metabolism towards burning fat (ketosis).",
      tips: [
        "Keep carb intake below 50g per day.",
        "Increase intake of healthy oils, avocados, and fatty fish.",
        "Monitor electrolyte levels (Sodium, Potassium, Magnesium)."
      ],
      color: "warning",
      backgroundImage: "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?q=80&w=2072&auto=format&fit=crop"
    },
    "Vegan Plan": {
      description: "A 100% plant-based approach focused on whole foods and high-quality plant proteins.",
      tips: [
        "Combine grains and legumes to ensure a complete amino acid profile.",
        "Source iron from lentils, spinach, and fortified cereals.",
        "Supplement with Vitamin B12 and Vitamin D regularly."
      ],
      color: "info",
      backgroundImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop"
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  const handleProductPayment = (amount, productName) => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please check your internet connection.");
      return;
    }

    const options = {
      key: "rzp_test_SoL1lxm6LzPqie",
      amount: amount * 100,
      currency: "INR",
      name: "GymDash Shop",
      description: `Purchase: ${productName}`,
      handler: function (response) {
        alert(`Payment Successful for ${productName}! Payment ID: ` + response.razorpay_payment_id);
      },
      prefill: {
        name: "Dinesh",
        email: "dinesh@gmail.com",
        contact: "1234567890",
      },
      theme: {
        color: "#ffc107",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <PageWrapper>
      {/* Hero Section */}
      <header
        className="text-white text-center d-flex flex-column justify-content-center align-items-center"
        style={{
          background: "transparent",
          height: "45vh",
          width: "100%",
        }}
      >
        <h1 className="display-2 fw-bold mb-3" style={{ color: "black" }}>Fuel Your Fitness</h1>
        <p className="lead fs-3">Eat right, train hard, and achieve your goals.</p>
        <a href="#meal-plans" className="btn btn-warning btn-lg mt-4 px-5 rounded-pill fw-bold shadow">View Meal Plans</a>
      </header>

      {/* Macro nutrient Breakdown */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold">Macro nutrient Breakdown</h2>
          <p className="text-muted fs-5">Understanding macro nutrients is key to optimal performance.</p>
        </div>

        <div className="row g-4 text-center justify-content-center">
          <div className="col-md-4">
            <GlassCard
              className="card h-100 p-4 transition-hover border-0 text-white"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=2070&auto=format&fit=crop")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="bg-warning rounded-circle p-4 mx-auto mb-4 shadow" style={{ width: "fit-content" }}>
                <Activity size={40} className="text-dark" />
              </div>
              <h3 className="fw-bold mb-3 text-warning">Protein</h3>
              <p className="text-white fw-medium">Essential for muscle growth and recovery. Aim for 1.6g-2.2g per kg of body weight.</p>
            </GlassCard>
          </div>
          <div className="col-md-4">
            <GlassCard
              className="card h-100 p-4 transition-hover border-0 text-white"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=2070&auto=format&fit=crop")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="bg-warning rounded-circle p-4 mx-auto mb-4 shadow" style={{ width: "fit-content" }}>
                <Zap size={40} className="text-dark" />
              </div>
              <h3 className="fw-bold mb-3 text-warning">Carbohydrates</h3>
              <p className="text-white fw-medium">The primary source of energy for intense workouts. Focus on complex carbs like oats and quinoa.</p>
            </GlassCard>
          </div>
          <div className="col-md-4">
            <GlassCard
              className="card h-100 p-4 transition-hover border-0 text-white"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=2075&auto=format&fit=crop")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="bg-warning rounded-circle p-4 mx-auto mb-4 shadow" style={{ width: "fit-content" }}>
                <Droplets size={40} className="text-dark" />
              </div>
              <h3 className="fw-bold mb-3 text-warning">Fats</h3>
              <p className="text-white fw-medium">Supports overall health, brain function, and hormone production. Choose healthy fats like avocado.</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Meal Plans Section */}
      <section id="meal-plans" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark">Nutrition Meal Plans</h2>
            <div className="mx-auto bg-warning mb-3" style={{ height: "5px", width: "100px", borderRadius: "10px" }}></div>
            <p className="text-muted">Click on a fitness goal to see detailed nutritional strategies.</p>
          </div>

          <div className="row justify-content-center g-4">
            {/* Table Column */}
            <div className={activeGoal ? "col-lg-5 transition-all" : "col-lg-10 transition-all"}>
              <GlassCard
                className="card overflow-hidden shadow-lg border-0 text-white"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=2070&auto=format&fit=crop")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <style>
                  {`
                    .hide-scrollbar::-webkit-scrollbar { display: none; }
                    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; overflow-x: auto; }
                    .clickable-row { cursor: pointer; transition: all 0.2s ease; }
                    .clickable-row:hover { background-color: rgba(255, 255, 255, 0.1) !important; }
                    .active-goal-row { background-color: rgba(255, 193, 7, 0.2) !important; border-left: 5px solid #ffc107; }
                    .transition-all { transition: all 0.5s ease; }
                    .table-dark-custom { --bs-table-bg: transparent; --bs-table-color: white; --bs-table-hover-bg: rgba(255,255,255,0.05); }
                  `}
                </style>
                <div className="hide-scrollbar">
                  <table className="table table-hover mb-0 align-middle w-100 table-dark-custom">
                    <thead>
                      <tr style={{ background: "#212529", color: "#ffc107" }}>
                        <th className="py-3 px-3 fs-6 fw-bold border-0 text-center">Fitness Goal</th>
                        <th className="py-3 px-3 fs-6 fw-bold border-0 text-center">Dietary Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={`clickable-row ${activeGoal === "Weight Loss" ? "active-goal-row" : ""}`} onClick={() => setActiveGoal("Weight Loss")}>
                        <td className="py-3 px-2 border-bottom">
                          <div className="d-flex align-items-center justify-content-center">
                            <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-2 me-2"><TrendingDown size={18} /></div>
                            <span className="fw-bold small">Weight Loss</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 border-bottom small text-secondary text-center">Low calorie high protein</td>
                      </tr>
                      <tr className={`clickable-row ${activeGoal === "Muscle Gain" ? "active-goal-row" : ""}`} onClick={() => setActiveGoal("Muscle Gain")}>
                        <td className="py-3 px-2 border-bottom">
                          <div className="d-flex align-items-center justify-content-center">
                            <div className="bg-danger bg-opacity-10 text-danger rounded-3 p-2 me-2"><Zap size={18} /></div>
                            <span className="fw-bold small">Muscle Gain</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 border-bottom small text-secondary text-center">High protein high calorie</td>
                      </tr>
                      <tr className={`clickable-row ${activeGoal === "Maintenance" ? "active-goal-row" : ""}`} onClick={() => setActiveGoal("Maintenance")}>
                        <td className="py-3 px-2 border-bottom">
                          <div className="d-flex align-items-center justify-content-center">
                            <div className="bg-success bg-opacity-10 text-success rounded-3 p-2 me-2"><CheckCircle size={18} /></div>
                            <span className="fw-bold small">Maintenance</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 border-bottom small text-secondary text-center">Balanced nutrition</td>
                      </tr>
                      <tr className={`clickable-row ${activeGoal === "Keto Diet" ? "active-goal-row" : ""}`} onClick={() => setActiveGoal("Keto Diet")}>
                        <td className="py-3 px-2 border-bottom">
                          <div className="d-flex align-items-center justify-content-center">
                            <div className="bg-warning bg-opacity-10 text-dark rounded-3 p-2 me-2"><Flame size={18} /></div>
                            <span className="fw-bold small text-dark">Keto Diet</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 border-bottom small text-secondary text-center">Low carb plan</td>
                      </tr>
                      <tr className={`clickable-row ${activeGoal === "Vegan Plan" ? "active-goal-row" : ""}`} onClick={() => setActiveGoal("Vegan Plan")}>
                        <td className="py-3 px-2 border-0">
                          <div className="d-flex align-items-center justify-content-center">
                            <div className="bg-info bg-opacity-10 text-info rounded-3 p-2 me-2"><Leaf size={18} /></div>
                            <span className="fw-bold small">Vegan Plan</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 border-0 small text-secondary text-center">Plant-based meals</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </div>

            {/* Details Column */}
            {activeGoal && (
              <div className="col-lg-7 animate__animated animate__fadeInRight">
                <GlassCard
                  className={`card rounded-4 p-4 h-100 transition-all overflow-hidden position-relative`}
                  style={goalDetails[activeGoal].backgroundImage ? {
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${goalDetails[activeGoal].backgroundImage}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white'
                  } : {
                    background: '#ffffff'
                  }}
                >
                  <div className="position-relative z-1">
                    <div className="d-flex align-items-center mb-4">
                      <div className={`bg-${goalDetails[activeGoal].color} text-white rounded-circle p-3 d-inline-block shadow me-3`}>
                        <Info size={32} />
                      </div>
                      <h3 className={`h2 fw-bold ${goalDetails[activeGoal].backgroundImage ? 'text-white' : `text-${goalDetails[activeGoal].color}`} mb-0`}>
                        {activeGoal} Strategy
                      </h3>
                    </div>
                    <p className={`fs-5 ${goalDetails[activeGoal].backgroundImage ? 'text-white-50' : 'text-dark'} mb-4`}>
                      {goalDetails[activeGoal].description}
                    </p>
                    <div className="row g-3">
                      {goalDetails[activeGoal].tips.map((tip, index) => (
                        <div key={index} className="col-md-4">
                          <div className={`p-3 rounded-3 shadow-sm border-top border-4 border-warning h-100 ${goalDetails[activeGoal].backgroundImage ? 'bg-dark bg-opacity-50 text-white' : 'bg-white text-muted'}`}>
                            <p className="mb-0 small fw-semibold">{tip}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      className={`btn ${goalDetails[activeGoal].backgroundImage ? 'btn-outline-light' : 'btn-outline-dark'} mt-4 rounded-pill px-4 align-self-start`}
                      onClick={() => setActiveGoal(null)}
                    >
                      Close Details
                    </button>
                  </div>
                </GlassCard>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sample Daily Menu */}
      <section className="text-white py-5">
        <div className="container">
          <div className="text-center mb-5">
            <div className="d-flex align-items-center justify-content-center mb-3">
              <Apple size={32} className="text-warning me-3" />
              <h2 className="display-6 fw-bold mb-0">Sample Daily Menu</h2>
            </div>
            <p className="text-muted fs-5">A balanced 1,800 - 2,000 calorie day for optimal performance.</p>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <GlassCard
                className="p-4 rounded-4 border-0 h-100 shadow-lg position-relative overflow-hidden text-center transition-hover text-white"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=2070&auto=format&fit=crop")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="position-absolute top-0 end-0 bg-warning text-dark px-3 py-1 fw-bold rounded-bl-4">450 kcal</div>
                <h4 className="text-warning fw-bold mb-3 mt-2">Breakfast</h4>
                <p className="fs-5 mb-3">Oatmeal with fresh banana, walnuts & a scoop of whey protein.</p>
                <ul className="small text-white-50 list-unstyled d-inline-block text-start">
                  <li><CheckCircle size={14} className="me-2 text-warning" /> High fiber for energy</li>
                  <li><CheckCircle size={14} className="me-2 text-warning" /> 30g Protein for repair</li>
                </ul>
              </GlassCard>
            </div>
            <div className="col-md-4">
              <GlassCard
                className="p-4 rounded-4 border-0 h-100 shadow-lg position-relative overflow-hidden text-center transition-hover text-white"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2060&auto=format&fit=crop")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="position-absolute top-0 end-0 bg-warning text-dark px-3 py-1 fw-bold rounded-bl-4">650 kcal</div>
                <h4 className="text-warning fw-bold mb-3 mt-2">Lunch</h4>
                <p className="fs-5 mb-3">Grilled chicken, quinoa, and mixed steamed vegetables.</p>
                <ul className="small text-white-50 list-unstyled d-inline-block text-start">
                  <li><CheckCircle size={14} className="me-2 text-warning" /> Lean protein & carbs</li>
                  <li><CheckCircle size={14} className="me-2 text-warning" /> Vitamins A and K</li>
                </ul>
              </GlassCard>
            </div>
            <div className="col-md-4">
              <GlassCard
                className="p-4 rounded-4 border-0 h-100 shadow-lg position-relative overflow-hidden text-center transition-hover text-white"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=2070&auto=format&fit=crop")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="position-absolute top-0 end-0 bg-warning text-dark px-3 py-1 fw-bold rounded-bl-4">550 kcal</div>
                <h4 className="text-warning fw-bold mb-3 mt-2">Dinner</h4>
                <p className="fs-5 mb-3">Baked Atlantic salmon, roasted sweet potatoes, and spinach salad.</p>
                <ul className="small text-white-50 list-unstyled d-inline-block text-start">
                  <li><CheckCircle size={14} className="me-2 text-warning" /> Omega-3 for health</li>
                  <li><CheckCircle size={14} className="me-2 text-warning" /> Low glycemic carbs</li>
                </ul>
              </GlassCard>
            </div>
          </div>

          <div className="row justify-content-center mt-5">
            <div className="col-lg-8 text-center p-4 bg-white rounded-4 border border-warning shadow-sm">
              <h4 className="fw-bold mb-0 text-dark">Total Daily Estimate: <span className="text-warning">~1,650 - 1,800 Calories</span></h4>
              <p className="mb-0 text-muted small mt-2">*Note: Calorie needs vary based on age, weight, and activity level.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Essential Supplements Guide */}
      <section id="supplements" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark">Essential Supplements Guide</h2>
            <div className="mx-auto bg-warning mb-3" style={{ height: "5px", width: "100px", borderRadius: "10px" }}></div>
            <p className="text-muted fs-5">Enhance your results with scientifically-backed supplementation.</p>
          </div>

          <div className="row g-4">
            <div className="col-lg-4">
              <GlassCard
                className="card h-100 border-0 shadow-lg overflow-hidden transition-hover text-white"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("/whey.png")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '380px'
                }}
              >
                <div className="card-body p-4 d-flex flex-column justify-content-end h-100">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-warning text-dark rounded-circle p-2 me-3">
                      <Zap size={20} />
                    </div>
                    <h3 className="h4 fw-bold mb-0 text-warning">Whey Protein</h3>
                  </div>
                  <p className="text-white-50 small">The gold standard for muscle recovery. Fast-absorbing protein that provides essential amino acids to repair muscle fibers after intense workouts.</p>
                  <ul className="small text-white list-unstyled mb-0">
                    <li><CheckCircle size={14} className="me-2 text-warning" /> 20-25g protein per scoop</li>
                    <li><CheckCircle size={14} className="me-2 text-warning" /> Low in fats and carbs</li>
                    <li><CheckCircle size={14} className="me-2 text-warning" /> Ideal post-workout or between meals</li>
                  </ul>
                </div>
              </GlassCard>
            </div>
            <div className="col-lg-4">
              <GlassCard
                className="card h-100 border-0 shadow-lg overflow-hidden transition-hover text-white"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("/creatine.png")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '380px'
                }}
              >
                <div className="card-body p-4 d-flex flex-column justify-content-end h-100">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-warning text-dark rounded-circle p-2 me-3">
                      <Flame size={20} />
                    </div>
                    <h3 className="h4 fw-bold mb-0 text-warning">Creatine</h3>
                  </div>
                  <p className="text-white-50 small">The most researched supplement in the world. Increases ATP production, allowing you to lift heavier and train harder for longer periods.</p>
                  <ul className="small text-white list-unstyled mb-0">
                    <li><CheckCircle size={14} className="me-2 text-warning" /> Increases strength & power</li>
                    <li><CheckCircle size={14} className="me-2 text-warning" /> Improves muscle cell hydration</li>
                    <li><CheckCircle size={14} className="me-2 text-warning" /> 3-5g daily maintenance dose</li>
                  </ul>
                </div>
              </GlassCard>
            </div>
            <div className="col-lg-4">
              <GlassCard
                className="card h-100 border-0 shadow-lg overflow-hidden transition-hover text-white"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("/vitamins.png")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '380px'
                }}
              >
                <div className="card-body p-4 d-flex flex-column justify-content-end h-100">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-warning text-dark rounded-circle p-2 me-3">
                      <Leaf size={20} />
                    </div>
                    <h3 className="h4 fw-bold mb-0 text-warning">Multivitamins</h3>
                  </div>
                  <p className="text-white-50 small">Ensures your body has the micro nutrients needed for optimal metabolic function, immune support, and overall physical well-being.</p>
                  <ul className="small text-white list-unstyled mb-0">
                    <li><CheckCircle size={14} className="me-2 text-warning" /> Supports immune health</li>
                    <li><CheckCircle size={14} className="me-2 text-warning" /> Fills nutritional gaps</li>
                    <li><CheckCircle size={14} className="me-2 text-warning" /> Essential for hormone balance</li>
                  </ul>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Nutritional Tracking & Tools Shop */}
      <section id="tracking" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark">Shop Tracking Tools</h2>
            <div className="mx-auto bg-warning mb-3" style={{ height: "5px", width: "100px", borderRadius: "10px" }}></div>
            <p className="text-muted fs-5">Premium tools to accurately measure and track your nutritional progress.</p>
          </div>

          <div className="row g-4">
            <div className="col-lg-3">
              <GlassCard className="card h-100 border-0 overflow-hidden rounded-4 transition-hover bg-white text-center">
                <div className="position-absolute top-0 start-0 m-3 badge bg-success px-3 py-2 rounded-pill">BEST SELLER</div>
                <img src="/scale.png" className="card-img-top p-4" alt="Smart Scale" style={{ height: "250px", objectFit: "contain" }} />
                <div className="card-body p-4 pt-0">
                  <h3 className="h5 fw-bold mb-2">Smart BMI Scale</h3>
                  <p className="text-muted small">Tracks weight, body fat %, muscle mass, and water weight. Syncs with our app.</p>
                  <div className="fs-4 fw-bold text-dark mb-3">₹2,499</div>
                  <button onClick={() => handleProductPayment(2499, "Smart BMI Scale")} className="btn btn-warning w-100 fw-bold rounded-pill shadow-sm">Buy Now</button>
                </div>
              </GlassCard>
            </div>
            <div className="col-lg-3">
              <GlassCard className="card h-100 border-0 overflow-hidden rounded-4 transition-hover bg-white text-center">
                <img src="/scale.png" className="card-img-top p-4" alt="Food Scale" style={{ height: "250px", objectFit: "contain" }} />
                <div className="card-body p-4 pt-0">
                  <h3 className="h5 fw-bold mb-2">Precision Food Scale</h3>
                  <p className="text-muted small">Ultra-accurate measurements down to 0.1g. Essential for strict macro tracking.</p>
                  <div className="fs-4 fw-bold text-dark mb-3">₹999</div>
                  <button onClick={() => handleProductPayment(999, "Precision Food Scale")} className="btn btn-warning w-100 fw-bold rounded-pill shadow-sm">Buy Now</button>
                </div>
              </GlassCard>
            </div>
            <div className="col-lg-3">
              <GlassCard className="card h-100 border-0 overflow-hidden rounded-4 transition-hover bg-white text-center">
                <img src="/app.png" className="card-img-top p-4" alt="Fitness Tracker" style={{ height: "250px", objectFit: "contain" }} />
                <div className="card-body p-4 pt-0">
                  <h3 className="h5 fw-bold mb-2">Elite Fitness Band</h3>
                  <p className="text-muted small">Monitor heart rate, sleep quality, and daily caloric burn in real-time.</p>
                  <div className="fs-4 fw-bold text-dark mb-3">₹3,999</div>
                  <button onClick={() => handleProductPayment(3999, "Elite Fitness Band")} className="btn btn-warning w-100 fw-bold rounded-pill shadow-sm">Buy Now</button>
                </div>
              </GlassCard>
            </div>
            <div className="col-lg-3">
              <GlassCard className="card h-100 border-0 overflow-hidden rounded-4 transition-hover bg-white text-center">
                <img src="/journal.png" className="card-img-top p-4" alt="Nutrition Journal" style={{ height: "250px", objectFit: "contain" }} />
                <div className="card-body p-4 pt-0">
                  <h3 className="h5 fw-bold mb-2">90-Day Journal</h3>
                  <p className="text-muted small">Hardcover guided journal for meal planning, mood tracking, and results.</p>
                  <div className="fs-4 fw-bold text-dark mb-3">₹599</div>
                  <button onClick={() => handleProductPayment(599, "90-Day Journal")} className="btn btn-warning w-100 fw-bold rounded-pill shadow-sm">Buy Now</button>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-5 bg-dark"  >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12" >
              <GlassCard className="card border-0 shadow-lg p-4 p-md-5 rounded-4">
                <div className="row align-items-center mb-5 text-center text-lg-start">
                  <div className="col-lg-8">
                    <h2 className="display-5 fw-bold mb-2">Get Personalized Advice</h2>
                    <p className="text-muted fs-5 mb-0">Our expert nutritionists are ready to help you reach your goals.</p>
                  </div>
                  <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                    <span className="badge bg-warning text-dark px-4 py-2 rounded-pill fw-bold fs-6">FREE CONSULTATION</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-4">
                      <label className="form-label fw-bold small text-uppercase text-secondary">Full Name</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        name="name"
                        className="form-control form-control-lg border-2 shadow-none bg-light"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold small text-uppercase text-secondary">Mobile Number</label>
                      <input
                        type="tel"
                        placeholder="+91 00000 00000"
                        name="phone"
                        className="form-control form-control-lg border-2 shadow-none bg-light"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold small text-uppercase text-secondary">Email Address</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        name="email"
                        className="form-control form-control-lg border-2 shadow-none bg-light"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-lg-9 mt-4">
                      <label className="form-label fw-bold small text-uppercase text-secondary">Your Fitness Goals</label>
                      <textarea
                        placeholder="Tell us about your fitness journey..."
                        name="goals"
                        className="form-control form-control-lg border-2 shadow-none bg-light"
                        rows="3"
                        required
                        value={formData.goals}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    <div className="col-lg-3 mt-lg-auto mb-1">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-warning btn-lg w-100 fw-bold py-3 shadow-sm rounded-4 text-uppercase tracking-wider"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Request"}
                      </button>
                    </div>
                  </div>
                </form>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  background: linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), 
              url("https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2070&auto=format&fit=crop");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  padding-bottom: 50px;
  color: #1a1a1a;

  header {
    background: transparent !important;
    height: 45vh !important;
  }

  @media (max-width: 768px) {
    background-attachment: scroll;
    h1.display-2 { font-size: 2.5rem; }
    p.lead { font-size: 1.1rem !important; }
    header { height: 35vh !important; }
    .display-5 { font-size: 1.8rem; }
  }
`;

const GlassCard = styled.div`
  background: #ffffff;
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  border-radius: 16px !important;
  
  @media (max-width: 768px) {
    padding: 20px !important;
    h3 { font-size: 1.25rem; }
    .fs-4 { font-size: 1.25rem !important; }
  }
`;

export default Nutrition;
