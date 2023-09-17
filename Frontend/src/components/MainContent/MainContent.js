import React from 'react';
import './MainContent.css';
//import knowledgeGraphImage from '../assets/kg-icon.jpg';

function MainContent() {
  return (
    <div className="main-content">
      <div className="box">
        <div className="text">KnowledgeVerse</div>
        <div className="secondary-text">
          <div className="secondary-heading">
            Knowledge Driven Semantic Web portal for Tafsir Al-Tabari
          </div>
          <div className="square"></div>
          <div className="side-text">
            <span className="italic-text">
              Semantic Web Portal to Facilitate in Research & Self-Learning of Tafseer Al-Tabari
            </span>
          </div>
          <div className="buttons">
            <button className="explore-button">Explore</button>
            <button className="about-button">About</button>
          </div>
        </div>
        <img src={require('../../assets/1.jpg')} alt="Knowledge Graph Image" className="box-image" />
      </div>
    </div>
  );
}

export default MainContent;