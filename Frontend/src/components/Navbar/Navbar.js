import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">KnowledgeVerse</div>
      <div className="links">
        <Link to="/" className="nav-link">Home</Link> {}
        <Link to="/al-tabari-graph" className="nav-link">Al-Tabari Graph</Link> {}
        <Link to="/hadith-query-builder" className="nav-link">Search Query</Link> {}
        <Link to="/view-statistics" className="nav-link">View Statistics</Link> {}
      </div>
    </nav>
  );
}

export default Navbar;
