/* Navbar.js */
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">KnowledgeVerse</div>
      <div className="links">
        <Link to="/" className="nav-link">
          <FontAwesomeIcon icon={faHome} /> {/* Icon for Home */}
        </Link>
        {/* Add more links as needed */}
      </div>
    </nav>
  );
}

export default Navbar;

/* <Link to="/view-statistics" className="nav-link">View Statistics</Link> {} 
   <Link to="/tafseer-page" className="nav-link">View Tafseer Al-Tabari</Link> {}
   <Link to="/al-tabari-graph" className="nav-link">Al-Tabari Graph</Link> {}
   <Link to="/hadith-query-builder" className="nav-link">Search Query</Link> {}
*/