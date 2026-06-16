import React, { useState } from "react";
import styled from "styled-components";
import { Users, Award, Briefcase, Calendar, ChevronRight, X } from "lucide-react";

const TrainerModule = ({ staffs, onAddUser }) => {
  const [selectedTrainerSchedule, setSelectedTrainerSchedule] = useState(null);
  const trainers = staffs.filter(s => s.role === 'Trainer' || s.role === 'TRAINER');
  
  return (
    <Container className="animate-in">
      <div className="module-header">
        <div className="title-area">
          <h2>TRAINER <small>MANAGEMENT</small></h2>
        </div>
        <button className="btn-primary" onClick={onAddUser}>Assign Member</button>
      </div>

      <div className="trainers-grid">
        {trainers.map((trainer, i) => (
          <div key={trainer.id || i} className="trainer-card">
            <div className="t-header">
              <div className="avatar-large bg-accent">
                {(trainer.fullName || trainer.name || "T").charAt(0)}
              </div>
              <div className="t-info">
                <h3>{trainer.fullName || trainer.name || "Trainer"}</h3>
                <span className="badge bg-success-light">{trainer.specialty || "General Fitness"}</span>
              </div>
            </div>
            
            <div className="t-stats">
              <div className="stat">
                <label>Assigned</label>
                <strong>{Math.floor(Math.random() * 15) + 5} Members</strong>
              </div>
              <div className="stat">
                <label>Experience</label>
                <strong>{Math.floor(Math.random() * 5) + 2} Years</strong>
              </div>
            </div>
            
            <div className="t-contact">
              <div><Briefcase size={14} className="mr-2" style={{marginRight: '8px'}} /> {trainer.times || "Morning Shift"}</div>
              <div><Users size={14} className="mr-2" style={{marginRight: '8px'}} /> {trainer.email || "trainer@gym.com"}</div>
            </div>
            
            <div className="t-actions">
              <button className="btn-outline w-100" onClick={() => setSelectedTrainerSchedule(trainer)}>View Schedule <ChevronRight size={14} /></button>
            </div>
          </div>
        ))}
        {trainers.length === 0 && (
          <div className="col-span-full text-center py-5 text-muted">
            No trainers found. Please add a trainer in the Staffs tab.
          </div>
        )}
      </div>



      {/* Slide-out Drawer for View Schedule */}
      {selectedTrainerSchedule && (
        <>
          <div className="drawer-overlay" onClick={() => setSelectedTrainerSchedule(null)} />
          <div className="pay-slip-drawer animate-slide-left" style={{ width: '450px' }}>
            <div className="drawer-header">
              <h3>Trainer Schedule</h3>
              <button onClick={() => setSelectedTrainerSchedule(null)}><X size={20} /></button>
            </div>
            
            <div className="slip-profile">
              <div className="big-avatar" style={{width: '60px', height: '60px', fontSize: '1.5rem'}}>
                {(selectedTrainerSchedule.fullName || selectedTrainerSchedule.name || "T").charAt(0)}
              </div>
              <div className="info">
                <h4>{selectedTrainerSchedule.fullName || selectedTrainerSchedule.name || "Trainer Name"}</h4>
                <div style={{marginTop: '5px'}}><span className="badge bg-success-light">{selectedTrainerSchedule.specialty || "General Fitness"}</span></div>
              </div>
            </div>

            <div className="schedule-section" style={{border: 'none', padding: '0', boxShadow: 'none', background: 'transparent'}}>
              <h3 style={{padding: '0 0 16px 0', border: 'none'}}>Today's Assigned Sessions</h3>
              <div className="table-responsive">
                <table className="table">
                <thead>
                  <tr><th>TIME</th><th>MEMBER</th><th>STATUS</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fw-bold">07:00 AM</td>
                    <td>John Doe</td>
                    <td><span className="badge bg-success-light">Completed</span></td>
                  </tr>
                  <tr>
                    <td className="fw-bold">09:00 AM</td>
                    <td>Emma Smith</td>
                    <td><span className="badge bg-warning-light text-warning">In Progress</span></td>
                  </tr>
                  <tr>
                    <td className="fw-bold">04:00 PM</td>
                    <td>Mike Ross</td>
                    <td><span className="badge">Upcoming</span></td>
                  </tr>
                </tbody>
                </table>
              </div>
            </div>

            <button className="btn-primary w-100 mt-3" onClick={onAddUser} style={{marginTop: 'auto'}}>
              + Assign New Member to Schedule
            </button>
          </div>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex; flex-direction: column; gap: 24px;

  .module-header {
    display: flex; justify-content: space-between; align-items: center;
    h2 { margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--text-color); display: flex; align-items: center; gap: 8px; }
    small { font-weight: 400; color: var(--text-muted); font-size: 0.8rem; letter-spacing: 1px; }
    .btn-primary { background: var(--accent-color, #38bdf8); color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
  }

  .trainers-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;
  }

  .trainer-card {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; padding: 20px; box-shadow: var(--shadow);
    display: flex; flex-direction: column; gap: 16px;
    
    .t-header {
      display: flex; gap: 16px; align-items: center;
      .avatar-large { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; }
      .bg-accent { background: rgba(56, 189, 248, 0.1); color: var(--accent-color, #38bdf8); }
      .t-info h3 { margin: 0 0 6px 0; color: var(--text-color); font-size: 1.1rem; }
      .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; background: rgba(16, 185, 129, 0.1); color: #10b981; }
    }

    .t-stats {
      display: flex; background: rgba(0,0,0,0.1); border-radius: 8px; padding: 12px;
      .stat { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; border-right: 1px solid var(--border-color); &:last-child { border: none; } }
      label { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px; }
      strong { color: var(--text-color); font-size: 0.95rem; }
    }

    .t-contact {
      display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem; color: var(--text-muted);
      div { display: flex; align-items: center; }
    }

    .t-actions {
      margin-top: auto;
      .btn-outline { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; background: transparent; border: 1px solid var(--border-color); color: var(--text-color); border-radius: 8px; cursor: pointer; transition: background 0.2s; &:hover { background: rgba(255,255,255,0.05); } }
    }
  }

  .schedule-section {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; overflow: hidden; box-shadow: var(--shadow);
    h3 { margin: 0; padding: 20px; border-bottom: 1px solid var(--border-color); font-size: 1.1rem; color: var(--text-color); }
    .table {
      width: 100%; border-collapse: collapse;
      th { text-align: left; padding: 12px 20px; font-size: 0.75rem; color: var(--text-muted); border-bottom: 1px solid var(--border-color); }
      td { padding: 16px 20px; font-size: 0.9rem; border-bottom: 1px solid var(--border-color); color: var(--text-color); }
      .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; background: rgba(255,255,255,0.05); color: var(--text-muted); }
      .bg-success-light { background: rgba(16, 185, 129, 0.1); color: #10b981; }
      .bg-warning-light { background: rgba(245, 158, 11, 0.1); }
      .text-warning { color: #f59e0b; }
    }
  }

  /* Drawer Styles */
  .drawer-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 100;
  }
  .pay-slip-drawer {
    position: fixed; top: 0; right: 0; bottom: 0; background: var(--card-bg, #1e293b); width: 400px; max-width: 100vw; z-index: 101;
    box-shadow: -10px 0 30px rgba(0,0,0,0.5); border-left: 1px solid var(--border-color);
    display: flex; flex-direction: column; overflow-y: auto; padding: 24px; color: var(--text-color);
    
    .drawer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; h3 { margin: 0; } button { background: none; border: none; color: inherit; cursor: pointer; } }
    .slip-profile { display: flex; gap: 16px; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px dashed var(--border-color); }
    .big-avatar { background: var(--accent-glow); color: var(--accent-color); display: flex; align-items: center; justify-content: center; border-radius: 12px; font-weight: bold; }
    .info h4 { margin: 0 0 4px 0; font-size: 1.2rem; } .info p { margin: 0; color: var(--text-muted); font-size: 0.85rem; }
    
    .btn-primary { background: var(--accent-color, #38bdf8); color: #fff; border: none; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .w-100 { width: 100%; }
    .mt-3 { margin-top: 16px; }
  }
`;

export default TrainerModule;
