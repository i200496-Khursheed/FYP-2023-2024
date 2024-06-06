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
  const [isMoreInfoVisible, setIsMoreInfoVisible] = useState(false);
  const [moreInfoButtonLabel, setMoreInfoButtonLabel] = useState('More Info');
  const [newQueryResults, setNewQueryResults] = useState([]);
  const [newCurrentPage, setNewCurrentPage] = useState(1);
  const [newMaxJump, setNewMaxJump] = useState(0);

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

  const extractHadithNumber = (hadithNo) => {
    // Check if the hadith number matches the pattern with 00 and a decimal part
    const patternWith00AndDecimal = /HD_([0-9]+\.00|[0-9]+\.[0-9]+)/;
    const matchWith00AndDecimal = hadithNo.match(patternWith00AndDecimal);

    // Check if the hadith number matches the pattern with optional leading zeros and a decimal part
    const patternWithOptionalLeadingZeros = /HD_0*([1-9][0-9]*\.[0-9]+)/;
    const matchWithOptionalLeadingZeros = hadithNo.match(patternWithOptionalLeadingZeros);

    // Check if the hadith number matches the pattern for non-decimal based numbers
    const patternNonDecimalBased = /HD_0*([1-9]\d*)/;
    const matchNonDecimalBased = hadithNo.match(patternNonDecimalBased);

    // If the pattern with 00 and decimal matches, return the matched part
    if (matchWith00AndDecimal) {
        return matchWith00AndDecimal[1];
    } else if (matchWithOptionalLeadingZeros) {
        // If the pattern with optional leading zeros matches, return the matched part
        return matchWithOptionalLeadingZeros[1];
    } else if (matchNonDecimalBased) {
        // If the pattern for non-decimal based numbers matches, return the matched part
        return matchNonDecimalBased[1];
    } else {
        // Otherwise, use the default pattern
        const defaultPattern = /HD_([0-9]+\.[0-9]+)/;
        const match = hadithNo.match(defaultPattern);
        return match ? match[1] : hadithNo;
    }
};

  const sendHadithNumberToDifferentBackend = (hadithNo) => {
    const extractedNumber = extractHadithNumber(hadithNo);
    if (!extractedNumber) {
      console.error('Invalid HadithNo format:', hadithNo);
      return;
    }
  
    console.log('POST to a different backend endpoint');
    console.log('Sending HadithNo to chainPage:', hadithNo);
    const url = 'http://127.0.0.1:8000/api/chain_narrators/';
  
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hadithNo: extractedNumber }),
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

  const handleNarratorNameClick = (Refer) => {
    // Define the action when narrator name is clicked
    console.log('Narrator Name clicked:', Refer);
    navigate('/people-page', { state: { Refer } });
  };

  const [isTextsExpanded, setIsTextsExpanded] = useState(false);

  const toggleTextsExpansion = () => {
    setIsTextsExpanded(!isTextsExpanded);
  };

  const parseHadithText = (hadithText, narratorNames, rootNarrator, refers) => {
    if (!hadithText) return hadithText;

    const narratorNamesArray = narratorNames ? narratorNames.split(',').map(name => name.trim()) : [];
    const rootNarratorArray = rootNarrator ? rootNarrator.split(',').map(name => name.trim()) : [];
    const refersArray = refers ? refers.split(',').map(name => name.trim()) : [];
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

  const renderTableData = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return (
      resultsData &&
      resultsData.slice(startIndex, endIndex).map((data, index) => (
        <React.Fragment key={index}>
          <tr>
            <th className="sortable" onClick={() => handleSort('HadithNo1')}>
              HadithNo {sortOrder === 'asc' ? '▲' : '▼'}
            </th>
            <button
              className="hadith-number-button"
              onClick={() => handleHadithNumberClick(extractHadithNumber(data.HadithNo1?.value))}
            >
              {extractHadithNumber(data.HadithNo1?.value)}
            </button>          
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
              )).reduce((prev, curr) => [prev, ', ', curr], [])}
            </td>
          </tr>
          <tr>
            <th>NarratorTypes</th>
            <td style={{ padding: '10px', lineHeight: '20px', fontSize: '16px' }}>{addSpaceAfterCommas(data.NarratorTypes?.value)}</td>
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
              )).reduce((prev, curr) => [prev, ', ', curr], [])}
            </td>
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
            <td style={{ padding: '10px', lineHeight: '20px', fontSize: '16px' }}>{addSpaceAfterCommas(data.Themes?.value)}</td>
          </tr>

          <tr>
            <th>More Information</th>
            <td>
              <button className="more-info-button" onClick={() => handleMoreInfoClick(data.HadithNo1?.value)}>
                {moreInfoButtonLabel}
              </button>
            </td>          
          </tr>
        </React.Fragment>
      ))
    );
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(resultsData?.length / ITEMS_PER_PAGE);
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    setMaxJump(Math.ceil(resultsData?.length / ITEMS_PER_PAGE));
  
    // Reset the page number of the second table to 1
    setNewCurrentPage(1);
  
    // Hide the new table and reset the more info button label
    setIsMoreInfoVisible(false);
    setMoreInfoButtonLabel('More Info');
  };
  
  
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    
    // Update the maxJump state only for the main table
    setMaxJump(Math.ceil(resultsData?.length / ITEMS_PER_PAGE));
  
    // Reset the page number of the second table to 1
    setNewCurrentPage(1);

    // Hide the new table and reset the more info button label
    setIsMoreInfoVisible(false);
    setMoreInfoButtonLabel('More Info');
  };
  
  const handleJumpToPage = (pageNumber) => {
    const totalPages = Math.ceil(resultsData?.length / ITEMS_PER_PAGE);
    setCurrentPage((prevPage) => Math.min(Math.max(pageNumber, 1), totalPages));
    setMaxJump(Math.ceil(resultsData?.length / ITEMS_PER_PAGE));
  };

  const sendToQuery2 = (hadithNo) => {
    console.log('Sending HadithNo1 to Query2:', hadithNo);
    // Prepare the data to send to the backend
    const requestData = {
      Hadith_IRI: hadithNo // Assuming HadithNo1 is the IRI you need to send
    };

    // Make a POST request to the backend API
    fetch('http://127.0.0.1:8000/api/query_hadith2/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((responseData) => {
        // Handle the response data here, maybe update the state or navigate to a new page
        console.log('Query2 response:', responseData);

        // Update the state with new query results
        setNewQueryResults({
          result: responseData.result.results,
          result2: responseData.result2.results
        });
        setNewMaxJump(Math.ceil(responseData.result.results.length / ITEMS_PER_PAGE));
        setIsMoreInfoVisible(true);
        setMoreInfoButtonLabel('Less Info');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleMoreInfoClick = (hadithNo) => {
    if (isMoreInfoVisible) {
      setIsMoreInfoVisible(false);
      setMoreInfoButtonLabel('More Info');
    } else {
      sendToQuery2(hadithNo);
    }
  };

  const handleNewNextPage = () => {
    const totalPages = Math.ceil(newQueryResults.result.bindings.length / ITEMS_PER_PAGE);
    setNewCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    setNewMaxJump(totalPages);
  };
  
  const handleNewPrevPage = () => {
    const totalPages = Math.ceil(newQueryResults.result.bindings.length / ITEMS_PER_PAGE);
    setNewCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    setNewMaxJump(totalPages);
  };
  
  const handleJumpToNewPage = (pageNumber) => {
    const totalPages = Math.ceil(newQueryResults.result.bindings.length / ITEMS_PER_PAGE);
    setNewCurrentPage((prevPage) => Math.min(Math.max(pageNumber, 1), totalPages));
    setMaxJump(totalPages);
  };
  
  // Update useEffect to calculate newMaxJump based on the total number of results available in the backend
  useEffect(() => {
    if (newQueryResults?.result) {
      // Use the total count of results available in the backend to calculate newMaxJump
      const totalCount = newQueryResults.result.bindings.length;
      setNewMaxJump(Math.ceil(totalCount / ITEMS_PER_PAGE));
    }
  }, [newQueryResults]);

  
  // Update useEffect to calculate maxJump based on resultsData length
  useEffect(() => {
    setMaxJump(Math.ceil(resultsData?.length / ITEMS_PER_PAGE));
  }, [resultsData]);
  
  // Define a variable to store the RootNarrator fetched initially
  let rootNarrator = '';

  // Update the value of rootNarrator when newQueryResults is available
  if (newQueryResults.result2 && newQueryResults.result2.bindings.length > 0) {
    rootNarrator = newQueryResults.result2.bindings[0].RootNarrator?.value;
  }

  function addSpaceAfterCommas(text) {
    return text.replace(/,/g, ', '); // Replace each comma with a comma followed by a space
}

// Modify the renderNewQueryResults function to display the stored RootNarrator
const renderNewQueryResults = () => {
  const startIndex = (newCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  return (
    <React.Fragment>
      <div className="details-table-HQR">
        <table>
          <tbody>
            {/* Render the new query result table rows */}
            {newQueryResults.result && newQueryResults.result.bindings.slice(startIndex, endIndex).map((data, index) => (
              <React.Fragment key={index}>
                <tr>
                  <th>RootNarrator</th>
                  <td>{rootNarrator}</td>
                </tr>
                <tr>
                  <th>Subthemes</th>
                  <td style={{ padding: '30px', lineHeight: '40px', fontSize: '16px' }}>{addSpaceAfterCommas(data.Subthemes?.value)}</td>
                </tr>
                <tr>
                  <th>Verse Number</th>
                  <td>{data.Verse_No?.value}</td>
                </tr>
                <tr>
                  <th>Verse Text</th>
                  <td>{data.Verse_Text?.value}</td>
                </tr>
                <tr>
                  <th>Chapter</th>
                  <td>{data.chapter?.value}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
};

    // New useEffect hook to update newMaxJump when newQueryResults.result changes
    useEffect(() => {
      if (newQueryResults.result) {
        setNewMaxJump(Math.ceil(newQueryResults.result.bindings.length / ITEMS_PER_PAGE));
      }
    }, [newQueryResults]);

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

      {isMoreInfoVisible && newQueryResults && newQueryResults.result && newQueryResults.result.bindings.length > 0 && (
        <div className="details-table-new-HQR">
          <table>
            <tbody>{renderNewQueryResults()}</tbody>
          </table>
          <div className="pagination new-pagination">
            <button className="new-pagination-button" onClick={handleNewPrevPage} disabled={newCurrentPage === 1}>
              Prev (More)
            </button>
            <span>{`Page ${newCurrentPage}`}</span>
            <button className="new-pagination-button" onClick={handleNewNextPage} disabled={newCurrentPage * ITEMS_PER_PAGE >= newQueryResults.result.length}>
              Next (More)
            </button>
            <div className="jump-to-max-container">
              <span id="page-jump-new-HQR">Jump to :</span>
              <input
                type="number"
                value={newCurrentPage}
                onChange={(e) => handleJumpToNewPage(Number(e.target.value))}
                min={1}
                max={newMaxJump}
              />
              <span id="page-max-new-HQR">{`Max: ${newMaxJump}`}</span>
            </div>
          </div>
        </div>
      )}
    <div className="oldTable">
        <div className="pagination top-right-HQR">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Prev (Main)
          </button>
          <span>{`Page ${currentPage}`}</span>
          <button onClick={handleNextPage} disabled={currentPage * ITEMS_PER_PAGE >= resultsData.length}>
            Next (Main)
          </button>
        </div>

        <div className="pagination top-right-HQR-2">
          <span id="page-jump-HQR">Jump to :</span>
          <input
            type="number"
            value={currentPage}
            onChange={(e) => handleJumpToPage(Number(e.target.value))}
            min={1}
            max={maxJump}
          />
          <span id="page-max-HQR">{`Max: ${maxJump}`}</span>
        </div>
    </div>
  </div>
  );
};

export default HadithQueryResults;