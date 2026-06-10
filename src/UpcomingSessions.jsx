import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import styled from 'styled-components';

const SessionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SessionCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const SessionType = styled.h5`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
`;

const StatusBadge = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  background-color: ${(props) => props.$bg || '#e2e8f0'};
  color: ${(props) => props.$color || '#475569'};
`;

const TrainerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const TrainerAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const TrainerName = styled.small`
  color: #475569;
  font-size: 0.85rem;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  font-size: 0.8rem;
  color: #64748b;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const getBadgeStyles = (status) => {
  switch (status) {
    case 'Booked':
      return { bg: '#dbeafe', color: '#1d4ed8' };
    case 'Waitlist':
      return { bg: '#fde8e8', color: '#dc2626' };
    case 'Confirm':
      return { bg: '#fef3c7', color: '#b45309' };
    default:
      return { bg: '#e2e8f0', color: '#475569' };
  }
};

const sessions = [
  {
    id: 1,
    type: "HIIT",
    trainer: { name: "Mike Thompson", avatar: "https://i.pravatar.cc/150?img=52" },
    time: "Today, 5:30 PM",
    duration: "45 mins",
    location: "Studio B",
    badge: "Booked"
  },
  {
    id: 2,
    type: "Yoga",
    trainer: { name: "Emma Davis", avatar: "https://i.pravatar.cc/150?img=47" },
    time: "Tomorrow, 8:00 AM",
    duration: "60 mins",
    location: "Zen Room",
    badge: "Booked"
  },
  {
    id: 3,
    type: "Personal Training",
    trainer: { name: "Jason Miller", avatar: "https://i.pravatar.cc/150?img=59" },
    time: "Wed, 6:00 PM",
    duration: "60 mins",
    location: "Training Area",
    badge: "Confirm"
  },
  {
    id: 4,
    type: "Cycling",
    trainer: { name: "Lisa Wong", avatar: "https://i.pravatar.cc/150?img=5" },
    time: "Thu, 7:15 PM",
    duration: "45 mins",
    location: "Spin Studio",
    badge: "Booked"
  },
  {
    id: 5,
    type: "Boxing",
    trainer: { name: "Alex Johnson", avatar: "https://i.pravatar.cc/150?img=15" },
    time: "Fri, 5:45 PM",
    duration: "50 mins",
    location: "Boxing Ring",
    badge: "Waitlist"
  }
];

const UpcomingSessions = () => {
  return (
    <SessionList>
      {sessions.map((session) => {
        const { bg, color } = getBadgeStyles(session.badge);
        return (
          <SessionCard key={session.id}>
            <CardHeader>
              <SessionType>{session.type}</SessionType>
              <StatusBadge $bg={bg} $color={color}>{session.badge}</StatusBadge>
            </CardHeader>

            <TrainerRow>
              <TrainerAvatar src={session.trainer.avatar} alt={session.trainer.name} />
              <TrainerName>{session.trainer.name}</TrainerName>
            </TrainerRow>

            <MetaGrid>
              <MetaItem>
                <Clock size={14} />
                {session.time}
              </MetaItem>
              <MetaItem>
                {session.duration}
              </MetaItem>
              <MetaItem style={{ gridColumn: '1 / -1' }}>
                <MapPin size={14} />
                {session.location}
              </MetaItem>
            </MetaGrid>
          </SessionCard>
        );
      })}
    </SessionList>
  );
};

export default UpcomingSessions;
