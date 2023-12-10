// App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage';

import HadithQueryBuilderPage from './pages/HadithQueryBuilderPage';
import HadithQueryResultsPage from './pages/HadithQueryResultsPage';

import VerseQueryBuilderPage from './pages/VerseQueryBuilderPage';
import VerseQueryResultsPage from './pages/VerseQueryResultsPage';

import CommentaryQueryBuilderPage from './pages/CommentaryQueryBuilderPage';
import CommentaryQueryResultsPage from './pages/CommentaryQueryResultsPage';

import ChainPage from './pages/ChainPage';

import FAQPage from './pages/FAQPage';

import FAQResultsPage from './pages/FAQResultsPage';

import PeoplePage from './pages/PeoplePage';


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
            path="/verse-query-results"
            element={<VerseQueryResultsPage />} 
          />

          <Route
            path="/chain-page"
            element={<ChainPage />} 
          />

          <Route
            path="/commentary-query-builder"
            element={<CommentaryQueryBuilderPage />} 
          />

          <Route
            path="/commentary-query-results"
            element={<CommentaryQueryResultsPage />} 
          />

          <Route
            path="/faq-page"
            element={<FAQPage />} 
          />

          <Route
            path="/faq-results"
            element={<FAQResultsPage />} 
          />

          <Route
            path="/people-page"
            element={<PeoplePage />} 
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;