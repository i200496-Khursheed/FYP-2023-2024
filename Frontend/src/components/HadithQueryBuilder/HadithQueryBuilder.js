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

// const narratorTitleOptions = [
//   { value: 'sahabi', label: 'sahabi' },
//   { value: 'rawi', label: 'rawi' },
//   { value: 'any', label: 'any' },
// ];

// const narratorNameOptions = [
//   { value: 'ابن عباس', label: 'ابن عباس' },
//   { value: 'عثمان بن سعيد', label: 'عثمان بن سعيد' },
//   { value: 'أبو روق', label: 'أبو روق' },
// ];

const HadithQueryBuilder = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('hadith');
  const [data, setData] = useState({
    theme: '',
    hadith_number: '',
    narrator_title: '', // Initialize narrator_title
    narrator_name: '',  // Initialize narrator_name
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

  const handleNarratorTitleChange = (selectedOption) => {
    setData({
      ...data,
      narrator_title: selectedOption.value,
    });
  };

  const handleNarratorNameChange = (selectedOption) => {
    setData({
      ...data,
      narrator_name: selectedOption.value,
    });
  };

  const SendDataToBackend = () => {
    let url = `http://127.0.0.1:8000/api/query_hadith/?theme=${data.theme}`;

    if (data.hadith_number) {
      url += `&hadith_number=${data.hadith_number}`;
    }

    // Add narrator_title and narrator_name to the URL
    // if (data.narrator_title) {
    //   url += `&narrator_title=${data.narrator_title}`;
    // }

    // if (data.narrator_name) {
    //   url += `&narrator_name=${data.narrator_name}`;
    // }

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
          <span> <p>Hadith</p> </span>
        </label>
      </div>

      <div className="query-box">
        <div className="search-text">Search for Hadith with:</div>
        <div className="dropdown">
          <label htmlFor="theme">Theme</label>
          <Select options={themeOptions} isSearchable={true} onChange={handleThemeChange} />
        </div>
        <div className="dropdown">
          <label htmlFor="hadith_number">Hadith Number</label>
          <Select
            options={hadithNumberOptions}
            isSearchable={true}
            onChange={handleHadithNumberChange}
          />
        </div>
        {/* <div className="dropdown">
          <label htmlFor="narrator_title">Narrator Title</label>
          <Select
            options={narratorTitleOptions}
            isSearchable={true}
            onChange={handleNarratorTitleChange}
          />
        </div>
        <div className="dropdown">
          <label htmlFor="narrator_name">Narrator Name</label>
          <Select
            options={narratorNameOptions}
            isSearchable={true}
            onChange={handleNarratorNameChange}
          />
        </div> */}
        <div className="run-query-button">
          <button onClick={SendDataToBackend}>Run Query</button>
        </div>
      </div>
    </div>
  );
};

export default HadithQueryBuilder;
