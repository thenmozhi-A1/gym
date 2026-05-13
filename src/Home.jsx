import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MapPin, Clock, Phone, Mail, Award, Shield, Zap, UserCircle, Send } from "lucide-react";

const API_BASE = "https://gymj-9.onrender.com/api";

import BMICalculator from "./BMICalculator";

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
          <h1>Redefining Fitness at <span className="text-warning">SlayFit</span> <span className="since">Since 2024</span></h1>
          <p className="tagline">Train Hard. Stay Consistent. Slay Every Goal.</p>
          <div className="cta-row">
            <button className="btn btn-warning fw-bold px-5 py-3 rounded-pill shadow" onClick={() => navigate("/userdashboard")}>
              ENTER ARENA
            </button>
          </div>
        </div>
      </HeroSection>

      <DetailsGrid>
        <DetailCard
          as="a"
          href="https://www.google.com/maps"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MapPin size={32} className="text-warning mb-3" />
          <h3>Our Location</h3>
          <p>No.624, Khivraj Building, Anna Salai, Chennai.</p>
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
          <p>Email: slayfit@gmail.com</p>
        </DetailCard>
      </DetailsGrid>

      {/* ── ABOUT SLAYFIT ── */}
      <AboutSection>
        <div className="container">
          <div className="about-content">
            <SectionTitle style={{ textAlign: 'left' }}>
              <span className="text-warning">SLAYFIT</span> STUDIO
            </SectionTitle>
            <p style={{ color: "black" }}>
              SlayFit Fitness Studio is a modern training space built to help individuals improve strength, endurance, body composition, and overall fitness performance. Designed for beginners, working professionals, fitness enthusiasts, and athletes, SlayFit provides a motivating environment focused on discipline, consistency, and transformation.
            </p>
            <p style={{ color: "black" }}>
              Our studio combines expert guidance, advanced workout methods, and modern equipment to create personalized fitness experiences for every member. Whether your goal is weight loss, muscle gain, improved stamina, or a healthier lifestyle, SlayFit offers structured programs tailored to your fitness level and goals.
            </p>
          </div>
        </div>
      </AboutSection>

      {/* ── SERVICES & JOINERS ── */}
      <ServicesSection>
        <div className="container">
          <div className="services-flex">
            <div className="services-list">
              <h4 className="text-warning">ELITE SERVICES</h4>
              <ul>
                <li>Strength and conditioning programs</li>
                <li>Weight loss and fat reduction training</li>
                <li>Muscle building workouts</li>
                <li>Functional fitness sessions</li>
                <li>Personal training programs</li>
                <li>Group workout classes</li>
                <li>Cardio and endurance training</li>
                <li>Transformation programs</li>
                <li>Beginner-friendly fitness plans</li>
                <li>Nutrition and lifestyle guidance</li>
              </ul>
              <p className="note">All training sessions are supervised by professionals to ensure safe, effective progress.</p>
            </div>
            <div className="join-list">
              <h4 className="text-warning">WHO CAN JOIN?</h4>
              <ul>
                <li>Beginners starting their fitness journey</li>
                <li>Individuals focused on weight management</li>
                <li>Students and working professionals</li>
                <li>Fitness enthusiasts and athletes</li>
                <li>Men and women of all fitness levels</li>
                <li>Anyone looking to improve health & confidence</li>
              </ul>
              <p className="note">Each program is customized based on individual goals and assessments.</p>
            </div>
          </div>
        </div>
      </ServicesSection>

      {/* ── WHY CHOOSE SLAYFIT ── */}
      <WhyChooseSection>
        <div className="container">
          <SectionTitle>
            WHY CHOOSE <span className="text-warning">SLAYFIT</span>?
          </SectionTitle>
          <div className="features-grid">
            <FeatureCard>
              <Award className="feature-icon" />
              <h4>ELITE COACHING</h4>
              <p>Train with national-level athletes and certified masters of discipline.</p>
            </FeatureCard>
            <FeatureCard>
              <Zap className="feature-icon" />
              <h4>TECH-DRIVEN GEAR</h4>
              <p>Biometric access, advanced tracking, and premium industrial equipment.</p>
            </FeatureCard>
            <FeatureCard>
              <Shield className="feature-icon" />
              <h4>PREMIUM ENVIRONMENT</h4>
              <p>A high-octane, sanitized facility designed for maximum focus and safety.</p>
            </FeatureCard>
            <FeatureCard>
              <UserCircle className="feature-icon" />
              <h4>ELITE COMMUNITY</h4>
              <p>Join a tribe of high-achievers who push you to your absolute limits.</p>
            </FeatureCard>
          </div>
        </div>
      </WhyChooseSection>

      {/* ── FITNESS TOOLS (BMI) ── */}
      <ToolsSection>
        <div className="container">
          <div className="tools-flex">
            <div className="tools-content">
              <SectionTitle style={{ textAlign: 'left' }}>
                FITNESS <span className="text-warning">TOOLS</span>
              </SectionTitle>
              <p className="tools-desc" style={{ color: "white" }}>
                Knowledge is power. Use our integrated biometric tools to understand your body metrics and track your progress toward the ultimate physique.
              </p>
              <ul className="tools-list" style={{ color: "white" }}>
                <li><Zap size={18} className="text-warning" /> Precision BMI Tracking</li>
                <li><Zap size={18} className="text-warning" /> Caloric Intake Estimates</li>
                <li><Zap size={18} className="text-warning" /> Macro-Nutrient Optimization</li>
              </ul>
            </div>
            <div className="tools-calc">
              <BMICalculator />
            </div>
          </div>
        </div>
      </ToolsSection>

      {/* ── FINAL CALL TO ACTION ── */}
      <CTASection>
        <div className="cta-overlay">
          <h2>READY TO <span className="text-warning">SLAY</span>?</h2>
          <p>Your elite transformation starts the moment you enter the arena. Don't wait for tomorrow.</p>
          <button onClick={() => navigate("/login")}>CLAIM YOUR ACCESS</button>
        </div>
      </CTASection>

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
  background: radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), 
              url("https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=100&w=2560&auto=format&fit=crop");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: #1a1a1a;
  min-height: 100vh;
  padding-top: 0;
  padding-bottom: 20px;

  @media (max-width: 768px) {
    background-attachment: scroll;
    padding-top: 120px;
  }

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
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  position: relative;
  padding-top: 0;
  
  .content {
    margin-top: 0; 
    max-width: 800px;
    padding: 0 20px;
    position: relative;
    z-index: 20;
    h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 20px; color:#ffc107; text-shadow: 0 2px 10px rgba(0,0,0,0.2); 
      .since { font-size: 1.2rem; opacity: 0.7; color: white; vertical-align: middle; margin-left: 10px; font-weight: 500; }
    }
    p { font-size: 1.2rem; color: #1a1a1a; margin-bottom: 30px; font-weight: 500; }
  }

  @media (max-width: 768px) {
    height: auto;
    padding: 60px 0;
    .content {
      padding: 0 16px;
      h1 { font-size: 2rem; }
      p { font-size: 1rem; }
    }
  }

  @media (max-width: 480px) {
    .content h1 { font-size: 1.8rem; }
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1100px;
  margin: 0 auto;
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
  cursor: ${props => props.as === 'a' ? 'pointer' : 'default'};
  display: block;

  @media (max-width: 600px) {
    padding: 30px 20px;
    border-radius: 20px;
  }

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
  margin: 20px auto;
  padding: 0 20px;

  .form-container {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    padding: 60px;
    border-radius: 40px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);

    @media (max-width: 768px) {
      padding: 30px 20px;
      border-radius: 25px;
    }
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



const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 40px;
  color: #1a1a1a;
  letter-spacing: -1px;
  @media (max-width: 768px) { font-size: 2rem; }
`;

const WhyChooseSection = styled.section`
  padding: 60px 20px;
  background: transparent;

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
    max-width: 1200px;
    margin: 0 auto;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.6);
    border-color: #ffc107;
  }

  .feature-icon {
    width: 50px;
    height: 50px;
    color: #ffc107;
    margin-bottom: 20px;
  }

  h4 { font-weight: 800; margin-bottom: 15px; letter-spacing: 1px; }
  p { color: #555; font-size: 0.95rem; line-height: 1.6; font-weight: 500; }
`;

const ToolsSection = styled.section`
  padding: 60px 20px;
  background: transparent;

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .tools-flex {
    display: flex;
    align-items: center;
    gap: 80px;
    flex-wrap: wrap;

    .tools-content {
      flex: 1;
      min-width: 300px;
    }

    .tools-calc {
      flex: 1;
      min-width: 300px;
      display: flex;
      justify-content: center;
    }
  }

  .tools-desc { font-size: 1.1rem; color: #444; margin-bottom: 30px; line-height: 1.7; font-weight: 500; }
  
  .tools-list {
    list-style: none;
    padding: 0;
    li {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
      font-weight: 700;
      color: #1a1a1a;
      font-size: 1.1rem;
    }
  }

  @media (max-width: 991px) {
    .tools-flex { gap: 40px; flex-direction: column; text-align: center; }
    .tools-list li { justify-content: center; }
  }
`;

const CTASection = styled.section`
  height: 400px;
  background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), 
              url("https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2000&auto=format&fit=crop");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;

  .cta-overlay {
    max-width: 700px;
    padding: 20px;
    
    h2 { font-size: 3.5rem; font-weight: 900; margin-bottom: 20px; letter-spacing: -2px; }
    p { font-size: 1.2rem; opacity: 0.9; margin-bottom: 40px; font-weight: 500; }
    
    button {
      background: #ffc107;
      color: black;
      border: none;
      padding: 15px 50px;
      border-radius: 50px;
      font-weight: 900;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: #fff;
        transform: scale(1.05);
        box-shadow: 0 15px 30px rgba(255, 193, 7, 0.4);
      }
    }
  }

  @media (max-width: 768px) {
    height: 350px;
    background-attachment: scroll;
    h2 { font-size: 2.5rem; }
    p { font-size: 1rem; }
  }
