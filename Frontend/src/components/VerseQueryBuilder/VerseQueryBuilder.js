//VerseQueryBuilder.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './VerseQueryBuilder.css';
import Footer from '../Footer/Footer'; // Import Footer component
import { Oval as Loader } from 'react-loader-spinner';


// Verse Contents

const VerseQueryBuilder = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('verse');
  const [data, setData] = useState({
    chapterNo: '',
    verseNo: '',
    theme: '',
    //hadithTheme: '',
    narrator: [{ hadithTheme: '', name: '' }],
    reference: '',
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

  const handleHadithThemeChange = (selectedOption) => {
    setData({
      ...data,
      hadithTheme: selectedOption.value,
    });console.log("This is inside handle: ",data.hadithTheme)
  };

  const handleNarratorChange = (index, type, value) => {
    const updatedNarrators = [...data.narrator];
    const hadithTheme = value;
    updatedNarrators[index][type] = hadithTheme;
    setData({
      ...data,
      narrator: updatedNarrators,
    });
  };

 const handleAddNarrator = () => {
  setData((prevData) => ({
    ...prevData,
    narrator: [...prevData.narrator, { hadithTheme: '', name: '' }],
  }));

  setNarratorLogic((prevLogic) => [...prevLogic, 'AND']); // Initialize logic for the new narrator
};


  const handleRemoveNarrator = (index) => {
    const updatedNarrators = [...data.narrator];
    const updatedLogic = [...narratorLogic];
  
    updatedNarrators.splice(index, 1);
    updatedLogic.splice(index, 1);
  
    setData({
      ...data,
      narrator: updatedNarrators,
    });
  
    setNarratorLogic(updatedLogic);
  };

  const handleMentionsChange = (selectedOption) => {
    setData({
      ...data,
      reference: selectedOption.value,
    });
  };

  const handleChapterNoChange = (selectedOption) => {
    setData({
      ...data,
      chapterNo: selectedOption.value,
    });
  };
  
  const handleVerseNoChange = (selectedOption) => {
    setData({
      ...data,
      verseNo: selectedOption.value,
    });
  };

  const SendDataToBackend = () => {
    // Check if any field is selected
    if (
      data.chapterNo === '' &&
      data.verseNo === '' &&
      data.reference === '' &&
      data.theme === '' &&
      data.narrator.every((narrator) => narrator.hadithTheme === '' && narrator.name === '')
    ) {
      // If no field is selected, show alert
      alert('Please select at least one option');
      return;
    }
  
    // Include narrator logic in the JSON data
    const updatedNarrators = data.narrator.map((narrator, index) => ({
      ...narrator,
      narratorLogic: narratorLogic[index] // Include narrator logic for each narrator
    }));

    const requestData = {
      ...data,
      narrator: updatedNarrators, // Include updated narrators array with logic
      applyLimit: true,
      limit: limitValue
    };
  
    console.log("POST");
    console.log(data.hadithTheme); // Add this line
    const url = 'http://127.0.0.1:8000/api/query_verse/';
    setLoading(true);
  
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData), // Only include the relevant data in the request
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
      })
      .finally(() => {
        setLoading(false);
      });
  };
  

  const [loading, setLoading] = useState(false);

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
const [narratorLogic, setNarratorLogic] = useState(Array(data.narrator.length).fill('AND'));

const handleNarratorLogicChange = (index) => {
  setNarratorLogic((prevLogic) => {
    const updatedLogic = [...prevLogic];
    updatedLogic[index] = updatedLogic[index] === 'AND' ? 'OR' : 'AND';
    return updatedLogic;
  });
};


/* Verse Number Filter Selection */
const [verseNumberInputValue, setVerseNumberInputValue] = useState('');
const [filteredVerseNumbers, setFilteredVerseNumbers] = useState([]);

const handleVerseNumberInputChange = (inputValue) => {
  setVerseNumberInputValue(inputValue);
  const filteredOptions = verseNoOptions.filter((option) =>
    option.label.toLowerCase().startsWith(inputValue.toLowerCase())
  );
  setFilteredVerseNumbers(filteredOptions.slice(0, 11));
};

/* Chapter Number Filter Selection */
const [chapterNumberInputValue, setChapterNumberInputValue] = useState('');
const [filteredChapterNumbers, setFilteredChapterNumbers] = useState([]);

