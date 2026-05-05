import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const monthlyData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 5000 },
  { name: "Mar", revenue: 4500 },
  { name: "Apr", revenue: 6000 },
  { name: "May", revenue: 7500 },
  { name: "Jun", revenue: 8500 },
  { name: "Jul", revenue: 9000 },
  { name: "Aug", revenue: 8000 },
  { name: "Sep", revenue: 8600 },
  { name: "Oct", revenue: 9200 },
  { name: "Nov", revenue: 9800 },
  { name: "Dec", revenue: 10500 },
];

const weeklyData = [
  { name: "Mon", revenue: 1200 },
  { name: "Tue", revenue: 1400 },
  { name: "Wed", revenue: 1100 },
  { name: "Thu", revenue: 1600 },
  { name: "Fri", revenue: 2100 },
  { name: "Sat", revenue: 1800 },
  { name: "Sun", revenue: 1300 },
];

const yearlyData = [
  { name: "2020", revenue: 65000 },
  { name: "2021", revenue: 78000 },
  { name: "2022", revenue: 92000 },
  { name: "2023", revenue: 103000 },
  { name: "2024", revenue: 85000 },
  { name: "2025", revenue: 115000 },
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const EarningsChart = () => {
  const [activeTab, setActiveTab] = useState("monthly");

  const getData = () => {
    switch (activeTab) {
      case "weekly":
        return weeklyData;
      case "yearly":
        return yearlyData;
      default:
        return monthlyData;
    }
  };

  // Inline styles for custom responsiveness and shadow
  const styles = {
    card: {
      borderRadius: "1rem",
      boxShadow: "0 0 20px rgba(0,0,0,0.08)",
      overflow: "hidden",
    },
    cardHeader: {
      backgroundColor: "#800000", // Bootstrap danger
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
    <div className="mb-2" style={styles.card}>
      <div style={styles.cardHeader}>
        <h4 className="mb-0">Earnings Overview</h4>
        <small>Track your gym's revenue over time</small>
      </div>

      <div className="p-4">
        <div style={styles.navTabs}>
          <button
            style={styles.navButton(activeTab === "weekly")}
            onClick={() => setActiveTab("weekly")}
          >
            Weekly
          </button>
          <button
            style={styles.navButton(activeTab === "monthly")}
            onClick={() => setActiveTab("monthly")}
          >
            Monthly
          </button>
          <button
            style={styles.navButton(activeTab === "yearly")}
            onClick={() => setActiveTab("yearly")}
          >
            Yearly
          </button>
        </div>

        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={getData()}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatCurrency} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0EA5E9"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EarningsChart;
