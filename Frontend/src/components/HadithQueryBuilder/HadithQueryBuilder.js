//HadithQueryBuilder.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './HadithQueryBuilder.css';
import Footer from '../Footer/Footer';
import { Oval as Loader } from 'react-loader-spinner';

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
    mentions: '',
  });

  const [loading, setLoading] = useState(false);
  const [limitValue, setLimitValue] = useState(0);
  const [narratorLogic, setNarratorLogic] = useState(Array(data.narrators.length).fill('AND'));
  const [themeOptions, setThemeOptions] = useState([]);
  const [hadithNumberOptions, setHadithNumberOptions] = useState([]);
  const [narratorNameOptions, setNarratorNameOptions] = useState([]);
  const [mentionsOptions, setMentionsOptions] = useState([]);

  const MAX_LIMIT = 20000; // Example value

  /* Hadith Number Filter Selection */
  const [hadithNumberInputValue, setHadithNumberInputValue] = useState('');
  const [filteredHadithNumbers, setFilteredHadithNumbers] = useState([]);

  /* Hadith Themes Filter Selection */
  const [themeInputValue, setThemeInputValue] = useState('');
  const [filteredThemes, setFilteredThemes] = useState([]);

  /* Hadith Narrator Name Filter Selection */
  const [narratorNameInputValue, setNarratorNameInputValue] = useState('');
  const [filteredNarratorNames, setFilteredNarratorNames] = useState([]);

  /* Hadith Mentions Filter Selection */
  const [MentionsInputValue, setMentionsInputValue] = useState('');
  const [filteredMentions, setFilteredMentions] = useState([]);

  const handleRadioChange = (option) => {
    setSelectedOption(option);
    if (option === 'verse') {
      navigate('/verse-query-builder');
    } else if (option === 'commentary') {
      navigate('/commentary-query-builder');
    }
  };

  /* Theme */
  const handleThemeChange = (selectedOption) => {
    setData({
      ...data,
      theme: selectedOption.value,
    });
  };

  const handleThemeInputChange = (inputValue) => {
    setThemeInputValue(inputValue);
    const filteredOptions = themeOptions.filter((option) =>
      option.label.toLowerCase().startsWith(inputValue.toLowerCase())
    );
    setFilteredThemes(filteredOptions.slice(0, 8));
  };
  

  /* Hadith Number */
  const handleHadithNumberChange = (selectedOption) => {
    setData({
      ...data,
      hadith_number: selectedOption.value,
    });
  };

  const handleHadithNumberInputChange = (inputValue) => {
    setHadithNumberInputValue(inputValue);
    const filteredOptions = hadithNumberOptions.filter((option) =>
      option.label.toLowerCase().startsWith(inputValue.toLowerCase())
    );
    setFilteredHadithNumbers(filteredOptions.slice(0, 11));
  };

  /* Narrator Name */
  const handleNarratorChange = (index, type, value) => {
    const updatedNarrators = [...data.narrators];
    const title = value === 'any' ? '' : value;
    updatedNarrators[index][type] = title;
    setData({
      ...data,
      narrators: updatedNarrators,
    });
  };

  const handleNarratorNameInputChange = (inputValue) => {
    setNarratorNameInputValue(inputValue);
    const filteredOptions = narratorNameOptions.filter((option) =>
      option.label.toLowerCase().startsWith(inputValue.toLowerCase())
    );
    setFilteredNarratorNames(filteredOptions.slice(0, 8));
  };

  const handleAddNarrator = () => {
    setData({
      ...data,
      narrators: [...data.narrators, { title: '', name: '' }],
    });
    setNarratorLogic([...narratorLogic, 'AND']);
  };

  const handleRemoveNarrator = (index) => {
    const updatedNarrators = data.narrators.filter((_, i) => i !== index);
    setData({
      ...data,
      narrators: updatedNarrators,
    });
  };

  /* Mentons */
  const handleMentionsChange = (selectedOption) => {
    setData({
      ...data,
      mentions: selectedOption.value,
    });
  };

  const handleMentionsInputChange = (inputValue) => {
    setMentionsInputValue(inputValue);
    const filteredOptions = mentionsOptions.filter((option) =>
      option.label.toLowerCase().startsWith(inputValue.toLowerCase())
    );
    setFilteredMentions(filteredOptions.slice(0, 8));
  };

