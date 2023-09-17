import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">KnowledgeVerse</div>
      <div className="links">
        <a href="#" className="nav-link">Home Page</a>
        <a href="#" className="nav-link">Al-Tabari</a>
        <a href="#" className="nav-link">Query Builder</a>
        <a href="#" className="nav-link">Narrator Chain</a>
      </div>
    </nav>
  );
}

export default Navbar;
