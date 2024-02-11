import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './CommentaryQueryResults.css';
import Footer from '../Footer/Footer';

const ITEMS_PER_PAGE = 1; // Number of items to display per page

const CommentaryQueryResults = () => {
  const location = useLocation();
  const { resultsData } = location.state || {};

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
            <td>{data.chapter_nos?.value}</td>
          </tr>
          <tr>
            <th>Verse Number</th>
            <td>{data.V_nos?.value}</td>
          </tr>
          <tr>
            <th>Verse Text</th>
            <td>{data.V_Texts?.value}</td>
          </tr>
          <tr>
            <th>Text</th>
            <td>{data.Texts?.value}</td>
          </tr>
          <tr>
            <th>Section Chapter</th>
            <td>{data.sec_chps?.value}</td>
          </tr>
          <tr className="commentary-text">
            <th>Commentary Text</th>
            <td>{data.sec_texts?.value}</td>
          </tr>
          <tr>
            <th>Section Number</th>
            <td>{data.sec_nos?.value}</td>
          </tr>
          <tr>
            <th>Section Text</th>
            <td>{data.sec_texts?.value}</td>
          </tr>
          <tr>
            <th>Person Names</th>
            <td>{data.person_names?.value}</td>
          </tr>
          <tr>
            <th>Subthemes</th>
            <td>{data.subthemes?.value}</td>
          </tr>
          <tr>
            <th>Theme Names</th>
            <td>{data.theme_names?.value}</td>
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
      <div className="Footer-portion-CQR">
        <Footer />
      </div>
    </div>
  );
};

export default CommentaryQueryResults;
