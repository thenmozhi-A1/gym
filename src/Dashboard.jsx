import React from 'react';
import UserHeader from './UserHeader';
import StatsPanel from './StatsPanel';
import UpcomingSessions from './UpcomingSessions';
import ProgressChart from './ProgressChart';
import ChatSection from './ChatSection';
import ContactGym from './ContactGym';

const Dashboard = () => {
  const [activeTab, setActiveTab] = React.useState("upcoming");

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container-fluid px-3 px-md-5">
        <UserHeader />

        <div className="row mt-4 gx-4 gy-4">
          {/* Left Section */}
          <div className="col-12 col-lg-8">
            <StatsPanel />

            <div className="card mt-4 w-100" style={{ minHeight: "400px" }}>
              <div className="card-header">
                <h5 className="card-title mb-0">Your Progress</h5>
                <small className="text-muted">Track your fitness journey over time</small>
              </div>
              <div className="card-body">
                <ProgressChart />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="col-12 col-lg-4">
            {/* Tabs */}
            <ul className="nav nav-tabs mb-3" role="tablist">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''}`}
                  onClick={() => setActiveTab("upcoming")}
                >
                  Upcoming
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'chat' ? 'active' : ''}`}
                  onClick={() => setActiveTab("chat")}
                >
                  Chat
                </button>
              </li>
            </ul>

            {/* Tab Content */}
            <div className="tab-content border rounded p-3 bg-white" style={{ maxHeight: "500px", overflowY: "auto" }}>
              {activeTab === "upcoming" && <UpcomingSessions />}
              {activeTab === "chat" && <ChatSection />}
            </div>

            {/* Contact Section */}
            <div className="mt-4">
              <ContactGym />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
