import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MapPin, Clock, Phone, Mail, Award, Shield, Zap, UserCircle, Send } from "lucide-react";

const API_BASE = "https://gymj-9.onrender.com/api";

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    goals: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/consultations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Enquiry submitted successfully! We will contact you soon.");
        setFormData({ fullName: "", email: "", phone: "", goals: "" });
      } else {
        alert("Failed to submit enquiry. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HomeContainer>

      <HeroSection>
        <div className="content">
          <Badge>SINCE 2024</Badge>
          <h1>Elevating Fitness at <span className="text-warning">HoneyFit</span></h1>
          <p>
            Welcome to HoneyFit, where fitness becomes a lifestyle.
            “Sweet Energy. Serious Results.” is the motivation that drives us every day.
            At HoneyFit, we help you build strength, confidence, and discipline.
            Our gym is designed with modern equipment and a powerful training environment.
            Whether you are a beginner or a fitness enthusiast, your journey starts here.
            “Where Strength Meets Confidence.” — that’s the HoneyFit experience.
            Train with certified coaches who guide you toward real transformation.
            Push your limits with cardio, strength training, and personalized workouts.
            Every drop of sweat brings you one step closer to your goals.
            “Built by Discipline, Powered by HoneyFit.” inspires our community to stay focused.
            We believe fitness is not only about the body but also about mindset.
            Feel motivated, energized, and supported every single day.
            “Transform Your Body, Empower Your Life.” is more than a quote — it’s our mission.
            Join a positive fitness community that motivates you to become your best self.
            HoneyFit — “Strong Looks Good on You.”
          </p>
          <div className="cta-row">
            <button className="btn btn-warning fw-bold px-5 py-3 rounded-pill shadow" onClick={() => navigate("/userdashboard")}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </HeroSection>

      <DetailsGrid>
        <DetailCard>
          <MapPin size={32} className="text-warning mb-3" />
          <h3>Our Location</h3>
          <p>No.624,Kivraj Building,Anna Salai,Chennai-600006.</p>
        </DetailCard>

        <DetailCard>
          <Clock size={32} className="text-warning mb-3" />
          <h3>Opening Hours</h3>
          <p>Mon - Fri: 5:00 AM - 11:00 PM</p>
          <p>Sat - Sun: 6:00 AM - 9:00 PM</p>
        </DetailCard>

        <DetailCard>
          <Phone size={32} className="text-warning mb-3" />
          <h3>Contact Us</h3>
          <p>Phone: +91 84891 02133</p>
          <p>Email: honeyfit@gmail.com</p>
        </DetailCard>
      </DetailsGrid>

      <EnquirySection>
        <div className="form-container">
          <h2><span className="text-warning">Enquiry Now</span></h2>
          <p>Join our Community!</p>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                name="fullName"
                placeholder="Your Full Name"
                required
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-row">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                required
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              <textarea
                name="goals"
                placeholder="Your Message / Fitness Goals"
                rows="4"
                required
                value={formData.goals}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : <>Send Message <Send size={18} /></>}
            </button>
          </form>
        </div>
      </EnquirySection>

    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  background: linear-gradient(135deg, rgba(255, 126, 95, 0.3), rgba(254, 180, 123, 0.3), rgba(255, 255, 255, 0.4)), 
              url("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=100&w=2560&auto=format&fit=crop");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: #1a1a1a;
  min-height: 100vh;
  padding-top: 0;
  padding-bottom: 80px;

  .login-corner {
    position: absolute;
    top: 110px;
    right: 40px;
    z-index: 1000;
  }

  .login-btn {
    background: #ffc107;
    border: none;
    color: black;
    padding: 12px 30px;
    border-radius: 50px;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    box-shadow: 0 10px 20px rgba(255, 193, 7, 0.3);
    transition: all 0.3s ease;

    &:hover {
      background: #e5ac00;
      transform: translateY(-3px);
      box-shadow: 0 15px 30px rgba(255, 193, 7, 0.4);
    }
  }

  @media (max-width: 576px) {
    .login-corner {
      top: 90px;
      right: 20px;
    }
    .login-btn {
      padding: 8px 20px;
      font-size: 0.85rem;
    }
  }
`;

const Badge = styled.span`
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
  padding: 6px 15px;
  border-radius: 50px;
  font-weight: 800;
  font-size: 0.75rem;
  letter-spacing: 2px;
  margin-top: 30px;
  margin-bottom: 20px;
  display: inline-block;
  border: 1px solid rgba(255, 193, 7, 0.2);
`;

const HeroSection = styled.section`
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  position: relative;
  padding-top: 0;
  
  .content {
    margin-top: -50px; /* Moves button/text slightly upside */
    max-width: 800px;
    padding: 0 20px;
    position: relative;
    z-index: 20;
    h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 20px; color:#ffc107; }
    p { font-size: 1.2rem; color:white; margin-bottom: 30px; }
  }

  @media (max-width: 768px) {
    min-height: 70vh;
    .content {
      padding: 0 16px;
      h1 { font-size: 2.2rem; }
      p { font-size: 1rem; }
    }
  }

  @media (max-width: 480px) {
    .content h1 { font-size: 1.7rem; }
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1100px;
  margin: 60px auto 0; /* Added 60px top margin to move cards downside */
  padding: 0 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 12px;
  }
`;

const DetailCard = styled.div`
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 50px 40px;
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: default;

  &:hover { 
    transform: translateY(-10px) scale(1.02);
    background: rgba(255, 255, 255, 0.6);
    border-color: rgba(255, 193, 7, 0.8);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
  h3 { font-size: 1.5rem; font-weight: 700; margin-bottom: 15px; color: #ffc107; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  p { color: #555; margin: 5px 0; line-height: 1.6; font-weight: 500; }
`;

const EnquirySection = styled.section`
  max-width: 900px;
  margin: 80px auto 20px;
  padding: 0 20px;

  .form-container {
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(16px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.4);
    padding: 60px;
    border-radius: 40px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
    text-align: center;

    h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 10px; color: #1a1a1a; }
    p { color: #555; margin-bottom: 40px; font-weight: 500; }

    form {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .input-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        @media (max-width: 600px) { grid-template-columns: 1fr; }
      }

      input, textarea {
        width: 100%;
        padding: 15px 25px;
        border-radius: 15px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        background: rgba(255, 255, 255, 0.8);
        font-size: 1rem;
        font-weight: 500;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: #ffc107;
          box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.1);
          background: #fff;
        }
      }

      button {
        background: #ffc107;
        color: black;
        border: none;
        padding: 18px;
        border-radius: 15px;
        font-weight: 800;
        font-size: 1.1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        transition: all 0.3s ease;
        margin-top: 10px;

        &:hover {
          background: #e5ac00;
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(255, 193, 7, 0.3);
        }

        &:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
        }
      }
    }

    @media (max-width: 600px) {
      padding: 30px 20px;
      h2 { font-size: 1.8rem; }
    }
  }
`;



export default Home;