const handleChapterNumberInputChange = (inputValue) => {
  setChapterNumberInputValue(inputValue);
  const filteredOptions = chapterNoOptions.filter((option) =>
    option.label.toLowerCase().startsWith(inputValue.toLowerCase())
  );
  setFilteredChapterNumbers(filteredOptions.slice(0, 11));
};

/* Verse Commentary Theme Filter Selection */
const [themeInputValue, setThemeInputValue] = useState('');
const [filteredThemeOptions, setFilteredThemes] = useState([]);

const handleThemeInputChange = (inputValue) => {
  setThemeInputValue(inputValue);
  const filteredOptions = themeOptions.filter((option) =>
    option.label.toLowerCase().startsWith(inputValue.toLowerCase())
  );
  setFilteredThemes(filteredOptions.slice(0, 8));
};

/* Verse Mentions Filter Selection */
const [mentionsInputValue, setMentionsInputValue] = useState('');
const [filteredMentions, setFilteredMentions] = useState([]);

const handleMentionsInputChange = (inputValue) => {
  setMentionsInputValue(inputValue);
  const filteredOptions = mentionsOptions.filter((option) =>
    option.label.toLowerCase().startsWith(inputValue.toLowerCase())
  );
  setFilteredMentions(filteredOptions.slice(0, 8));
};

/* Verse Hadith Narrator Name Filter Selection */
const [narratorNameInputValue, setNarratorNameInputValue] = useState('');
const [filteredNarratorNames, setFilteredNarratorNames] = useState([]);

const handleNarratorNameInputChange = (inputValue) => {
  setNarratorNameInputValue(inputValue);
  const filteredOptions = narratorNameOptions.filter((option) =>
    option.label.toLowerCase().startsWith(inputValue.toLowerCase())
  );
  setFilteredNarratorNames(filteredOptions.slice(0, 8));
};

/* Verse Hadith Theme Filter Selection */
const [verseHadithThemeInputValue, setVerseHadithThemeInputValue] = useState('');
const [filteredVerseHadithThemeOptions, setFilteredVerseHadithThemes] = useState([]);

const handleVerseHadithThemeInputChange = (inputValue) => {
  setVerseHadithThemeInputValue(inputValue);
  const filteredOptions = hadithThemeOptions.filter((option) =>
    option.label.toLowerCase().startsWith(inputValue.toLowerCase())
  );
  setFilteredVerseHadithThemes(filteredOptions.slice(0, 8));
};

// Fetch TXT
const [verseNoOptions, setVerseNoOptions] = useState([]);

const [chapterNoOptions, setChapterNoOptions] = useState([]);
const [themeOptions, setThemeOptions] = useState([]);
const [narratorNameOptions, setNarratorNameOptions] = useState([]);
const [mentionsOptions, setMentionsOptions] = useState([]);

const [hadithThemeOptions, setHadithThemeOptions] = useState([]);

// VerseNo
useEffect(() => {
  fetch('/Drop-down-data/Verse Dropdowns/Verse Ayat Number.txt')
    .then((response) => response.text())
    .then((data) => {
      const verses = data
        .split('\n')
        .map((verse) => verse.trim())
        .filter((verse) => verse !== '') // Remove empty lines, if any
        .sort((a, b) => parseInt(a) - parseInt(b)) // Sort in ascending order
        .map((sortedVerse) => ({
          value: sortedVerse,
          label: sortedVerse,
        }));
      setVerseNoOptions(verses);
      setFilteredVerseNumbers(verses.slice(0, 11));
    })
    .catch((error) => {
      console.error('Error fetching and sorting verse numbers:', error);
    });
}, []);

// Chapter No
useEffect(() => {
  fetch('/Drop-down-data/Verse Dropdowns/Verse Surah Number.txt')
  .then((response) => response.text())
  .then((data) => {
    const chapters = data
      .split('\n')
      .map((chapter) => chapter.trim())
      .filter((chapter) => chapter !== '') // Remove empty lines, if any
      .sort((a, b) => parseInt(a) - parseInt(b)) // Sort in ascending order
      .map((sortedChapter) => ({
        value: sortedChapter,
        label: sortedChapter,
      }));
    setChapterNoOptions(chapters)
    setFilteredChapterNumbers(chapters.slice(0, 11));
  })
  .catch((error) => {
    console.error('Error fetching and sorting chapter numbers:', error);
  });
}, []);

// themes
useEffect(() => {
  // Fetch the text file from the public folder
  fetch('/Drop-down-data/Verse Dropdowns/Verse Commentary Themes.txt')
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
      setFilteredThemes(themes.slice(0, 8));

    })
    .catch((error) => {
      console.error('Error fetching themes:', error);
    });
}, []);

