//VerseQueryBuilder.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './VerseQueryBuilder.css';
import Footer from '../Footer/Footer'; // Import Footer component

// Verse Contents
const verseNumberOptions = [
  { value: '7', label: 'Verse 007' },
  { value: '6', label: 'Verse 006' },
  { value: '2', label: 'Verse 002' },
];

const surahNameOptions = [
  { value: 'الفاتحة', label: 'الفاتحة	' },
  { value: 'يونس', label: 'يونس' },
  { value: 'مريم', label: 'مريم ' },
];

const narratorTitleOptions = [
  { value: 'sahabi', label: 'sahabi' },
  { value: 'rawi', label: 'rawi' },
  { value: 'shaykh', label: 'shaykh' },
  { value: 'any', label: 'any' },
];

const VerseQueryBuilder = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('verse');
  const [data, setData] = useState({
    Surahname: '',
    Verseno: '',
    theme: '',
    narrators: [{ title: '', name: '' }],
    mentions: '',
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

  const handleMentionsChange = (selectedOption) => {
    setData({
      ...data,
      mentions: selectedOption.value,
    });
  };

  const handleSurahNameChange = (selectedOption) => {
    setData({
      ...data,
      Surahname: selectedOption.value,
    });
  };
  
  const handleVerseNumberChange = (selectedOption) => {
    setData({
      ...data,
      Verseno: selectedOption.value,
    });
  };

  // const SendDataToBackend = () => {
  //   let url = `http://127.0.0.1:8000/api/query_hadith/?theme=${data.theme}`;

  //   if (data.hadith_number) {
  //     url += `&hadith_number=${data.hadith_number}`;
  //   }

  //   if (data.organization) {
  //     url += `&organization=${data.organization}`;
  //   }

  //   if (data.time) {
  //     url += `&time=${data.time}`;
  //   }

  //   if (data.place) {
  //     url += `&place=${data.place}`;
  //   }

  //   fetch(url, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log('Success:', data);
  //       if (data.result) {
  //         console.log('Result from backend:', data.result);
  //         navigate('/verse-query-results', { state: { resultsData: data.result } });
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //     });
  // };


  const SendDataToBackend = () => {
    console.log("POST")
    const url = 'http://127.0.0.1:8000/api/query_verse/';

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

          navigate('/verse-query-results', { state: { resultsData: results } });
        } else {
          console.error('Results or bindings not found in response data.');
        }
      })
      .catch((error) => {
        //console.error('Error:', error);
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

// Fetch TXT
const [themeOptions, setThemeOptions] = useState([]);
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


//end

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
              <label htmlFor="Surahname">Surah Name</label>
              <Select options={surahNameOptions} isSearchable={true} onChange={handleSurahNameChange} />
            </div>
            <div className="dropdown-verse">
              <label htmlFor="Verseno">Ayat Number</label>
              <Select options={verseNumberOptions} isSearchable={true} onChange={handleVerseNumberChange} />
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
        <div className="that-mentions">
          <div className="search-text">That Mentions:</div>
          <div className="dropdown">
            <label htmlFor="mentions">Mentions</label>
            <Select options={mentionsOptions} isSearchable={true} onChange={handleMentionsChange} />
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
      <div className='Footer-portion'>
        <Footer />
      </div> 
    </div>
  );
};

export default VerseQueryBuilder;
