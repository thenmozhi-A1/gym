import React from "react";
import styled from "styled-components";
import { Activity, Camera, TrendingUp, Plus } from "lucide-react";

const WorkoutModule = () => {
  return (
    <Container className="animate-in">
      <div className="module-header">
        <div className="title-area">
          <h2>WORKOUT <small>PLANS & PROGRESS</small></h2>
        </div>
        <button className="btn-primary"><Plus size={16} /> Create Workout Plan</button>
      </div>

      <div className="layout-grid">
        <div className="plans-list">
          <h3>Active Workout Plans</h3>
          <div className="w-card">
            <div className="w-header">
              <h4>Beginner Weight Loss</h4>
              <span className="badge bg-primary-light">4 Weeks</span>
            </div>
            <p>Focus on cardio and high repetition light weights to maximize calorie burn.</p>
            <div className="w-meta">
              <span>Trainer: Sarah Johnson</span>
              <span>12 Members Assigned</span>
            </div>
          </div>
          
          <div className="w-card">
            <div className="w-header">
              <h4>Hypertrophy Core</h4>
              <span className="badge bg-success-light">8 Weeks</span>
            </div>
            <p>Heavy compound lifts combined with targeted isolation movements.</p>
            <div className="w-meta">
              <span>Trainer: Marcus Aurelius</span>
              <span>5 Members Assigned</span>
            </div>
          </div>

          <div className="w-card">
            <div className="w-header">
              <h4>Flexibility & Yoga Flow</h4>
              <span className="badge bg-warning-light">Ongoing</span>
            </div>
            <p>Daily routines for core strength and mobility improvements.</p>
            <div className="w-meta">
              <span>Trainer: Emma Watson</span>
              <span>24 Members Assigned</span>
            </div>
          </div>
        </div>

        <div className="progress-section">
          <h3>Member Progress Tracking</h3>
          
          <div className="search-bar">
            <input type="text" placeholder="Search member to view progress..." />
            <button className="btn-outline">Search</button>
          </div>

          <div className="progress-dashboard">
            <div className="member-info">
              <div className="avatar">JD</div>
              <div>
                <h4>John Doe</h4>
                <p>Goal: Muscle Building</p>
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metric">
                <label>Weight</label>
                <div className="val">78.5 kg <span className="trend positive"><TrendingUp size={12}/> 1.2 kg</span></div>
              </div>
              <div className="metric">
                <label>Body Fat %</label>
                <div className="val">18% <span className="trend negative"><TrendingUp size={12} style={{transform: 'rotate(180deg)'}}/> 2%</span></div>
              </div>
              <div className="metric">
                <label>Chest</label>
                <div className="val">42"</div>
              </div>
              <div className="metric">
                <label>Biceps</label>
                <div className="val">15.5"</div>
              </div>
            </div>

            <div className="photo-comparison">
              <div className="photo-box">
                <div className="img-placeholder"><Camera size={24} /></div>
                <div className="label">Before (Day 1)</div>
              </div>
              <div className="photo-box">
                <div className="img-placeholder"><Camera size={24} /></div>
                <div className="label">Current (Day 60)</div>
              </div>
            </div>
            
            <button className="btn-outline w-100 mt-3">Log New Measurements</button>
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex; flex-direction: column; gap: 24px;

  .module-header {
    display: flex; justify-content: space-between; align-items: center;
    h2 { margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--text-color); display: flex; align-items: center; gap: 8px; }
    small { font-weight: 400; color: var(--text-muted); font-size: 0.8rem; letter-spacing: 1px; }
    .btn-primary { display: flex; align-items: center; gap: 8px; background: var(--accent-color, #38bdf8); color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
  }

  .layout-grid {
    display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px;
    h3 { margin: 0 0 16px 0; color: var(--text-color); font-size: 1.1rem; }
  }

  .plans-list {
    display: flex; flex-direction: column; gap: 16px;
  }

  .w-card {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; padding: 20px; box-shadow: var(--shadow);
    .w-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; h4 { margin: 0; color: var(--text-color); font-size: 1rem; } }
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
    .bg-primary-light { background: rgba(56, 189, 248, 0.1); color: var(--accent-color, #38bdf8); }
    .bg-success-light { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .bg-warning-light { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    p { margin: 0 0 16px 0; color: var(--text-muted); font-size: 0.85rem; line-height: 1.4; }
    .w-meta { display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
  }

  .progress-section {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; padding: 24px; box-shadow: var(--shadow); display: flex; flex-direction: column;
    
    .search-bar {
      display: flex; gap: 12px; margin-bottom: 24px;
      input { flex: 1; padding: 10px 16px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-color); outline: none; &:focus { border-color: var(--accent-color); } }
      .btn-outline { padding: 10px 20px; background: transparent; border: 1px solid var(--border-color); color: var(--text-color); border-radius: 8px; cursor: pointer; }
    }

    .progress-dashboard {
      border: 1px dashed var(--border-color); border-radius: 12px; padding: 24px; flex: 1;
      
      .member-info {
        display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
        .avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--accent-glow); color: var(--accent-color); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: bold; }
        h4 { margin: 0 0 4px 0; color: var(--text-color); }
        p { margin: 0; color: var(--text-muted); font-size: 0.85rem; }
      }

      .metrics-grid {
        display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;
        .metric {
          background: rgba(0,0,0,0.1); border-radius: 8px; padding: 16px;
          label { font-size: 0.8rem; color: var(--text-muted); }
          .val { font-size: 1.2rem; font-weight: 700; color: var(--text-color); display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
          .trend { font-size: 0.75rem; display: flex; align-items: center; gap: 4px; padding: 2px 6px; border-radius: 4px; }
          .trend.positive { background: rgba(16, 185, 129, 0.1); color: #10b981; }
          .trend.negative { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        }
      }

      .photo-comparison {
        display: flex; gap: 16px;
        .photo-box {
          flex: 1; display: flex; flex-direction: column; gap: 8px;
          .img-placeholder { height: 150px; background: rgba(0,0,0,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); border: 1px dashed var(--border-color); }
          .label { text-align: center; font-size: 0.8rem; color: var(--text-muted); }
        }
      }
      
      .btn-outline.w-100 { width: 100%; padding: 12px; background: transparent; border: 1px solid var(--border-color); color: var(--text-color); border-radius: 8px; cursor: pointer; font-weight: 600; transition: background 0.2s; &:hover { background: rgba(255,255,255,0.05); } }
      .mt-3 { margin-top: 24px; }
    }
  }
`;

export default WorkoutModule;
