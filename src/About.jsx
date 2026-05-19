import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Send, Award, Target, Users, Shield, Zap, Trophy, TrendingUp, Heart } from "lucide-react";

const API_BASE = window.location.hostname === "localhost" ? "http://localhost:8080/api" : "https://gymj-10.onrender.com/api";

const About = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    goals: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      {/* ── CINEMATIC HERO ── */}
      <HeroSection>
        <div className="hero-overlay" />
        <div className="content">
          <Badge>SINCE 2024</Badge>
          <h1>THE <span className="text-warning">VISION</span> BEHIND THE ARENA</h1>
          <p>We didn't just build a gym. We built a sanctuary for those who demand more from themselves.</p>
        </div>
      </HeroSection>

      {/* ── OUR STORY SPLIT ── */}
      <StorySection>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <span className="accent-text">OUR GENESIS</span>
              <h2 className="section-title">BUILT FOR <span className="text-warning">STRENGTH</span>, DRIVEN BY RESULTS</h2>
              <p className="lead-text">
                B&Y Fitness was born from a simple idea: that fitness should be
                empowering, not intimidating. We've built a community that
                celebrates every milestone, from the first push-up to the
                latest personal record.
              </p>
              <p className="body-text">
                Equipped with state-of-the-art machines and led by world-class
                trainers, we offer a comprehensive approach to health that
                combines physical training with nutritional guidance and
                mental fortitude.
              </p>
              <StatsRow>
                <StatCard>
                  <Users size={24} className="icon" />
                  <div className="info">
                    <span className="num">500+</span>
                    <span className="lab">ELITE MEMBERS</span>
                  </div>
                </StatCard>
                <StatCard>
                  <Trophy size={24} className="icon" />
                  <div className="info">
                    <span className="num">15+</span>
                    <span className="lab">PRO COACHES</span>
                  </div>
                </StatCard>
              </StatsRow>
            </div>
            <div className="col-lg-6">
              <ImageFrame>
                <div className="img-overlay" />
                <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop" alt="Gym Interior" />
                <div className="frame-decoration" />
              </ImageFrame>
            </div>
          </div>
        </div>
      </StorySection>

      {/* ── VALUES ARENA ── */}
      <ValuesSection>
        <div className="container">
          <div className="text-center mb-5">
            <Badge>CORE VALUES</Badge>
            <h2 className="section-title text-white">THE <span className="text-warning">CODE</span> WE LIVE BY</h2>
          </div>
          <ValuesGrid>
            <ValueCard>
              <div className="card-inner">
                <Shield size={40} className="card-icon" />
                <h3>DISCIPLINE</h3>
                <p>Motivation gets you started; discipline keeps you going when the lights are low and the weights are heavy.</p>
                <div className="card-num">01</div>
              </div>
            </ValueCard>
            <ValueCard>
              <div className="card-inner">
                <Zap size={40} className="card-icon" />
                <h3>INTENSITY</h3>
                <p>We believe in high-performance training that pushes boundaries and breaks plateaus daily.</p>
                <div className="card-num">02</div>
              </div>
            </ValueCard>
            <ValueCard>
              <div className="card-inner">
                <Target size={40} className="card-icon" />
                <h3>PRECISION</h3>
                <p>Every rep, every meal, and every recovery session is calculated for maximum physiological impact.</p>
                <div className="card-num">03</div>
              </div>
            </ValueCard>
            <ValueCard>
              <div className="card-inner">
                <Heart size={40} className="card-icon" />
                <h3>COMMUNITY</h3>
                <p>No one slays alone. We are a brotherhood and sisterhood of high-achievers supporting each other.</p>
                <div className="card-num">04</div>
              </div>
            </ValueCard>
          </ValuesGrid>
        </div>
      </ValuesSection>

      {/* ── MISSION PARALLAX ── */}
      <MissionSection>
        <div className="container">
          <div className="mission-box">
            <h2 className="section-title">THE <span className="text-warning">MISSION</span></h2>
            <p>"To create an environment where human potential is recognized, challenged, and ultimately exceeded through the relentless pursuit of physical and mental excellence."</p>
            <div className="signature">B&Y FITNESS LEADERSHIP</div>
          </div>
        </div>
      </MissionSection>

      {/* ── LIFESTYLE GALLERY ── */}
      <GallerySection>
        <div className="container">
          <div className="text-center mb-5">
            <Badge>THE ARENA</Badge>
            <h2 className="section-title">THE <span className="text-warning">LIFESTYLE</span></h2>
          </div>
          <GalleryGrid>
            <div className="gallery-item large">
              <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop" alt="Workout" />
              <div className="overlay"><span>POWER</span></div>
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop" alt="Workout" />
              <div className="overlay"><span>FOCUS</span></div>
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop" alt="Workout" />
              <div className="overlay"><span>GRIT</span></div>
            </div>
            <div className="gallery-item tall">
              <img src="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1000&auto=format&fit=crop" alt="Workout" />
              <div className="overlay"><span>DRIVE</span></div>
            </div>
            <div className="gallery-item">
              <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop" alt="Workout" />
              <div className="overlay"><span>WILL</span></div>
            </div>
          </GalleryGrid>
        </div>
      </GallerySection>

      {/* ── ENQUIRY ARENA ── */}
      <EnquiryArena>
        <div className="container">
          <div className="form-wrapper">
            <div className="form-info">
              <span className="accent">CONTACT THE TEAM</span>
              <h2>READY TO <span className="text-warning">JOIN?</span></h2>
              <p>Take the first step towards your ultimate self. Our consultants will guide you through the process.</p>
              <ContactList>
                <div className="contact-item">
                  <TrendingUp size={20} className="text-warning" />
                  <span>Personalized Growth Plans</span>
                </div>
                <div className="contact-item">
                  <Shield size={20} className="text-warning" />
                  <span>Secure Access & Privacy</span>
                </div>
              </ContactList>
            </div>
            <div className="form-content">
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
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
                    placeholder="Mobile Number"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <textarea
                    name="goals"
                    placeholder="Tell us about your fitness goals..."
                    rows="3"
                    required
                    value={formData.goals}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "SENDING..." : <>SUBMIT ENQUIRY <Send size={18} /></>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </EnquiryArena>
    </AboutContainer>
  );
};

