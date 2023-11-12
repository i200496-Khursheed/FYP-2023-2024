import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './HadithQueryResults.css';

const HadithQueryResults = () => {
  const location = useLocation();
  const { resultsData } = location.state;

  const [isExpanded, setIsExpanded] = useState(false); // Start with details collapsed
  const [sortOrder, setSortOrder] = useState('asc'); // Initial sort order

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Function to handle sorting by Hadith Number
  const handleSort = () => {
    if (sortOrder === 'asc') {
      resultsData.HadithNo.sort((a, b) => a - b); // Sort in ascending order
      setSortOrder('desc');
    } else {
      resultsData.HadithNo.sort((a, b) => b - a); // Sort in descending order
      setSortOrder('asc');
    }
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

      {isExpanded && resultsData && resultsData.HadithNo && resultsData.Theme && resultsData.Text && (
        <div className="details-table">
          <table>
            <tbody>
              <tr>
                <th className="sortable" onClick={handleSort}>
                  Hadith Number {sortOrder === 'asc' ? '▲' : '▼'}
                </th>
                <th>Theme</th>
                <th>Text</th>
              </tr>
              {resultsData.HadithNo.map((item, index) => (
                <tr key={index}>
                  <td>{item}</td>
                  <td>{resultsData.Theme[index]}</td>
                  <td className="text-cell">{resultsData.Text[index]}</td>
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
