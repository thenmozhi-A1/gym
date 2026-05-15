import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { Clock, Award, Users, Check, Zap, Shield, Star, Crown, Info } from "lucide-react";

const plans = [
  {
    id: 1,
    title: "Standard Plan",
    price: 5000,
    duration: "Per Month",
    badge: "Budget Friendly",
    rating: 4.5,
    userCount: "5k+ Members",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
    features: [
      "Access during Peak Hours",
      "Basic Workout Routines",
      "Standard Gym Equipment",
      "Locker Room Access",
      "Free Hydration Station",
      "Online Support Community",
    ],
    bonus: "7-Day Money Back Guarantee",
    accent: "#3b82f6",
  },
  {
    id: 2,
    title: "Pro Membership",
    price: 9000,
    duration: "Per 6 Months",
    badge: "Most Popular",
    rating: 4.8,
    userCount: "2.5k+ Members",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1470&auto=format&fit=crop",
    features: [
      "Full Access (6 AM - Midnight)",
      "4 PT Sessions per Month",
      "Standard Nutritional Guide",
      "Locker & Shower Facilities",
      "Access to Yoga & HIIT Classes",
      "Monthly Body Scan Analysis",
    ],
    bonus: "10% Discount on Supplements",
    accent: "#f97316",
  },
  {
    id: 3,
    title: "Elite Yearly",
    price: 12000,
    duration: "Per Year",
    badge: "Best Value",
    rating: 5,
    userCount: "800+ Members",
    image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1469&auto=format&fit=crop",
    features: [
      "24/7 Access to All Gyms",
      "Unlimited Personal Training",
      "Customized Macro Plans",
      "Spa & Recovery Zone",
      "Free Supplement Monthly Kit",
      "Biometric Health Tracking",
    ],
    bonus: "Includes Free Gym Apparel",
    accent: "#ef4444",
  },
  {
    id: 4,
    title: "VIP Yearly",
    price: 18000,
    duration: "Per Year",
    badge: "Ultimate Experience",
    rating: 5,
    userCount: "300+ Members",
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop",
    features: [
      "Everything in Elite Plan",
      "Personal Nutritionist",
      "Home Workout Equipment Hire",
      "Monthly Massage Therapy",
      "Guest Pass for Friends",
      "Private Locker with Name",
    ],
    bonus: "VIP Event Invitations",
    accent: "#ffc107",
  },
  {
    id: 5,
    title: "Custom Plan",
    price: "Custom",
    duration: "Flexible",
    badge: "For Teams/Groups",
    rating: 4.9,
    userCount: "50+ Corporate Teams",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1375&auto=format&fit=crop",
    features: [
      "Tailored Group Sessions",
      "Corporate Wellness Programs",
      "Custom Training Modules",
      "Flexible Timing Slots",
      "Team Progress Reports",
      "Special Event Hosting",
    ],
    bonus: "Dedicated Account Manager",
    accent: "#a855f7",
  },
];

