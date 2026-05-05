import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Form } from 'react-bootstrap';

const ProgressChart = () => {
  const [metricType, setMetricType] = useState("weight");

  const data = {
    weight: [
      { name: 'Jan', value: 165 },
      { name: 'Feb', value: 163 },
      { name: 'Mar', value: 162 },
      { name: 'Apr', value: 159 },
      { name: 'May', value: 158 },
      { name: 'Jun', value: 155 },
      { name: 'Jul', value: 154 },
    ],
    strength: [
      { name: 'Jan', value: 50 },
      { name: 'Feb', value: 60 },
      { name: 'Mar', value: 65 },
      { name: 'Apr', value: 70 },
      { name: 'May', value: 75 },
      { name: 'Jun', value: 85 },
      { name: 'Jul', value: 90 },
    ],
    endurance: [
      { name: 'Jan', value: 20 },
      { name: 'Feb', value: 22 },
      { name: 'Mar', value: 25 },
      { name: 'Apr', value: 26 },
      { name: 'May', value: 30 },
      { name: 'Jun', value: 32 },
      { name: 'Jul', value: 35 },
    ],
  };

  const metricLabels = {
    weight: "Weight (lbs)",
    strength: "Strength (kg)",
    endurance: "Endurance (mins)",
  };

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <Form.Select
          className="w-auto"
          value={metricType}
          onChange={(e) => setMetricType(e.target.value)}
        >
          <option value="weight">Weight</option>
          <option value="strength">Strength</option>
          <option value="endurance">Endurance</option>
        </Form.Select>
      </div>

      <div style={{   height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data[metricType]}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38aecc" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#38aecc" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              label={{
                value: metricLabels[metricType],
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: 12 }
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                border: 'none'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="value"
              name={metricLabels[metricType]}
              stroke="#38aecc"
              fillOpacity={1}
              fill="url(#progressGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
