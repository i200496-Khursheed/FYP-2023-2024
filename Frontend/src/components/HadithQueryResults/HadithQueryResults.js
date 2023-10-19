import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './HadithQueryResults.css';

const HadithQueryResults = () => {
  const location = useLocation();
  const { resultsData } = location.state;
  const { Text, HadithNo, Theme } = resultsData;

  const [isExpanded, setIsExpanded] = useState(false); // Start with details collapsed

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="hadith-query-results">
      <div className="back-button-HQR" onClick={() => window.history.back()}>
        <img src={require('../../assets/back_button.png')} alt="Back Button" />
      </div>
      <div className={`query-text-box ${isExpanded ? 'expanded' : ''}`}>
        <div className="expand-icon" onClick={toggleExpand}>
          <img src={require('../../assets/expand_icon.png')} alt="Expand Icon" />
        </div>
        
        
        <div className="details-swipe-bar" onClick={toggleExpand}>
          <div className={`arrow ${isExpanded ? 'expanded' : ''}`}></div>
        </div>
      </div>

      {isExpanded && (
        <div className="details-table">
          <table>
            <tbody>
              <tr>
                <th>Hadith Number</th>
                <th>Theme</th>
                <th>Text</th>
              </tr>
              {HadithNo.map((item, index) => (
                <tr key={index}>
                  <td>{item}</td>
                  <td>{Theme[index]}</td>
                  <td className="text-cell">{Text[index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HadithQueryResults;
