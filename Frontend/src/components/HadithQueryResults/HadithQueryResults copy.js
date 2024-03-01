import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './HadithQueryResults.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';

const ROWS_TO_SHOW_INITIAL = 5;

const HadithQueryResults = () => {
  const location = useLocation();
  const { resultsData } = location.state || {};
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [visibleRows, setVisibleRows] = useState(ROWS_TO_SHOW_INITIAL);
  const [narratorNames, setNarratorNames] = useState([]);

  useEffect(() => {
    fetch('/Drop-down-data/Hadith Dropdowns/Hadith Narrator Names.txt')
      .then((response) => response.text())
      .then((data) => {
        const names = data.split('\n').map(name => name.trim());
        setNarratorNames(names);
      })
      .catch((error) => {
        console.error('Error fetching narrator names:', error);
      });
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    setVisibleRows(isExpanded ? ROWS_TO_SHOW_INITIAL : resultsData?.length);
  };

  const handleSort = (field) => {
    const sortedData = resultsData.slice().sort((a, b) => {
      const aValue = a[field]?.value || '';
      const bValue = b[field]?.value || '';
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    // Update resultsData with sorted data
  };

  const sendHadithNumberToDifferentBackend = (hadithNo) => {
    console.log("here", hadithNo)
    console.log('POST to a different backend endpoint');
    const url = 'http://127.0.0.1:8000/api/chain_narrators/';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hadithNo }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        // Use navigate to move to the Chain page
        navigate('/chain-page', { state: { resultsData: responseData } });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleHadithNumberClick = (hadithNo) => {
    sendHadithNumberToDifferentBackend(hadithNo);
  };

  const handleRootNarratorClick = (rootNarrator) => {
    // Define the action when root narrator is clicked
    console.log("Root Narrator clicked:", rootNarrator);
  };

  const handleNarratorNameClick = (narratorName) => {
    // Define the action when narrator name is clicked
    console.log("Narrator Name clicked:", narratorName);
  };

  const handleReferClick = (Refer) => {
    // Pass the Refer value to the People component
    navigate('/people-page', { state: { Refer } });
  };


  const renderTableData = () => {
    return (
      resultsData &&
      resultsData.slice(0, visibleRows).map((data, index) => (
        <tr key={index}>
          <td>
            <button
              className="hadith-number-button"
              onClick={() => handleHadithNumberClick(data.HadithNo?.value)}
            >
              {data.HadithNo?.value}
            </button>
          </td>
          <td>
            <a
              className="clickable-text"
              onClick={() => handleRootNarratorClick(data.RootNarrator?.value)}
            >
              {data.RootNarrator?.value}
            </a>
          </td>
          <td>
            <a
              className="clickable-text"
              onClick={() => handleNarratorNameClick(data.NarratorName?.value)}
            >
              {data.NarratorName?.value}
            </a>
          </td>
          <td>{data.NarratorType?.value}</td>
          <td>
            {data.Text?.value.split(' ').map((word, idx) => {
              const clickable = narratorNames.includes(word);
              return (
                <span key={idx}>
                  {clickable ? (
                    <a
                      className="clickable-text"
                      onClick={() => handleReferClick(word)}
                    >
                      {word}
                    </a>
                  ) : (
                    word
                  )}{' '}
                </span>
              );
            })}
          </td>
          <td>{data.Theme?.value}</td>
          <td>
            <a
              className="clickable-text"
              onClick={() => handleReferClick(data.Refer?.value)}
            >
              {data.Refer?.value}
            </a>
          </td>
          <td>{data.rootNarratorType?.value}</td>
          <td>{data.subtheme?.value}</td>
        </tr>
      ))
    );
  };

  return (
    <div>
      <div className="hadith-query-results">
        <div className="back-button-HQR" onClick={() => window.history.back()}>
          <img src={require('../../assets/back_button.png')} alt="Back Button" />
        </div>
        {resultsData && (
          <div className="details-table">
            <table>
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleSort('HadithNo')}>
                    Hadith Number {sortOrder === 'asc' ? '▲' : '▼'}
                  </th>
                  <th>Root Narrator</th>
                  <th>Narrator Name</th>
                  <th>Narrator Type</th>
                  <th style={{ width: '30%' }}>Text</th> 
                  <th>Theme</th>
                  <th>Mentioned</th>
                  <th>Root Narrator Type</th>
                  <th>Subtheme</th>
                </tr>
              </thead>
              <tbody>{renderTableData()}</tbody>
            </table>
          </div>
        )}
        {resultsData && resultsData.length > ROWS_TO_SHOW_INITIAL && (
          <div>
            <button className="view-button" onClick={toggleExpand}>
              {isExpanded ? 'View Less' : 'View More'} ({visibleRows} of {resultsData.length} rows shown)
            </button>
          </div>
        )}
      </div>
      <div className="Footer-portion-HQR">
        <Footer />
      </div>
    </div>
  );
};

export default HadithQueryResults;
