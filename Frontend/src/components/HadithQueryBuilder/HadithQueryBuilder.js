//HadithQueryBuilder.js

import React, { useState } from 'react';
import Select from 'react-select';
import './HadithQueryBuilder.css';

const themeOptions = [
  { value: 'theme1', label: 'Theme 1' },
  { value: 'theme2', label: 'Theme 2' },
  { value: 'theme3', label: 'Theme 3' },
];

const narratorTitleOptions = [
  { value: 'title1', label: 'Title 1' },
  { value: 'title2', label: 'Title 2' },
  { value: 'title3', label: 'Title 3' },
];

const narratorNameOptions = [
  { value: 'name1', label: 'Name 1' },
  { value: 'name2', label: 'Name 2' },
  { value: 'name3', label: 'Name 3' },
];

const HadithQueryBuilder = () => {

  const [selectedOption, setSelectedOption] = useState('hadith');
  
  const handleRadioChange = (option) => {
    setSelectedOption(option);
  };

  const [data, setData] = useState({
    theme: '',
    narratortitle: '',
    narratorname: ''
  });

  const handleThemeChange = (selectedOption) => {
    setData({
      ...data,
      theme: selectedOption.value
    });
  };

  const handleTitleChange = (selectedOption) => {
    setData({
      ...data,
      narratortitle: selectedOption.value
    });
  };

  const handleNameChange = (selectedOption) => {
    setData({
      ...data,
      narratorname: selectedOption.value
    });
  };

  const SendDataToBackend = () => {
    fetch('http://127.0.0.1:8000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);

      // Redirect to HadithQueryResultsPage
      window.location.href = '/hadith-query-results';
    })
    
    .catch(error => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="hadith-query-builder">
      <div className="back-button">
        <img src={require('../../assets/back_button.png')} alt="Back Button" onClick={() => window.history.back()} />
      </div>
      <div className="radio-buttons">
        {/* (radio button code) */}
        <label className={`radio-button ${selectedOption === 'hadith' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="queryType"
            value="hadith"
            onChange={() => handleRadioChange('hadith')}
            checked={selectedOption === 'hadith'}
          />
          <span>Hadith</span>
        </label>
        <label className={`radio-button ${selectedOption === 'verse' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="queryType"
            value="verse"
            onChange={() => handleRadioChange('verse')}
            checked={selectedOption === 'verse'}
          />
          <span>Verse</span>
        </label>
        <label className={`radio-button ${selectedOption === 'commentary' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="queryType"
            value="commentary"
            onChange={() => handleRadioChange('commentary')}
            checked={selectedOption === 'commentary'}
          />
          <span>Commentary</span>
        </label>
      </div>

      <div className="query-box">
        <div className="search-text">Search for Hadith with:</div>
        <div className="dropdown">
          <label htmlFor="theme">Theme</label>
          <Select
            options={themeOptions}
            isSearchable={true}
            onChange={handleThemeChange}
          />
        </div>
        <div className="dropdown">
          <label htmlFor="narratorTitle">Narrator Title</label>
          <Select
            options={narratorTitleOptions}
            isSearchable={true}
            onChange={handleTitleChange}
          />
        </div>
        <div className="dropdown">
          <label htmlFor="narratorName">Narrator Name</label>
          <Select
            options={narratorNameOptions}
            isSearchable={true}
            onChange={handleNameChange}
          />
        </div>
        <div className="run-query-button">
            <button onClick={SendDataToBackend}>Send Data</button>
        </div>
      </div>
    </div>
  );
};

export default HadithQueryBuilder;