`;

const AboutSection = styled.section`
  padding: 60px 20px;
  background: transparent;
  .container { max-width: 1200px; margin: 0 auto; }
  .about-content {
    max-width: 900px;
    p { font-size: 1.1rem; line-height: 1.8; color: #444; margin-bottom: 20px; font-weight: 500; }
  }
`;

const ServicesSection = styled.section`
  padding: 60px 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  .container { max-width: 1200px; margin: 0 auto; }
  .services-flex {
    display: flex;
    gap: 60px;
    flex-wrap: wrap;
    
    div { flex: 1; min-width: 300px; }
    h4 { font-family: 'Oswald', sans-serif; font-weight: 800; margin-bottom: 30px; letter-spacing: 2px; }
    
    ul {
      list-style: none;
      padding: 0;
      li {
        margin-bottom: 12px;
        padding-left: 25px;
        position: relative;
        font-weight: 600;
        font-size: 0.95rem;
        color: #aaa;
        
        &::before {
          content: '→';
          position: absolute;
          left: 0;
          color: #ffc107;
          font-weight: 900;
        }
      }
    }
    
    .note {
      margin-top: 30px;
      font-size: 0.85rem;
      color: #555;
      font-style: italic;
      border-top: 1px solid #222;
      padding-top: 20px;
    }
  }
`;

export default Home;
