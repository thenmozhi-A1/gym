import React from "react";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-m5">
      <div className="m5-container">
        
        {/* Left Side: Brand Trapezoid */}
        <div className="m5-brand-section">
          <h2>SLAYFIT</h2>
          <div className="m5-tagline">— TRAIN. FUEL. CONQUER. —</div>
        </div>

        {/* Center: Links Grid */}
        <div className="m5-links-section">
          
          <div className="m5-col">
            <h5 className="m5-col-title">Quick Links</h5>
            <ul className="m5-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/workouts">Workouts</Link></li>
              <li><Link to="/subscription">Pricing</Link></li>
            </ul>
          </div>

          <div className="m5-col">
            <h5 className="m5-col-title">Programs</h5>
            <ul className="m5-links">
              <li><Link to="/workout/bench-press">Strength</Link></li>
              <li><Link to="/workout/weight-loss">Weight Loss</Link></li>
              <li><Link to="/workout/cardio">Cardio</Link></li>
              <li><Link to="/workout/yoga">Mobility</Link></li>
            </ul>
          </div>

          <div className="m5-col">
            <h5 className="m5-col-title">Membership</h5>
            <ul className="m5-links">
              <li><Link to="/subscription">Plans</Link></li>
              <li><Link to="/login">Join Now</Link></li>
              <li><Link to="/userdashboard">Benefits</Link></li>
              <li><Link to="/about">Story</Link></li>
            </ul>
          </div>

        </div>

        {/* Right Side: Contact Trapezoid */}
        <div className="m5-right-section">
          <h5 className="m5-col-title">Contact Us</h5>
          <div className="m5-contact-item">
            <MapPin size={16} />
            <span>123 Fitness St, Mumbai</span>
          </div>
          <div className="m5-contact-item">
            <Mail size={16} />
            <span>info@slayfit.com</span>
          </div>
          <div className="m5-contact-item">
            <Phone size={16} />
            <span>+91 98765 43210</span>
          </div>
          
          <div className="m5-socials">
            <a href="#" className="social-m5-btn"><Facebook size={18} /></a>
            <a href="#" className="social-m5-btn"><Instagram size={18} /></a>
            <a href="#" className="social-m5-btn"><Twitter size={18} /></a>
            <a href="#" className="social-m5-btn"><Youtube size={18} /></a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="m5-bottom-bar">
        <div>&copy; {new Date().getFullYear()} SlayFit Global. All rights reserved.</div>
        <div className="m5-slogan">TRAIN TODAY. TRANSFORM TOMORROW.</div>
      </div>

    </footer>
  );
};

export default Footer;
