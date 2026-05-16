import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, UserCircle, LogOut, Settings, LayoutDashboard } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userName = localStorage.getItem("userName") || "";
  const userRole = localStorage.getItem("userRole");
  const displayName = userName ? userName.split(" ")[0] : "Profile";

  const handleNavClick = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? "scrolled" : ""}`}>
      <div className="container">

        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={handleNavClick}>
          <img src="/logo.png" alt="Logo" />
          <span className="ms-2 brand-text">SLAYFIT</span>
        </Link>

        <button className="navbar-toggler border-0" type="button" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} color="#ffc107" /> : <Menu size={32} color="#ffc107" />}
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <button className="nav-link" onClick={() => { navigate("/"); handleNavClick(); }}>Home</button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => { navigate("/about"); handleNavClick(); }}>About</button>
            </li>
            <li className="nav-item dropdown">
              <button className="nav-link dropdown-toggle" id="workoutsDrop" data-bs-toggle="dropdown">Workouts</button>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/workouts" onClick={handleNavClick}>Overview</Link></li>
                <li><hr className="dropdown-divider border-secondary opacity-25" /></li>
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
            <li className="nav-item dropdown">
              <button className="nav-link dropdown-toggle" id="nutriDrop" data-bs-toggle="dropdown">Nutrition</button>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/nutrition" onClick={handleNavClick}>Plans</Link></li>
                <li><Link className="dropdown-item" to="/nutrition#supplements" onClick={handleNavClick}>Supplements</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => { navigate("/subscription"); handleNavClick(); }}>Pricing</button>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            {!isLoggedIn ? (
              <button className="btn-tech" onClick={() => { navigate("/login"); handleNavClick(); }}>
                Enter Arena
              </button>
            ) : (
              <div className="nav-item dropdown">
                <button className="btn-tech dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
                  <UserCircle size={20} className="me-2" />
                  {displayName}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link 
                      className="dropdown-item d-flex align-items-center" 
                      to={
                        userRole?.toUpperCase() === 'ADMIN' 
                          ? "/AdminDashboard" 
                          : (['TRAINER', 'FRONT OFFICE', 'STAFF'].some(r => userRole?.toUpperCase().includes(r)) 
                            ? "/EmployeeDashboard" 
                            : "/userdashboard")
                      } 
                      onClick={handleNavClick}
                    >
                      <LayoutDashboard size={16} className="me-2" /> Dashboard
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item d-flex align-items-center" onClick={() => { navigate("/myprofile"); handleNavClick(); }}>
                      <Settings size={16} className="me-2" /> Profile
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item d-flex align-items-center text-danger" onClick={handleLogout}>
                      <LogOut size={16} className="me-2" /> Shutdown
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;