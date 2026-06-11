import React from 'react';
import { Dumbbell, Calendar, Activity, Flame } from 'lucide-react';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (min-width: 992px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.$bg || '#e8f4fd'};
  color: ${(props) => props.$color || '#3b82f6'};
  flex-shrink: 0;
`;

const InfoText = styled.small`
  color: #6c757d;
  font-size: 0.75rem;
`;

const StatTitle = styled.h6`
  text-transform: uppercase;
  color: #6c757d;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  margin: 0 0 4px 0;
`;

const StatValue = styled.h4`
  font-weight: bold;
  color: #212529;
  font-size: 1.5rem;
  margin: 0;
`;

const stats = [
  {
    title: "Membership Status",
    value: "Premium Active",
    icon: <Dumbbell size={20} />,
    info: "Expires in 45 days",
    bg: "#e8f0fe",
    color: "#3b82f6",
  },
  {
    title: "Current Plan",
    value: "Strength Training",
    icon: <Calendar size={20} />,
    info: "Week 3 of 12",
    bg: "#e6f4ea",
    color: "#22c55e",
  },
  {
    title: "This Month",
    value: "12 Sessions",
    icon: <Activity size={20} />,
    info: "75% attendance",
    bg: "#e0f7fa",
    color: "#0dcaf0",
  },
  {
    title: "Calories Burned",
    value: "6,240 kcal",
    icon: <Flame size={20} />,
    info: "This month",
    bg: "#fdecea",
    color: "#ef4444",
  },
];

const StatsPanel = () => {
  return (
    <Grid>
      {stats.map((stat, index) => (
        <StatCard key={index}>
          <CardTop>
            <IconCircle $bg={stat.bg} $color={stat.color}>
              {stat.icon}
            </IconCircle>
            <InfoText>{stat.info}</InfoText>
          </CardTop>
          <div>
            <StatTitle>{stat.title}</StatTitle>
            <StatValue>{stat.value}</StatValue>
          </div>
        </StatCard>
      ))}
    </Grid>
  );
};

export default StatsPanel;
