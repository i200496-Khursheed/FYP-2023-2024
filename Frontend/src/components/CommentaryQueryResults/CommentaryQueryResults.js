import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './CommentaryQueryResults.css';
import Footer from '../Footer/Footer'; // Import Footer component

const CommentaryQueryResults = () => {
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
          <td>{data.V_nos?.value}</td>
          <td>{data.chapter_nos?.value}</td>
          <td>{data.Texts?.value}</td>
          <td>{data.sec_chps?.value}</td>
          <td>{data.number?.value}</td>
          <td className="commentary-text">{data.sec_texts?.value}</td>
          <td>{data.sec_nos?.value}</td>
          <td>{data.sec_texts?.value}</td>
          <td>{data.person_names?.value}</td>
          <td>{data.refer_type?.value}</td>
          <td>{data.subthemes?.value}</td>
          <td>{data.theme_names?.value}</td>
          <td>{data.volumes?.value}</td>
        </tr>
      ))
    );
  };

  return (
    <div>
      <div className={`verse-query-results ${isExpanded ? 'expanded' : ''}`}>
        <div className="back-button-CQR" onClick={() => window.history.back()}>
          <img src={require('../../assets/back_button.png')} alt="Back Button" />
        </div>
        <div className={`query-text-box ${isExpanded ? 'expanded' : ''}`}>
          <div className="details-swipe-bar" onClick={toggleExpand}>
            <div className={`arrow ${isExpanded ? 'expanded' : ''}`}></div>
          </div>
        </div>

        {isExpanded && resultsData && (
          <div className="details-table-CQR">
            <table>
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleSort('V_nos')}>
                    Verse Number {sortOrder === 'asc' ? '▲' : '▼'}
                  </th>
                  <th>Chapter Number</th>
                  <th>Text</th>
                  <th>Section Chapter</th>
                  <th>Commentary Number</th>
                  <th>Commentary Text</th>
                  <th>Section Number</th>
                  <th>Section Text</th>
                  <th>Person Names</th>
                  <th>Reference Type</th>
                  <th>Subthemes</th>
                  <th>Theme Names</th>
                  <th>Volumes</th>
                </tr>
              </thead>
              <tbody>{renderTableData()}</tbody>
            </table>
          </div>
        )}
      </div>
      <div className="Footer-portion-CQR">
        <Footer />
      </div>
    </div>
  );
};

export default CommentaryQueryResults;
