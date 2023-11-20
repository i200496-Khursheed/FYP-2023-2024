//HadithQueryResults.js

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './HadithQueryResults.css';
import Footer from '../Footer/Footer'; // Import Footer component

const HadithQueryResults = () => {
  const location = useLocation();
  const { resultsData } = location.state || {};

  const [isExpanded, setIsExpanded] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc'); // Initial sort order

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNarratorClick = async (selectedNarrator) => {
    try {
      // Simulate fetching related narrators (replace this with your actual API call)
      const relatedNarratorsResponse = await fetch(
        `your_backend_url/narrators?selectedNarrator=${selectedNarrator}`
      );
      const relatedNarratorsData = await relatedNarratorsResponse.json();

      // Add the selected narrator's name at the beginning of the array
      const narratorsData = [selectedNarrator, ...relatedNarratorsData.narrators];

      // Redirect to Chain page with the narrators' data
      window.location.href = `/chain-page?narratorsData=${JSON.stringify(narratorsData)}`;
    } catch (error) {
      console.error('Error fetching related narrators:', error);
    }
  };

  const handleSort = () => {
    if (sortOrder === 'asc') {
      resultsData?.HadithNo?.sort((a, b) => a - b); // Sort in ascending order
      setSortOrder('desc');
    } else {
      resultsData?.HadithNo?.sort((a, b) => b - a); // Sort in descending order
      setSortOrder('asc');
    }
  };

  return (
    <div>
      <div className={`hadith-query-results ${isExpanded ? 'expanded' : ''}`}>
        <div className="back-button-HQR" onClick={() => window.history.back()}>
          <img src={require('../../assets/back_button.png')} alt="Back Button" />
        </div>
        <div className={`query-text-box ${isExpanded ? 'expanded' : ''}`}>
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
                  <th>Narrator Title</th>
                  <th>Narrator Name</th>
                  <th>Text</th>
                </tr>
                {resultsData?.HadithNo?.map((item, index) => (
                  <tr key={index}>
                    <td>{item}</td>
                    <td>{resultsData?.Theme?.[index]}</td>
                    <td>{resultsData?.NarratorTitle?.[index] || 'N/A'}</td>
                    <td
                      className="narrator-name"
                      onClick={() => handleNarratorClick(resultsData?.NarratorName?.[index])}>
                      {resultsData?.NarratorName?.[index] || 'N/A'}
                    </td>
                    <td className="text-cell">{resultsData?.Text?.[index]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className='Footer-portion-HQR'>
        <Footer />
      </div>
    </div>
  );
};

export default HadithQueryResults;
