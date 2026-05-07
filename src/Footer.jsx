import React from "react";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light pt-2 pb-2">
      <div className="container">
        <div className="row">

          {/* GymDash Info */}
          <div className="col-md-4 mb-3">
            <h5 className="text-warning fw-bold">GymDash</h5>
            <p>Your one-stop fitness companion for tracking workouts, nutrition, and progress.</p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-3">
            <h6 className="text-light">Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/dashboard" className="footer-link text-light text-decoration-none">Dashboard</Link></li>
              <li><Link to="/workouts" className="footer-link text-light text-decoration-none">Workouts</Link></li>
              <li><Link to="/nutrition" className="footer-link text-light text-decoration-none">Nutrition</Link></li>
              <li><Link to="/subscription" className="footer-link text-light text-decoration-none">Subscription</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-3">
            <h6 className="text-light">Contact Us</h6>
            <p><MapPin size={16} className="me-2" /> 123 Gym Street, FitCity</p>
            <p><Phone size={16} className="me-2" /> +1 (555) 123-4567</p>
            <p><Mail size={16} className="me-2" /> support@gymdash.com</p>

            {/* Social Icons */}
            <div className="mt-3">
              <a href="#" className="social-icon"><Facebook size={20} /></a>
              <a href="https://www.instagram.com/rockdinesh2002/" className="social-icon"><Instagram size={20} /></a>
              <a href="https://www.linkedin.com/in/dinesh-dinesh-1a707b281" className="social-icon"><Twitter size={20} /></a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <hr className="border-light" />
        <div className="text-center small">
          &copy; {new Date().getFullYear()} <span className="text-warning">GymDash</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
