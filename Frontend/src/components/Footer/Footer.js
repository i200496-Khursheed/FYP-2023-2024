// Footer.js

import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <div className="footer">
      <div className="left-images">
        <img src={require('../../assets/goethe.png')} alt="Goethe University" className="footer-image" />
        <img src={require('../../assets/fast.jpg')} alt="FAST-NUCES" className="footer-image" />
      </div>
      <div className="right-image">
        <img src={require('../../assets/semantic.png')} alt="Semantic Web" className="footer-image" />
      </div>
    </div>
  );
}

export default Footer;
