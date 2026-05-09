import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, UserCircle } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Read logged-in user from localStorage
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userName = localStorage.getItem("userName") || "";
  const userEmail = localStorage.getItem("userEmail") || "";
  // Show first name only in the button label
  const displayName = userName ? userName.split(" ")[0] : "Profile";

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top py-0" style={{ height: "70px" }}>
      <div className="container h-100">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center h-100" to="/" onClick={handleNavClick} style={{ overflow: "hidden" }}>
          <img 
            src="/logo.png" 
            alt="HoneyFit Logo" 
            style={{ 
              height: "100%", 
              width: "200px", 
              objectFit: "cover",
              objectPosition: "center"
            }} 
          />
        </Link>

        {/* Toggle Button */}
        <button className="navbar-toggler" type="button" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} color="white" /> : <Menu size={28} color="white" />}
        </button>

        {/* Nav Links */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">

            {/* Home */}
            <li className="nav-item">
              <button className="btn btn-outline-warning me-2" onClick={() => { navigate("/"); handleNavClick(); }}>
                Home
              </button>
            </li>


            {/* Workouts Dropdown */}
            <li className="nav-item dropdown">
              <button className="nav-link dropdown-toggle" id="workoutsDropdown" data-bs-toggle="dropdown">
                Workouts
              </button>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/workouts" onClick={handleNavClick}>Overview</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/workout/bench-press" onClick={handleNavClick}>Bench Press</Link></li>
                <li><Link className="dropdown-item" to="/workout/squats" onClick={handleNavClick}>Squats</Link></li>
                <li><Link className="dropdown-item" to="/workout/deadlifts" onClick={handleNavClick}>Deadlifts</Link></li>
                <li><Link className="dropdown-item" to="/workout/pull-ups" onClick={handleNavClick}>Pull-Ups</Link></li>
                <li><Link className="dropdown-item" to="/workout/dumbbell-rows" onClick={handleNavClick}>Dumbbell Rows</Link></li>
                <li><Link className="dropdown-item" to="/workout/lunges" onClick={handleNavClick}>Lunges</Link></li>
                <li><Link className="dropdown-item" to="/workout/cardio" onClick={handleNavClick}>Cardio</Link></li>
                <li><Link className="dropdown-item" to="/workout/bulking" onClick={handleNavClick}>Bulking</Link></li>
                <li><Link className="dropdown-item" to="/workout/weight-loss" onClick={handleNavClick}>Weight Loss</Link></li>
                <li><Link className="dropdown-item" to="/workout/yoga" onClick={handleNavClick}>Yoga</Link></li>
              </ul>
            </li>

            {/* Nutrition Dropdown */}
            <li className="nav-item dropdown">
              <button className="nav-link dropdown-toggle" id="nutritionDropdown" data-bs-toggle="dropdown">
                Nutrition
              </button>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/nutrition" onClick={handleNavClick}>Overview</Link></li>
                <li><Link className="dropdown-item" to="/nutrition#meal-plans" onClick={handleNavClick}>Meal Plans</Link></li>
                <li><Link className="dropdown-item" to="/nutrition#supplements" onClick={handleNavClick}>Supplements</Link></li>
                <li><Link className="dropdown-item" to="/nutrition#tracking" onClick={handleNavClick}>Tracking</Link></li>
              </ul>
            </li>

            {/* Subscription Dropdown */}
            <li className="nav-item dropdown">
              <button className="nav-link dropdown-toggle" id="subscriptionDropdown" data-bs-toggle="dropdown">
                Subscription
              </button>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/subscription" onClick={handleNavClick}>Overview</Link></li>
                <li><Link className="dropdown-item" to="/subscription#monthly-plans" onClick={handleNavClick}>Monthly Plans</Link></li>
                <li><Link className="dropdown-item" to="/subscription#yearly-plans" onClick={handleNavClick}>Yearly Plans</Link></li>
                <li><Link className="dropdown-item" to="/subscription#custom-plans" onClick={handleNavClick}>Custom Plans</Link></li>
              </ul>
            </li>

            {/* Login Button — ONLY SHOWN IF NOT LOGGED IN */}
            {!isLoggedIn && (
              <li className="nav-item">
                <button className="btn btn-warning fw-bold ms-lg-2" onClick={() => { navigate("/login"); handleNavClick(); }}>
                  <UserCircle size={18} className="me-1" /> User Login
                </button>
              </li>
            )}

            {/* Dashboard Dropdown - ONLY SHOWN IF LOGGED IN */}
            {isLoggedIn && (
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle text-warning fw-bold" id="dashboardDropdown" data-bs-toggle="dropdown">
                  Dashboard
                </button>
                <ul className="dropdown-menu">
                  {localStorage.getItem("userRole") === "ADMIN" ? (
                    <li><Link className="dropdown-item" to="/AdminDashboard" onClick={handleNavClick}>Admin Panel</Link></li>
                  ) : (
                    <>
                      <li><Link className="dropdown-item" to="/userdashboard" onClick={handleNavClick}>Overview</Link></li>
                      <li><Link className="dropdown-item" to="/dashboard/reports" onClick={handleNavClick}>Reports</Link></li>
                      <li><Link className="dropdown-item" to="/dashboard/stats" onClick={handleNavClick}>Statistics</Link></li>
                    </>
                  )}
                </ul>
              </li>
            )}

            {/* Profile Dropdown - ONLY SHOWN IF LOGGED IN */}
            {isLoggedIn && (
              <li className="nav-item dropdown">
                <button className="btn btn-secondary dropdown-toggle ms-lg-2" id="profileDropdown" data-bs-toggle="dropdown">
                  <UserCircle size={20} className="me-1" />
                  {displayName}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <div className="px-3 py-2">
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#212529" }}>{userName}</div>
                      <div style={{ fontSize: "0.78rem", color: "#6c757d" }}>{userEmail}</div>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={() => { navigate("/myprofile"); handleNavClick(); }}>My Profile</button></li>
                  <li><Link className="dropdown-item" to="/settings" onClick={handleNavClick}>Settings</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => {
                        localStorage.removeItem("isLoggedIn");
                        localStorage.removeItem("userId");
                        localStorage.removeItem("userName");
                        localStorage.removeItem("userEmail");
                        localStorage.removeItem("userRole");
                        window.location.href = "/";
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
