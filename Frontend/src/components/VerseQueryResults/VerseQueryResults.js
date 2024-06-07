import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './VerseQueryResults.css';
import Footer from '../Footer/Footer'; // Import Footer component

const ITEMS_PER_PAGE = 1; // Number of items to display per page

const VerseQueryResults = () => {
  const location = useLocation();
  const { resultsData, selectedFields } = location.state || {}; // Extract selectedFields

  const navigate = useNavigate();


  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc'); // Initial sort order
  const [maxJump, setMaxJump] = useState(Math.ceil(resultsData?.length / ITEMS_PER_PAGE));

  // State variables to track whether each section should be expanded
  const [isCommentaryExpanded, setIsCommentaryExpanded] = useState(false);
  const [isHadithExpanded, setIsHadithExpanded] = useState(false);
  const [isSegmentExpanded, setIsSegmentExpanded] = useState(false);


  // -- Complete Graph -- //

  // State for More Info button
  const [isMoreInfoVisible, setIsMoreInfoVisible] = useState(false);
  const [moreInfoButtonLabel, setMoreInfoButtonLabel] = useState('More Info');

  const [newQueryResults, setNewQueryResults] = useState([]);
  const [newCurrentPage, setNewCurrentPage] = useState(1);
  const [newMaxJump, setNewMaxJump] = useState(0);

  const handleMoreInfoClick = (verseNo) => {
    if (isMoreInfoVisible) {
      setIsMoreInfoVisible(false);
      setMoreInfoButtonLabel('More Info');
    } else {
      sendToQuery2(verseNo);
    }
  };

  const sendToQuery2 = (verse) => {
    console.log('Sending VerseNo to Query2:', verse);

    // Extract individual fields from selectedFields
    const { theme, reference, narrator } = selectedFields || {};

    // Prepare the data to send to the backend
    const requestData = {
        Verse_IRI: verse, // Include the original verseNo without modification
        theme: theme || '?theme',
        reference: reference || '?reference',
        narrator: narrator && narrator[0] && narrator[0].name ? narrator[0].name : '?narrator',
        hadithTheme: narrator && narrator[0] && narrator[0].hadithTheme ? narrator[0].hadithTheme : '?hadithTheme'
    };

    console.log("Request data is: ", requestData); // Debugging line

    // Make a POST request to the backend API
    fetch('http://127.0.0.1:8000/api/query_verse2/', {
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
            result2: responseData.result2.results,
            result3: responseData.result3.results,
            result4: responseData.result4.results,
        });
        setNewMaxJump(Math.ceil(responseData.result.results.length / ITEMS_PER_PAGE));
        setIsMoreInfoVisible(true);
        setMoreInfoButtonLabel('Less Info');
    })
    .catch((error) => {
        console.error('Error:', error);
    });
};


function addSpaceAfterCommas(text) {
  return text.replace(/,/g, ', '); // Replace each comma with a comma followed by a space
}

