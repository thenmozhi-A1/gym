import React from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaDumbbell,
  FaCreditCard,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaChevronLeft,
} from "react-icons/fa";
import { Button } from "react-bootstrap";

const Sidebar = ({ isOpen, toggleSidebar, currentPage }) => {
  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/" },
    { name: "Members", icon: <FaUsers />, path: "/members" },
    { name: "Trainers", icon: <FaDumbbell />, path: "/trainers" },
    { name: "Payments", icon: <FaCreditCard />, path: "/payments" },
    { name: "Schedules", icon: <FaCalendarAlt />, path: "/schedules" },
    { name: "Reports", icon: <FaChartBar />, path: "/reports" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  return (
    <div
      className={`position-fixed top-0 start-0 h-100 bg-white border-end shadow-sm p-3 transition-all ${
        isOpen ? "translate-x-0" : "-translate-x-100 d-none d-md-block"
      }`}
      style={{ width: "260px", zIndex: 1040 }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-primary text-white fw-bold rounded px-2 py-1">FP</div>
          <span className="fw-bold text-primary fs-5">GYM BRO</span>
        </div>
        <Button
          variant="link"
          className="d-md-none p-0"
          onClick={toggleSidebar}
        >
          <FaChevronLeft size={18} />
        </Button>
      </div>

      <hr />

      <nav className="nav flex-column mb-4">
        {menuItems.map((item) => (
          <a
            key={item.name}
            href={item.path}
            className={`nav-link d-flex align-items-center gap-2 ${
              item.path === currentPage ? "active fw-semibold text-primary" : "text-dark"
            }`}
          >
            {item.icon}
            {item.name}
          </a>
        ))}
      </nav>

      <hr />

      <div className="bg-light rounded p-3 mt-auto">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-primary text-white rounded-circle p-2 d-flex justify-content-center align-items-center">
            <FaDumbbell />
          </div>
          <div>
            <p className="mb-0 fw-semibold small">Upgrade to Pro</p>
            <p className="mb-0 text-muted small">Get more features</p>
          </div>
        </div>
        <Button variant="primary" className="w-100 mt-3">
          Upgrade Plan
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
