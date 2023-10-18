// App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage';
import HadithQueryBuilderPage from './pages/HadithQueryBuilderPage';
import HadithQueryResultsPage from './pages/HadithQueryResultsPage';

function App() {

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<LandingPage />}
          />
          <Route
            path="/hadith-query-builder"
            element={<HadithQueryBuilderPage />} 
          />
          <Route
            path="/hadith-query-results"
            element={<HadithQueryResultsPage />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;