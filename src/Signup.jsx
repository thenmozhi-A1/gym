import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Signup = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const role = params.get("role");

  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // Perform signup logic here (API call or local storage)
    alert("Signup Successful!");
    navigate(`/login?role=${role}`); // Redirect to login page with role
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h2 className="text-center mb-4">
          {role === "admin" ? "Admin Signup" : "User Signup"}
        </h2>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control" placeholder="Enter Full Name" required />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input type="text" className="form-control" placeholder="Enter Phone Number" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="Enter Email" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="Enter Password" required />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
