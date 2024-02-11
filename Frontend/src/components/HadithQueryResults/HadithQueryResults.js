import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './HadithQueryResults.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';

const ROWS_TO_SHOW_INITIAL = 5;

const HadithQueryResults = () => {
  const location = useLocation();
  const { resultsData } = location.state || {};
  const navigate = useNavigate(); // Define navigate

  const [isExpanded, setIsExpanded] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [visibleRows, setVisibleRows] = useState(ROWS_TO_SHOW_INITIAL);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    setVisibleRows(isExpanded ? ROWS_TO_SHOW_INITIAL : resultsData?.length);
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
        console.log('Success:', responseData);

        // Use navigate to move to the Chain page
        navigate('/chain-page', { state: { resultsData: responseData } });

        // Handle the response data as needed
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleHadithNumberClick = (hadithNo) => {
    sendHadithNumberToDifferentBackend(hadithNo);
  };

  const renderTableData = () => {
    return (
      resultsData &&
      resultsData.slice(0, visibleRows).map((data, index) => (
        <tr key={index}>
          <td>
            <button
              className="hadith-number-button "
              onClick={() => handleHadithNumberClick(data.HadithNo?.value)}
              style={{
                backgroundColor: '#2e249e',
                color: '#fff',
                padding: '8px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                fontFamily: "'Lexend Deca', 'Jost', sans-serif",
              }}
            >
              {data.HadithNo?.value}
            </button>
          </td>
          <td>{data.NarratorName?.value}</td>
          <td>{data.NarratorType?.value}</td>
          <td>{data.RootNarrator?.value}</td>
          <td>{data.Text?.value}</td>
          <td>{data.Theme?.value}</td>
          <td>{data.Refer?.value}</td>
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
                  <th>Narrator Name</th>
                  <th>Narrator Type</th>
                  <th>Root Narrator</th>
                  <th style={{ width: '30%' }}>Text</th> {/* Set the width directly here */}
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
