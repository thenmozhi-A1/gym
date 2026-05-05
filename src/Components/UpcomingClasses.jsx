import React from "react";

const classData = [
  {
    id: "1",
    name: "HIIT Workout",
    time: "08:00 AM - 09:00 AM",
    trainer: { name: "Alex Johnson", avatar: "/placeholder.svg" },
    spots: { total: 15, filled: 12 },
  },
  {
    id: "2",
    name: "Yoga Flow",
    time: "10:00 AM - 11:00 AM",
    trainer: { name: "Maya Patel", avatar: "/placeholder.svg" },
    spots: { total: 20, filled: 15 },
  },
  {
    id: "3",
    name: "Strength Training",
    time: "01:00 PM - 02:00 PM",
    trainer: { name: "Chris Lee", avatar: "/placeholder.svg" },
    spots: { total: 10, filled: 10 },
  },
  {
    id: "4",
    name: "Spin Class",
    time: "04:00 PM - 05:00 PM",
    trainer: { name: "Sophia Martinez", avatar: "/placeholder.svg" },
    spots: { total: 12, filled: 8 },
  },
];

const UpcomingClasses = () => {
  return (
    <>
      {/* Embedded CSS */}
      <style>{`
        .classes-container {
          width: 100%;
          margin: 0 auto;
          padding: 1rem;
        }

        .class-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          transition: box-shadow 0.2s ease;
        }

        .class-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        .class-badge {
          font-size: 0.75rem;
          padding: 4px 8px;
          border-radius: 12px;
        }

        .trainer-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        .trainer-avatar {
          width: 28px;
          height: 28px;
          object-fit: cover;
          border-radius: 50%;
          border: 1px solid #dee2e6;
        }

        .progress {
          height: 6px;
          border-radius: 3px;
          margin-top: 0.5rem;
        }

        .progress-bar {
          transition: width 0.3s ease;
        }
      `}</style>

      <div className="classes-container">
        <div className="card shadow-sm mb-4 w-100">
          <div className="card-header bg-white border-bottom">
            <h5 className="mb-0 fw-bold">Today's Classes</h5>
          </div>
          <div className="card-body">
            {classData.map((item) => {
              const spotsFilled = (item.spots.filled / item.spots.total) * 100;
              const isFull = item.spots.filled === item.spots.total;

              return (
                <div key={item.id} className="class-card">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="fw-semibold mb-1">{item.name}</h6>
                      <p className="text-muted small mb-0">{item.time}</p>
                    </div>
                    <span
                      className={`class-badge badge ${
                        isFull
                          ? "bg-danger-subtle text-danger"
                          : "bg-success-subtle text-success"
                      }`}
                    >
                      {isFull ? "Full" : `${item.spots.total - item.spots.filled} spots left`}
                    </span>
                  </div>

                  <div className="trainer-info">
                    <img
                      src={item.trainer.avatar}
                      alt={item.trainer.name}
                      className="trainer-avatar"
                    />
                    <span className="text-muted small">{item.trainer.name}</span>
                  </div>

                  <div className="progress">
                    <div
                      className={`progress-bar ${
                        isFull ? "bg-danger" : "bg-primary"
                      }`}
                      style={{ width: `${spotsFilled}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default UpcomingClasses;