// ── STYLED COMPONENTS ──

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AboutContainer = styled.div`
  background: #000;
  color: white;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
`;

const Badge = styled.span`
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
  padding: 8px 20px;
  border-radius: 50px;
  font-weight: 800;
  font-size: 0.75rem;
  letter-spacing: 3px;
  display: inline-block;
  border: 1px solid rgba(255, 193, 7, 0.2);
  margin-bottom: 25px;
  text-transform: uppercase;
`;

const HeroSection = styled.section`
  height: 60vh;
  background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), 
              url("https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  padding-top: 80px;

  .content {
    max-width: 900px;
    padding: 0 20px;
    z-index: 10;
    animation: ${slideUp} 1s ease;

    h1 { 
      font-size: 4.5rem; 
      font-weight: 950; 
      letter-spacing: -3px; 
      margin-bottom: 20px;
      line-height: 1;
      font-style: italic;
    }
    p { font-size: 1.25rem; color: #ccc; font-weight: 500; opacity: 0.9; }
  }

  @media (max-width: 768px) {
    height: 50vh;
    padding-top: 60px;
    .content h1 { font-size: 2.5rem; letter-spacing: -1px; }
    .content p { font-size: 1rem; }
  }
`;

const StorySection = styled.section`
  padding: 80px 0;
  background: #fff;
  color: #000;
  position: relative;

  .accent-text { color: #ffc107; font-weight: 900; letter-spacing: 2px; font-size: 0.9rem; margin-bottom: 10px; display: block; }
  .section-title { font-size: 3.2rem; font-weight: 950; letter-spacing: -2px; margin-bottom: 25px; line-height: 1.1; }
  .lead-text { font-size: 1.2rem; font-weight: 700; margin-bottom: 15px; color: #333; line-height: 1.6; }
  .body-text { font-size: 1.05rem; color: #666; line-height: 1.7; margin-bottom: 30px; }

  @media (max-width: 768px) {
    padding: 60px 0;
    .section-title { font-size: 2.2rem; }
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 30px;
  @media (max-width: 480px) { flex-direction: column; }
`;

const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  background: #f8f9fa;
  padding: 20px 30px;
  border-radius: 20px;
  border: 1px solid #eee;

  .icon { color: #ffc107; }
  .info {
    .num { display: block; font-size: 1.8rem; font-weight: 900; color: #000; line-height: 1; }
    .lab { font-size: 0.75rem; font-weight: 800; color: #888; text-transform: uppercase; letter-spacing: 1px; }
  }
`;

const ImageFrame = styled.div`
  position: relative;
  height: 550px;
  border-radius: 40px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0,0,0,0.2);

  img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; }
  .img-overlay { position: absolute; inset: 0; background: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.4)); }
  
  .frame-decoration {
    position: absolute;
    bottom: -20px;
    right: -20px;
    width: 200px;
    height: 200px;
    border: 10px solid #ffc107;
    z-index: -1;
    border-radius: 40px;
  }

  @media (max-width: 768px) { height: 400px; }
