import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // <-- changed to HashRouter
import Dashboard from './pages/dashboard';
import ChartPage from './pages/ChartPage';
import UpcomingAuctions from './pages/UpcomingAuctions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chart" element={<ChartPage />} />
        <Route path="/upcoming" element={<UpcomingAuctions />} />
      </Routes>
    </Router>
  );
}

export default App;
