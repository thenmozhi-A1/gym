import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { Badge, Image } from 'react-bootstrap';

const UpcomingSessions = () => {
  const sessions = [
    {
      id: 1,
      type: "HIIT",
      trainer: {
        name: "Mike Thompson",
        avatar: "https://i.pravatar.cc/150?img=52",
        initials: "MT"
      },
      time: "Today, 5:30 PM",
      duration: "45 mins",
      location: "Studio B",
      badge: "Booked"
    },
    {
      id: 2,
      type: "Yoga",
      trainer: {
        name: "Emma Davis",
        avatar: "https://i.pravatar.cc/150?img=47",
        initials: "ED"
      },
      time: "Tomorrow, 8:00 AM",
      duration: "60 mins",
      location: "Zen Room",
      badge: "Booked"
    },
    {
      id: 3,
      type: "Personal Training",
      trainer: {
        name: "Jason Miller",
        avatar: "https://i.pravatar.cc/150?img=59",
        initials: "JM"
      },
      time: "Wed, 6:00 PM",
      duration: "60 mins",
      location: "Training Area",
      badge: "Confirm"
    },
    {
      id: 4,
      type: "Cycling",
      trainer: {
        name: "Lisa Wong",
        avatar: "https://i.pravatar.cc/150?img=5",
        initials: "LW"
      },
      time: "Thu, 7:15 PM",
      duration: "45 mins",
      location: "Spin Studio",
      badge: "Booked"
    },
    {
      id: 5,
      type: "Boxing",
      trainer: {
        name: "Alex Johnson",
        avatar: "https://i.pravatar.cc/150?img=15",
        initials: "AJ"
      },
      time: "Fri, 5:45 PM",
      duration: "50 mins",
      location: "Boxing Ring",
      badge: "Waitlist"
    }
  ];

  const getBadgeVariant = (status) => {
    switch (status) {
      case "Booked":
        return "primary";
      case "Waitlist":
        return "danger";
      case "Confirm":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="border rounded p-3 bg-white shadow-sm hover-shadow transition"
        >
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">{session.type}</h5>
            <Badge bg={getBadgeVariant(session.badge)}>{session.badge}</Badge>
          </div>

          <div className="d-flex align-items-center mb-3">
            <Image
              src={session.trainer.avatar}
              alt={session.trainer.name}
              roundedCircle
              width={32}
              height={32}
              className="me-2"
            />
            <small>{session.trainer.name}</small>
          </div>

          <div className="row text-muted small">
            <div className="col-6 d-flex align-items-center mb-1">
              <Clock size={14} className="me-1" />
              {session.time}
            </div>
            <div className="col-6 mb-1">
              {session.duration}
            </div>
            <div className="col-12 d-flex align-items-center">
              <MapPin size={14} className="me-1" />
              {session.location}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingSessions;
