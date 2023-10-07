// HadithQueryBuilder.js

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

function HadithQueryBuilder() {
  const [selectedOption, setSelectedOption] = useState('hadith');

  const handleRadioChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="hadith-query-builder">
      <div className="back-button" onClick={() => window.history.back()}>
        <img src={require('../../assets/back_button.png')} alt="Back Button" />
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
            onChange={(selectedOption) => console.log(selectedOption)}
          />
        </div>
        <div className="dropdown">
          <label htmlFor="narratorTitle">Narrator Title</label>
          <Select
            options={narratorTitleOptions}
            isSearchable={true}
            onChange={(selectedOption) => console.log(selectedOption)}
          />
        </div>
        <div className="dropdown">
          <label htmlFor="narratorName">Narrator Name</label>
          <Select
            options={narratorNameOptions}
            isSearchable={true}
            onChange={(selectedOption) => console.log(selectedOption)}
          />
       <div className="insert-logic-button">
          <button>+</button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default HadithQueryBuilder;
