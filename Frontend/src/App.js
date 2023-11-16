// App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage';

import HadithQueryBuilderPage from './pages/HadithQueryBuilderPage';
import HadithQueryResultsPage from './pages/HadithQueryResultsPage';

import VerseQueryBuilderPage from './pages/VerseQueryBuilderPage';

import ChainPage from './pages/ChainPage';


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

          <Route
            path="/verse-query-builder"
            element={<VerseQueryBuilderPage />} 
          />

          <Route
            path="/chain-page"
            element={<ChainPage />} 
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;