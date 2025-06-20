import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import ChartPage from './pages/ChartPage';
import UpcomingAuctions from './pages/UpcomingAuctions'; // ✅ Import added

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chart" element={<ChartPage />} />
        <Route path="/upcoming" element={<UpcomingAuctions />} /> {/* ✅ Route added */}
      </Routes>
    </Router>
  );
}

export default App;
