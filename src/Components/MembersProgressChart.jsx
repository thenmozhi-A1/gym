import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const progressData = [
  { name: "Week 1", strength: 60, endurance: 30, flexibility: 40, weight: 180 },
  { name: "Week 2", strength: 65, endurance: 32, flexibility: 43, weight: 178 },
  { name: "Week 3", strength: 70, endurance: 38, flexibility: 45, weight: 175 },
  { name: "Week 4", strength: 75, endurance: 42, flexibility: 48, weight: 172 },
  { name: "Week 5", strength: 80, endurance: 48, flexibility: 50, weight: 170 },
  { name: "Week 6", strength: 85, endurance: 52, flexibility: 53, weight: 167 },
  { name: "Week 7", strength: 87, endurance: 58, flexibility: 55, weight: 165 },
  { name: "Week 8", strength: 90, endurance: 65, flexibility: 60, weight: 164 },
];

const MembersProgressChart = () => {
  const [activeTab, setActiveTab] = useState("performance");

  const styles = {
    card: {
      borderRadius: "1rem",
      boxShadow: "0 0 20px rgba(0,0,0,0.08)",
      overflow: "hidden",
      marginBottom: "1.5rem",
    },
    cardHeader: {
      backgroundColor: "#0dcaf0", // Bootstrap info
      color: "white",
      padding: "1rem 1.5rem",
    },
    navTabs: {
      display: "flex",
      gap: "1rem",
      marginBottom: "1.5rem",
      flexWrap: "wrap",
    },
    navButton: (active) => ({
      backgroundColor: active ? "#0d6efd" : "#f1f1f1",
      color: active ? "white" : "#333",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      fontWeight: 500,
      cursor: "pointer",
    }),
    chartContainer: {
      height: "300px",
      width: "100%",
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h4 className="mb-0">Active Members Progress</h4>
        <small>Track member fitness metrics over time</small>
      </div>

      <div className="p-4">
        <div style={styles.navTabs}>
          <button
            style={styles.navButton(activeTab === "performance")}
            onClick={() => setActiveTab("performance")}
          >
            Performance
          </button>
          <button
            style={styles.navButton(activeTab === "weight")}
            onClick={() => setActiveTab("weight")}
          >
            Weight
          </button>
        </div>

        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {activeTab === "performance" ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="strength"
                    stroke="#0EA5E9"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="endurance"
                    stroke="#ea384c"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="flexibility"
                    stroke="#8E9196"
                    strokeWidth={2}
                  />
                </>
              ) : (
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#ea384c"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MembersProgressChart;