`;

const ValuesSection = styled.section`
  padding: 80px 0;
  background: #000;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  @media (max-width: 1200px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const ValueCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 30px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;

  .card-inner { z-index: 2; position: relative; }
  .card-icon { color: #ffc107; margin-bottom: 25px; transition: transform 0.4s ease; }
  h3 { font-size: 1.5rem; font-weight: 900; margin-bottom: 15px; letter-spacing: 1px; }
  p { color: #888; font-size: 0.95rem; line-height: 1.7; transition: color 0.4s ease; }
  
  .card-num {
    position: absolute;
    bottom: -20px;
    right: -10px;
    font-size: 8rem;
    font-weight: 950;
    color: rgba(255, 193, 7, 0.03);
    line-height: 1;
    transition: all 0.4s ease;
  }

  &:hover {
    background: #ffc107;
    transform: translateY(-10px);
    .card-icon { color: #000; transform: scale(1.1); }
    h3 { color: #000; }
    p { color: #222; font-weight: 500; }
    .card-num { color: rgba(0, 0, 0, 0.05); transform: translateY(-10px); }
  }
`;

const MissionSection = styled.section`
  padding: 100px 0;
  background: linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), 
              url("https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075&auto=format&fit=crop");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  justify-content: center;

  .mission-box {
    max-width: 800px;
    text-align: center;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    padding: 60px 40px;
    border-radius: 40px;
    border: 1px solid rgba(255, 255, 255, 0.1);

    .section-title { font-size: 3rem; color: #fff; margin-bottom: 20px; }
    p { font-size: 1.6rem; font-style: italic; font-weight: 800; line-height: 1.4; color: #eee; margin-bottom: 25px; }
    .signature { color: #ffc107; font-weight: 900; letter-spacing: 4px; font-size: 0.9rem; }
  }

  @media (max-width: 768px) {
    padding: 80px 0;
    .mission-box { padding: 40px 20px; p { font-size: 1.25rem; } }
  }
`;

const EnquiryArena = styled.section`
  padding: 80px 0;
  background: #fff;
  color: #000;

  .form-wrapper {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 60px;
    align-items: center;
    background: #000;
    color: #fff;
    padding: 60px;
    border-radius: 50px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.4);

    .form-info {
      .accent { color: #ffc107; font-weight: 900; letter-spacing: 2px; font-size: 0.8rem; margin-bottom: 10px; display: block; }
      h2 { font-size: 3.2rem; font-weight: 950; margin-bottom: 15px; line-height: 1; }
      p { font-size: 1.1rem; color: #888; margin-bottom: 30px; }
    }

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
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 18px 25px;
        border-radius: 15px;
        color: #fff;
        font-size: 1rem;
        transition: all 0.3s ease;
        &:focus { outline: none; border-color: #ffc107; background: rgba(255, 255, 255, 0.08); }
      }

      button {
        background: #ffc107;
        color: #000;
        border: none;
        padding: 20px;
        border-radius: 15px;
        font-weight: 900;
        font-size: 1.1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        transition: all 0.3s ease;
        &:hover { background: #fff; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255, 193, 7, 0.2); }
        &:disabled { background: #444; color: #888; cursor: not-allowed; }
      }
    }

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
      padding: 40px;
      gap: 40px;
      .form-info h2 { font-size: 2.5rem; }
    }
  }
`;

const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  .contact-item {
    display: flex;
    align-items: center;
    gap: 15px;
    font-weight: 700;
    font-size: 1.1rem;
  }
`;

const GallerySection = styled.section`
  padding: 80px 0;
  background: transparent;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 250px;
  gap: 20px;

  .gallery-item {
    position: relative;
    border-radius: 25px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);

    img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
    
    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(255, 193, 7, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: all 0.4s ease;
      span { color: #000; font-weight: 900; font-size: 1.5rem; letter-spacing: 2px; transform: translateY(20px); transition: all 0.4s ease; }
    }

    &:hover {
      img { transform: scale(1.1); }
      .overlay { opacity: 1; span { transform: translateY(0); } }
    }

    &.large { grid-column: span 2; grid-row: span 2; }
    &.tall { grid-row: span 2; }
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    .gallery-item.large { grid-column: span 2; }
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    grid-auto-rows: 300px;
    .gallery-item.large { grid-column: span 1; grid-row: span 1; }
    .gallery-item.tall { grid-row: span 1; }
  }
`;

export default About;