// Update the SendDataToBackend function to include the limit value in the JSON data
const SendDataToBackend = () => {
  // Check if any field is selected
  if (
    data.theme === '' &&
    data.hadith_number === '' &&
    data.narrators.every((narrator) => narrator.title === '' && narrator.name === '') &&
    data.mentions === ''
  ) {
    // If no field is selected, show alert
    alert('Please select at least one option');
    return;
  }

  // Include narrator logic in the JSON data
  const updatedNarrators = data.narrators.map((narrator, index) => ({
    ...narrator,
    narratorLogic: narratorLogic[index] // Include narrator logic for each narrator
  }));

  const requestData = {
    ...data,
    narrators: updatedNarrators, // Include updated narrators array with logic
    applyLimit: true,
    limit: limitValue
  };

  // Proceed with sending data to backend
  console.log('POST');
  const url = 'http://127.0.0.1:8000/api/query_hadith/';
  setLoading(true);
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })
  .then((response) => response.json())
  .then((responseData) => {
    console.log('Success:', responseData);
    if (
      responseData.result &&
      responseData.result.results &&
      responseData.result.results.bindings
    ) {
      const results = responseData.result.results.bindings;
      console.log('Results for new is :', results);
      navigate('/hadith-query-results', { state: { resultsData: results } });
    } else {
      console.error('Results or bindings not found in response data.');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  })
  .finally(() => {
    setLoading(false);
  });
};



  const incrementValue = () => {
    setLimitValue(Math.min(limitValue + 1, MAX_LIMIT));
  };

  const decrementValue = () => {
    setLimitValue(Math.max(limitValue - 1, 0));
  };

  useEffect(() => {
    fetch('/Drop-down-data/Hadith Dropdowns/Hadith Themes.txt')
      .then((response) => response.text())
      .then((data) => {
        const themes = data.split('\n').slice(1).map((theme) => {
          const trimmedTheme = theme.trim();
          const themeWithoutColon = trimmedTheme.startsWith(':') ? trimmedTheme.substring(1) : trimmedTheme;
          return { value: themeWithoutColon, label: themeWithoutColon };
        });
        setThemeOptions(themes);
        setFilteredThemes(themes.slice(0, 8));
      })
      .catch((error) => {
        console.error('Error fetching themes:', error);
      });
  }, []);

  useEffect(() => {
    fetch('/Drop-down-data/Hadith Dropdowns/Hadith Numbers.txt')
      .then((response) => response.text())
      .then((data) => {
        const hadith_number = data.split('\n').slice(1).map((hadith_number) => {
          const trimmedHadithNumber = hadith_number.trim();
          const hadithNumberWithoutColon = trimmedHadithNumber.startsWith(':') ? trimmedHadithNumber.substring(1) : trimmedHadithNumber;
          return { value: hadithNumberWithoutColon, label: hadithNumberWithoutColon };
        });
        setHadithNumberOptions(hadith_number);
        setFilteredHadithNumbers(hadith_number.slice(0, 11));
      })
      .catch((error) => {
        console.error('Error fetching hadith number:', error);
      });
  }, []);

  useEffect(() => {
    fetch('/Drop-down-data/Hadith Dropdowns/Hadith Narrator Names.txt')
      .then((response) => response.text())
      .then((data) => {
        const narrator_name = data.split('\n').slice(1).map((narrator_name) => {
          const trimmedNarratorName = narrator_name.trim();
          const narratorNameWithoutColon = trimmedNarratorName.startsWith(':') ? trimmedNarratorName.substring(1) : trimmedNarratorName;
          return { value: narratorNameWithoutColon, label: narratorNameWithoutColon };
        });
        setNarratorNameOptions(narrator_name);
        setFilteredNarratorNames(narrator_name.slice(0, 8));
      })
      .catch((error) => {
        console.error('Error fetching narrator name:', error);
      });
  }, []);

  useEffect(() => {
    fetch('/Drop-down-data/Hadith Dropdowns/Mentions Hadith.txt')
      .then((response) => response.text())
      .then((data) => {
        const lines = data.split('\n');
        const mentionedPersons = lines.slice(1).map((line) => {
          const fullName = line.trim();
          return { value: fullName, label: fullName };
        });
        setMentionsOptions(mentionedPersons);
        setFilteredMentions(mentionedPersons.slice(0, 8));
      })
      .catch((error) => {
        console.error('Error fetching mentioned persons:', error);
      });
  }, []);


  const handleNarratorLogicChange = (index, logic) => {
    const updatedLogic = [...narratorLogic];
    updatedLogic[index] = logic;
    setNarratorLogic(updatedLogic);
  };
  
  
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
        <span> <p id="rH">Hadith</p> </span>
      </label>
      <label className={`radio-button ${selectedOption === 'verse' ? 'selected' : ''}`}>
        <input
          type="radio"
          name="queryType"
          value="verse"
          onChange={() => handleRadioChange('verse')}
          checked={selectedOption === 'verse'}
        />
        <span> <p id="rV">Verse</p> </span>
      </label>
      <label className={`radio-button ${selectedOption === 'commentary' ? 'selected' : ''}`}>
        <input
          type="radio"
          name="queryType"
          value="commentary"
          onChange={() => handleRadioChange('commentary')}
          checked={selectedOption === 'commentary'}
        />
        <span> <p id="rC">Commentary</p> </span>
      </label>
    </div>

    <div className="query-box">
      <div className="search-text">Search for Hadith with:</div>
      <div className="dropdown-container">
          <div className="dropdown">
            <label htmlFor="theme">Theme</label>
            <Select
              options={filteredThemes}
              inputValue={themeInputValue}
              isSearchable={true}
              onInputChange={handleThemeInputChange}
              onChange={handleThemeChange}
            />          
          </div>
          <div className="dropdown">
            <label htmlFor="hadith_number">Hadith Number</label>
            <Select
              options={filteredHadithNumbers}
              inputValue={hadithNumberInputValue}
              isSearchable={true}
              onInputChange={handleHadithNumberInputChange}
              onChange={handleHadithNumberChange}
            />
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
                onClick={() => handleNarratorLogicChange(index, 'AND')}
              >
                AND
              </button>
              <button
                className={`logic-button ${narratorLogic[index] === 'OR' ? 'selected' : ''}`}
                onClick={() => handleNarratorLogicChange(index, 'OR')}
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
                options={filteredNarratorNames}
                inputValue={narratorNameInputValue}
                isSearchable={true}
                onInputChange={handleNarratorNameInputChange}
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
          <Select
              options={filteredMentions}
              inputValue={MentionsInputValue}
              isSearchable={true}
              onInputChange={handleMentionsInputChange}
              onChange={handleMentionsChange}
            />        
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
    
    {loading && (
      <div className="loader-container2">
        <Loader type="Oval" color="#4639E3" height={40} width={40} />
      </div>
    )}

    </div>

    <div className='Footer-portion'>
        <Footer />
    </div>
    
  </div>
);
  
};

export default HadithQueryBuilder;
