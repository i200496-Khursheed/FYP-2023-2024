// App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage';
import HadithQueryBuilderPage from './pages/HadithQueryBuilderPage';
import HadithQueryResultsPage from './pages/HadithQueryResultsPage';

function App() {
  const handleRunHadithQuery = () => {
    // Adding the logic to handle the query results here later on
    // I can navigate to the results page using a similar approach as below
  };

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
            element={<HadithQueryBuilderPage onRunQuery={handleRunHadithQuery} />} 
          />
          <Route
            path="/hadith-query-results" // Define the route for results page
            element={<HadithQueryResultsPage />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;