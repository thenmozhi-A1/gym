import React from "react";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-moody">
      <div className="container">
        <div className="row">
          
          {/* Brand Column */}
          <div className="col-lg-5 col-md-12 mb-5 mb-lg-0">
            <div className="moody-brand">
              <h2>SLAYFIT</h2>
              <p>
                SlayFit is more than just a gym — it’s a community built to inspire strength, confidence, and healthy living. Join us and push beyond your limits.
              </p>
              <div className="moody-socials">
                <a href="#" className="social-icon-moody"><Facebook size={20} /></a>
                <a href="#" className="social-icon-moody"><Instagram size={20} /></a>
                <a href="#" className="social-icon-moody"><Twitter size={20} /></a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-3 col-md-6 mb-5 mb-md-0">
            <h4 className="moody-title">Training</h4>
            <ul className="moody-links">
              <li><Link to="/workouts">Workout Plans</Link></li>
              <li><Link to="/nutrition">Nutrition Guide</Link></li>
              <li><Link to="/subscription">Membership</Link></li>
              <li><Link to="/about">Our Philosophy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-4 col-md-6">
            <h4 className="moody-title">Visit Us</h4>
            <div className="moody-contact-item">
              <MapPin className="moody-icon" size={20} />
              <span>Anna Salai, Chennai, India</span>
            </div>
            <div className="moody-contact-item">
              <Phone className="moody-icon" size={20} />
              <span>+91 84891 02133</span>
            </div>
            <div className="moody-contact-item">
              <Mail className="moody-icon" size={20} />
              <span>support@slayfit.com</span>
            </div>
          </div>

        </div>

        <div className="moody-bottom">
          <div className="copyright-moody">
            &copy; {new Date().getFullYear()} SLAYFIT. ALL RIGHTS RESERVED.
          </div>
          <div className="footer-legal-links d-flex gap-4">
            <a href="#" className="text-decoration-none text-muted">PRIVACY</a>
            <a href="#" className="text-decoration-none text-muted">TERMS</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
