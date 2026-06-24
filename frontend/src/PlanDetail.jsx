import React, { useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";

const planData = {
  monthly: {
    title: "Monthly Standard Plan",
    price: 5000,
    duration: "Per Month",
    image: "https://w0.peakpx.com/wallpaper/560/825/HD-wallpaper-bodybuilder-gym-hard-healthy-life-happy-thumbnail.jpg",
    benefits: [
      "Access during Peak Hours (6 AM - 10 AM & 5 PM - 10 PM)",
      "Full access to all Strength & Cardio equipment",
      "One-time 30-minute fitness orientation",
      "Access to standard locker rooms and showers",
      "Free high-speed WiFi in the facility",
      "Monthly guest pass (1 per month)",
    ],
    paymentDetails: [
      "Billed monthly on the day of signup",
      "Price includes 18% GST (Goods and Services Tax)",
      "Secure payment processing via Razorpay",
      "Cancel anytime with 7 days notice",
      "No hidden enrollment or activation fees",
    ],
    accent: "#00d2ff",
  },
  yearly: {
    title: "Elite Yearly Membership",
    price: 12000,
    duration: "Per Year",
    image: "https://cdn.pixabay.com/photo/2023/03/12/16/10/man-7847248_1280.jpg",
    benefits: [
      "24/7 VIP Access to all 50+ locations",
      "Unlimited Personal Training sessions",
      "Customized Nutrition & Macro tracking app access",
      "Private VIP Locker suite & Laundry service",
      "Unlimited Sauna, Steam Room & Cold Plunge access",
      "Priority booking for all premium HIIT & Yoga classes",
      "Free monthly supplement kit (Proteins/Pre-workouts)",
    ],
    paymentDetails: [
      "One-time annual payment (Best Value)",
      "Save over ₹48,000 compared to monthly billing",
      "Price inclusive of all taxes and insurance",
      "Transferable membership (to a friend/family)",
      "Exclusive access to the annual Athlete's Gala",
    ],
    accent: "#ff3e3e",
  },
  custom: {
    title: "Custom Professional Plan",
    price: 9000,
    duration: "Per 6 Months",
    image: "https://cdn.pixabay.com/photo/2024/04/19/16/56/ai-generated-8706775_1280.jpg",
    benefits: [
      "Tailored scheduling to fit your professional life",
      "4 Specialized Personal Training sessions per month",
      "Bio-metric health tracking every 15 days",
      "Access to specialized powerlifting & yoga zones",
      "Guided meditation and recovery sessions",
      "Corporate networking lounge access",
    ],
    paymentDetails: [
      "Billed every 6 months",
      "Customized invoice for corporate reimbursement",
      "Flexible payment split options available",
      "Includes comprehensive injury insurance coverage",
      "Adjustable focus areas (Bulking/Lean/Mobility)",
    ],
    accent: "#ff9900",
  },
};

const PlanDetail = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const plan = planData[type] || planData.monthly;

  useEffect(() => {
    window.scrollTo(0, 0);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, [type]);

  const handlePayment = () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded.");
      return;
    }

    const options = {
      key: "rzp_test_T5P2c2t4n8vCwb",
      amount: plan.price * 100,
      currency: "INR",
      name: "GymDash " + plan.title,
      description: "Membership Activation",
      handler: (res) => alert("Payment Successful! ID: " + res.razorpay_payment_id),
      prefill: { name: "Dinesh", email: "dinesh@gmail.com", contact: "1234567890" },
      theme: { color: plan.accent },
    };

    new window.Razorpay(options).open();
  };

  return (
    <PageContainer>
      <HeroSection style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), #0f0f0f), url(${plan.image})` }}>
        <div className="hero-content">
          <Badge accent={plan.accent}>{type.toUpperCase()}</Badge>
          <h1>{plan.title}</h1>
          <p className="price">₹{plan.price} <span>{plan.duration}</span></p>
          <button className="main-btn" onClick={handlePayment} style={{ background: plan.accent }}>
            Activate Membership Now
          </button>
        </div>
      </HeroSection>

      <ContentSection>
        <div className="info-grid">
          <div className="info-box">
            <h3>Exclusive Benefits</h3>
            <ul className="benefit-list">
              {plan.benefits.map((b, i) => (
                <li key={i}>
                  <CheckCircle color={plan.accent} /> {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="info-box">
            <h3>Payment & Billing Details</h3>
            <div className="payment-card">
              {plan.paymentDetails.map((p, i) => (
                <div key={i} className="payment-item">
                  <div className="dot" style={{ background: plan.accent }}></div>
                  <p>{p}</p>
                </div>
              ))}
              <div className="total-box">
                <p>Initial Payment Due Today</p>
                <h4>₹{plan.price}.00</h4>
              </div>
            </div>
          </div>
        </div>

        <FaqPreview>
          <h3>Plan FAQ</h3>
          <div className="faq-grid">
            <div className="faq-item">
              <h5>Can I cancel anytime?</h5>
              <p>Yes, all our plans are flexible. You can cancel through your profile settings or by contacting support.</p>
            </div>
            <div className="faq-item">
              <h5>Are there any hidden fees?</h5>
              <p>None. The price you see includes GST and all facility access fees.</p>
            </div>
          </div>
        </FaqPreview>

        <FooterCta>
          <h2>Ready to transform your life?</h2>
          <p>Join thousands of others who have achieved their fitness goals with GymDash.</p>
          <button onClick={handlePayment} style={{ background: plan.accent }}>Get Started Today</button>
        </FooterCta>
      </ContentSection>
    </PageContainer>
  );
};

const CheckCircle = ({ color }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px', flexShrink: 0 }}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const PageContainer = styled.div`
  background: #0f0f0f;
  color: white;
  min-height: 100vh;
`;

const HeroSection = styled.div`
  height: 70vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 20px;

  .hero-content {
    max-width: 800px;
    
    h1 {
      font-size: 4rem;
      font-weight: 900;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: -1px;
    }

    .price {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 40px;
      span {
        font-size: 1.2rem;
        color: #aaa;
        font-weight: 400;
      }
    }

    .main-btn {
      padding: 20px 50px;
      border: none;
      border-radius: 50px;
      color: #000;
      font-size: 1.2rem;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);

      &:hover {
        transform: scale(1.05);
        filter: brightness(1.1);
        box-shadow: 0 15px 40px rgba(0,0,0,0.7);
      }
    }
  }

  @media (max-width: 768px) {
    height: 60vh;
    .hero-content h1 { font-size: 2.5rem; }
  }
`;

const Badge = styled.span`
  background: ${props => props.accent};
  color: #000;
  padding: 8px 25px;
  border-radius: 50px;
  font-weight: 800;
  font-size: 0.9rem;
  letter-spacing: 2px;
  margin-bottom: 20px;
  display: inline-block;
`;

const ContentSection = styled.div`
  max-width: 1200px;
  margin: -80px auto 0;
  padding: 0 20px 100px;
  position: relative;
  z-index: 10;

  .info-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 40px;
    
    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }

  .info-box {
    background: #1a1a1a;
    padding: 40px;
    border-radius: 25px;
    border: 1px solid rgba(255,255,255,0.05);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);

    h3 {
      font-size: 1.8rem;
      font-weight: 800;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
    }
  }

  .benefit-list {
    list-style: none;
    padding: 0;
    li {
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;
      font-size: 1.1rem;
      color: #ccc;
      line-height: 1.4;
    }
  }

  .payment-card {
    background: rgba(255,255,255,0.02);
    padding: 30px;
    border-radius: 20px;
    
    .payment-item {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
      
      .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
      
      p { color: #aaa; font-size: 0.95rem; }
    }

    .total-box {
      margin-top: 30px;
      padding-top: 30px;
      border-top: 1px solid rgba(255,255,255,0.1);
      text-align: right;
      
      p { color: #888; font-size: 0.9rem; margin-bottom: 5px; }
      h4 { font-size: 2rem; font-weight: 800; color: #fff; }
    }
  }
`;

const FaqPreview = styled.div`
  margin-top: 80px;
  text-align: center;

  h3 { font-size: 2.2rem; margin-bottom: 40px; }

  .faq-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    
    @media (max-width: 768px) { grid-template-columns: 1fr; }
  }

  .faq-item {
    background: #151515;
    padding: 30px;
    border-radius: 20px;
    text-align: left;
    
    h5 { color: #ffcc00; margin-bottom: 15px; font-size: 1.2rem; }
    p { color: #aaa; line-height: 1.6; }
  }
`;

const FooterCta = styled.div`
  margin-top: 100px;
  background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
  padding: 80px 40px;
  border-radius: 40px;
  text-align: center;
  border: 1px solid rgba(255,255,255,0.05);

  h2 { font-size: 2.5rem; margin-bottom: 20px; }
  p { color: #aaa; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto; }
  
  button {
    padding: 18px 60px;
    border: none;
    border-radius: 50px;
    color: #000;
    font-size: 1.1rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover { transform: scale(1.05); filter: brightness(1.1); }
  }
`;

export default PlanDetail;
