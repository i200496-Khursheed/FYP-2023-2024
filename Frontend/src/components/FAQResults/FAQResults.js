import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './FAQResults.css';
import Footer from '../Footer/Footer'; // Import Footer component

const FAQResults = () => {
  const location = useLocation();
  const { resultsData } = location.state || {};

  const [isExpanded, setIsExpanded] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc'); // Initial sort order

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSort = (field) => {
    if (sortOrder === 'asc') {
      resultsData?.sort((a, b) => a[field]?.value.localeCompare(b[field]?.value));
      setSortOrder('desc');
    } else {
      resultsData?.sort((a, b) => b[field]?.value.localeCompare(a[field]?.value));
      setSortOrder('asc');
    }
  };

  const renderTableData = () => {
    return (
      resultsData &&
      resultsData.map((data, index) => (
        <tr key={index}>
          <td>{data.Text ? data.Text.value : '-'}</td>
          <td>{data.chapter ? data.chapter.value : '-'}</td>
          <td>{data.Verseno ? data.Verseno.value : '-'}</td>
          <td>{data.Surahname ? data.Surahname.value : '-'}</td>
        </tr>
      ))
    );
  };
  
  
  

  return (
    <div>
      <div className={`verse-query-results ${isExpanded ? 'expanded' : ''}`}>
        <div className="back-button-FAQ" onClick={() => window.history.back()}>
          <img src={require('../../assets/back_button.png')} alt="Back Button" />
        </div>
        <div className={`query-text-box ${isExpanded ? 'expanded' : ''}`}>
          <div className="details-swipe-bar" onClick={toggleExpand}>
            <div className={`arrow ${isExpanded ? 'expanded' : ''}`}></div>
          </div>
        </div>

        {isExpanded && resultsData && resultsData.length > 0 && (
        <div className="details-table-FAQ">
          <table>
            <thead>
              <tr>
                <th>Text</th>
                <th>Chapter</th>
                <th>Verse Number</th>
                <th>Surah Name</th>
              </tr>
            </thead>
            <tbody>{renderTableData()}</tbody>
          </table>
        </div>
      )}
      </div>
      <div className="Footer-portion-FAQ">
        <Footer />
      </div>
    </div>
  );
};

export default FAQResults;
