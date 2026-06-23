import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MapPin, Clock, Phone, Mail, Award, Shield, Zap, UserCircle, Send, Users, Target, Trophy, Dumbbell } from "lucide-react";
import Footer from "./Footer";

import axiosInstance from "./api/axiosInstance";
import log from "./utils/logger";

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
  const [submitStatus, setSubmitStatus] = useState("idle");
  const observerRef = useRef(null);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axiosInstance.get("/feedbacks");
        setFeedbacks(response.data);
      } catch (error) {
        log.error("Error fetching feedbacks:", error);
      }
    };
    fetchFeedbacks();
  }, []);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/consultations", formData);

      alert("Enquiry submitted successfully! We will contact you soon.");
      setFormData({ fullName: "", email: "", phone: "", goals: "" });
      setSubmitStatus("success");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      log.error("Error submitting enquiry:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
      alert("Failed to submit enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HomeContainer>

      <HeroSection className="reveal">
        <div className="content">
          <Badge>ESTABLISHED 2024</Badge>
          <h1>Redefining Fitness at <span className="text-warning">B&Y Fitness</span></h1>
          <p className="tagline">Train Hard. Stay Consistent. Slay Every Goal.</p>


          <div className="cta-row">
            <button className="btn-arena" onClick={() => navigate("/login")}>
              ENTER ARENA <Zap size={20} />
            </button>
          </div>
        </div>

      </HeroSection>

      <StatsSection className="reveal">
        <div className="container">
          <StatBox>
            <div className="stat-content">
              <Users size={24} className="stat-icon" />
              <h3>500+</h3>
              <p className="stat-label">MEMBERS</p>
            </div>
          </StatBox>
          <StatBox>
            <div className="stat-content">
              <Dumbbell size={24} className="stat-icon" />
              <h3>30+</h3>
              <p className="stat-label">COACHES</p>
            </div>
          </StatBox>
          <StatBox>
            <div className="stat-content">
              <Target size={24} className="stat-icon" />
              <h3>10K</h3>
              <p className="stat-label">SQ. FT.</p>
            </div>
          </StatBox>
          <StatBox>
            <div className="stat-content">
              <Trophy size={24} className="stat-icon" />
              <h3>24/7</h3>
              <p className="stat-label">ACCESS</p>
            </div>
          </StatBox>
        </div>
      </StatsSection>

      <InfoCardsRow className="reveal">
        {/* ── LOCATION CARD ── */}
        <FlipCard
          as="a"
          $color="#3b82f6"
          href="https://www.google.com/maps/search/?api=1&query=No.624+Khivraj+Building+Anna+Salai+Chennai"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flip-inner">
            <div className="flip-front">
              <div className="icon-ring"><MapPin size={36} /></div>
              <h3>Our Location</h3>
              <span className="tap-hint">Hover to explore →</span>
            </div>
            <div className="flip-back">
              <MapPin size={28} className="back-icon" />
              <h4>Find Us Here</h4>
              <p>No.624, Khivraj Building,</p>
              <p>Anna Salai, Chennai.</p>
              <div className="cta-link">Open in Maps ↗</div>
            </div>
          </div>
        </FlipCard>

        {/* ── HOURS CARD ── */}
        <FlipCard $color="#f97316">
          <div className="flip-inner">
            <div className="flip-front">
              <div className="icon-ring"><Clock size={36} /></div>
              <h3>Opening Hours</h3>
              <span className="tap-hint">Hover to explore →</span>
            </div>
            <div className="flip-back">
              <Clock size={28} className="back-icon" />
              <h4>We're Open</h4>
              <div className="hours-row"><span>Mon – Fri</span><span>5 AM – 11 PM</span></div>
              <div className="hours-row"><span>Sat – Sun</span><span>6 AM – 9 PM</span></div>
            </div>
          </div>
        </FlipCard>

        {/* ── CONTACT CARD ── */}
        <FlipCard $color="#a855f7">
          <div className="flip-inner">
            <div className="flip-front">
              <div className="icon-ring"><Phone size={36} /></div>
              <h3>Contact Us</h3>
              <span className="tap-hint">Hover to explore →</span>
            </div>
            <div className="flip-back">
              <Phone size={28} className="back-icon" />
              <h4>Get In Touch</h4>
              <p>📞 +91 84891 02133</p>
              <p>✉️ byfitness@gmail.com</p>
            </div>
          </div>
        </FlipCard>
      </InfoCardsRow>

      {/* ── ABOUT B&Y FITNESS ── */}
      <AboutSection className="reveal">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <SectionTitle style={{ textAlign: 'left' }}>
                <span className="text-warning">B&Y FITNESS</span> STUDIO
              </SectionTitle>
              <p style={{ color: "white", textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>
                B&Y Fitness Fitness Studio is a modern training space built to help individuals improve strength, endurance, body composition, and overall fitness performance. Designed for beginners, working professionals, fitness enthusiasts, and athletes, B&Y Fitness provides a motivating environment focused on discipline, consistency, and transformation.
              </p>
              <p style={{ color: "white", textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>
                Our studio combines expert guidance, advanced workout methods, and modern equipment to create personalized fitness experiences for every member. Whether your goal is weight loss, muscle gain, improved stamina, or a healthier lifestyle, B&Y Fitness offers structured programs tailored to your fitness level and goals.
              </p>
            </div>
            <div className="about-image-wrapper">
              <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop" alt="B&Y Fitness Studio" />
            </div>
          </div>
        </div>
      </AboutSection>
      {feedbacks.length > 0 && (
        <FeedbackMarquee>
          <marquee behavior="scroll" direction="left" scrollamount="6" loop="infinite" onMouseOver={(e) => e.currentTarget.stop()} onMouseOut={(e) => e.currentTarget.start()}>
            {/* Repeat the feedbacks array 4 times to ensure a dense, endless stream with no gaps */}
            {[...feedbacks, ...feedbacks, ...feedbacks, ...feedbacks].map((fb, idx) => (
              <span className="feedback-item" key={idx}>
                <span className="user">★ {fb.userName || "User"}:</span>
                <span className="msg">"{fb.message}"</span>
                <span className="rating">
                  {Array.from({ length: fb.rating || 5 }).map((_, i) => "⭐")}
                </span>
                <span className="separator">🔥</span>
              </span>
            ))}
          </marquee>
        </FeedbackMarquee>
      )}

      <EliteServicesSection className="reveal">
        <div className="container">
          <SectionTitle>
            ELITE <span className="text-warning">SERVICES</span>
          </SectionTitle>
          <ServiceGrid>
            <ServiceCard>
              <div className="card-image" style={{ backgroundImage: 'url("/assets/service-pt.png")' }}></div>
              <div className="card-overlay">
                <h4>PERSONAL TRAINING</h4>
                <p>1-on-1 coaching tailored to your specific physiology and goals.</p>
                <ul>
                  <li>Custom workout plans</li>
                  <li>Nutrition monitoring</li>
                  <li>Posture correction</li>
                </ul>
              </div>
            </ServiceCard>
            <ServiceCard>
              <div className="card-image" style={{ backgroundImage: 'url("/assets/service-group.png")' }}></div>
              <div className="card-overlay">
                <h4>GROUP FITNESS</h4>
                <p>High-octane community sessions that push your limits.</p>
                <ul>
                  <li>HIIT and Tabata</li>
                  <li>Functional training</li>
                  <li>Team motivation</li>
                </ul>
              </div>
            </ServiceCard>
            <ServiceCard>
              <div className="card-image" style={{ backgroundImage: 'url("/assets/service-strength.png")' }}></div>
              <div className="card-overlay">
                <h4>STRENGTH & CONDITIONING</h4>
                <p>Build explosive power and raw strength with expert guidance.</p>
                <ul>
                  <li>Olympic lifting</li>
                  <li>Powerlifting basics</li>
                  <li>Athletic performance</li>
                </ul>
              </div>
            </ServiceCard>
            <ServiceCard>
              <div className="card-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop")' }}></div>
              <div className="card-overlay">
                <h4>NUTRITION COACHING</h4>
                <p>Fuel your body correctly to see maximum results from your hard work.</p>
                <ul>
                  <li>Macro counting</li>
                  <li>Meal planning</li>
                  <li>Supplements advice</li>
                </ul>
              </div>
            </ServiceCard>
            <ServiceCard>
              <div className="card-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop")' }}></div>
              <div className="card-overlay">
                <h4>CARDIO & ENDURANCE</h4>
                <p>Improve heart health and burn fat with high-intensity cardio.</p>
                <ul>
                  <li>Advanced treadmills</li>
                  <li>Spin classes</li>
                  <li>VO2 max training</li>
                </ul>
              </div>
            </ServiceCard>
            <ServiceCard>
              <div className="card-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop")' }}></div>
              <div className="card-overlay">
                <h4>YOGA & RECOVERY</h4>
                <p>Focus on flexibility, mental clarity, and deep muscle recovery.</p>
                <ul>
                  <li>Vinyasa flows</li>
                  <li>Deep tissue foam rolling</li>
                  <li>Mindfulness sessions</li>
                </ul>
              </div>
            </ServiceCard>
            <ServiceCard>
              <div className="card-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1517438322351-1e74be76006c?q=80&w=1000&auto=format&fit=crop")' }}></div>
              <div className="card-overlay">
                <h4>COMBAT SPORTS</h4>
                <p>Master boxing and kickboxing techniques for fitness and defense.</p>
                <ul>
                  <li>Heavy bag work</li>
                  <li>Partner drills</li>
                  <li>Agility and speed</li>
                </ul>
              </div>
            </ServiceCard>
            <ServiceCard>
              <div className="card-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop")' }}></div>
              <div className="card-overlay">
                <h4>CORPORATE WELLNESS</h4>
                <p>Tailored programs for teams to improve productivity and health.</p>
                <ul>
                  <li>Team building events</li>
                  <li>Postural seminars</li>
                  <li>Stress management</li>
                </ul>
              </div>
            </ServiceCard>
          </ServiceGrid>
        </div>
      </EliteServicesSection>

      {/* ── MEET THE COACHES ── */}
      <CoachesSection className="reveal">
        <div className="container">
          <SectionTitle>
            MEET THE <span className="text-warning">MASTERS</span>
          </SectionTitle>
          <p className="section-desc">Train with the best. Our certified experts are here to push you beyond your limits.</p>
          <CoachesGrid>
            <CoachCard>
              <div className="coach-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=400&auto=format&fit=crop")' }}></div>
              <div className="coach-info">
                <h4>ALEX "IRON" ROSS</h4>
                <span>STRENGTH & HYPERTROPHY</span>
              </div>
            </CoachCard>
            <CoachCard>
              <div className="coach-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=400&auto=format&fit=crop")' }}></div>
              <div className="coach-info">
                <h4>SARAH BLAZE</h4>
                <span>HIIT & FUNCTIONAL FITNESS</span>
              </div>
            </CoachCard>
            <CoachCard>
              <div className="coach-image" style={{ backgroundImage: 'url("/assets/coach-mark.png")' }}></div>
              <div className="coach-info">
                <h4>MARK VOID</h4>
                <span>MMA & COMBAT DRILLS</span>
              </div>
            </CoachCard>
          </CoachesGrid>
        </div>
      </CoachesSection>

      {/* ── TRANSFORMATIONS ── */}
      <TransformationsSection className="reveal">
        <div className="container">
          <SectionTitle>
            REAL <span className="text-warning">RESULTS</span>
          </SectionTitle>
          <TransformationsGrid>
            <TransformationCard>
              <div className="trans-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop")' }}></div>
              <div className="trans-content">
                <p>"B&Y Fitness changed my life. I've never felt more confident and strong."</p>
                <h5>- JAMES K. (Lost 20kg)</h5>
              </div>
            </TransformationCard>
            <TransformationCard>
              <div className="trans-image" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop")' }}></div>
              <div className="trans-content">
                <p>"The community here is unmatched. Every session is a new peak."</p>
                <h5>- LINDA M. (Pro Athlete)</h5>
              </div>
            </TransformationCard>
          </TransformationsGrid>
        </div>
      </TransformationsSection>

      {/* ── WHY CHOOSE B&Y FITNESS ── */}
      <WhyChooseSection>
        <div className="container">
          <SectionTitle>
            WHY CHOOSE <span className="text-warning">B&Y FITNESS</span>?
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
                <li style={{ color: "white" }}><Zap size={18} className="text-warning" /> Precision BMI Tracking</li>
                <li style={{ color: "white" }}><Zap size={18} className="text-warning" /> Caloric Intake Estimates</li>
                <li style={{ color: "white" }}><Zap size={18} className="text-warning" /> Macro-Nutrient Optimization</li>
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
              linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
              url("/assets/gym-hero-bg.png");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: #1a1a1a;
  min-height: 100vh;
  padding-top: 0;
  padding-bottom: 40px;
  overflow-x: hidden;

  /* ── Reveal Animations ── */
  .reveal {
    opacity: 0;
    transform: translateY(50px);
    transition: all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    &.reveal-visible {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    background-attachment: scroll;
  }
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
  
  .content {
    max-width: 900px;
    padding: 0 20px;
    z-index: 20;
    h1 { font-size: 5rem; font-weight: 900; line-height: 1; margin-bottom: 20px; color:#ffc107; text-shadow: 0 4px 30px rgba(0,0,0,0.5); }
    p { font-size: 1.5rem; color: white; margin-bottom: 40px; font-weight: 500; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
  }

  .cta-row {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .btn-arena {
    background: #ffc107;
    color: black;
    border: none;
    padding: 20px 60px;
    font-size: 1.5rem;
    font-weight: 900;
    border-radius: 100px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 15px;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 20px 40px rgba(255, 193, 7, 0.3);

    &:hover {
      transform: scale(1.05) translateY(-5px);
      background: white;
      box-shadow: 0 30px 60px rgba(255, 193, 7, 0.4);
    }
  }

  .hero-scroll-indicator {
    position: absolute;
    bottom: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    opacity: 0.7;
    span { font-size: 0.7rem; font-weight: 800; letter-spacing: 3px; }
    .mouse {
      width: 25px;
      height: 40px;
      border: 2px solid white;
      border-radius: 20px;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        width: 4px;
        height: 8px;
        background: white;
        left: 50%;
        transform: translateX(-50%);
        top: 8px;
        border-radius: 2px;
        animation: scrollMouse 2s infinite;
      }
    }
  }

  @keyframes scrollMouse {
    0% { top: 8px; opacity: 1; }
    100% { top: 25px; opacity: 0; }
  }

  @media (max-width: 768px) {
    height: 70vh;
    .content h1 { font-size: 3rem; }
    .content p { font-size: 1.1rem; }
  }
`;

const StatsSection = styled.section`
  padding: 0;
  background: #000;
  margin-top: -60px;
  margin-bottom: 80px;
  position: relative;
  z-index: 30;
  overflow: hidden;
  border-top: 3px solid #ffc107;
  border-bottom: 3px solid #ffc107;

  .container {
    max-width: 100%;
    margin: 0;
    display: flex;
    flex-wrap: nowrap;
    @media (max-width: 900px) { flex-wrap: wrap; }

    /* Group Hover Effect: When hovering the container, all cards turn Black */
    &:hover > div {
      background: #0a0a0a;
      .stat-icon { color: #ffc107; opacity: 0.7; }
      h3 { color: #fff; }
      .stat-label { color: #ffc107; }
    }

    /* Target Hover Effect: The specific card being hovered turns Yellow */
    &:hover > div:hover {
      background: #ffc107;
      z-index: 10;
      .stat-icon { color: #000; opacity: 0.6; }
      h3 { color: #000; }
      .stat-label { color: #000; }
    }
  }
`;

const StatBox = styled.div`
  flex: 1;
  background: #ffc107;
  padding: 40px 20px;
  position: relative;
  transform: skewX(-12deg);
  margin-left: -15px;
  border-right: 1px solid rgba(0, 0, 0, 0.15);
  transition: all 0.4s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  &:first-child { margin-left: -40px; }
  &:last-child { border-right: none; padding-right: 60px; }

  .stat-content {
    transform: skewX(12deg);
    text-align: center;
  }

  .stat-icon {
    color: #000;
    margin-bottom: 8px;
    opacity: 0.6;
  }

  h3 { 
    font-size: 3rem; 
    font-weight: 950; 
    margin: 0; 
    color: #000;
    line-height: 1;
    letter-spacing: -2px;
    font-style: italic;
  }

  .stat-label { 
    font-size: 0.65rem; 
    font-weight: 900; 
    letter-spacing: 4px; 
    color: #000;
    margin-top: 8px;
    text-transform: uppercase;
  }

  /* Alternate Pattern for 30+ Coaches & 24/7 Access */
  &:nth-child(even) {
    background: #0a0a0a;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    
    .stat-icon { color: #ffc107; opacity: 0.7; }
    h3 { color: #fff; }
    .stat-label { color: #ffc107; }
  }

  @media (max-width: 900px) {
    flex: none;
    width: 50%;
    transform: none;
    margin: 0 !important;
    padding: 30px 10px;
    border: 1px solid rgba(255,255,255,0.05);
    .stat-content { transform: none !important; }
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 25px 10px;
  }
`;

const InfoCardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; padding: 0 12px; }
`;

const FlipCard = styled.div`
  height: 260px;
  perspective: 1000px;
  cursor: pointer;
  text-decoration: none;
  display: block;

  &:hover .flip-inner { transform: rotateY(180deg); }

  .flip-inner {
    width: 100%;
    height: 100%;
    transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
    position: relative;
  }

  .flip-front, .flip-back {
    position: absolute;
    inset: 0;
    border-radius: 28px;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 35px;
    text-align: center;
  }

  .flip-front {
    background: #ffffff;
    border: 1px solid ${({ $color }) => $color || '#ffc107'}44;
    box-shadow: 0 20px 50px rgba(0,0,0,0.15), inset 0 0 60px ${({ $color }) => $color || '#ffc107'}08;
    gap: 18px;

    .icon-ring {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: ${({ $color }) => $color || '#ffc107'}18;
      border: 2px solid ${({ $color }) => $color || '#ffc107'}55;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${({ $color }) => $color || '#ffc107'};
      transition: all 0.3s ease;
    }

    h3 {
      font-size: 1.4rem;
      font-weight: 900;
      color: #111;
      margin: 0;
      letter-spacing: -0.5px;
    }

    .tap-hint {
      font-size: 0.7rem;
      color: rgba(0,0,0,0.35);
      font-weight: 700;
      letter-spacing: 1px;
    }
  }

  .flip-back {
    background: ${({ $color }) => $color || '#ffc107'};
    color: #fff;
    transform: rotateY(180deg);
    gap: 12px;

    .back-icon { color: rgba(255,255,255,0.5); }

    h4 {
      font-size: 1.2rem;
      font-weight: 900;
      margin: 0;
      letter-spacing: -0.5px;
      color: #fff;
    }

    p {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 700;
      color: rgba(255,255,255,0.9);
    }

    .hours-row {
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-size: 0.9rem;
      font-weight: 800;
      padding: 5px 0;
      border-bottom: 1px solid rgba(255,255,255,0.2);
      color: #fff;
      span:last-child { opacity: 0.7; }
    }

    .cta-link {
      margin-top: 5px;
      font-size: 0.8rem;
      font-weight: 900;
      text-decoration: underline;
      opacity: 0.8;
      color: #fff;
    }
  }

  @media (max-width: 600px) { height: 220px; }
`;

const EnquirySection = styled.section`
  max-width: 900px;
  margin: 40px auto 80px;
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

    h2 { font-size: 2.5rem; font-weight: 900; margin-bottom: 10px; color: #ffc107; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
    p { color: rgba(255, 255, 255, 0.8); margin-bottom: 40px; font-weight: 500; }

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
  color: #ffc107;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.2);
    border-color: #ffc107;
    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
  }

  .feature-icon {
    width: 50px;
    height: 50px;
    color: #ffc107;
    margin-bottom: 20px;
  }

  h4 { font-weight: 800; margin-bottom: 15px; letter-spacing: 1px; color: white; }
  p { color: rgba(255, 255, 255, 0.8); font-size: 0.95rem; line-height: 1.6; font-weight: 500; }
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
              url("/assets/gym-cta-bg.png");
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

const CoachesSection = styled.section`
  padding: 80px 20px;
  background: transparent;
  .container { max-width: 1200px; margin: 0 auto; text-align: center; }
  .section-desc { color: white; opacity: 0.8; margin-bottom: 50px; font-size: 1.2rem; }
  @media (max-width: 768px) {
    padding: 60px 15px;
    .section-desc { font-size: 1rem; margin-bottom: 30px; }
  }
`;

const CoachesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  @media (max-width: 480px) {
    gap: 20px;
  }
`;

const CoachCard = styled.div`
  position: relative;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  
  .coach-image {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    transition: transform 0.6s ease;
  }

  .coach-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30px;
    background: linear-gradient(transparent, rgba(0,0,0,0.9));
    color: white;
    text-align: left;
    
    h4 { font-weight: 900; font-size: 1.5rem; margin-bottom: 5px; color: #ffc107; }
    span { font-size: 0.8rem; font-weight: 700; opacity: 0.7; letter-spacing: 1px; }
  }

  &:hover {
    .coach-image { transform: scale(1.1); }
  }
`;

const TransformationsSection = styled.section`
  padding: 80px 20px;
  background: rgba(255, 193, 7, 0.05);
  .container { max-width: 1200px; margin: 0 auto; }
  @media (max-width: 768px) { padding: 60px 15px; }
`;

const TransformationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 40px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const TransformationCard = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 250px;

  .trans-image {
    flex: 1;
    background-size: cover;
    background-position: center;
  }

  .trans-content {
    flex: 1.2;
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: white;
    
    p { font-style: italic; font-size: 1.1rem; margin-bottom: 15px; line-height: 1.6; }
    h5 { font-weight: 900; color: #ffc107; }
  }

  @media (max-width: 600px) {
    flex-direction: column;
    height: auto;
    .trans-image { height: 200px; }
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

const AboutSection = styled.section`
  padding: 100px 20px;
  background: transparent;

  .container { max-width: 1200px; margin: 0 auto; }

  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }

  .about-content {
    p { 
      font-size: 1.1rem; 
      line-height: 1.8; 
      color: white; 
      margin-bottom: 20px; 
      font-weight: 500; 
    }
  }

  .about-image-wrapper {
    width: 100%;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    border: 1px solid rgba(255, 193, 7, 0.3);
    position: relative;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.5s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
      pointer-events: none;
    }
  }
`;

const EliteServicesSection = styled.section`
  padding: 80px 20px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  .container { max-width: 1400px; margin: 0 auto; }
  @media (max-width: 768px) { padding: 60px 15px; }
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-top: 50px;
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ServiceCard = styled.div`
  height: 360px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    border-color: #ffc107;

    .card-image { transform: scale(1.1); }
    .card-overlay { background: rgba(0, 0, 0, 0.85); }
    ul { opacity: 1; transform: translateY(0); }
  }

  .card-image {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    transition: transform 0.8s ease;
  }

  .card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(transparent 20%, rgba(0, 0, 0, 0.9));
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 30px 25px;
    color: white;
    transition: all 0.4s ease;

    h4 { 
      font-size: 1.3rem; 
      font-weight: 900; 
      margin-bottom: 10px; 
      color: #ffc107;
      letter-spacing: 1px;
    }

    p { 
      font-size: 0.9rem; 
      opacity: 0.9; 
      margin-bottom: 15px; 
      line-height: 1.5;
      font-weight: 500;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.4s ease 0.1s;
      
      li {
        font-size: 0.85rem;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        gap: 10px;
        color: rgba(255,255,255,0.8);
        font-weight: 600;
        
        &::before {
          content: '•';
          color: #ffc107;
          font-size: 1.2rem;
        }
      }
    }
  }

  @media (max-width: 768px) {
    height: 400px;
    .card-overlay { padding: 30px; }
    ul { opacity: 1; transform: translateY(0); }
  }
`;


const FeedbackMarquee = styled.div`
  width: 100%;
  max-width: 900px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 193, 7, 0.2);
  border-radius: 50px;
  position: relative;
  padding: 12px 25px;
  margin: -55px auto 35px;
  @media (max-width: 768px) {
    margin: -35px auto 25px;
  }
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 15px rgba(255, 193, 7, 0.05);
  display: flex;
  align-items: center;
  overflow: hidden;
  z-index: 25;

  marquee {
    width: 100%;
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .feedback-item {
    display: inline-flex;
    align-items: center;
    margin-right: 50px;
    white-space: nowrap;
    
    .user {
      color: #ffc107;
      font-weight: 800;
      margin-right: 8px;
    }

    .msg {
      font-style: italic;
      color: #ffffff;
    }

    .rating {
      color: #ffc107;
      margin-left: 8px;
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }

    .separator {
      color: rgba(255, 193, 7, 0.3);
      margin-left: 40px;
    }
  }
`;

export default Home;
