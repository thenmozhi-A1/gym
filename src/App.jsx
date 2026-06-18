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
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
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
import ProtectedRoute from "./Components/ProtectedRoute";
import ErrorBoundary from "./Components/ErrorBoundary";
import NotFound from "./NotFound";

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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* Public Marketing/Info Routes */}
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/membership/:type" element={<PlanDetail />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/workout/:type" element={<WorkoutDetail />} />

        {/* Protected User Routes */}
        <Route path="/userdashboard" element={<ProtectedRoute><ErrorBoundary fallbackMessage="The user dashboard encountered an error."><Userdashboard /></ErrorBoundary></ProtectedRoute>} />
        <Route path="/pay" element={<ProtectedRoute><Pay /></ProtectedRoute>} />
        <Route path="/dashboard/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/dashboard/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
        <Route path="/myprofile" element={<ProtectedRoute><Myprofile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        
        {/* Role-Based Protected Routes */}
        <Route path="/AdminDashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><ErrorBoundary fallbackMessage="The admin dashboard encountered an error."><AdminDashboard /></ErrorBoundary></ProtectedRoute>} />
        <Route path="/EmployeeDashboard" element={<ProtectedRoute allowedRoles={['TRAINER', 'STAFF', 'FRONT OFFICE', 'MANAGER', 'EMPLOYEE']}><ErrorBoundary fallbackMessage="The employee dashboard encountered an error."><EmployeeDashboard /></ErrorBoundary></ProtectedRoute>} />
        
        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />

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
