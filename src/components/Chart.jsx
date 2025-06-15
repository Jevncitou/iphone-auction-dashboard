// src/components/Chart.jsx
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

export default function Chart({ data, title = "Price Trend" }) {
  if (!data || data.length === 0) {
    return <p style={{ color: '#ccc', textAlign: 'center' }}>No chart data available.</p>;
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3 style={{ color: '#fff', marginBottom: '1rem', textAlign: 'center' }}>{title}</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="month" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#444', color: '#fff' }} />
          <Line type="monotone" dataKey="price" stroke="#00d8ff" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
