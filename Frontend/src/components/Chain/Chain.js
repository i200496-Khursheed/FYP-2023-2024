// Chain.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Chain.css';

const Chain = () => {
  const location = useLocation();
  const resultsData = location.state ? location.state.resultsData : null;

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const narrators = [
    { name: 'Narrator A' },
    { name: 'Narrator B' },
    { name: 'Narrator C' },
    { name: 'Narrator D' },
    { name: 'Narrator E' },
 
    // Add more narrators as needed
  ];

  const calculateLinePositions = () => {
    const container = document.querySelector('.chain-container');
  
    if (!container) {
      return; // Exit if container is null
    }
  
    const links = document.querySelectorAll('.link-line');
  
    // Check if links NodeList is empty
    if (!links.length) {
      return;
    }
  
    const containerRect = container.getBoundingClientRect();
  
    narrators.forEach((narrator, index) => {
      const block = document.getElementById(`narrator-block-${index}`);
      if (!block) {
        return; // Exit if block is null
      }
  
      const blockRect = block.getBoundingClientRect();
  
      const link = links[index];
  
      // Calculate top and height based on the position of the next block
      const nextBlock = document.getElementById(`narrator-block-${index + 1}`);
      const nextBlockRect = nextBlock ? nextBlock.getBoundingClientRect() : null;
  
      const top = blockRect.bottom;
      const height = nextBlockRect ? nextBlockRect.top - blockRect.top : 0;
  
      link.style.top = `${top}px`;
      link.style.height = `${height}px`;
    });
  };
  
  

  useEffect(() => {
    calculateLinePositions();
    window.addEventListener('resize', calculateLinePositions);

    return () => {
      window.removeEventListener('resize', calculateLinePositions);
    };
  }, [isExpanded]);

  return (
    <div className={`hadith-query-results-chain ${isExpanded ? 'expanded' : ''}`}>
      <div className="back-button-HQR" onClick={() => window.history.back()}>
        <img src={require('../../assets/back_button.png')} alt="Back Button" />
      </div>
      <div className={`query-text-box-chain ${isExpanded ? 'expanded' : ''}`}>
        <p> Dummy text Box </p>
        <div className="details-swipe-bar-chain" onClick={toggleExpand}>
          <div className={`arrow ${isExpanded ? 'expanded' : ''}`}></div>
        </div>
      </div>

      {isExpanded && narrators && narrators.length > 0 && (
        <div className="details-chain">
          <div className="chain-container">
            {narrators.map((narrator, index) => (
              <div key={index} className="narrator-block" id={`narrator-block-${index}`}>
                {narrator.name}
              </div>
            ))}
          </div>
          <div className="chain-links">
            {narrators.length > 1 &&
              narrators.map((_, index) => (
                <div key={index} className="link-line"></div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chain;
