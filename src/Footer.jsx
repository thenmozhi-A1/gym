import React from "react";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Footer = () => {
  return (
    <FooterContainer>
      <div className="container">
        <div className="row g-4">

          {/* GymDash Info */}
          <div className="col-md-4 mb-4">
            <h5 className="brand-title">GymDash</h5>
            <p className="footer-desc">
              Your one-stop fitness companion for tracking workouts, nutrition, and progress. 
              Join the elite community today.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h6 className="section-title">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/dashboard" className="footer-link">Dashboard</Link></li>
              <li className="mb-2"><Link to="/workouts" className="footer-link">Workouts</Link></li>
              <li className="mb-2"><Link to="/nutrition" className="footer-link">Nutrition</Link></li>
              <li className="mb-2"><Link to="/subscription" className="footer-link">Subscription</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-4">
            <h6 className="section-title">Contact Us</h6>
            <div className="contact-item">
              <MapPin size={16} /> <span>No.624, Khivraj Building, Anna Salai</span>
            </div>
            <div className="contact-item">
              <Phone size={16} /> <span>+91 78248 58436</span>
            </div>
            <div className="contact-item">
              <Mail size={16} /> <span>support@gymdash.com</span>
            </div>

            {/* Social Icons */}
            <div className="social-row mt-4">
              <a href="#" className="social-icon"><Facebook size={20} /></a>
              <a href="https://www.instagram.com/rockdinesh2002/" className="social-icon"><Instagram size={20} /></a>
              <a href="https://www.linkedin.com/in/dinesh-dinesh-1a707b281" className="social-icon"><Twitter size={20} /></a>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} <span className="text-warning">GymDash</span>. All rights reserved.
        </div>
      </div>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background: #ffffff;
  color: #4a5568;
  padding: 40px 0 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);

  .brand-title {
    color: #b8860b; /* Darker Gold for visibility on light */
    font-weight: 800;
    font-size: 1.8rem;
    margin-bottom: 20px;
    letter-spacing: -0.5px;
  }

  .footer-desc {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #4a5568;
  }

  .section-title {
    color: #1a202c;
    font-weight: 700;
    font-size: 1.1rem;
    margin-bottom: 25px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .footer-link {
    color: #718096;
    text-decoration: none;
    transition: all 0.3s ease;
    font-size: 0.95rem;

    &:hover {
      color: #b8860b;
      padding-left: 5px;
    }
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    font-size: 0.95rem;
    color: #4a5568;
    
    svg {
      color: #b8860b;
    }
  }

  .social-row {
    display: flex;
    gap: 15px;
  }

  .social-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
    color: #1a202c;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      background: #ffc107;
      color: black;
      transform: translateY(-3px);
    }
  }

  .footer-divider {
    border-color: rgba(0, 0, 0, 0.05);
    margin: 40px 0 20px;
  }

  .footer-bottom {
    text-align: center;
    font-size: 0.85rem;
    color: #718096;
  }
`;

export default Footer;
