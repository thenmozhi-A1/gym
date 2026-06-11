import React from "react";
import styled from "styled-components";
import { TrendingUp, Calendar, Trophy, Target, Activity, Award } from "lucide-react";

const StatsPage = () => {
  return (
    <PageWrapper>
      <header className="stats-header">
        <h1>Advanced Fitness Statistics</h1>
        <p>Monitor your body transformation, consistency, and milestones.</p>
      </header>

      <StatsGrid>
        {/* Body Progress Stats */}
        <StatSection>
          <div className="section-header">
            <Activity className="text-warning" />
            <h2>Body Progress Stats</h2>
          </div>
          <div className="progress-cards">
            <ProgressCard>
              <div className="info">
                <span>Weight</span>
                <h3>75.4 <small>kg</small></h3>
              </div>
              <div className="bar-container"><div className="bar" style={{ width: '65%' }}></div></div>
              <small className="trend negative">-1.2kg this month</small>
            </ProgressCard>
            <ProgressCard>
              <div className="info">
                <span>Muscle Mass</span>
                <h3>38.2 <small>kg</small></h3>
              </div>
              <div className="bar-container"><div className="bar gold" style={{ width: '80%' }}></div></div>
              <small className="trend positive">+0.5kg this month</small>
            </ProgressCard>
            <ProgressCard>
              <div className="info">
                <span>Body Fat</span>
                <h3>14.5 <small>%</small></h3>
              </div>
              <div className="bar-container"><div className="bar" style={{ width: '45%' }}></div></div>
              <small className="trend negative">-0.8% this month</small>
            </ProgressCard>
          </div>
        </StatSection>

        {/* Attendance Stats */}
        <StatSection>
          <div className="section-header">
            <Calendar className="text-warning" />
            <h2>Attendance Stats</h2>
          </div>
          <AttendanceBox>
            <div className="main-stat">
              <div className="circle-progress">
                <span className="value">85%</span>
                <span className="label">Monthly Consistency</span>
              </div>
            </div>
            <div className="details">
              <div className="detail-item">
                <span>Total Visits</span>
                <strong>24 Days</strong>
              </div>
              <div className="detail-item">
                <span>Current Streak</span>
                <strong>6 Days</strong>
              </div>
              <div className="detail-item">
                <span>Missed Sessions</span>
                <strong>4 Days</strong>
              </div>
            </div>
          </AttendanceBox>
        </StatSection>

        {/* Goals & Achievements */}
        <StatSection className="full-width">
          <div className="section-header">
            <Target className="text-warning" />
            <h2>Goals & Achievements</h2>
          </div>
          <div className="goals-grid">
            <div className="goals-list">
              <h3>Active Goals</h3>
              <GoalItem>
                <div className="goal-info">
                  <span>Bench Press 100kg</span>
                  <span>85%</span>
                </div>
                <div className="goal-bar"><div className="fill" style={{ width: '85%' }}></div></div>
              </GoalItem>
              <GoalItem>
                <div className="goal-info">
                  <span>Run 10km under 50m</span>
                  <span>60%</span>
                </div>
                <div className="goal-bar"><div className="fill" style={{ width: '60%' }}></div></div>
              </GoalItem>
            </div>
            <div className="achievements-box">
              <h3>Recent Achievements</h3>
              <div className="badge-grid">
                <BadgeItem><Award size={32} /> <span>Early Bird</span></BadgeItem>
                <BadgeItem className="locked"><Trophy size={32} /> <span>100 Workouts</span></BadgeItem>
                <BadgeItem><Award size={32} /> <span>Weight Warrior</span></BadgeItem>
                <BadgeItem><Award size={32} /> <span>Streak King</span></BadgeItem>
              </div>
            </div>
          </div>
        </StatSection>
      </StatsGrid>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  padding: 120px 50px 50px;
  background: #0a0a0a;
  min-height: 100vh;
  color: #fff;

  @media (max-width: 768px) {
    padding: 100px 20px 30px;
    .stats-header {
      margin-bottom: 30px;
      h1 { font-size: 1.8rem; }
      p { font-size: 0.95rem; }
    }
  }

  .stats-header {
    margin-bottom: 50px;
    h1 { font-size: 2.8rem; font-weight: 800; margin-bottom: 10px; }
    p { color: #888; font-size: 1.1rem; }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;

  @media (max-width: 992px) { grid-template-columns: 1fr; }
  .full-width { grid-column: 1 / -1; }
`;

const StatSection = styled.section`
  background: #111;
  border-radius: 25px;
  padding: 40px;
  border: 1px solid rgba(255,255,255,0.05);

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 16px;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 30px;
    h2 { font-size: 1.5rem; font-weight: 700; margin: 0; }
  }

  .goals-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  .badge-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 15px;
  }
`;

const ProgressCard = styled.div`
  background: rgba(255,255,255,0.03);
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 20px;

  .info {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 10px;
    span { color: #888; font-weight: 600; text-transform: uppercase; font-size: 0.8rem; }
    h3 { margin: 0; font-weight: 800; small { font-size: 0.9rem; color: #888; } }
  }

  .bar-container {
    height: 6px;
    background: #222;
    border-radius: 10px;
    margin-bottom: 10px;
    .bar { height: 100%; background: #008bf8; border-radius: 10px; }
    .bar.gold { background: #ffc107; }
  }

  .trend {
    font-size: 0.8rem;
    font-weight: 600;
    &.positive { color: #28a745; }
    &.negative { color: #dc3545; }
  }
`;

const AttendanceBox = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  height: 100%;

  @media (max-width: 576px) { flex-direction: column; }

  .circle-progress {
    width: 150px;
    height: 150px;
    border: 10px solid #ffc107;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 20px rgba(255, 193, 7, 0.2);

    .value { font-size: 2rem; font-weight: 900; color: #ffc107; }
    .label { font-size: 0.7rem; font-weight: 700; color: #888; text-transform: uppercase; text-align: center; }
  }

  .details {
    flex: 1;
    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: 15px 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      span { color: #888; font-weight: 600; }
      strong { color: #fff; font-weight: 700; }
      &:last-child { border: none; }
    }
  }
`;

const GoalItem = styled.div`
  margin-bottom: 25px;
  .goal-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    span { font-weight: 700; font-size: 0.95rem; }
  }
  .goal-bar {
    height: 10px;
    background: #222;
    border-radius: 10px;
    .fill { height: 100%; background: linear-gradient(to right, #ffc107, #ff8c00); border-radius: 10px; }
  }
`;

const BadgeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.03);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  transition: all 0.3s ease;

  svg { color: #ffc107; }
  span { font-size: 0.8rem; font-weight: 700; color: #ccc; }
  
  &:hover { background: rgba(255,255,255,0.08); transform: translateY(-5px); }
  &.locked { opacity: 0.3; filter: grayscale(1); }
`;

export default StatsPage;
