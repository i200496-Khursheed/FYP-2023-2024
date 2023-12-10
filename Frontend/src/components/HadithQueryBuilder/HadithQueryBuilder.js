//HadithQueryBuilder.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './HadithQueryBuilder.css';
import Footer from '../Footer/Footer'; // Import Footer component


const narratorTitleOptions = [
  { value: 'sahabi', label: 'sahabi' },
  { value: 'rawi', label: 'rawi' },
  { value: 'shaykh', label: 'shaykh' },
  { value: 'any', label: 'any' },
];

const HadithQueryBuilder = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('hadith');
  
  const [data, setData] = useState({
    theme: '',
    hadith_number: '',
    narrators: [{ title: '', name: '' }],
    mentions: '', // Combined field for person, organization, time
  });

  const handleRadioChange = (option) => {
    setSelectedOption(option);

    // Navigate based on the selected radio button
    if (option === 'verse') {
      navigate('/verse-query-builder');
    } else if (option === 'commentary') {
      navigate('/commentary-query-builder');
    }
  };

  const handleThemeChange = (selectedOption) => {
    setData({
      ...data,
      theme: selectedOption.value,
    });
  };

  const handleHadithNumberChange = (selectedOption) => {
    setData({
      ...data,
      hadith_number: selectedOption.value,
    });
  };

  const handleNarratorChange = (index, type, value) => {
    const updatedNarrators = [...data.narrators];
    updatedNarrators[index][type] = value;
    setData({
      ...data,
      narrators: updatedNarrators,
    });
  };

  const handleAddNarrator = () => {
    setData({
      ...data,
      narrators: [...data.narrators, { title: '', name: '' }],
    });
  
    setNarratorLogic([...narratorLogic, 'AND']); // Add 'AND' for the new narrator
  };
  

  const handleRemoveNarrator = (index) => {
    const updatedNarrators = data.narrators.filter((_, i) => i !== index);
    setData({
      ...data,
      narrators: updatedNarrators,
    });
  };

  // Remove individual handlers
const handleMentionsChange = (selectedOption) => {
  setData({
    ...data,
    mentions: selectedOption.value,
  });
};

  // const SendDataToBackend = () => {
  //   // Extract individual data properties
  //   const { theme, hadith_number, organization, time, place } = data;
  
  //   // Create an object containing only the non-empty parameters
  //   const queryParams = {
  //     theme,
  //     hadith_number,
  //     organization,
  //     time,
  //     place,
  //   };
  
  //   // Filter out undefined or empty values
  //   const filteredParams = Object.fromEntries(
  //     Object.entries(queryParams).filter(([key, value]) => value !== undefined && value !== '')
  //   );
  
  //   // Construct the URL by appending filtered parameters
  //   const url = `http://127.0.0.1:8000/api/query_hadith/?${new URLSearchParams(filteredParams).toString()}`;
  
  //   fetch(url, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((responseData) => {
  //       console.log('Success:', responseData);
  //       if (responseData.result) {
  //         console.log('Result from backend:', responseData.result);
  //         navigate('/hadith-query-results', { state: { resultsData: responseData.result } });
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //     });
  // };
 
// Frontend.js

