import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './VerseQueryBuilder.css';

// Verse Contents
const ayatNumberOptions = [
  { value: '15', label: 'Verse 015' },
  { value: '6', label: 'Verse 006' },
  { value: '13', label: 'Verse 013' },
];

const surahNumberOptions = [
  { value: '12', label: 'يوسف 12' },
  { value: '10', label: 'يونس 10' },
  { value: '19', label: 'مريم 19' },
];

const themeOptions = [
  { value: 'lugha', label: 'lugha' },
  { value: 'kalam', label: 'kalam' },
  { value: 'science', label: 'science' },
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

const VerseQueryBuilder = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('verse');
  const [data, setData] = useState({
    surah_number: '',
    verse_number: '',
    theme: '',
    narrators: [{ title: '', name: '' }],
    organization: '',
    time: '',
    place: '',
  });

  const handleRadioChange = (option) => {
    setSelectedOption(option);
    switch (option) {
      case 'verse':
        navigate('/verse-query-builder');
        break;
      case 'hadith':
        navigate('/hadith-query-builder');
        break;
      case 'commentary':
        navigate('/commentary-query-builder');
        break;
      default:
        break;
    }
  };

  const handleThemeChange = (selectedOption) => {
    setData({
      ...data,
      theme: selectedOption.value,
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
  setData((prevData) => ({
    ...prevData,
    narrators: [...prevData.narrators, { title: '', name: '' }],
  }));

  setNarratorLogic((prevLogic) => [...prevLogic, 'AND']); // Initialize logic for the new narrator
};


  const handleRemoveNarrator = (index) => {
    const updatedNarrators = [...data.narrators];
    const updatedLogic = [...narratorLogic];
  
    updatedNarrators.splice(index, 1);
    updatedLogic.splice(index, 1);
  
    setData({
      ...data,
      narrators: updatedNarrators,
    });
  
    setNarratorLogic(updatedLogic);
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

  const handleSurahNumberChange = (selectedOption) => {
    setData({
      ...data,
      surah_number: selectedOption.value,
    });
  };
  
  const handleAyatNumberChange = (selectedOption) => {
    setData({
      ...data,
      verse_number: selectedOption.value,
    });
  };

  const SendDataToBackend = () => {
    let url = `http://127.0.0.1:8000/api/query_hadith/?theme=${data.theme}`;

    if (data.hadith_number) {
      url += `&hadith_number=${data.hadith_number}`;
    }

    if (data.organization) {
      url += `&organization=${data.organization}`;
    }

    if (data.time) {
      url += `&time=${data.time}`;
    }

    if (data.place) {
      url += `&place=${data.place}`;
    }

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
          navigate('/verse-query-results', { state: { resultsData: data.result } });
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

  return (
    <div className="verse-query-builder">
      <div className="back-button-verse">
        <img
          src={require('../../assets/back_button.png')}
          alt="Back Button"
          onClick={() => window.history.back()}
        />
      </div>
      <div className="radio-buttons-verse">
        <label className={`radio-button-verse ${selectedOption === 'hadith' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="queryType"
            value="hadith"
            onChange={() => handleRadioChange('hadith')}
            checked={selectedOption === 'hadith'}
          />
          <span> <p>Hadith</p> </span>
        </label>
        <label className={`radio-button-verse ${selectedOption === 'verse' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="queryType"
            value="verse"
            onChange={() => handleRadioChange('verse')}
            checked={selectedOption === 'verse'}
          />
          <span> <p>Verse</p> </span>
        </label>
        <label className={`radio-button-verse ${selectedOption === 'commentary' ? 'selected' : ''}`}>
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

      <div className="query-box-verse">
      <div className="search-text-verse">Search for Verse with:</div>
      <div className="dropdown-container-verse">
            <div className="dropdown-verse">
              <label htmlFor="surah_number">Surah Number</label>
              <Select options={surahNumberOptions} isSearchable={true} onChange={handleSurahNumberChange} />
            </div>
            <div className="dropdown-verse">
              <label htmlFor="ayat_number">Ayat Number</label>
              <Select options={ayatNumberOptions} isSearchable={true} onChange={handleAyatNumberChange} />
            </div>

            <div className="dropdown-verse">
              <label htmlFor="theme">Where its commentary has Theme</label>
              <Select options={themeOptions} isSearchable={true} onChange={handleThemeChange} />
            </div>
          </div>

          <div className="add-narrator-button-verse">
            <div className="add-content-verse" onClick={handleAddNarrator}>
              <img
                src={require('../../assets/add.png')} 
                alt="Add Narrator"
                className="add-image-verse"
              />
              <p id="add-narrator-text-verse">Add Condition</p>
            </div>
        </div>


        <div className="narrators-verse">
          {data.narrators.map((narrator, index) => (
            <div key={index} className="narrator-verse">
              <p> Where the verse is referenced by Hadith</p>
              <div className="narrator-logic-buttons-verse">
                <button
                  className={`logic-button-verse ${narratorLogic[index] === 'AND' ? 'selected' : ''}`}
                  onClick={() => handleNarratorLogicChange(index)}
                >
                  AND
                </button>
                <button
                  className={`logic-button-verse ${narratorLogic[index] === 'OR' ? 'selected' : ''}`}
                  onClick={() => handleNarratorLogicChange(index)}
                >
                  OR
                </button>
              </div>

              <div className="dropdown-verse">
                <label htmlFor={`theme_${index}`}>Theme</label>
                <Select
                  options={themeOptions}
                  isSearchable={true}
                  onChange={(selectedOption) =>
                    handleThemeChange(index, 'theme', selectedOption.value)
                  }
                />
              </div>

              <div className="dropdown-verse">
                <label htmlFor={`narrator_title_${index}`}>Narrator Title</label>
                <Select
                  options={narratorTitleOptions}
                  isSearchable={true}
                  onChange={(selectedOption) =>
                    handleNarratorChange(index, 'title', selectedOption.value)
                  }
                />
              </div>
              <div className="dropdown-verse">
                <label htmlFor={`narrator_name_${index}`}>Narrator Name</label>
                <Select
                  options={narratorNameOptions}
                  isSearchable={true}
                  onChange={(selectedOption) =>
                    handleNarratorChange(index, 'name', selectedOption.value)
                  }
                />
              </div>

              <div className="remove-narrator-button-verse">
                <img
                  src={require('../../assets/remove.png')} // Updated image path
                  alt="Remove Narrator"
                  className="remove-image-verse"
                  onClick={() => handleRemoveNarrator(index)}
                />
              </div>
              
            </div>
          ))}
        </div>
        <div className="that-mentions-verse">
          <div className="search-text-verse">That Mentions:</div>
          <div className="dropdown-verse">
            <label htmlFor="organization">Organization</label>
            <Select options={organizationOptions} isSearchable={true} onChange={handleOrganizationChange} />
          </div>
          <div className="dropdown-verse">
            <label htmlFor="time">Time</label>
            <Select options={timeOptions} isSearchable={true} onChange={handleTimeChange} />
          </div>
          <div className="dropdown-verse">
            <label htmlFor="place">Place</label>
            <Select options={placeOptions} isSearchable={true} onChange={handlePlaceChange} />
          </div>
        </div>
        <div className="run-query-button-verse">
          <button className="run-button" onClick={SendDataToBackend}>
            Run Query
          </button>
        </div>

        <div className="limit-results-box-verse">
          <label htmlFor="limit-results">Limit Search Results</label>
          <div className="limit-input-verse">
            <button className="decrement-verse" onClick={decrementValue}>-</button>
            <input
              type="number"
              id="limit-results"
              value={limitValue}
              onChange={(e) => setLimitValue(Math.max(0, parseInt(e.target.value)))}
            />
            <button className="increment-verse" onClick={incrementValue}>+</button>
          </div>
      </div>
      </div>
    </div>
  );
};

export default VerseQueryBuilder;
