// HadithQueryBuilder.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './HadithQueryBuilder.css';

const themeOptions = [
  { value: 'lugha', label: 'lugha' },
  { value: 'theme2', label: 'Theme 2' },
  { value: 'theme3', label: 'Theme 3' },
];

const HadithQueryBuilder = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('hadith');
  const [data, setData] = useState({
    theme: '',
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

  const SendDataToBackend = () => {
    const url = `http://127.0.0.1:8000/api/query_hadith/?theme=${data.theme}`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        if (data.result) {
          console.log('Result from backend:', data.result);
          // Navigate to HadithQueryResultsPage and pass data as state
          navigate('/hadith-query-results', { state: { resultsData: data.result } });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

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
          <span>Hadith</span>
        </label>
      </div>

      <div className="query-box">
        <div className="search-text">Search for Hadith with:</div>
        <div className="dropdown">
          <label htmlFor="theme">Theme</label>
          <Select options={themeOptions} isSearchable={true} onChange={handleThemeChange} />
        </div>
        <div className="run-query-button">
          <button onClick={SendDataToBackend}>Run Query</button>
        </div>
      </div>
    </div>
  );
};

export default HadithQueryBuilder;