// hadithThemes
useEffect(() => {
  // Fetch the text file from the public folder
  fetch('/Drop-down-data/Verse Dropdowns/Verse Hadith Themes.txt')
    .then((response) => response.text())
    .then((data) => {
      // Split the file content by lines and start from line 2
      const hadithThemes = data.split('\n').map((hadithTheme) => {
        // Remove the leading colon from each theme
        const trimmedHadithTheme = hadithTheme.trim();
        const hadithThemeWithoutColon = trimmedHadithTheme.startsWith(':') ? trimmedHadithTheme.substring(1) : trimmedHadithTheme;
        return { value: hadithThemeWithoutColon, label: hadithThemeWithoutColon };
      });
      setHadithThemeOptions(hadithThemes);
      setFilteredVerseHadithThemes(hadithThemes.slice(0, 8));

    })
    .catch((error) => {
      console.error('Error fetching hadithThemes:', error);
    });
}, []);

// Narrators
useEffect(() => {
  // Fetch the text file from the public folder
  fetch('/Drop-down-data/Verse Dropdowns/Verse Hadith Narrator Names.txt')
    .then((response) => response.text())
    .then((data) => {
      // Split the file content by lines and start from line 2
      const narrator_name = data.split('\n').map((narrator_name) => {
        // Remove the leading colon from each narrator_name
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

// Fetch mentioned persons from the text file
useEffect(() => {
  fetch('/Drop-down-data/Verse Dropdowns/Verse Hadith Mentions.txt')
    .then((response) => response.text())
    .then((data) => {
      // Split the file content by lines
      const lines = data.split('\n');
      // Process each line to extract the full name
      const mentionedPersons = lines.map((line) => {
        const fullName = line.trim();
        return { value: fullName, label: fullName };
      });
      // Set the options in state
      setMentionsOptions(mentionedPersons);
      setFilteredMentions(mentionedPersons.slice(0, 8));

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
          <span> <p id="rH">Hadith</p> </span>
        </label>
        <label className={`radio-button-verse ${selectedOption === 'verse' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="queryType"
            value="verse"
            onChange={() => handleRadioChange('verse')}
            checked={selectedOption === 'verse'}
          />
          <span> <p id="rV">Verse</p> </span>
        </label>
        <label className={`radio-button-verse ${selectedOption === 'commentary' ? 'selected' : ''}`}>
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

      <div className="query-box-verse">
      <div className="search-text-verse">Search for Verse with:</div>
      <div className="dropdown-container-verse">
            <div className="dropdown-verse">
              <label htmlFor="chapterNo">Surah Number</label>
              <Select
              options={filteredChapterNumbers}
              inputValue={chapterNumberInputValue}
              isSearchable={true}
              onInputChange={handleChapterNumberInputChange}
              onChange={handleChapterNoChange}
            />                    
            </div>
            <div className="dropdown-verse">
              <label htmlFor="Verseno">Ayat Number</label>
              <Select
              options={filteredVerseNumbers}
              inputValue={verseNumberInputValue}
              isSearchable={true}
              onInputChange={handleVerseNumberInputChange}
              onChange={handleVerseNoChange}
            />             
            </div>

            <div className="dropdown-verse">
              <label htmlFor="theme">Where its commentary has Theme</label>
              <Select 
                options={filteredThemeOptions}
                inputValue={themeInputValue} 
                isSearchable={true} 
                onInputChange={handleThemeInputChange}
                onChange={handleThemeChange} 
              />
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
          {data.narrator.map((narrator, index) => (
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
                <label htmlFor={`hadithTheme${index}`}> Theme </label>
              <Select 
                options={filteredVerseHadithThemeOptions}
                inputValue={verseHadithThemeInputValue} 
                isSearchable={true} 
                onInputChange={handleVerseHadithThemeInputChange}
                onChange={(selectedOption) =>
                  handleNarratorChange(index, 'hadithTheme', selectedOption.value)
                }
              />
              </div>

              <div className="dropdown-verse">
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
            <Select 
              options={filteredMentions}
              inputValue={mentionsInputValue} 
              isSearchable={true} 
              onInputChange={handleMentionsInputChange}
              onChange={handleMentionsChange} 
            />
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
      {loading && (
      <div className="loader-container3">
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

export default VerseQueryBuilder;
