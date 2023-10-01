// InfoBox.js
import React from 'react';
import { Link } from 'react-router-dom';
import './InfoBox.css';

function InfoBox({ title, description, imageSrc, linkTo }) {
  return (
    <div className="info-box">
      <Link to={linkTo}>
        <img src={imageSrc} alt={title} className="info-box-image" />
      
        <h2 className="info-box-title">{title}</h2>
        <p className="info-box-description">{description}</p>
      </Link>
    </div>
  );
}

export default InfoBox;
