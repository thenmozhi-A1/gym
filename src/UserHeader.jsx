import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { Button, Image } from 'react-bootstrap';

const UserHeader = () => {
  const userName = "Dinesh";
  const avatarUrl = "https://m.gettywallpapers.com/wp-content/uploads/2023/05/GYM-Bodybuilder-Anime-Boy-Pfp-HD.jpg";

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="d-flex align-items-center justify-content-between mb-4">
      <div className="d-flex align-items-center gap-3">
        <div
          className="rounded-circle border border-3 border-info overflow-hidden"
          style={{ width: "64px", height: "64px" }}
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={userName}
              roundedCircle
              width="100%"
              height="100%"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="bg-secondary text-white d-flex align-items-center justify-content-center h-100 w-100 fw-bold">
              {getInitials(userName)}
            </div>
          )}
        </div>
        <div>
          <h4 className="mb-1 fw-bold text-dark">Welcome back, {userName}!</h4>
          <p className="text-muted mb-0">Ready for today's workout challenge?</p>
        </div>
      </div>

      <div className="d-flex gap-2">
        <Button variant="outline-secondary">
          <Bell size={18} />
        </Button>
        <Button variant="outline-secondary">
          <Settings size={18} />
        </Button>
      </div>
    </div>
  );
};

export default UserHeader;
