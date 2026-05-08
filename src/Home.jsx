import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MapPin, Clock, Phone, Mail, Award, Shield, Zap, UserCircle } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <HomeContainer>
      {localStorage.getItem("isLoggedIn") !== "true" && (
        <div className="login-corner">
          <button className="login-btn" onClick={() => navigate("/login")}>
            <UserCircle size={18} /> User Login
          </button>
        </div>
      )}

      <HeroSection>
        <div className="content">
          <Badge>SINCE 2024</Badge>
          <h1>Elevating Fitness at <span className="text-warning">GymDash</span></h1>
          <p>
            GymDash was founded with a single mission: to provide an inclusive,
            high-performance environment where every individual can unlock their
            true physical potential. From elite athletes to fitness beginners,
            our state-of-the-art facility and expert coaches are here to guide
            your journey.
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
          <p>123 Gym Street, Elite Plaza, FitCity, 560001</p>
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
          <p>Phone: +1 (555) 123-4567</p>
          <p>Email: info@gymdash.com</p>
        </DetailCard>
      </DetailsGrid>

    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  background: linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), 
              url("https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=100&w=2560&auto=format&fit=crop");
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
  padding-top: 56px;

  .content {
    max-width: 800px;
    padding: 0 20px;
    position: relative;
    z-index: 20;
    h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 20px; color: #1a1a1a; }
    p { font-size: 1.2rem; color: #444; margin-bottom: 30px; }
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



export default Home;
