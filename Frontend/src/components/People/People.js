import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Oval as Loader } from 'react-loader-spinner';
import './People.css';
import Footer from '../Footer/Footer';
import Select from 'react-select'; // Import the Select component

const People = () => {
  const location = useLocation();
  const { Refer } = location.state || {}; // Retrieve the Refer value from location state

  const [selectedValue, setSelectedValue] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mentionOptions, setMentionOptions] = useState([]);
  const [filteredMentions, setFilteredMentions] = useState([]);

  const [currentTableData, setCurrentTableData] = useState([]);

  const [tableStack, setTableStack] = useState([]); // Stack to store table data

  useEffect(() => {
    if (Refer) {
      // Set the selected value to the Refer value if available
      setSelectedValue({ value: Refer, label: Refer });
      // Invoke query_federated with the Refer value
      // fetchData(Refer);
    }
  }, [Refer]);

  // State to track the expansion status of each cell
  const [isExpanded, setIsExpanded] = useState([]);

  useEffect(() => {
    setIsExpanded(new Array(tableData.length).fill(false));
  }, [tableData]);

  const handleExpansion = (index) => {
    const expanded = [...isExpanded];
    expanded[index] = !expanded[index];
    setIsExpanded(expanded);
  };

 
  const renderTableData = () => {
    return (
      <tbody>
        {tableData.map((data, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {/* Abstract */}
            {data.abstract && (
              <tr>
                <th>Abstract</th>
                <td>
                  {isExpanded[rowIndex] || data.abstract.length <= 100
                    ? data.abstract
                    : `${data.abstract.slice(0, 500)}...`}
                  {data.abstract.length > 100 && (
                    <button
                      className="view-more-button"
                      onClick={() => handleExpansion(rowIndex)}
                    >
                      {isExpanded[rowIndex] ? 'View less' : 'View more'}
                    </button>
                  )}
                </td>
              </tr>
            )}
  
            {/* Death */}
            {data.death && (
              <tr>
                <th>Death</th>
                <td>
                  {isExpanded[rowIndex] || data.death.length <= 100
                    ? data.death
                    : `${data.death.slice(0, 100)}...`}
                  {data.death.length > 100 && (
                    <button
                      className="view-more-button"
                      onClick={() => handleExpansion(rowIndex)}
                    >
                      {isExpanded[rowIndex] ? 'View less' : 'View more'}
                    </button>
                  )}
                </td>
              </tr>
            )}
  
            {/* Wiki Links */}
            {data.concatenatedData && (
              <tr>
                <th>Wiki Links</th>
                <td>
                  <ul>
                    {isExpanded[rowIndex] || data.concatenatedData.length <= 100 ? (
                      renderClickableListItems(data.concatenatedData)
                    ) : (
                      renderClickableListItems(data.concatenatedData.slice(0, 100))
                    )}
                  </ul>
                  {data.concatenatedData.length > 100 && (
                    <button
                      className="view-more-button"
                      onClick={() => handleExpansion(rowIndex)}
                    >
                      {isExpanded[rowIndex] ? 'View less' : 'View more'}
                    </button>
                  )}
                </td>
              </tr>
            )}
  
            {/* Children */}
            {data.concatenatedChildren && (
              <tr>
                <th>Children</th>
                <td>
                  <ul>
                    {isExpanded[rowIndex] || data.concatenatedChildren.length <= 100 ? (
                      renderClickableListItems(data.concatenatedChildren)
                    ) : (
                      renderClickableListItems(data.concatenatedChildren.slice(0, 100))
                    )}
                  </ul>
                  {data.concatenatedChildren.length > 100 && (
                    <button
                      className="view-more-button"
                      onClick={() => handleExpansion(rowIndex)}
                    >
                      {isExpanded[rowIndex] ? 'View less' : 'View more'}
                    </button>
                  )}
                </td>
              </tr>
            )}
  
            {/* Parents */}
            {data.concatenatedParents && (
              <tr>
                <th>Parents</th>
                <td>
                  <ul>
                    {isExpanded[rowIndex] || data.concatenatedParents.length <= 100 ? (
                      renderClickableListItems(data.concatenatedParents)
                    ) : (
                      renderClickableListItems(data.concatenatedParents.slice(0, 100))
                    )}
                  </ul>
                  {data.concatenatedParents.length > 100 && (
                    <button
                      className="view-more-button"
                      onClick={() => handleExpansion(rowIndex)}
                    >
                      {isExpanded[rowIndex] ? 'View less' : 'View more'}
                    </button>
                  )}
                </td>
              </tr>
            )}
  
            {/* Relatives */}
            {data.concatenatedRelatives && (
              <tr>
                <th>Relatives</th>
                <td>
                  <ul>
                    {isExpanded[rowIndex] || data.concatenatedRelatives.length <= 100 ? (
                      renderClickableListItems(data.concatenatedRelatives)
                    ) : (
                      renderClickableListItems(data.concatenatedRelatives.slice(0, 100))
                    )}
                  </ul>
                  {data.concatenatedRelatives.length > 100 && (
                    <button
                      className="view-more-button"
                      onClick={() => handleExpansion(rowIndex)}
                    >
                      {isExpanded[rowIndex] ? 'View less' : 'View more'}
                    </button>
                  )}
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    );
  };
  
  
  

  const handleInputChange = (selectedOption) => {
    setSelectedValue(selectedOption);
  };

  const handleRenderTable = () => {
    if (selectedValue) {
      setLoading(true);
      fetchData(selectedValue.value);
    }
  };

  const fetchData = async (selectedName) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/query_federated/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ person: selectedName }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Backend Response:', data);

        if (data && data.result && data.result.results && Array.isArray(data.result.results.bindings)) {
          setTableStack([...tableStack, renderTableData]); // Push current table data to stack

          setTableData(
            data.result.results.bindings.map(item => ({
              abstract: item.abstract?.value || '',
              death: item.death?.value || '',
              concatenatedData: item.concatenatedData?.value || '',
              concatenatedQuotes: item.concatenatedQuotes?.value || '',
              concatenatedChildren: item.concatenatedChildren?.value || '',
              concatenatedParents: item.concatenatedParents?.value || '',
              concatenatedRelatives: item.concatenatedRelatives?.value || ''
            }))
          );

          setShowTable(true);
        } else {
          console.error('Invalid backend response:', data);
        }
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetch('/Drop-down-data/Hadith Dropdowns/Mentions Hadith.txt')
      .then((response) => response.text())
      .then((data) => {
        const lines = data.split('\n');
        const mentionedPersons = lines.slice(1).map((line) => {
          const fullName = line.trim();
          return { value: fullName, label: fullName };
        });
        setMentionOptions(mentionedPersons);
        setFilteredMentions(mentionedPersons.slice(0, 8));
      })
      .catch((error) => {
        console.error('Error fetching mentioned persons:', error);
      });
  }, []);

  const handleMentionsInputChange = (inputValue) => {
    const filteredOptions = mentionOptions.filter(option =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredMentions(filteredOptions);
  };
  
  const handleLinkClick = async (clickedLink) => {
    try {
      // Scroll to the top of the page
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // You can change this to 'auto' if you don't want smooth scrolling
      });
  
      setLoading(true);
      const formattedLink = clickedLink.trim(); // Remove leading and trailing spaces
  
      const response = await fetch('http://127.0.0.1:8000/api/query_federated2/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ information: formattedLink }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Backend Response:', data);
  
        if (data && data.result && data.result.results && Array.isArray(data.result.results.bindings)) {
          setTableStack([...tableStack, currentTableData]); // Push current table data to stack

          setCurrentTableData(
            data.result.results.bindings.map(item => ({
              abstract: item.abstract?.value || '',
              death: item.death?.value || '',
              concatenatedData: item.concatenatedData?.value || '',
              concatenatedQuotes: item.concatenatedQuotes?.value || '',
              concatenatedChildren: item.concatenatedChildren?.value || '',
              concatenatedParents: item.concatenatedParents?.value || '',
              concatenatedRelatives: item.concatenatedRelatives?.value || ''
            }))
          );
  
          setShowTable(true);
  
        } else {
          console.error('Invalid backend response:', data);
        }
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleBackToPrevious = () => {
    const previousTable = tableStack.pop(); // Pop the previous table from stack
    if (previousTable) {
      setCurrentTableData(previousTable);
    }
  };


  const renderClickableLink = (item) => {
    // Check if the item contains "http://dbpedia.org/"
    const dbpediaIndex = item.indexOf('http://dbpedia.org/');
    const isClickable = dbpediaIndex !== -1;
  
    if (isClickable) {
      // Check if the link contains "/resource/" after "http://dbpedia.org/"
      const resourceIndex = item.indexOf('/resource/', dbpediaIndex);
      if (resourceIndex !== -1) {
        // If "/resource/" is found, render the link normally
        const resourceName = item.substring(resourceIndex + '/resource/'.length);
        return (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick(item);
            }}
            className="clickable-link"
          >
            {resourceName}
          </a>
        );
      } else {
        // If "/resource/" is not found, render the entire link as plain text
        const endIndex = item.indexOf(' ', dbpediaIndex); // Find the end of the link
        const truncatedLink = item.substring(dbpediaIndex, endIndex); // Extract the truncated link
        return (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick(item);
            }}
            className="clickable-link"
          >
            {truncatedLink}
          </a>
        );
      }
    }
  
    // If the item is not a valid link, render it as plain text
    return <span>{item}</span>;
  };
  
  
