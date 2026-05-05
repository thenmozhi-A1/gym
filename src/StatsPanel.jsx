import React from 'react';
import { Card } from 'react-bootstrap';
import { Dumbbell, Calendar, Activity, Flame } from 'lucide-react';

const StatsPanel = () => {
  const stats = [
    {
      title: "Membership Status",
      value: "Premium Active",
      icon: <Dumbbell size={20} />,
      info: "Expires in 45 days",
      color: "text-primary bg-primary bg-opacity-10",
    },
    {
      title: "Current Plan",
      value: "Strength Training",
      icon: <Calendar size={20} />,
      info: "Week 3 of 12",
      color: "text-success bg-success bg-opacity-10",
    },
    {
      title: "This Month",
      value: "12 Sessions",
      icon: <Activity size={20} />,
      info: "75% attendance",
      color: "text-info bg-info bg-opacity-10",
    },
    {
      title: "Calories Burned",
      value: "6,240 kcal",
      icon: <Flame size={20} />,
      info: "This month",
      color: "text-danger bg-danger bg-opacity-10",
    },
  ];

  return (
    <div className="row g-4">
      {stats.map((stat, index) => (
        <div className="col-12 col-sm-6 col-lg-3" key={index}>
          <Card className="border-0 shadow-sm w-100 h-100">
            <Card.Body className="d-flex flex-column justify-content-between h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div
                  className={`d-flex align-items-center justify-content-center rounded-circle ${stat.color}`}
                  style={{ width: '48px', height: '48px' }}
                >
                  {stat.icon}
                </div>
                <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                  {stat.info}
                </small>
              </div>
              <div>
                <h6
                  className="text-uppercase text-secondary mb-1"
                  style={{ fontSize: "0.75rem", letterSpacing: '0.5px' }}
                >
                  {stat.title}
                </h6>
                <h4
                  className="fw-bold text-dark mb-0"
                  style={{ fontSize: '1.5rem' }}
                >
                  {stat.value}
                </h4>
              </div>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default StatsPanel;