const SendDataToBackend = () => {
  console.log('POST')
  const url = 'http://127.0.0.1:8000/api/query_hadith/';

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((responseData) => {
      console.log('Success:', responseData);

      if (responseData.result && responseData.result.results && responseData.result.results.bindings) {
        const results = responseData.result.results.bindings;
        console.log('Results:', results);

        navigate('/hadith-query-results', { state: { resultsData: results } });
      } else {
        console.error('Results or bindings not found in response data.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

  

const [limitValue, setLimitValue] = useState(0);

const incrementValue = () => {
  setLimitValue(Math.min(limitValue + 1, MAX_LIMIT));
};

const decrementValue = () => {
  setLimitValue(Math.max(limitValue - 1, 0));
};

// Define MAX_LIMIT constant if needed
const MAX_LIMIT = 2000; // Example value

// Logic Gates
const [narratorLogic, setNarratorLogic] = useState(Array(data.narrators.length).fill('AND'));

const handleNarratorLogicChange = (index) => {
  setNarratorLogic((prevLogic) => {
    const updatedLogic = [...prevLogic];
    updatedLogic[index] = updatedLogic[index] === 'AND' ? 'OR' : 'AND';
    return updatedLogic;
  });
};

// Fetch from txt
const [themeOptions, setThemeOptions] = useState([]);
const [hadithNumberOptions, setHadithNumberOptions] = useState([]);
const [narratorNameOptions, setNarratorNameOptions] = useState([]);
const [mentionsOptions, setMentionsOptions] = useState([]);


// themes
useEffect(() => {
  // Fetch the text file from the public folder
  fetch('/Drop-down-data/THEMES OF HADITH.txt')
    .then((response) => response.text())
    .then((data) => {
      // Split the file content by lines and start from line 2
      const themes = data.split('\n').slice(1).map((theme) => {
        // Remove the leading colon from each theme
        const trimmedTheme = theme.trim();
        const themeWithoutColon = trimmedTheme.startsWith(':') ? trimmedTheme.substring(1) : trimmedTheme;
        return { value: themeWithoutColon, label: themeWithoutColon };
      });
      setThemeOptions(themes);
    })
    .catch((error) => {
      console.error('Error fetching themes:', error);
    });
}, []);

// Hadith Number
useEffect(() => {
  // Fetch the text file from the public folder
  fetch('/Drop-down-data/hadith-no.txt')
    .then((response) => response.text())
    .then((data) => {
      // Split the file content by lines and start from line 2
      const hadith_number = data.split('\n').slice(1).map((hadith_number) => {
        // Remove the leading colon from each hadith_number
        const trimmedHadithNumber = hadith_number.trim();
        const hadithNumberWithoutColon = trimmedHadithNumber.startsWith(':') ? trimmedHadithNumber.substring(1) : trimmedHadithNumber;
        return { value: hadithNumberWithoutColon, label: hadithNumberWithoutColon };
      });
      setHadithNumberOptions(hadith_number);
    })
    .catch((error) => {
      console.error('Error fetching hadith number:', error);
    });
}, []);

// Narrators
useEffect(() => {
  // Fetch the text file from the public folder
  fetch('/Drop-down-data/narrators.txt')
    .then((response) => response.text())
    .then((data) => {
      // Split the file content by lines and start from line 2
      const narrator_name = data.split('\n').slice(1).map((narrator_name) => {
        // Remove the leading colon from each narrator_name
        const trimmedNarratorName = narrator_name.trim();
        const narratorNameWithoutColon = trimmedNarratorName.startsWith(':') ? trimmedNarratorName.substring(1) : trimmedNarratorName;
        return { value: narratorNameWithoutColon, label: narratorNameWithoutColon };
      });
      setNarratorNameOptions(narrator_name);
    })
    .catch((error) => {
      console.error('Error fetching narrator name:', error);
    });
}, []);

// Fetch mentioned persons from the text file
useEffect(() => {
  fetch('/Drop-down-data/mentioned persons.txt')
    .then((response) => response.text())
    .then((data) => {
      // Split the file content by lines
      const lines = data.split('\n');
      // Process each line to extract Arabic text and type
      const mentionedPersons = lines.map((line) => {
        const [text, type] = line.split(/\s+/);
        return { text, type };
      });
      // Create options with combined text and type for display
      const mentionsOption = mentionedPersons.map((person) => ({
        value: person.text,
        label: `${person.text} ${person.type}`, // Combined text and type
      }));
      // Set the options in state
      setMentionsOptions(mentionsOption);
    })
    .catch((error) => {
      console.error('Error fetching mentioned persons:', error);
    });
}, []);

// end

return (
  <div className="hadith-query-builder">
    <div className="back-button">
      <img
        src={require('../../assets/back_button.png')}
        alt="Back Button"
        onClick={() => window.history.back()}
      />
    </div>
    <div className="radio-buttons">
      <label className={`radio-button ${selectedOption === 'hadith' ? 'selected' : ''}`}>
        <input
          type="radio"
          name="queryType"
          value="hadith"
          onChange={() => handleRadioChange('hadith')}
          checked={selectedOption === 'hadith'}
        />
        <span> <p>Hadith</p> </span>
      </label>
      <label className={`radio-button ${selectedOption === 'verse' ? 'selected' : ''}`}>
        <input
          type="radio"
          name="queryType"
          value="verse"
          onChange={() => handleRadioChange('verse')}
          checked={selectedOption === 'verse'}
        />
        <span> <p>Verse</p> </span>
      </label>
      <label className={`radio-button ${selectedOption === 'commentary' ? 'selected' : ''}`}>
        <input
          type="radio"
          name="queryType"
          value="commentary"
          onChange={() => handleRadioChange('commentary')}
          checked={selectedOption === 'commentary'}
        />
        <span> <p>Commentary</p> </span>
      </label>
    </div>

    <div className="query-box">
      <div className="search-text">Search for Hadith with:</div>
      <div className="dropdown-container">
          <div className="dropdown">
            <label htmlFor="theme">Theme</label>
            <Select options={themeOptions} isSearchable={true} onChange={handleThemeChange} />
          </div>
          <div className="dropdown">
            <label htmlFor="hadith_number">Hadith Number</label>
            <Select options={hadithNumberOptions} isSearchable={true} onChange={handleHadithNumberChange} />
          </div>
        </div>

        <div className="add-narrator-button">
          <div className="add-content" onClick={handleAddNarrator}>
            <img
              src={require('../../assets/add.png')} 
              alt="Add Narrator"
              className="add-image"
            />
            <p id="add-narrator-text">Add Narrator</p>
          </div>
      </div>


      <div className="narrators">
        {data.narrators.map((narrator, index) => (
          <div key={index} className="narrator">

            <div className="narrator-logic-buttons">
              <button
                className={`logic-button ${narratorLogic[index] === 'AND' ? 'selected' : ''}`}
                onClick={() => handleNarratorLogicChange(index)}
              >
                AND
              </button>
              <button
                className={`logic-button ${narratorLogic[index] === 'OR' ? 'selected' : ''}`}
                onClick={() => handleNarratorLogicChange(index)}
              >
                OR
              </button>
            </div>

            <div className="dropdown">
              <label htmlFor={`narrator_title_${index}`}>Narrator Title</label>
              <Select
                options={narratorTitleOptions}
                isSearchable={true}
                onChange={(selectedOption) =>
                  handleNarratorChange(index, 'title', selectedOption.value)
                }
              />
            </div>
            <div className="dropdown">
              <label htmlFor={`narrator_name_${index}`}>Narrator Name</label>
              <Select
                options={narratorNameOptions}
                isSearchable={true}
                onChange={(selectedOption) =>
                  handleNarratorChange(index, 'name', selectedOption.value)
                }
              />
            </div>

            <div className="remove-narrator-button">
              <img
                src={require('../../assets/remove.png')} // Updated image path
                alt="Remove Narrator"
                className="remove-image"
                onClick={() => handleRemoveNarrator(index)}
              />
            </div>
            
          </div>
        ))}
      </div>
      <div className="that-mentions">
        <div className="search-text">That Mentions:</div>
        <div className="dropdown">
          <label htmlFor="mentions">Mentions</label>
          <Select options={mentionsOptions} isSearchable={true} onChange={handleMentionsChange} />
        </div>
      </div>
      <div className="run-query-button">
        <button className="run-button" onClick={SendDataToBackend}>
          Run Query
        </button>
      </div>

      <div className="limit-results-box">
        <label htmlFor="limit-results">Limit Search Results</label>
        <div className="limit-input">
          <button className="decrement" onClick={decrementValue}>-</button>
          <input
            type="number"
            id="limit-results"
            value={limitValue}
            onChange={(e) => setLimitValue(Math.max(0, parseInt(e.target.value)))}
          />
          <button className="increment" onClick={incrementValue}>+</button>
        </div>
    </div>
    </div>

    <div className='Footer-portion'>
        <Footer />
    </div>
    
  </div>
);
  
};

export default HadithQueryBuilder;