// Function to render clickable list items without extra empty <li> elements
const renderClickableListItems = (list) => {
  return list
    .split('\n')
    .filter((item) => item.trim() !== '') // Filter out empty items
    .map((item, index) => (
      <li key={index}>{renderClickableLink(item)}</li>
    ));
};

    return (
    <div>
      <div className="back-button-P" onClick={() => window.history.back()}>
        <img src={require('../../assets/back_button.png')} alt="Back Button" />
      </div>
      <div className={`query-text-box-P`}>
        <Select
          options={filteredMentions}
          value={selectedValue}
          onChange={handleInputChange}
          onInputChange={handleMentionsInputChange}
          isSearchable
          placeholder="Select or type to search..."
          className='custom-select'
        />
        <button onClick={handleRenderTable}>Learn About the Person</button>
      </div>

      {loading && (
        <div className="loader-container">
          <Loader type="Oval" color="#4639E3" height={40} width={40} />
        </div>
      )}

      {!loading && currentTableData.length > 0 && showTable  &&  (
        <div className="details-table-P">
          <button onClick={handleBackToPrevious} className="button-back">Back to Previous Results</button>

          <table>
            <tbody>
            {currentTableData.map((data, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {data.abstract && (
            <tr>
              <th>Abstract</th>
              <td>{data.abstract}</td>
            </tr>
          )}

          {data.concatenatedData && (
            <tr>
              <th>Wiki Links</th>
              <td>
                <ul>
                  {isExpanded[rowIndex] || data.concatenatedData.length <= 100 ? (
                    renderClickableListItems(data.concatenatedData)
                  ) : (
                    renderClickableListItems(data.concatenatedData.slice(0, 100))
                  )}
                </ul>
                {data.concatenatedData.length > 100 && (
                  <button
                    className="view-more-button"
                    onClick={() => handleExpansion(rowIndex)}
                  >
                    {isExpanded[rowIndex] ? 'View less' : 'View more'}
                  </button>
                )}
              </td>
            </tr>
          )}

          {data.concatenatedChildren && (
            <tr>
              <th>Children</th>
              <td>
                <ul>
                  {isExpanded[rowIndex] || data.concatenatedChildren.length <= 100 ? (
                    renderClickableListItems(data.concatenatedChildren)
                  ) : (
                    renderClickableListItems(data.concatenatedChildren.slice(0, 100))
                  )}
                </ul>
                {data.concatenatedChildren.length > 100 && (
                  <button
                    className="view-more-button"
                    onClick={() => handleExpansion(rowIndex)}
                  >
                    {isExpanded[rowIndex] ? 'View less' : 'View more'}
                  </button>
                )}
              </td>
            </tr>
          )}

          {data.concatenatedParents && (
            <tr>
              <th>Parents</th>
              <td>
                <ul>
                  {isExpanded[rowIndex] || data.concatenatedParents.length <= 100 ? (
                    renderClickableListItems(data.concatenatedParents)
                  ) : (
                    renderClickableListItems(data.concatenatedParents.slice(0, 100))
                  )}
                </ul>
                {data.concatenatedParents.length > 100 && (
                  <button
                    className="view-more-button"
                    onClick={() => handleExpansion(rowIndex)}
                  >
                    {isExpanded[rowIndex] ? 'View less' : 'View more'}
                  </button>
                )}
              </td>
            </tr>
          )}

          {data.concatenatedRelatives && (
            <tr>
              <th>Relatives</th>
              <td>
                <ul>
                  {isExpanded[rowIndex] || data.concatenatedRelatives.length <= 100 ? (
                    renderClickableListItems(data.concatenatedRelatives)
                  ) : (
                    renderClickableListItems(data.concatenatedRelatives.slice(0, 100))
                  )}
                </ul>
                {data.concatenatedRelatives.length > 100 && (
                  <button
                    className="view-more-button"
                    onClick={() => handleExpansion(rowIndex)}
                  >
                    {isExpanded[rowIndex] ? 'View less' : 'View more'}
                  </button>
                )}
              </td>
            </tr>
          )}
        </React.Fragment>
      ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !currentTableData.length && showTable && (
        <div className="details-table-P">
          <table>
            {renderTableData()}
          </table>
        </div>
      )}
    </div>
  );
};

export default People;
