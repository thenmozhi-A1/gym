import React, { useState } from "react";
import styled from "styled-components";
import { Coffee, Apple, Search, Plus, Trash2 } from "lucide-react";

const DietModule = () => {
  return (
    <Container className="animate-in">
      <div className="module-header">
        <div className="title-area">
          <h2>DIET <small>& NUTRITION PLANS</small></h2>
        </div>
        <button className="btn-primary"><Plus size={16} /> Create Diet Plan</button>
      </div>

      <div className="layout-grid">
        <div className="plans-library">
          <div className="search-box">
            <Search size={16} />
            <input type="text" placeholder="Search diet plans..." />
          </div>

          <div className="plan-list">
            <div className="diet-card">
              <div className="d-header">
                <h4>Extreme Fat Loss</h4>
                <div className="calories">1,500 kcal</div>
              </div>
              <div className="d-macros">
                <div className="macro protein">120g P</div>
                <div className="macro carbs">100g C</div>
                <div className="macro fats">60g F</div>
              </div>
              <p>Low carb, high protein diet focused on lean meats and vegetables.</p>
              <div className="d-actions">
                <button className="btn-link">View Details</button>
                <button className="btn-outline-sm">Assign</button>
              </div>
            </div>

            <div className="diet-card">
              <div className="d-header">
                <h4>Lean Muscle Builder</h4>
                <div className="calories">2,800 kcal</div>
              </div>
              <div className="d-macros">
                <div className="macro protein">180g P</div>
                <div className="macro carbs">300g C</div>
                <div className="macro fats">80g F</div>
              </div>
              <p>Caloric surplus diet with balanced macronutrients for muscle growth.</p>
              <div className="d-actions">
                <button className="btn-link">View Details</button>
                <button className="btn-outline-sm">Assign</button>
              </div>
            </div>
            
            <div className="diet-card">
              <div className="d-header">
                <h4>Keto Adaptation</h4>
                <div className="calories">2,000 kcal</div>
              </div>
              <div className="d-macros">
                <div className="macro protein">100g P</div>
                <div className="macro carbs">30g C</div>
                <div className="macro fats">150g F</div>
              </div>
              <p>High fat, extremely low carb diet for ketogenic fat burning.</p>
              <div className="d-actions">
                <button className="btn-link">View Details</button>
                <button className="btn-outline-sm">Assign</button>
              </div>
            </div>
          </div>
        </div>

        <div className="plan-details-view">
          <div className="details-header">
            <h3>Lean Muscle Builder</h3>
            <span className="badge">Assigned to 8 Members</span>
          </div>
          
          <div className="meals-timeline">
            <div className="meal-item">
              <div className="meal-icon"><Coffee size={18} /></div>
              <div className="meal-content">
                <h5>Breakfast (08:00 AM)</h5>
                <ul>
                  <li>4 Whole Eggs, scrambled</li>
                  <li>1 cup Oatmeal with berries</li>
                  <li>Black Coffee or Green Tea</li>
                </ul>
              </div>
            </div>
            
            <div className="meal-item">
              <div className="meal-icon"><Apple size={18} /></div>
              <div className="meal-content">
                <h5>Mid-Morning Snack (11:00 AM)</h5>
                <ul>
                  <li>1 scoop Whey Protein</li>
                  <li>Handful of Almonds</li>
                  <li>1 Banana</li>
                </ul>
              </div>
            </div>
            
            <div className="meal-item">
              <div className="meal-icon"><Coffee size={18} /></div>
              <div className="meal-content">
                <h5>Lunch (01:30 PM)</h5>
                <ul>
                  <li>200g Grilled Chicken Breast</li>
                  <li>1.5 cups Brown Rice</li>
                  <li>Steamed Broccoli & Carrots</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="supplements-section">
            <h4>Recommended Supplements</h4>
            <div className="supp-tags">
              <span className="supp-tag">Whey Protein Isolate</span>
              <span className="supp-tag">Creatine Monohydrate (5g/day)</span>
              <span className="supp-tag">Omega-3 Fish Oil</span>
              <span className="supp-tag">Multivitamin</span>
            </div>
          </div>
          
          <div className="dietician-notes">
            <h4>Dietician Notes</h4>
            <p>Ensure to drink at least 3-4 liters of water daily. Adjust rice portions based on weekly weight gain. If gaining too fast, reduce carbs slightly.</p>
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
  }

  .plans-library {
    display: flex; flex-direction: column; gap: 16px;
    
    .search-box {
      display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px 16px; color: var(--text-muted);
      input { border: none; background: transparent; outline: none; color: var(--text-color); width: 100%; }
    }
    
    .plan-list { display: flex; flex-direction: column; gap: 16px; }
  }

  .diet-card {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; padding: 20px; box-shadow: var(--shadow);
    .d-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; h4 { margin: 0; color: var(--text-color); font-size: 1rem; } .calories { font-weight: 700; color: var(--accent-color); font-size: 0.9rem; } }
    .d-macros {
      display: flex; gap: 8px; margin-bottom: 12px;
      .macro { padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
      .protein { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }
      .carbs { background: rgba(16, 185, 129, 0.1); color: #10b981; }
      .fats { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    }
    p { margin: 0 0 16px 0; color: var(--text-muted); font-size: 0.85rem; line-height: 1.4; }
    .d-actions {
      display: flex; justify-content: space-between; align-items: center;
      .btn-link { background: none; border: none; color: var(--text-muted); font-size: 0.85rem; cursor: pointer; &:hover { color: var(--text-color); } }
      .btn-outline-sm { background: transparent; border: 1px solid var(--border-color); color: var(--text-color); padding: 4px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; transition: background 0.2s; &:hover { background: rgba(255,255,255,0.05); } }
    }
  }

  .plan-details-view {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; padding: 24px; box-shadow: var(--shadow);
    
    .details-header {
      display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px dashed var(--border-color); margin-bottom: 24px;
      h3 { margin: 0; color: var(--text-color); font-size: 1.2rem; }
      .badge { background: rgba(255,255,255,0.05); padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; color: var(--text-muted); }
    }

    .meals-timeline {
      display: flex; flex-direction: column; gap: 20px; position: relative; margin-bottom: 30px;
      &::before { content: ''; position: absolute; top: 10px; bottom: 10px; left: 19px; width: 2px; background: var(--border-color); }
      
      .meal-item {
        display: flex; gap: 20px; position: relative;
        .meal-icon { width: 40px; height: 40px; border-radius: 50%; background: var(--card-bg); border: 2px solid var(--accent-color); color: var(--accent-color); display: flex; align-items: center; justify-content: center; z-index: 2; flex-shrink: 0; }
        .meal-content {
          background: rgba(0,0,0,0.1); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px; flex: 1;
          h5 { margin: 0 0 10px 0; color: var(--text-color); font-size: 0.95rem; }
          ul { margin: 0; padding-left: 20px; color: var(--text-muted); font-size: 0.85rem; line-height: 1.6; }
        }
      }
    }

    .supplements-section, .dietician-notes {
      margin-bottom: 24px;
      h4 { margin: 0 0 12px 0; font-size: 0.9rem; color: var(--text-color); }
    }

    .supp-tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .supp-tag { background: rgba(56, 189, 248, 0.1); color: var(--accent-color); border: 1px solid rgba(56, 189, 248, 0.2); padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; }
    
    .dietician-notes p { margin: 0; padding: 16px; background: rgba(245, 158, 11, 0.05); border-left: 3px solid #f59e0b; color: var(--text-muted); font-size: 0.9rem; line-height: 1.5; border-radius: 4px; }
  }
`;

export default DietModule;
