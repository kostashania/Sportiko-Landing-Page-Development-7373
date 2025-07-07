import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;