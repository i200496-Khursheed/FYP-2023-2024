import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './HadithQueryResults.css';
import Footer from '../Footer/Footer'; 

const HadithQueryResults = () => {
  const location = useLocation();
  const { resultsData } = location.state || {};

  const [isExpanded, setIsExpanded] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');

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
          <td>{data.HadithNo?.value}</td>
          <td>{data.NarratorName?.value}</td>
          <td>{data.NarratorType?.value}</td>
          <td>{data.RootNarrator?.value}</td>
          <td>{data.Text?.value}</td>
          <td>{data.Theme?.value}</td>
          <td>{data.RootNarratorType?.value}</td>
        </tr>
      ))
    );
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

        {isExpanded && resultsData && (
          <div className="details-table">
            <table>
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleSort('HadithNo')}>
                    Hadith Number {sortOrder === 'asc' ? '▲' : '▼'}
                  </th>
                  <th>Narrator Name</th>
                  <th>Narrator Type</th>
                  <th>Root Narrator</th>
                  <th>Text</th>
                  <th>Theme</th>
                  <th>Root Narrator Type</th>
                </tr>
              </thead>
              <tbody>
                {renderTableData()}
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
