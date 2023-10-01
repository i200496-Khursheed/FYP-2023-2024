import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HadithQueryBuilder.css';

function HadithQueryBuilder() {
  const [selectedOption, setSelectedOption] = useState('hadith'); // Set default to 'hadith'

  const handleRadioChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="hadith-query-builder">
      <Link to="/" className="back-button">
        <img src={require('../../assets/back_button.png')} alt="Back Button" />
      </Link>
      <div className="radio-buttons">
        <label className={`radio-button ${selectedOption === 'hadith' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="queryType"
            value="hadith"
            checked={selectedOption === 'hadith'} // Set checked attribute
            onChange={() => handleRadioChange('hadith')}
          />
          <span>Hadith</span>
        </label>
        <label className={`radio-button ${selectedOption === 'verse' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="queryType"
            value="verse"
            checked={selectedOption === 'verse'} // Set checked attribute
            onChange={() => handleRadioChange('verse')}
          />
          <span>Verse</span>
        </label>
        <label className={`radio-button ${selectedOption === 'commentary' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="queryType"
            value="commentary"
            checked={selectedOption === 'commentary'} // Set checked attribute
            onChange={() => handleRadioChange('commentary')}
          />
          <span>Commentary</span>
        </label>
      </div>
    </div>
  );
}

export default HadithQueryBuilder;
