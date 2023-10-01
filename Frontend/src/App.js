import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage';
import HadithQueryBuilderPage from './pages/HadithQueryBuilderPage'; // Import HadithQueryBuilderPage

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/hadith-query-builder" element={<HadithQueryBuilderPage />} /> {}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
