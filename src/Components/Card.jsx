import React from "react";

const Card = ({ title, value, icon, change, className }) => {
  const changeColor = change
    ? change.positive
      ? "text-success"
      : "text-danger"
    : "";

  const arrow = change
    ? change.positive
      ? "↑"
      : "↓"
    : "";

  return (
    <div className={`card shadow-sm ${className || ""}`}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="text-muted small mb-1">{title}</p>
            <h3 className="fw-bold mb-2">{value}</h3>
            {change && (
              <p className={`small mb-0 ${changeColor}`}>
                {arrow} {change.value}% from last month
              </p>
            )}
          </div>
          <div
            className="d-flex align-items-center justify-content-center rounded-circle bg-light p-2"
            style={{ width: "40px", height: "40px" }}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
