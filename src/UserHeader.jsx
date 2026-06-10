import React from 'react';
import { Bell, Settings } from 'lucide-react';
import styled from 'styled-components';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const AvatarContainer = styled.div`
  border-radius: 50%;
  border: 3px solid #0dcaf0;
  overflow: hidden;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const AvatarFallback = styled.div`
  background-color: #6c757d;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  font-weight: bold;
`;

const Greeting = styled.h4`
  margin-bottom: 4px;
  font-weight: bold;
  color: #212529;
  font-size: 1.5rem;
`;

const Subtitle = styled.p`
  color: #6c757d;
  margin-bottom: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  background-color: transparent;
  color: #6c757d;
  border: 1px solid #6c757d;
  border-radius: 6px;
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #fff;
    background-color: #6c757d;
  }
`;

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
    <HeaderContainer>
      <ProfileSection>
        <AvatarContainer>
          {avatarUrl ? (
            <AvatarImg src={avatarUrl} alt={userName} />
          ) : (
            <AvatarFallback>{getInitials(userName)}</AvatarFallback>
          )}
        </AvatarContainer>
        <div>
          <Greeting>Welcome back, {userName}!</Greeting>
          <Subtitle>Ready for today's workout challenge?</Subtitle>
        </div>
      </ProfileSection>

      <Actions>
        <IconButton>
          <Bell size={18} />
        </IconButton>
        <IconButton>
          <Settings size={18} />
        </IconButton>
      </Actions>
    </HeaderContainer>
  );
};

export default UserHeader;
