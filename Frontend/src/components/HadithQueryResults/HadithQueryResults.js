import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './HadithQueryResults.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import '../../fonts.css';

const ROWS_TO_SHOW_INITIAL = 5;
const ITEMS_PER_PAGE = 1; // Number of items to display per page

const HadithQueryResults = () => {
  const location = useLocation();
  const { resultsData } = location.state || {};
  const navigate = useNavigate();

  const [isExpanded, setIsExpanded] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [visibleRows, setVisibleRows] = useState(ROWS_TO_SHOW_INITIAL);
  const [narratorNames, setNarratorNames] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [maxJump, setMaxJump] = useState(Math.ceil(resultsData?.length / ITEMS_PER_PAGE));


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

  // const handleRootNarratorClick = (rootNarrator) => {
  //   // Define the action when root narrator is clicked
  //   console.log("Root Narrator clicked:", rootNarrator);
  // };

  const handleNarratorNameClick = (Refer) => {
    // Define the action when narrator name is clicked
    console.log("Narrator Name clicked:", Refer);
    navigate('/people-page', { state: { Refer} });
  };
  

  // const handleReferClick = (Refer) => {
  //   // Pass the Refer value to the People component
  //   navigate('/people-page', { state: { Refer } });
  // };

  const [isTextsExpanded, setIsTextsExpanded] = useState(false);

  const toggleTextsExpansion = () => {
    setIsTextsExpanded(!isTextsExpanded);
  };

  const parseHadithText = (hadithText, narratorNames, rootNarrator, refers) => {
    if (!hadithText || !narratorNames) return hadithText;
  
    const narratorNamesArray = narratorNames.split(',').map(name => name.trim());
    const rootNarratorArray = rootNarrator.split(',').map(name => name.trim());
    const refersArray = refers.split(',').map(name => name.trim());
    const namesArray = [...narratorNamesArray, ...rootNarratorArray, ...refersArray];
  
    const textWithClickableNames = [];
    let currentIndex = 0;
  
    namesArray.forEach(name => {
      const index = hadithText.indexOf(name, currentIndex);
      if (index !== -1) {
        textWithClickableNames.push(hadithText.substring(currentIndex, index));
  
        textWithClickableNames.push(
          <span className="narrator-name" onClick={() => handleNarratorNameClick(name)}>
            {name}
          </span>
        );
  
        currentIndex = index + name.length;
      }
    });
  
    textWithClickableNames.push(hadithText.substring(currentIndex));
  
    return textWithClickableNames;
  };
  
  
  // style={{ fontFamily: 'UthmanTN' }}
  
  const renderTableData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
  
    return (
      resultsData &&
      resultsData.slice(startIndex, endIndex).map((data, index) => (
        <React.Fragment key={index}>
          <tr>
            <th className="sortable" onClick={() => handleSort('HadithNo')}>
              HadithNo {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
            <button
              className="hadith-number-button"
              onClick={() => handleHadithNumberClick(data.HadithNo?.value)}
            >
              {data.HadithNo?.value}
            </button>          
          </tr>
          <tr>
            <th>Chapters</th> 
            <td >{data.Chapters?.value}</td>
          </tr>
          <tr>
          <th>NarratorNames</th>
          <td>
            {data.NarratorNames?.value.split(',').map((name, index) => (
              <span
                key={index}
                className="narrator-name"
                onClick={() => handleNarratorNameClick(name.trim())}
              >
                {name.trim()}
              </span>
            )).reduce((prev, curr) => [prev, ', ', curr])}
          </td>
        </tr>
          <tr>
            <th>NarratorTypes</th>
            <td>{data.NarratorTypes?.value}</td>
          </tr>
          <tr>
            <th>Refers</th>
            <td>
              {data.Refers?.value.split(',').map((refer, index) => (
                <span
                  key={index}
                  className="refer-name"
                  onClick={() => handleNarratorNameClick(refer.trim())}
                >
                  {refer.trim()}
                </span>
              )).reduce((prev, curr) => [prev, ', ', curr])}
            </td>
          </tr>
          <tr>
            <th>Root Narrator Types</th>
            <td>{data.RootNarratorTypes?.value.split(',').map(name => name.trim()).join('  ,  ')}</td>
          </tr>
          <tr>
            <th>Root Narrators</th>
            <td>
              {data.RootNarrators?.value.split(',').map((rootNarrator, index) => (
                <span
                  key={index}
                  className="root-narrator-name"
                  onClick={() => handleNarratorNameClick(rootNarrator.trim())}
                >
                  {rootNarrator.trim()}
                </span>
              )).reduce((prev, curr) => [prev, ', ', curr])}
            </td>
          </tr>
          <tr>
            <th>Sub Themes</th>
            <td>{data.Subthemes?.value}</td>
          </tr>
          {data.Texts?.value && (
            <tr>
              {index === 0 && <th>Hadith Text</th>}
              <td>
                {isTextsExpanded ? parseHadithText(data.Texts?.value, data.NarratorNames?.value, data.RootNarrators?.value, data.Refers?.value) : `${data.Texts?.value.slice(0, 100)}...`}
                {data.Texts?.value && (
                  <button className="view-more-button" onClick={toggleTextsExpansion}>
                    {isTextsExpanded ? 'View less' : 'View more'}
                  </button>
                )}
              </td>
            </tr>
          )}

          <tr>
            <th>Themes</th>
            <td>{data.Themes?.value}</td>
          </tr>
          <tr>
            <th>Verse Nos</th>
            <td>{data.VerseNos?.value}</td>
          </tr>
          <tr>
            <th>Verse Texts</th>
            <td>{data.VerseTexts?.value}</td>
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
      <div className="back-button-HQR" onClick={() => window.history.back()}>
        <img src={require('../../assets/back_button.png')} alt="Back Button" />
      </div>
      {resultsData && (
        <div className="details-table-HQR">
          <table>
            <tbody>{renderTableData()}</tbody>
          </table>
        </div>
      )}
      <div className="pagination top-right-HQR">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Prev
        </button>
        <span>{`Page ${currentPage}`}</span>
        <button onClick={handleNextPage} disabled={currentPage * ITEMS_PER_PAGE >= resultsData.length}>
          Next
        </button>
      </div>
      <div className="pagination top-right-HQR-2">
        <span id="page-jump-HQR">Jump to :</span>
        <input
          type="number"
          value={currentPage}
          onChange={(e) => setCurrentPage(e.target.value)}
          min={1}
          max={maxJump}
        />
        <span id="page-max-HQR">{`Max: ${maxJump}`}</span>
      </div>

    </div>
  );
};

export default HadithQueryResults;

/*
commtexts
hadithtexts
segment_texts
names
references
*/