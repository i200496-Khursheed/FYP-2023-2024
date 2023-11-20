import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './HadithQueryBuilder.css';

const themeOptions = [
  { value: 'lugha', label: 'lugha' },
  { value: 'kalam', label: 'kalam' },
  { value: 'science', label: 'science' },
];

const hadithNumberOptions = [
  { value: '134', label: 'Hadith 134' },
  { value: '135', label: 'Hadith 135' },
  { value: '136', label: 'Hadith 136' },
];

const narratorTitleOptions = [
  { value: 'sahabi', label: 'sahabi' },
  { value: 'rawi', label: 'rawi' },
  { value: 'any', label: 'any' },
];

const narratorNameOptions = [
  { value: 'ابن عباس', label: 'ابن عباس' },
  { value: 'عثمان بن سعيد', label: 'عثمان بن سعيد' },
  { value: 'أبو روق', label: 'أبو روق' },
];

const organizationOptions = [
  { value: 'org1', label: 'Organization 1' },
  { value: 'org2', label: 'Organization 2' },
];

const timeOptions = [
  { value: 'time1', label: 'Time 1' },
  { value: 'time2', label: 'Time 2' },
];

const placeOptions = [
  { value: 'place1', label: 'Place 1' },
  { value: 'place2', label: 'Place 2' },
];

const HadithQueryBuilder = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('hadith');
  
  const [data, setData] = useState({
    theme: '',
    hadith_number: '',
    narrators: [{ title: '', name: '' }],
    organization: '',
    time: '',
    place: '',
  });

  const handleRadioChange = (option) => {
    setSelectedOption(option);
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
  };

  const handleRemoveNarrator = (index) => {
    const updatedNarrators = data.narrators.filter((_, i) => i !== index);
    setData({
      ...data,
      narrators: updatedNarrators,
    });
  };

  const handleOrganizationChange = (selectedOption) => {
    setData({
      ...data,
      organization: selectedOption.value,
    });
  };

  const handleTimeChange = (selectedOption) => {
    setData({
      ...data,
      time: selectedOption.value,
    });
  };

  const handlePlaceChange = (selectedOption) => {
    setData({
      ...data,
      place: selectedOption.value,
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
    // Send all parameters to the backend as a JSON object
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((responseData) => {
      console.log('Success:', responseData);
      if (responseData.result) {
        console.log('Result from backend:', responseData.result);
        navigate('/hadith-query-results', { state: { resultsData: responseData.result } });
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
          <button className="add-button" onClick={handleAddNarrator}>
            + Add Narrator
          </button>
        </div>
        <div className="narrators">
          {data.narrators.map((narrator, index) => (
            <div key={index} className="narrator">
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
                <button className="remove-button" onClick={() => handleRemoveNarrator(index)}>
                  - Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="that-mentions">
          <div className="search-text">That Mentions:</div>
          <div className="dropdown">
            <label htmlFor="organization">Organization</label>
            <Select options={organizationOptions} isSearchable={true} onChange={handleOrganizationChange} />
          </div>
          <div className="dropdown">
            <label htmlFor="time">Time</label>
            <Select options={timeOptions} isSearchable={true} onChange={handleTimeChange} />
          </div>
          <div className="dropdown">
            <label htmlFor="place">Place</label>
            <Select options={placeOptions} isSearchable={true} onChange={handlePlaceChange} />
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
    </div>
  );
};

export default HadithQueryBuilder;
