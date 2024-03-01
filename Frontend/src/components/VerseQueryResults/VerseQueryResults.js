import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './VerseQueryResults.css';
import Footer from '../Footer/Footer'; // Import Footer component

const ITEMS_PER_PAGE = 1; // Number of items to display per page

const VerseQueryResults = () => {
  const location = useLocation();
  const { resultsData } = location.state || {};

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc'); // Initial sort order
  const [maxJump, setMaxJump] = useState(Math.ceil(resultsData?.length / ITEMS_PER_PAGE));

  // State variables to track whether each section should be expanded
  const [isCommentaryExpanded, setIsCommentaryExpanded] = useState(false);
  const [isHadithExpanded, setIsHadithExpanded] = useState(false);
  const [isSegmentExpanded, setIsSegmentExpanded] = useState(false);

  const handleSort = (field) => {
    if (sortOrder === 'asc') {
      resultsData?.sort((a, b) => a[field]?.value.localeCompare(b[field]?.value));
      setSortOrder('desc');
    } else {
      resultsData?.sort((a, b) => b[field]?.value.localeCompare(a[field]?.value));
      setSortOrder('asc');
    }
  };

  const toggleCommentaryExpansion = () => {
    setIsCommentaryExpanded(!isCommentaryExpanded);
  };

  const toggleHadithExpansion = () => {
    setIsHadithExpanded(!isHadithExpanded);
  };

  const toggleSegmentExpansion = () => {
    setIsSegmentExpanded(!isSegmentExpanded);
  };

  const renderTableData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return (
      resultsData &&
      resultsData.slice(startIndex, endIndex).map((data, index) => (
        <React.Fragment key={index}>
          <tr>
            {index === 0 && <th>Verse Number</th>}
            <td>{data.Verseno?.value}</td>
          </tr>
          <tr>
            {index === 0 && <th>Surah Name</th>}
            <td>{data.Surahnames?.value}</td>
          </tr>
          <tr>
            {index === 0 && <th>Text</th>}
            <td>{data.Texts?.value}</td>
          </tr>
          {/* Render the commentary text with "View more" button */}
          {data.commtexts?.value && (
          <tr>
            {index === 0 && <th>Commentary Text</th>}
            <td>
              {isCommentaryExpanded ? data.commtexts?.value : `${data.commtexts?.value.slice(0, 150)}...`}
              {data.commtexts?.value && (
                <button className="view-more-button" onClick={toggleCommentaryExpansion}>
                  {isCommentaryExpanded ? 'View less' : 'View more'}
                </button>
              )}
            </td>
          </tr>
        )}
          {/* Render the Hadith text with "View more" button */}
          {data.hadithtexts?.value && (
          <tr>
            {index === 0 && <th>Hadith Text</th>}
            <td>
              {isHadithExpanded ? data.hadithtexts?.value : `${data.hadithtexts?.value.slice(0, 100)}...`}
              {data.hadithtexts?.value && (
                <button className="view-more-button" onClick={toggleHadithExpansion}>
                  {isHadithExpanded ? 'View less' : 'View more'}
                </button>
              )}
            </td>
          </tr>
        )}
          {/* Render the segment text with "View more" button */}
          {data.segment_texts?.value && (
            <tr>
              {index === 0 && <th>Segment Text</th>}
              <td>
                {isSegmentExpanded ? data.segment_texts?.value : `${data.segment_texts?.value.slice(0, 100)}...`}
                {data.segment_texts?.value && (
                  <button className="view-more-button" onClick={toggleSegmentExpansion}>
                    {isSegmentExpanded ? 'View less' : 'View more'}
                  </button>
                )}
              </td>
            </tr>
          )}
          <tr>
            {index === 0 && <th>Chapter</th>}
            <td>{data.chapter?.value}</td>
          </tr>
          <tr>
            {index === 0 && <th>Commentary Number</th>}
            <td>{data.commnos?.value.split(';').map(name => name.trim()).join(' ;  ')}</td>
          </tr>
          <tr>
            {index === 0 && <th>Hadith Number</th>}
            <td>{data.hadithnos?.value.split(';').map(name => name.trim()).join('  ;  ')}</td>
          </tr>
          <tr>
            {index === 0 && <th>Name</th>}
            <td>{data.names?.value.split(';').map(name => name.trim()).join(' ;  ')}</td>
          </tr>
          <tr>
            {index === 0 && <th>Reference</th>}
            <td>{data.references?.value.split(';').map(name => name.trim()).join('  ;  ')}</td>
          </tr>
          <tr>
            {index === 0 && <th>Subtheme</th>}
            <td>{data.subthemes?.value.split(';').map(name => name.trim()).join('  ;  ')}</td>
          </tr>
          <tr>
            {index === 0 && <th>Theme Name</th>}
            <td>{data.themenames?.value.split(';').map(name => name.trim()).join('  ;  ')}</td>
          </tr>
          <tr>
            {index === 0 && <th>Hadith Theme</th>}
            <td>{data.hadithThemes?.value.split(';').map(name => name.trim()).join('  ;  ')}</td>
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
      <div className="verse-query-results">
        <div className="pagination top-right">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Prev
          </button>
          <span>{`Page ${currentPage}`}</span>
          <button onClick={handleNextPage} disabled={currentPage * ITEMS_PER_PAGE >= resultsData.length}>
            Next
          </button>
        </div>
        <div className="pagination top-right-2">
          <span id="page-jump-VQR">Jump to Page:</span>
          <input
            type="number"
            value={currentPage}
            onChange={(e) => setCurrentPage(e.target.value)}
            min={1}
            max={maxJump}
          />
          <span id="page-max-VQR">{`Max: ${maxJump}`}</span>
        </div>
        <div className="back-button-VQR" onClick={() => window.history.back()}>
          <img src={require('../../assets/back_button.png')} alt="Back Button" />
        </div>

        {resultsData && (
          <div className="details-table-VQR">
            <table>
              <tbody>{renderTableData()}</tbody>
            </table>
          </div>
        )}
      </div>
      <div className="Footer-portion-VQR">
        <Footer />
      </div>
    </div>
  );
};

export default VerseQueryResults;
