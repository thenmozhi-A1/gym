import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import About from "./About";
import Nav from "./Nav";
import Footer from "./Footer";
import Dashboard from "./Dashboard";
import Userdashboard from "./Userdashboard";
import Subscription from "./Subscription";
import PlanDetail from "./PlanDetail";
import Pay from "./Pay";
import Nutrition from "./Nutrition";
import Workouts from "./Workouts";
import WorkoutDetail from "./WorkoutDetail";
import ReportsPage from "./ReportsPage";
import StatsPage from "./StatsPage";
import Myprofile from "./Myprofile";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import Settings from "./Settings";

import "./App.css"; // Import your CSS file here

// Wrapper to allow useLocation inside Router
function LayoutWrapper() {
  const location = useLocation();

  // List all routes that should HIDE Navbar & Footer
  const hideLayoutRoutes = ["/AdminDashboard", "/EmployeeDashboard"];

  // Case-insensitive match to be ultra-robust
  const hideLayout = hideLayoutRoutes.some(
    (route) => route.toLowerCase() === location.pathname.toLowerCase()
  );

  return (
    <div className={hideLayout ? "no-navbar-layout" : "navbar-layout"}>
      {!hideLayout && <Nav />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userdashboard" element={<Userdashboard />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/membership/:type" element={<PlanDetail />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/workout/:type" element={<WorkoutDetail />} />
        <Route path="/dashboard/reports" element={<ReportsPage />} />
        <Route path="/dashboard/stats" element={<StatsPage />} />
        <Route path="/myprofile" element={<Myprofile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/EmployeeDashboard" element={<EmployeeDashboard />} />

      </Routes>

      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}

export default App;
