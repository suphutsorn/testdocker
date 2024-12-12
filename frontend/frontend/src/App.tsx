import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PassengerPage from './pages/PassengerPage';
import DriverPage from './pages/DriverPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<PassengerPage />} />
        <Route path="/passenger" element={<PassengerPage />} />
        <Route path="/driver" element={<DriverPage />} />
      </Routes>
    </Router>
  );
};

export default App;