// Modify the renderNewQueryResults function to display the stored RootNarrator
const renderNewQueryResults = () => {
  const startIndex = (newCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  return (
    <React.Fragment>
      {Object.keys(newQueryResults).map((resultKey, resultIndex) => {
        // Skip rendering 'result', 'verse', 'RESULT2', 'RESULT3', and 'RESULT4'
        if (['result', 'verse', 'RESULT2', 'RESULT3', 'RESULT4'].includes(resultKey)) return null;

        const resultData = newQueryResults[resultKey];
        
        return (
          <React.Fragment key={resultIndex}>
            {/* Render the result table rows */}
            {resultData && resultData.bindings.slice(startIndex, endIndex).map((data, index) => (
              <React.Fragment key={`${resultKey}-${index}`}>
                {/* Render rows for each field in the result */}
                {Object.keys(data).map((field, fieldIndex) => (
                  // Skip rendering the 'verse' field and check if the field value is empty before rendering th and td
                  field !== 'Verse' && data[field].value && (
                    <tr key={`${resultKey}-${index}-${fieldIndex}`}>
                      <th>{field}</th>
                      <td style={{ padding: '10px', lineHeight: '20px', fontSize: '18px' }}>
                        {/* Apply addSpaceAfterCommas function here */}
                        {field === 'PAGES' || field === 'SUBTHEMES' ? addSpaceAfterCommas(data[field].value) : data[field].value}
                      </td>
                    </tr>
                  )
                ))}
              </React.Fragment>
            ))}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
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

  // New useEffect hook to update newMaxJump when newQueryResults.result changes
  useEffect(() => {
    if (newQueryResults.result) {
      setNewMaxJump(Math.ceil(newQueryResults.result.bindings.length / ITEMS_PER_PAGE));
    }
  }, [newQueryResults]);

  // END

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
            {index === 0 && <th>Verse IRI</th>}
            <td>{data.Verse?.value}</td>
          </tr>
          <tr>
            {index === 0 && <th>Verse Number</th>}
            <td>{data.Verseno?.value}</td>
          </tr>
          <tr>
            {index === 0 && <th>Surah Name</th>}
            <td>{data.Surahname?.value}</td>
          </tr>
          <tr>
            {index === 0 && <th>Text</th>}
            <td>{data.Text?.value}</td>
          </tr>

          {/* Render the Hadith text with "View more" button */}
          {data.hadithtexts?.value && (
          <tr>
            {index === 0 && <th>Hadith Text</th>}
            <td>
              {isHadithExpanded ? parseText(data.hadithtexts?.value, data.names?.value, data.references?.value) : `${data.hadithtexts?.value.slice(0, 100)}...`}
              {data.hadithtexts?.value && (
                <button className="view-more-button" onClick={toggleHadithExpansion}>
                  {isHadithExpanded ? 'View less' : 'View more'}
                </button>
              )}
            </td>
          </tr>
        )}

          <tr>
            <th>More Information</th>
            <td>
              <button className="more-info-button" onClick={() => handleMoreInfoClick(data.Verse?.value)}>
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
  

  const handleNarratorNameClick = (Refer) => {
    // Define the action when narrator name is clicked
    console.log("Narrator Name clicked:", Refer);
    navigate('/people-page', { state: { Refer} });
  };
  // 1) Parsing Hadith Text

  const parseText = (hadithText, narratorNames, refers) => {
    if (!hadithText || !narratorNames) return hadithText;
  
    const narratorNamesArray = narratorNames.split(';').map(name => name.trim());
    const refersArray = refers.split(';').map(name => name.trim());
    const namesArray = [...narratorNamesArray, ...refersArray];
  
    const textWithClickableNames = [];
    let currentIndex = 0;
  
    namesArray.forEach(name => {
      const index = hadithText.indexOf(name, currentIndex);
      if (index !== -1) {
        textWithClickableNames.push(hadithText.substring(currentIndex, index));
  
        textWithClickableNames.push(
          <span className="narrator-name-VQR" onClick={() => handleNarratorNameClick(name)}>
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
      <div className="verse-query-results">
        <div className="pagination top-right-VQR">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Prev
          </button>
          <span>{`Page ${currentPage}`}</span>
          <button onClick={handleNextPage} disabled={currentPage * ITEMS_PER_PAGE >= resultsData.length}>
            Next
          </button>
        </div>
        <div className="pagination top-right-VQR-2">
          <span id="page-jump-VQR">Jump to:</span>
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


      {isMoreInfoVisible && newQueryResults && newQueryResults.result && newQueryResults.result.bindings.length > 0 && (
        <div className="details-table-new-VQR">
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
              <span id="page-jump-new-VQR">Jump to :</span>
              <input
                type="number"
                value={newCurrentPage}
                onChange={(e) => handleJumpToNewPage(Number(e.target.value))}
                min={1}
                max={newMaxJump}
              />
              <span id="page-max-new-VQR">{`Max: ${newMaxJump}`}</span>
            </div>
          </div>
        </div>
      )}

      </div>

    </div>
  );
};

export default VerseQueryResults;