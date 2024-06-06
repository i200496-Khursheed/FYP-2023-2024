import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import './CommentaryQueryResults.css';
import Footer from '../Footer/Footer';

const ITEMS_PER_PAGE = 1; // Number of items to display per page

const CommentaryQueryResults = () => {
  const location = useLocation();
  const { resultsData } = location.state || {};

  const navigate = useNavigate();


  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc'); // Initial sort order

  const [maxJump, setMaxJump] = useState(Math.ceil(resultsData?.length / ITEMS_PER_PAGE));

  const handleSort = (field) => {
    if (sortOrder === 'asc') {
      resultsData?.sort((a, b) => a[field]?.value.localeCompare(b[field]?.value));
      setSortOrder('desc');
    } else {
      resultsData?.sort((a, b) => b[field]?.value.localeCompare(a[field]?.value));
      setSortOrder('asc');
    }
  };

  const [isTextsExpanded, setIsTextsExpanded] = useState(false);

  const toggleTextsExpansion = () => {
    setIsTextsExpanded(!isTextsExpanded);
  };


  const [isSecTextsExpanded, setIsSecTextsExpanded] = useState(false);

  const toggleSecTextsExpansion = () => {
    setIsSecTextsExpanded(!isSecTextsExpanded);
  };

  const [isVTextsExpanded, setIsVTextsExpanded] = useState(false);

  const toggleVTextsExpansion = () => {
    setIsVTextsExpanded(!isVTextsExpanded);
  };

  const renderTableData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return (
      resultsData &&
      resultsData.slice(startIndex, endIndex).map((data, index) => (
        <React.Fragment key={index}>
          <tr>
            <th className="sortable" onClick={() => handleSort('V_nos')}>
              Commentary Number {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
            <td>{data.number?.value}</td>
          </tr>
          <tr>
            <th>Surah Number</th>
            <td>{data.chapter_no?.value}</td>
          </tr>
          <tr>
            <th>Verse Number</th>
            <td>{data.V_no?.value}</td>
          </tr>
          {data.V_Text?.value && (
          <tr>
            {index === 0 && <th>Verse Text</th>}
            <td>
              {isVTextsExpanded ? parseText(data.V_Text?.value, data.names?.value) : `${data.V_Text?.value.slice(0, 100)}...`}
              {data.V_Texts?.value && (
                <button className="view-more-button" onClick={toggleVTextsExpansion}>
                  {isVTextsExpanded ? 'View less' : 'View more'}
                </button>
              )}
            </td>
          </tr>
        )}
          {data.Text?.value && (
          <tr>
            {index === 0 && <th>Text</th>}
            <td>
              {isTextsExpanded ? parseText(data.Text?.value, data.names?.value) : `${data.Text?.value.slice(0, 100)}...`}
              {data.Text?.value && (
                <button className="view-more-button" onClick={toggleTextsExpansion}>
                  {isTextsExpanded ? 'View less' : 'View more'}
                </button>
              )}
            </td>
          </tr>
        )}
          <tr>
            <th>Section Chapter</th>
            <td>{data.sec_chps?.value}</td>
          </tr>
          <tr>
            <th>Section Number</th>
            <td>{data.sec_nos?.value}</td>
          </tr>
          {data.sec_texts?.value && (
          <tr>
            {index === 0 && <th>Section Text</th>}
            <td>
              {isSecTextsExpanded ? parseText(data.sec_texts?.value, data.person_names?.value) : `${data.sec_texts?.value.slice(0, 100)}...`}
              {data.sec_texts?.value && (
                <button className="view-more-button" onClick={toggleSecTextsExpansion}>
                  {isSecTextsExpanded ? 'View less' : 'View more'}
                </button>
              )}
            </td>
          </tr>
        )}
        <tr>
          <th>Person Names</th>
          <td>
            {data.names?.value.split(',').map((name, i) => (
              <React.Fragment key={i}>
                <span
                  className="narrator-name-CQR"
                  onClick={() => handleNarratorNameClick(name.trim())}
                >
                  {name.trim()}
                </span>
                {i !== data.person_names?.value.split(',').length - 1 && ', '}
              </React.Fragment>
            ))}
          </td>
        </tr>

          <tr>
            <th>Subthemes</th>
            <td>{data.subthemes?.value}</td>
          </tr>
          <tr>
            <th>Theme Names</th>
            <td>{data.themes?.value}</td>
          </tr>
          <tr>
            <th>Volumes</th>
            <td>{data.volumes?.value}</td>
          </tr>
          <tr>
            <th>Editions</th>
            <td>{data.editions?.value}</td>
          </tr>
          <tr>
            <th>Pages</th>
            <td>{data.pages?.value}</td>
          </tr>
        </React.Fragment>
      ))
    );
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(resultsData?.length / ITEMS_PER_PAGE);
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    setMaxJump(Math.ceil(resultsData?.length / ITEMS_PER_PAGE));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    setMaxJump(Math.ceil(resultsData?.length / ITEMS_PER_PAGE));
  };

  const handleJumpToPage = (pageNumber) => {
    const totalPages = Math.ceil(resultsData?.length / ITEMS_PER_PAGE);
    setCurrentPage((prevPage) => Math.min(Math.max(pageNumber, 1), totalPages));
    setMaxJump(Math.ceil(resultsData?.length / ITEMS_PER_PAGE));
  };


  const handleNarratorNameClick = (Refer) => {
    // Define the action when narrator name is clicked
    console.log("Narrator Name clicked:", Refer);
    navigate('/people-page', { state: { Refer} });
  };
  // 1) Parsing Hadith Text

  const parseText = (hadithText, narratorNames) => {
    if (!hadithText || !narratorNames) return hadithText;
  
    const narratorNamesArray = narratorNames.split(',').map(name => name.trim());
    const namesArray = [...narratorNamesArray];
  
    const textWithClickableNames = [];
    let currentIndex = 0;
  
    namesArray.forEach(name => {
      const index = hadithText.indexOf(name, currentIndex);
      if (index !== -1) {
        textWithClickableNames.push(hadithText.substring(currentIndex, index));
  
        textWithClickableNames.push(
          <span className="narrator-name-CQR" onClick={() => handleNarratorNameClick(name)}>
            {name}
          </span>
        );
  
        currentIndex = index + name.length;
      }
    });
  
    textWithClickableNames.push(hadithText.substring(currentIndex));
  
    return textWithClickableNames;
  };


  return (
    <div>
      <div className="back-button-VQR" onClick={() => window.history.back()}>
        <img src={require('../../assets/back_button.png')} alt="Back Button" />
      </div>
      {resultsData && (
        <div className="details-table-CQR">
          <table>
            <tbody>{renderTableData()}</tbody>
          </table>
        </div>
      )}
      <div className="pagination top-right-CQR">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Prev
        </button>
        <span>{`Page ${currentPage}`}</span>
        <button onClick={handleNextPage} disabled={currentPage * ITEMS_PER_PAGE >= resultsData.length}>
          Next
        </button>
      </div>
      <div className="pagination top-right-CQR-2">
        <span id="page-jump-CQR">Jump to :</span>
        <input
          type="number"
          value={currentPage}
          onChange={(e) => setCurrentPage(e.target.value)}
          min={1}
          max={maxJump}
        />
        <span id="page-max-CQR">{`Max: ${maxJump}`}</span>
      </div>

    </div>
  );
};

export default CommentaryQueryResults;
