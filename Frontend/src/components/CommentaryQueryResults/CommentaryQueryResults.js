import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import './CommentaryQueryResults.css';
import Footer from '../Footer/Footer';

const ITEMS_PER_PAGE = 1; // Number of items to display per page

const CommentaryQueryResults = () => {
  const location = useLocation();
  const { resultsData, selectedFields } = location.state || {}; // Extract selectedFields

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


  // -- Complete Graph -- //

    // State for More Info button
    const [isMoreInfoVisible, setIsMoreInfoVisible] = useState(false);
    const [moreInfoButtonLabel, setMoreInfoButtonLabel] = useState('More Info');
  
    const [newQueryResults, setNewQueryResults] = useState([]);
    const [newCurrentPage, setNewCurrentPage] = useState(1);
    const [newMaxJump, setNewMaxJump] = useState(0);
  

    const handleMoreInfoClick = (Commentary) => {
      if (isMoreInfoVisible) {
        setIsMoreInfoVisible(false);
        setMoreInfoButtonLabel('More Info');
      } else {
        sendToQuery2(Commentary);
      }
    };
    
    const sendToQuery2 = (Commentary) => {
      console.log('Sending Commentary IRI to Query2:', Commentary);
  
      // Extract individual fields from selectedFields
      const { subtheme } = selectedFields || {};


      // Prepare the data to send to the backend
      const requestData = {
        Commentary_IRI: Commentary, // Include the original comm IRI without modification
        subtheme: subtheme || '?subtheme',
      };
      
      console.log("Request data is: ", requestData); // Debugging line
  
      // Make a POST request to the backend API
      fetch('http://127.0.0.1:8000/api/query_commentary2/', {
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
          // Skip rendering 'result', 'RESULT2', 'RESULT3'
          //if (['result', 'result2'].includes(resultKey)) return null;
  
          const resultData = newQueryResults[resultKey];
          
          return (
            <React.Fragment key={resultIndex}>
              {/* Render the result table rows */}
              {resultData && resultData.bindings.slice(startIndex, endIndex).map((data, index) => (
                <React.Fragment key={`${resultKey}-${index}`}>
                  {/* Render rows for each field in the result */}
                  {Object.keys(data).map((field, fieldIndex) => (
                    // Skip rendering the 'verse' field and check if the field value is empty before rendering th and td
                    field !== 'Commentary IRI' && data[field].value && (
                      <tr key={`${resultKey}-${index}-${fieldIndex}`}>
                        <th>{field}</th>
                        <td style={{ padding: '10px', lineHeight: '20px', fontSize: '17px' }}>
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
            <th>Commentary IRI</th>
            <td>
              {data.Commentary?.value.split('#')[1]}
            </td>
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
              {index === 0 && <th>Cited Verse</th>}
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
            <th>Theme Names</th>
            <td>{data.themes?.value}</td>
          </tr>

          <tr>
            <th>More Information</th>
            <td>
              <button
                className="more-info-button"
                onClick={() => handleMoreInfoClick(data.Commentary?.value)}
              >
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
      <div className="back-button-CQR" onClick={() => window.history.back()}>
        <img src={require('../../assets/back_button.png')} alt="Back Button" />
      </div>
      {resultsData && (
        <div className="details-table-CQR">
          <table>
            <tbody>{renderTableData()}</tbody>
          </table>
        </div>
      )}


      {isMoreInfoVisible && newQueryResults && newQueryResults.result && newQueryResults.result.bindings.length > 0 && (
        <div className="details-table-new-CQR">
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
              <span id="page-jump-new-CQR">Jump to :</span>
              <input
                type="number"
                value={newCurrentPage}
                onChange={(e) => handleJumpToNewPage(Number(e.target.value))}
                min={1}
                max={newMaxJump}
              />
              <span id="page-max-new-CQR">{`Max: ${newMaxJump}`}</span>
            </div>
          </div>
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
