// InfoBox.js
import React from 'react';
import './InfoBox.css';

function InfoBox({ title, description, imageSrc }) {
  return (
    <div className="info-box">
      <img src={imageSrc} alt={title} className="info-box-image" />
      <h2 className="info-box-title">{title}</h2>
      <p className="info-box-description">{description}</p>
    </div>
  );
}

export default InfoBox;