const Subscription = () => {
  const { hash } = useLocation();

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

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [hash]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = (amount, planName) => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded.");
      return;
    }

    const options = {
      key: "rzp_test_SoL1lxm6LzPqie",
      amount: amount * 100,
      currency: "INR",
      name: "SlayFit Arena",
      description: `Membership: ${planName}`,
      handler: function (response) {
        alert("Payment Successful! ID: " + response.razorpay_payment_id);
      },
      prefill: { name: "Warrior", email: "warrior@slayfit.com", contact: "9999999999" },
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
          <Badge>PRICING & MEMBERSHIP</Badge>
          <h1 className="display-1 fw-black italic">CHOOSE YOUR <span className="text-warning">LEVEL</span></h1>
          <p className="lead mx-auto" style={{ maxWidth: '700px' }}>
            No hidden fees. No contracts. Just pure, unadulterated performance. 
            Choose the plan that fits your ambition.
          </p>
        </div>
      </HeroSection>

      <div className="container py-5">
        {/* ── MONTHLY PLANS ── */}
        <section id="monthly-plans" className="mb-5 reveal">
          <SectionHeader>
            <Clock size={40} className="text-warning" />
            <div>
              <h2 className="fw-black italic">MONTHLY <span className="text-warning">ACCESS</span></h2>
              <p className="text-secondary">Flexible training for the modern warrior.</p>
            </div>
          </SectionHeader>
          <div className="row g-4 mt-2">
            {plans.filter(p => p.duration.includes("Month")).map(plan => (
              <div className="col-lg-6" key={plan.id}>
                <PricingCard plan={plan} onJoin={() => handlePayment(plan.price, plan.title)} />
              </div>
            ))}
          </div>
        </section>

        {/* ── YEARLY ELITE ── */}
        <section id="yearly-plans" className="py-5 reveal">
          <SectionHeader>
            <Crown size={40} className="text-warning" />
            <div>
              <h2 className="fw-black italic">ELITE <span className="text-warning">ANNUALS</span></h2>
              <p className="text-secondary">Maximum commitment. Maximum results.</p>
            </div>
          </SectionHeader>
          <div className="row g-4 mt-2">
            {plans.filter(p => p.duration.includes("Year")).map(plan => (
              <div className="col-lg-4" key={plan.id}>
                <PricingCard plan={plan} onJoin={() => handlePayment(plan.price, plan.title)} />
              </div>
            ))}
          </div>
        </section>

        {/* ── COMPARISON TABLE ── */}
        <section className="py-5 reveal">
          <div className="text-center mb-5">
            <h2 className="fw-black italic display-5">ARENA <span className="text-warning">COMPARISON</span></h2>
            <p className="text-secondary">Find exactly what you need to slay your goals.</p>
          </div>
          <ComparisonWrapper>
            <table className="table table-dark table-hover align-middle">
              <thead>
                <tr>
                  <th>FEATURES</th>
                  <th>STANDARD</th>
                  <th>PRO</th>
                  <th className="text-warning">ELITE</th>
                  <th className="text-warning">VIP</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Gym Access", "Peak Hours", "6 AM - 12 AM", "24/7 Access", "24/7 + Guest"],
                  ["Personal Trainer", "❌", "4 Sessions/Mo", "Unlimited", "Daily Elite"],
                  ["Nutrition Plan", "Generic", "Guided", "DNA-Based", "Personal Coach"],
                  ["Spa & Recovery", "❌", "❌", "Full Access", "Monthly Massage"],
                  ["Locker Type", "Standard", "Premium", "Private Suite", "Named Suite"]
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="fw-bold">{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td className="text-warning-light">{row[3]}</td>
                    <td className="text-warning-light">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ComparisonWrapper>
        </section>

        {/* ── FAQ ── */}
        <section className="py-5 reveal">
          <div className="text-center mb-5">
            <h2 className="fw-black italic display-5">COMMON <span className="text-warning">QUESTIONS</span></h2>
          </div>
          <div className="row g-4">
            {[
              { q: "Can I upgrade my plan?", a: "Yes, you can upgrade anytime. We will adjust the remaining balance automatically." },
              { q: "Is there a joining fee?", a: "Zero hidden fees. You only pay for your membership and nothing else." },
              { q: "Can I freeze my account?", a: "Elite and VIP members can freeze their membership for up to 30 days per year." },
              { q: "Do you have trial plans?", a: "We offer a 3-day guest pass for new members to experience the SlayFit Arena." }
            ].map((faq, i) => (
              <div className="col-md-6" key={i}>
                <FaqBox>
                  <h4 className="fw-bold text-warning mb-2">{faq.q}</h4>
                  <p className="text-secondary mb-0">{faq.a}</p>
                </FaqBox>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── CUSTOM SECTION ── */}
      <section className="py-5 bg-black reveal">
        <div className="container">
          <CTASection>
            <div className="cta-content">
              <h2 className="display-4 fw-black italic">CORPORATE <span className="text-warning">SLAY</span></h2>
              <p className="lead">Tailored fitness solutions for elite teams and organizations.</p>
              <button onClick={() => window.location.href = "mailto:custom@slayfit.com"}>ENQUIRE NOW</button>
            </div>
          </CTASection>
        </div>
      </section>

    </PageWrapper>
  );
};

const PricingCard = ({ plan, onJoin }) => (
  <CardWrapper accent={plan.accent}>
    <div className="image-part">
      <img src={plan.image} alt={plan.title} />
      <div className="overlay"></div>
      <div className="top-tags">
        <span className="badge-slay">{plan.badge}</span>
        <div className="rating">⭐ {plan.rating}</div>
      </div>
      <div className="title-box">
        <h3 className="fw-black italic">{plan.title.toUpperCase()}</h3>
        <span className="members">{plan.userCount}</span>
      </div>
    </div>
    <div className="info-part">
      <div className="price-box">
        <span className="currency">₹</span>
        <span className="amount">{typeof plan.price === 'number' ? plan.price.toLocaleString() : plan.price}</span>
        <span className="period">/{plan.duration}</span>
      </div>
      <ul className="feature-list">
        {plan.features.map((f, i) => (
          <li key={i}><Check size={16} className="text-warning" /> {f}</li>
        ))}
      </ul>
      <button className="join-btn" onClick={onJoin}>JOIN THE ARENA</button>
    </div>
  </CardWrapper>
);

// ── STYLED COMPONENTS ──

const PageWrapper = styled.div`
  background: #0a0a0a;
  color: white;
  min-height: 100vh;
  overflow-x: hidden;
  font-family: 'Inter', sans-serif;

  .reveal {
    opacity: 0;
    transform: translateY(50px);
    transition: all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    &.reveal-visible {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const HeroSection = styled.header`
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  background-image: url("https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2000");
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

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  border-left: 5px solid #ffc107;
  padding-left: 25px;
  
  h2 { font-size: 2.5rem; margin: 0; }
  p { margin: 0; opacity: 0.6; }
`;

const CardWrapper = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 25px;
  overflow: hidden;
  display: flex;
  height: 400px;
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-10px);
    border-color: #ffc107;
    box-shadow: 0 0 30px rgba(255,193,7,0.2);
    .image-part img { transform: scale(1.1); }
  }

  .image-part {
    flex: 1;
    position: relative;
    overflow: hidden;
    
    img { width: 100%; height: 100%; object-fit: cover; transition: all 0.6s ease; }
    .overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); }
    
    .top-tags {
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 2;
    }
    
    .badge-slay { background: #ffc107; color: black; padding: 4px 12px; border-radius: 4px; font-weight: 900; font-size: 0.7rem; }
    .rating { background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; }
    
    .title-box {
      position: absolute;
      bottom: 25px;
      left: 25px;
      z-index: 2;
      h3 { color: #ffc107; margin: 0; font-size: 1.8rem; }
      .members { font-size: 0.8rem; opacity: 0.6; }
    }
  }

  .info-part {
    flex: 1;
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: rgba(255,255,255,0.02);

    .price-box {
      .currency { font-size: 1.5rem; font-weight: 900; color: #ffc107; }
      .amount { font-size: 3rem; font-weight: 900; line-height: 1; }
      .period { font-size: 0.9rem; opacity: 0.5; }
    }

    .feature-list {
      list-style: none;
      padding: 0;
      margin: 20px 0;
      li { font-size: 0.9rem; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; opacity: 0.8; }
    }

    .join-btn {
      background: #ffc107;
      color: black;
      border: none;
      padding: 15px;
      border-radius: 12px;
      font-weight: 900;
      font-style: italic;
      transition: all 0.3s ease;
      &:hover { background: white; transform: scale(1.02); }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    .image-part { height: 200px; }
  }
`;

const ComparisonWrapper = styled.div`
  background: rgba(255,255,255,0.03);
  border-radius: 25px;
  padding: 30px;
  border: 1px solid rgba(255,255,255,0.1);
  overflow-x: auto;
  
  table { 
    margin-bottom: 0;
    th { border: none; font-weight: 900; font-style: italic; letter-spacing: 1px; color: #ffc107; padding: 20px; }
    td { border-color: rgba(255,255,255,0.05); padding: 15px 20px; opacity: 0.8; }
    .text-warning-light { color: #ffe082; font-weight: 600; }
  }
`;

const FaqBox = styled.div`
  background: rgba(255,255,255,0.03);
  padding: 30px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  height: 100%;
  transition: all 0.3s ease;
  &:hover { background: rgba(255,255,255,0.05); border-color: #ffc107; }
`;

const CTASection = styled.div`
  background-image: linear-gradient(to right, rgba(0,0,0,0.8), transparent), url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000");
  background-size: cover;
  background-position: center;
  border-radius: 30px;
  padding: 80px 60px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);

  .cta-content {
    position: relative;
    z-index: 2;
    max-width: 600px;
    button {
      margin-top: 30px;
      background: #ffc107;
      color: black;
      border: none;
      padding: 18px 45px;
      border-radius: 15px;
      font-weight: 900;
      font-style: italic;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      &:hover { background: white; transform: scale(1.05); }
    }
  }

  @media (max-width: 768px) {
    padding: 60px 30px;
    text-align: center;
    background-image: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000");
  }
`;

export default Subscription;
