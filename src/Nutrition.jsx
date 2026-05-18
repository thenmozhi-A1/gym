import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  TrendingDown, Zap, CheckCircle, Flame, Leaf, Apple, Activity, 
  Droplets, Info, Target, Award, ShieldCheck, HeartPulse, Clock 
} from "lucide-react";
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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

  const goalDetails = {
    "Weight Loss": {
      description: "Focus on a caloric deficit by consuming 500-700 calories less than your maintenance level.",
      tips: [
        "Prioritize lean proteins like chicken and fish.",
        "Include plenty of leafy greens and fiber.",
        "Drink at least 3-4 liters of water daily."
      ],
      color: "#3b82f6",
      backgroundImage: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop"
    },
    "Muscle Gain": {
      description: "Requires a caloric surplus (250-500 calories above maintenance) and high protein intake.",
      tips: [
        "Aim for 1.8-2.2g of protein per kg of body weight.",
        "Fuel intense training with complex carbs.",
        "Don't skip healthy fats for hormones."
      ],
      color: "#ef4444",
      backgroundImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
    },
    "Maintenance": {
      description: "Match your caloric intake with your energy expenditure for stable weight and performance.",
      tips: [
        "Focus on a balanced 40/30/30 macro ratio.",
        "Adjust intake based on daily activity.",
        "Improve strength without weight change."
      ],
      color: "#10b981",
      backgroundImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop"
    },
    "Keto Diet": {
      description: "A very low-carb, high-fat diet that shifts metabolism towards burning fat (ketosis).",
      tips: [
        "Keep carb intake below 50g per day.",
        "Increase healthy oils and fatty fish.",
        "Monitor electrolyte levels carefully."
      ],
      color: "#f59e0b",
      backgroundImage: "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?q=80&w=2072&auto=format&fit=crop"
    },
    "Vegan Plan": {
      description: "A 100% plant-based approach focused on whole foods and high-quality plant proteins.",
      tips: [
        "Combine grains and legumes for protein.",
        "Source iron from lentils and spinach.",
        "Supplement with B12 and Vitamin D."
      ],
      color: "#06b6d4",
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
      alert("Razorpay SDK not loaded.");
      return;
    }

    const options = {
      key: "rzp_test_SoL1lxm6LzPqie",
      amount: amount * 100,
      currency: "INR",
      name: "B&Y Fitness Shop",
      description: `Purchase: ${productName}`,
      handler: function (response) {
        alert(`Payment Successful! ID: ${response.razorpay_payment_id}`);
      },
      prefill: { name: "User", email: "user@example.com", contact: "9999999999" },
      theme: { color: "#ffc107" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <PageWrapper>
      {/* ── HERO SECTION ── */}
      <HeroSection className="reveal">
        <div className="hero-overlay"></div>
        <div className="container position-relative z-2">
          <Badge>NUTRITION PERFORMANCE</Badge>
          <h1 className="display-1 fw-black italic">FUEL THE <span className="text-warning">BEAST</span></h1>
          <p className="lead mx-auto" style={{ maxWidth: '700px' }}>
            Precision nutrition for high-performance athletes. 
            Stop eating for taste, start eating for <span className="text-warning fw-bold">dominance</span>.
          </p>
          <div className="d-flex gap-3 justify-content-center mt-5">
            <PrimarySlay onClick={() => document.getElementById('meal-plans').scrollIntoView({ behavior: 'smooth' })}>
              EXPLORE PLANS <Target size={20} />
            </PrimarySlay>
            <OutlineSlay onClick={() => document.getElementById('tracking').scrollIntoView({ behavior: 'smooth' })}>
              SHOP GEAR
            </OutlineSlay>
          </div>
        </div>
      </HeroSection>

      {/* ── KEY METRICS ── */}
      {/* ── KEY METRICS ── */}
      <section className="container mb-5 reveal" style={{ marginTop: '-80px', position: 'relative', zIndex: '10' }}>
        <div className="row g-4">
          {[
            { icon: <Award />, label: "ELITE QUALITY", text: "100% Pure Sourcing" },
            { icon: <ShieldCheck />, label: "LAB TESTED", text: "Zero Contaminants" },
            { icon: <HeartPulse />, label: "HEALTH FIRST", text: "Science-Backed" },
            { icon: <Clock />, label: "24/7 SUPPORT", text: "Expert Guidance" }
          ].map((item, index) => (
            <div className="col-lg-3 col-6" key={index}>
              <MetricCard>
                <div className="icon-box">{item.icon}</div>
                <div>
                  <div className="label">{item.label}</div>
                  <div className="sub">{item.text}</div>
                </div>
              </MetricCard>
            </div>
          ))}
        </div>
      </section>

      {/* ── MACRO BREAKDOWN ── */}
      {/* ── MACRO BREAKDOWN ── */}
      <section className="container py-5 reveal">
        <div className="text-center mb-5">
          <SectionTitle>MACRO <span className="text-warning">ARCHITECT</span></SectionTitle>
          <p className="text-secondary fs-5">The building blocks of your ultimate physique.</p>
        </div>

        <div className="row g-4">
          {[
            { 
              title: "PROTEIN", 
              desc: "Muscle repair & growth synthesis.", 
              img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?q=80&w=800",
              color: "#ffc107",
              stat: "1.6 - 2.2g/kg",
              ratio: "30%"
            },
            { 
              title: "CARBS", 
              desc: "Glycogen fuel for explosive power.", 
              img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800",
              color: "#ffc107",
              stat: "High Density",
              ratio: "50%"
            },
            { 
              title: "FATS", 
              desc: "Hormonal balance & brain health.", 
              img: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=800",
              color: "#ffc107",
              stat: "Healthy Acids",
              ratio: "20%"
            }
          ].map((macro, i) => (
            <div className="col-md-4" key={i}>
              <MacroCard style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${macro.img})` }}>
                <div className="content">
                  <div className="stat-badge">{macro.stat}</div>
                  <div className="macro-viz">
                    <div className="circle-viz" style={{ background: `conic-gradient(#ffc107 ${macro.ratio}, rgba(255,255,255,0.1) 0)` }}>
                      <span>{macro.ratio}</span>
                    </div>
                  </div>
                  <h3 className="fw-black">{macro.title}</h3>
                  <p className="small mb-0">{macro.desc}</p>
                </div>
              </MacroCard>
            </div>
          ))}
        </div>
      </section>

      {/* ── MEAL PLANS SECTION ── */}
      {/* ── MEAL PLANS SECTION ── */}
      <section id="meal-plans" className="py-5 bg-black-gradient reveal">
        <div className="container">
          <div className="text-center mb-5">
            <SectionTitle>STRATEGIC <span className="text-warning">PLANS</span></SectionTitle>
            <p className="text-secondary">Precision-engineered diets for specific performance outcomes.</p>
          </div>

          <div className="row g-4 justify-content-center">
            <div className={activeGoal ? "col-lg-4" : "col-lg-8"}>
              <PlanSelectorCard>
                <div className="plan-list">
                  {Object.keys(goalDetails).map((goal) => (
                    <div 
                      key={goal} 
                      className={`plan-item ${activeGoal === goal ? 'active' : ''}`}
                      onClick={() => setActiveGoal(goal)}
                    >
                      <div className="plan-icon" style={{ color: goalDetails[goal].color }}>
                        {goal === "Weight Loss" && <TrendingDown />}
                        {goal === "Muscle Gain" && <Zap />}
                        {goal === "Maintenance" && <CheckCircle />}
                        {goal === "Keto Diet" && <Flame />}
                        {goal === "Vegan Plan" && <Leaf />}
                      </div>
                      <div className="plan-text">
                        <div className="name">{goal}</div>
                        <div className="desc">{goalDetails[goal].description.substring(0, 40)}...</div>
                      </div>
                    </div>
                  ))}
                </div>
              </PlanSelectorCard>
            </div>

            {activeGoal && (
              <div className="col-lg-8">
                <PlanDetailsCard style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.9)), url(${goalDetails[activeGoal].backgroundImage})` }}>
                  <div className="details-content">
                    <button className="close-btn" onClick={() => setActiveGoal(null)}>&times;</button>
                    <div className="header-row">
                      <div className="icon-circle" style={{ backgroundColor: goalDetails[activeGoal].color }}>
                        <Info size={32} color="white" />
                      </div>
                      <h2 className="display-6 fw-black m-0">{activeGoal.toUpperCase()} <span className="text-warning">STRATEGY</span></h2>
                    </div>
                    <p className="lead mb-4 text-white-50">{goalDetails[activeGoal].description}</p>
                    <div className="row g-3">
                      {goalDetails[activeGoal].tips.map((tip, idx) => (
                        <div className="col-md-4" key={idx}>
                          <TipCard>
                            <div className="tip-marker"></div>
                            <p className="mb-0 small">{tip}</p>
                          </TipCard>
                        </div>
                      ))}
                    </div>
                  </div>
                </PlanDetailsCard>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── SAMPLE MENU ── */}
      {/* ── SAMPLE MENU ── */}
      <section className="py-5 reveal">
        <div className="container">
          <div className="text-center mb-5">
            <SectionTitle>CHEF'S <span className="text-warning">SELECTION</span></SectionTitle>
            <p className="text-secondary">A glimpse into a perfect day of high-performance eating.</p>
          </div>

          <div className="row g-4">
            {[
              { time: "BREAKFAST", meal: "Oatmeal with fresh banana & whey", cal: "450 kcal", img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=800", carbs: "60g", prot: "30g", fats: "8g" },
              { time: "LUNCH", meal: "Grilled chicken, quinoa & veggies", cal: "650 kcal", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800", carbs: "70g", prot: "50g", fats: "12g" },
              { time: "DINNER", meal: "Salmon, sweet potatoes & spinach", cal: "550 kcal", img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800", carbs: "40g", prot: "45g", fats: "22g" }
            ].map((menu, i) => (
              <div className="col-md-4" key={i}>
                <MenuCard>
                  <div className="menu-image" style={{ backgroundImage: `url(${menu.img})` }}>
                    <div className="cal-tag">{menu.cal}</div>
                    <div className="macro-pills">
                      <span>C: {menu.carbs}</span>
                      <span>P: {menu.prot}</span>
                      <span>F: {menu.fats}</span>
                    </div>
                  </div>
                  <div className="menu-info">
                    <span className="time">{menu.time}</span>
                    <h4 className="fw-bold">{menu.meal}</h4>
                  </div>
                </MenuCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUPPLEMENTS ── */}
      {/* ── SUPPLEMENTS ── */}
      <section id="supplements" className="py-5 bg-darker reveal">
        <div className="container">
          <div className="text-center mb-5">
            <SectionTitle>PREMIUM <span className="text-warning">STACKS</span></SectionTitle>
            <p className="text-secondary">Supplement your hard work with pharmaceutical-grade support.</p>
          </div>

          <div className="row g-4">
            {[
              { title: "WHEY PROTEIN", icon: <Zap />, img: "/whey.png", desc: "Fast-absorbing anabolic recovery." },
              { title: "CREATINE", icon: <Flame />, img: "/creatine.png", desc: "Max ATP for explosive power." },
              { title: "MULTIVITAMINS", icon: <Leaf />, img: "/vitamins.png", desc: "Total metabolic support system." }
            ].map((supp, i) => (
              <div className="col-lg-4" key={i}>
                <SuppCard>
                  <div className="supp-bg" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${supp.img})` }}></div>
                  <div className="supp-content">
                    <div className="supp-icon">{supp.icon}</div>
                    <h3 className="fw-black">{supp.title}</h3>
                    <p className="small mb-0 text-white-50">{supp.desc}</p>
                  </div>
                </SuppCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOP TRACKING TOOLS ── */}
      {/* ── SHOP TRACKING TOOLS ── */}
      <section id="tracking" className="py-5 reveal">
        <div className="container">
          <div className="text-center mb-5">
            <SectionTitle>MEASURE <span className="text-warning">SUCCESS</span></SectionTitle>
            <p className="text-secondary">Precision tools for the metrics that matter.</p>
          </div>

          <div className="row g-4">
            {[
              { name: "Smart BMI Scale", price: 2499, img: "/scale.png", badge: "BEST SELLER" },
              { name: "Precision Food Scale", price: 999, img: "/scale.png" },
              { name: "Elite Fitness Band", price: 3999, img: "/app.png" },
              { name: "90-Day Journal", price: 599, img: "/journal.png" }
            ].map((prod, i) => (
              <div className="col-lg-3 col-md-6" key={i}>
                <ProductCard>
                  {prod.badge && <div className="prod-badge">{prod.badge}</div>}
                  <div className="prod-img">
                    <img src={prod.img} alt={prod.name} />
                  </div>
                  <div className="prod-info">
                    <h5 className="fw-bold">{prod.name}</h5>
                    <div className="price">₹{prod.price.toLocaleString()}</div>
                    <button onClick={() => handleProductPayment(prod.price, prod.name)} className="buy-btn">BUY NOW</button>
                  </div>
                </ProductCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONSULTATION FORM ── */}
      {/* ── CONSULTATION FORM ── */}
      <section className="py-5 bg-black reveal">
        <div className="container">
          <FormCard>
            <div className="row g-0">
              <div className="col-lg-5 form-image d-none d-lg-block">
                <div className="form-img-overlay">
                  <h2 className="display-4 fw-black">GET <br/> <span className="text-warning">PERSONAL</span></h2>
                  <p>Custom macros designed by pro-athletes.</p>
                </div>
              </div>
              <div className="col-lg-7 p-4 p-md-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="fw-black mb-0">CONSULTATION</h2>
                  <span className="badge-warning">FREE</span>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <SlayInput>
                        <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder=" " />
                        <label>FULL NAME</label>
                      </SlayInput>
                    </div>
                    <div className="col-md-6">
                      <SlayInput>
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder=" " />
                        <label>MOBILE NUMBER</label>
                      </SlayInput>
                    </div>
                    <div className="col-12">
                      <SlayInput>
                        <input type="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder=" " />
                        <label>EMAIL ADDRESS</label>
                      </SlayInput>
                    </div>
                    <div className="col-12">
                      <SlayInput>
                        <textarea name="goals" rows="3" required value={formData.goals} onChange={handleInputChange} placeholder=" "></textarea>
                        <label>FITNESS GOALS</label>
                      </SlayInput>
                    </div>
                    <div className="col-12 mt-4">
                      <SubmitBtn type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "PROCESSING..." : "CLAIM MY PLAN"}
                      </SubmitBtn>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </FormCard>
        </div>
      </section>

      {/* ── LIVE FEED (MOCK) ── */}
      <section className="py-5 bg-darker reveal">
        <div className="container text-center">
          <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
            <LiveDot />
            <span className="fw-bold tracking-widest text-secondary">LIVE TRANSFORMATION FEED</span>
          </div>
          <div className="row g-3">
            {[
              "Alex just started his Muscle Gain journey",
              "Sarah achieved 5% body fat reduction",
              "Mark reached 200g protein goal today",
              "Linda unlocked 'Keto Master' badge"
            ].map((text, i) => (
              <div className="col-md-3" key={i}>
                <FeedItem>{text}</FeedItem>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

// ── STYLED COMPONENTS ──

const PageWrapper = styled.div`
  background: #0a0a0a;
  color: white;
  min-height: 100vh;
  overflow-x: hidden;
  font-family: 'Inter', sans-serif;
`;

const HeroSection = styled.header`
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  background-image: url("https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2070");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(10,10,10,1));
    z-index: 1;
  }

  .fw-black { font-weight: 900; }
  .italic { font-style: italic; }
`;

const Badge = styled.span`
  background: #ffc107;
  color: black;
  padding: 5px 15px;
  font-weight: 900;
  font-size: 0.8rem;
  letter-spacing: 2px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: inline-block;
`;

const SectionTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 950;
  text-transform: uppercase;
  font-style: italic;
  letter-spacing: -2px;
  @media (max-width: 768px) { font-size: 2.5rem; }
`;

const MetricCard = styled.div`
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 20px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover { background: rgba(255,193,7,0.1); border-color: #ffc107; }

  .icon-box { color: #ffc107; }
  .label { font-weight: 900; font-size: 0.75rem; letter-spacing: 1px; color: #ffc107; }
  .sub { font-size: 0.85rem; color: #fff; }
`;

const MacroCard = styled.div`
  height: 450px;
  border-radius: 25px;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 30px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255,255,255,0.1);
  overflow: hidden;
  position: relative;

  &:hover {
    transform: translateY(-10px);
    border-color: #ffc107;
    box-shadow: 0 0 30px rgba(255,193,7,0.3);
  }

  .macro-viz {
    margin-bottom: 20px;
    .circle-viz {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        inset: 8px;
        background: #111;
        border-radius: 50%;
      }
      span {
        position: relative;
        z-index: 1;
        font-weight: 900;
        font-size: 0.9rem;
        color: #ffc107;
      }
    }
  }

  .stat-badge {
    position: absolute;
    top: 30px;
    right: 30px;
    background: #ffc107;
    color: black;
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 0.7rem;
    font-weight: 900;
  }

  .fw-black { font-weight: 900; font-size: 2rem; margin-bottom: 10px; color: #ffc107; font-style: italic; }
`;

const PlanSelectorCard = styled.div`
  background: rgba(255,255,255,0.05);
  border-radius: 20px;
  padding: 10px;
  border: 1px solid rgba(255,255,255,0.1);

  .plan-list { display: flex; flex-direction: column; gap: 8px; }

  .plan-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover { background: rgba(255,255,255,0.05); }
    &.active { background: #ffc107; .plan-icon, .name, .desc { color: black !important; } }

    .plan-icon { font-size: 24px; }
    .name { font-weight: 900; font-size: 1.1rem; }
    .desc { font-size: 0.8rem; color: #888; }
  }
`;

const PlanDetailsCard = styled.div`
  height: 100%;
  border-radius: 20px;
  background-size: cover;
  background-position: center;
  position: relative;
  padding: 50px;
  border: 1px solid rgba(255,255,255,0.1);
  overflow: hidden;
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

  .close-btn {
    position: absolute;
    top: 20px;
    right: 25px;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    opacity: 0.5;
    &:hover { opacity: 1; }
  }

  .header-row { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; }
  .icon-circle { width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .fw-black { font-weight: 900; }
`;

const TipCard = styled.div`
  background: rgba(0,0,0,0.5);
  padding: 20px;
  border-radius: 15px;
  border: 1px solid rgba(255,255,255,0.1);
  height: 100%;
  position: relative;
  overflow: hidden;

  .tip-marker {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: #ffc107;
  }
`;

const MenuCard = styled.div`
  background: rgba(255,255,255,0.03);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;

  &:hover { transform: scale(1.02); border-color: #ffc107; }

  .menu-image {
    height: 200px;
    background-size: cover;
    background-position: center;
    position: relative;
    
    .cal-tag {
      position: absolute;
      top: 15px;
      right: 15px;
      background: #ffc107;
      color: black;
      font-weight: 900;
      font-size: 0.75rem;
      padding: 5px 12px;
      border-radius: 100px;
    }

    .macro-pills {
      position: absolute;
      bottom: 15px;
      left: 15px;
      display: flex;
      gap: 5px;
      span {
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(5px);
        color: white;
        font-size: 0.6rem;
        font-weight: 900;
        padding: 4px 10px;
        border-radius: 4px;
        border: 1px solid rgba(255,255,255,0.1);
      }
    }
  }

  .menu-info {
    padding: 25px;
    .time { color: #ffc107; font-weight: 900; font-size: 0.75rem; letter-spacing: 2px; }
    h4 { margin-top: 10px; color: white; font-style: italic; }
  }
`;

const SuppCard = styled.div`
  height: 380px;
  border-radius: 25px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.5s ease;

  &:hover {
    border-color: #ffc107;
    .supp-bg { transform: scale(1.1); }
  }

  .supp-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    transition: all 0.8s ease;
  }

  .supp-content {
    position: absolute;
    inset: 0;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    z-index: 2;

    .supp-icon { color: #ffc107; font-size: 30px; margin-bottom: 15px; }
    .fw-black { font-weight: 900; font-size: 1.8rem; font-style: italic; color: #ffc107; }
  }
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  color: black;
  position: relative;
  height: 100%;
  transition: all 0.3s ease;

  &:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.5); }

  .prod-badge {
    position: absolute;
    top: 15px;
    left: 15px;
    background: #10b981;
    color: white;
    font-size: 0.6rem;
    font-weight: 900;
    padding: 4px 10px;
    border-radius: 4px;
  }

  .prod-img {
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    img { max-height: 100%; max-width: 100%; object-fit: contain; }
  }

  .price { font-size: 1.5rem; font-weight: 900; margin: 15px 0; }

  .buy-btn {
    background: black;
    color: #ffc107;
    border: none;
    width: 100%;
    padding: 12px;
    border-radius: 12px;
    font-weight: 900;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    &:hover { background: #ffc107; color: black; }
  }
`;

const FormCard = styled.div`
  background: #111;
  border-radius: 30px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);

  .form-image {
    background-image: url("https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=1000");
    background-size: cover;
    background-position: center;
    position: relative;
  }

  .form-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, transparent, #111);
    padding: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .fw-black { font-weight: 950; font-style: italic; line-height: 0.9; }
    p { opacity: 0.6; margin-top: 15px; }
  }

  .badge-warning { background: #ffc107; color: black; padding: 4px 12px; border-radius: 100px; font-weight: 900; font-size: 0.7rem; }
  .fw-black { font-weight: 950; font-style: italic; }
`;

const SlayInput = styled.div`
  position: relative;
  margin-top: 20px;

  input, textarea {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 15px;
    color: white;
    font-size: 0.9rem;
    outline: none;
    transition: all 0.3s ease;

    &:focus { border-color: #ffc107; background: rgba(255,255,255,0.08); }
    &:focus + label, &:not(:placeholder-shown) + label {
      top: -10px;
      left: 10px;
      font-size: 0.65rem;
      color: #ffc107;
      background: #111;
      padding: 0 5px;
    }
  }

  label {
    position: absolute;
    left: 15px;
    top: 15px;
    color: #666;
    font-weight: 900;
    font-size: 0.75rem;
    pointer-events: none;
    transition: all 0.3s ease;
  }
`;

const PrimarySlay = styled.button`
  padding: 15px 35px;
  border-radius: 100px;
  font-weight: 900;
  font-size: 0.9rem;
  letter-spacing: 1px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  background: #ffc107;
  color: black;
  border: none;
  &:hover { transform: scale(1.05); box-shadow: 0 15px 30px rgba(255,193,7,0.3); }
`;

const OutlineSlay = styled.button`
  padding: 15px 35px;
  border-radius: 100px;
  font-weight: 900;
  font-size: 0.9rem;
  letter-spacing: 1px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  background: transparent;
  color: white;
  border: 2px solid rgba(255,255,255,0.2);
  &:hover { background: white; color: black; border-color: white; }
`;

const SubmitBtn = styled.button`
  width: 100%;
  background: #ffc107;
  color: black;
  border: none;
  padding: 18px;
  border-radius: 15px;
  font-weight: 950;
  font-style: italic;
  font-size: 1.1rem;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  &:hover:not(:disabled) { 
    background: white; 
    transform: scale(1.02); 
    box-shadow: 0 0 40px rgba(255,193,7,0.4);
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const FeedItem = styled.div`
  background: rgba(255,255,255,0.05);
  padding: 15px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #aaa;
  border: 1px solid rgba(255,255,255,0.05);
  transition: all 0.3s ease;
  &:hover { background: rgba(255,255,255,0.1); color: #ffc107; }
`;

const LiveDot = styled.div`
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  box-shadow: 0 0 10px #ef4444;
  animation: pulse 1.5s infinite;
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.5); opacity: 0.5; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

export default Nutrition;
