import React, { useState } from "react";
import styled from "styled-components";
import { Send, Award, Target, Users, Shield } from "lucide-react";

const API_BASE = "https://gymj-9.onrender.com/api";

const About = () => {
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
    <AboutContainer>
      <HeroSection>
        <div className="content">
          <h1>About <span className="text-warning">HoneyFit</span></h1>
          <p>
            Founded in 2024, HoneyFit has quickly become the premier fitness destination 
            for those seeking real transformation. Our mission is to provide a 
            powerful, motivating environment where strength meets discipline.
          </p>
        </div>
      </HeroSection>

      <StorySection>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h2 className="section-title">Our <span className="text-warning">Story</span></h2>
              <p>
                HoneyFit was born from a simple idea: that fitness should be 
                empowering, not intimidating. We've built a community that 
                celebrates every milestone, from the first push-up to the 
                latest personal record.
              </p>
              <p>
                Equipped with state-of-the-art machines and led by world-class 
                trainers, we offer a comprehensive approach to health that 
                combines physical training with nutritional guidance and 
                mental fortitude.
              </p>
              <div className="stats-row mt-4">
                <div className="stat">
                  <span className="number">500+</span>
                  <span className="label">Active Members</span>
                </div>
                <div className="stat">
                  <span className="number">15+</span>
                  <span className="label">Expert Trainers</span>
                </div>
                <div className="stat">
                  <span className="number">24/7</span>
                  <span className="label">Support</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <FeaturesGrid>
                <FeatureCard>
                  <Award size={40} className="text-warning mb-3" />
                  <h3>Quality</h3>
                  <p>Only the best equipment and trainers for our members.</p>
                </FeatureCard>
                <FeatureCard>
                  <Target size={40} className="text-warning mb-3" />
                  <h3>Results</h3>
                  <p>Data-driven training plans that guarantee progress.</p>
                </FeatureCard>
                <FeatureCard>
                  <Users size={40} className="text-warning mb-3" />
                  <h3>Community</h3>
                  <p>A supportive network of like-minded fitness enthusiasts.</p>
                </FeatureCard>
                <FeatureCard>
                  <Shield size={40} className="text-warning mb-3" />
                  <h3>Safety</h3>
                  <p>Highest standards of hygiene and safe training practices.</p>
                </FeatureCard>
              </FeaturesGrid>
            </div>
          </div>
        </div>
      </StorySection>

      <EnquirySection>
        <div className="form-container">
          <h2>Get in <span className="text-warning">Touch</span></h2>
          <p>Ready to start your journey? Our experts are here to help you take the first step.</p>
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
              {isSubmitting ? "Sending..." : <>Send Enquiry <Send size={18} /></>}
            </button>
          </form>
        </div>
      </EnquirySection>
    </AboutContainer>
  );
};

const AboutContainer = styled.div`
  background: #0a0a0a;
  color: white;
  min-height: 100vh;
  padding-bottom: 80px;
`;

const HeroSection = styled.section`
  height: 60vh;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
              url("/about-bg.png");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 80px;

  .content {
    max-width: 800px;
    padding: 0 20px;
    h1 { font-size: 4rem; font-weight: 900; margin-bottom: 20px; }
    p { font-size: 1.3rem; color: #e0e0e0; }
  }

  @media (max-width: 768px) {
    height: 50vh;
    .content h1 { font-size: 2.5rem; }
    .content p { font-size: 1.1rem; }
  }
`;

const StorySection = styled.section`
  padding: 100px 0;
  background: #ffffff;
  color: #1a1a1a;

  .section-title { font-size: 3rem; font-weight: 800; margin-bottom: 30px; }
  p { font-size: 1.1rem; color: #555; line-height: 1.8; margin-bottom: 20px; }

  .stats-row {
    display: flex;
    gap: 40px;
    .stat {
      display: flex;
      flex-direction: column;
      .number { font-size: 2rem; font-weight: 900; color: #ffc107; }
      .label { font-size: 0.9rem; font-weight: 700; color: #888; text-transform: uppercase; }
    }
  }

  @media (max-width: 768px) {
    padding: 60px 0;
    .section-title { font-size: 2rem; }
    .stats-row { gap: 20px; flex-wrap: wrap; }
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const FeatureCard = styled.div`
  background: #f8f9fa;
  padding: 30px;
  border-radius: 20px;
  border: 1px solid #eee;
  transition: all 0.3s ease;
  &:hover { transform: translateY(-5px); border-color: #ffc107; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
  h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 10px; }
  p { font-size: 0.9rem; margin-bottom: 0; color: #777; }
`;

const EnquirySection = styled.section`
  max-width: 900px;
  margin: 80px auto 20px;
  padding: 0 20px;

  .form-container {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 60px;
    border-radius: 40px;
    text-align: center;
    color: white;

    h2 { font-size: 2.5rem; font-weight: 800; margin-bottom: 10px; }
    p { color: #aaa; margin-bottom: 40px; }

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
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
        font-size: 1rem;
        color: white;
        &:focus { outline: none; border-color: #ffc107; background: rgba(255, 255, 255, 0.1); }
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
        &:hover { background: #e5ac00; transform: translateY(-3px); }
        &:disabled { background: #444; color: #888; cursor: not-allowed; }
      }
    }

    @media (max-width: 600px) { padding: 30px 20px; h2 { font-size: 1.8rem; } }
  }
`;

export default About;
