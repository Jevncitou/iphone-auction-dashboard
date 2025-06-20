import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import ChartPage from './pages/ChartPage';
import UpcomingAuctions from './pages/UpcomingAuctions'; // ✅ Import added

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upcoming" element={<UpcomingPage />} />
        {/* other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;