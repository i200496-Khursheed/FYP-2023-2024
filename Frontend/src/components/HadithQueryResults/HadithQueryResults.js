import React, { useState } from 'react';
import './HadithQueryResults.css';

const HadithQueryResults = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(true);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible);
    document.querySelector('.arrow').classList.toggle('expanded'); // Toggle expanded class on arrow
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
        Query Text
        <div className="details-swipe-bar" onClick={toggleDetails}>
          <div className={`arrow ${isDetailsVisible ? 'expanded' : ''}`}></div>
        </div>
      </div>

      {isDetailsVisible && (
        <div className="details-table">
          <table>
            <tbody>
                
              <tr>
                <th>Hadith Number</th>
                <td>Value for Hadith Number</td>
              </tr>

              <tr>
                <th>Theme</th>
                <td>Value for Theme</td>
              </tr>

              <tr>
                <th>For Surah No</th>
                <td>Value for Surah No</td>
              </tr>
              
              <tr>
                <th>For Ayat No</th>
                <td>Value for Ayat No</td>
              </tr>

              <tr>
                <th className="wide-column">Verse</th>
                <td className="wide-column">Value for Verse</td>
              </tr>

              <tr>
                <th>Narrators</th>
                <td>Value for Narrators</td>
              </tr>

              <tr>
                <th>Organization</th>
                <td>Value for Organization</td>
              </tr>

              <tr>
                <th>Time</th>
                <td>Value for Time</td>
              </tr>

              <tr>
                <th>Person</th>
                <td>Value for Person</td>
              </tr>

            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HadithQueryResults;
