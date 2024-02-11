import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './CommentaryQueryBuilder.css';
import Footer from '../Footer/Footer'; // Import Footer component

const CommentaryQueryBuilder = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('commentary');
  const [data, setData] = useState({
    commno: '',
    chapterNo: '',
    verseNo: '',
    theme: '',
    subtheme: '',
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

  const handleSubThemeChange = (selectedOption) => {
    setData({
      ...data,
      subtheme: selectedOption.value,
    });
  };
  
  const handleMentionsChange = (selectedOption) => {
    setData({
      ...data,
      mentions: selectedOption.value,
    });
  };

  const handleChapterNoChange = (selectedOption) => {
    setData({
      ...data,
      chapterNo: selectedOption.value,
    });
  };

  const handleCommentaryNoChange = (selectedOption) => {
    setData({
      ...data,
      commno: selectedOption.value,
    });
  };
  
  const handleVerseNoChange = (selectedOption) => {
    setData({
      ...data,
      verseNo: selectedOption.value,
    });
  };

  const SendDataToBackend = () => {
    console.log("POST")
    const url = 'http://127.0.0.1:8000/api/query_commentary/';
    
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

          navigate('/commentary-query-results', { state: { resultsData: results } });
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

/* Commentary Number Filter Selection */
const [commentaryNumberInputValue, setCommentaryNumberInputValue] = useState('');
const [filteredCommentaryNumbers, setFilteredCommentaryNumbers] = useState([]);

const handleCommentaryNumberInputChange = (inputValue) => {
  setCommentaryNumberInputValue(inputValue);
  const filteredOptions = commentaryNoOptions.filter((option) =>
    option.label.toLowerCase().startsWith(inputValue.toLowerCase())
  );
  setFilteredCommentaryNumbers(filteredOptions.slice(0, 11));
};

/* Commentary Theme Filter Selection */
const [themeInputValue, setThemeInputValue] = useState('');
const [filteredThemes, setFilteredThemes] = useState([]);

const handleThemeInputChange = (inputValue) => {
  setThemeInputValue(inputValue);
  const filteredOptions = themeOptions.filter((option) =>
    option.label.toLowerCase().startsWith(inputValue.toLowerCase())
  );
  setFilteredThemes(filteredOptions.slice(0, 8));
};

/* Commentary Sub-Theme Filter Selection */
const [subThemeInputValue, setSubThemeInputValue] = useState('');
const [filteredSubThemes, setFilteredSubThemes] = useState([]);

const handleSubThemeInputChange = (inputValue) => {
  setSubThemeInputValue(inputValue);
  const filteredOptions = subThemeOptions.filter((option) =>
    option.label.toLowerCase().startsWith(inputValue.toLowerCase())
  );
  setFilteredSubThemes(filteredOptions.slice(0, 8));
};

/* Commentary Mentions Filter Selection */
const [mentionsInputValue, setMentionsInputValue] = useState('');
const [filteredMentions, setFilteredMentions] = useState([]);

const handleMentionsInputChange = (inputValue) => {
  setMentionsInputValue(inputValue);
  const filteredOptions = mentionsOptions.filter((option) =>
    option.label.toLowerCase().startsWith(inputValue.toLowerCase())
  );
  setFilteredMentions(filteredOptions.slice(0, 8));
};

/* Commentary Surah Number Filter Selection */
const [chapterNumberInputValue, setChapterNumberInputValue] = useState('');
const [filteredChapterNumber, setFilteredChapterNumber] = useState([]);

const handleChapterNumberInputChange = (inputValue) => {
  setChapterNumberInputValue(inputValue);
  const filteredOptions = chapterNoOptions.filter((option) =>
    option.label.toLowerCase().startsWith(inputValue.toLowerCase())
  );
  setFilteredChapterNumber(filteredOptions.slice(0, 11));
};

/* Commentary Ayat Number Filter Selection */
const [verseNumberInputValue, setVerseNumberInputValue] = useState('');
const [filteredVerseNumber, setFilteredVerseNumber] = useState([]);

const handleVerseNumberInputChange = (inputValue) => {
  setVerseNumberInputValue(inputValue);
  const filteredOptions = verseNoOptions.filter((option) =>
    option.label.toLowerCase().startsWith(inputValue.toLowerCase())
  );
  setFilteredVerseNumber(filteredOptions.slice(0, 11));
};

// Fetch from txt
const [commentaryNoOptions, setCommentaryNoOptions] = useState([]);

const [chapterNoOptions, setChapterNoOptions] = useState([]);

const [verseNoOptions, setVerseNoOptions] = useState([]);
const [themeOptions, setThemeOptions] = useState([]);
const [mentionsOptions, setMentionsOptions] = useState([]);
const [subThemeOptions, setSubThemeOptions] = useState([]);

// Commentary Number
useEffect(() => {
  fetch('/Drop-down-data/Commentary Dropdowns/Commentary No.txt')
    .then((response) => response.text())
    .then((data) => {
      const comms = data
        .split('\n')
        .map((commentaryNo) => commentaryNo.trim())
        .filter((commentaryNo) => commentaryNo !== '') // Remove empty lines, if any
        .sort((a, b) => parseInt(a) - parseInt(b)) // Sort in ascending order
        .map((sortedCommentaryNo) => ({
          value: sortedCommentaryNo,
          label: sortedCommentaryNo,
        }));
      setCommentaryNoOptions(comms);
      setFilteredCommentaryNumbers(comms.slice(0, 11));
    })
    .catch((error) => {
      console.error('Error fetching and sorting commentary numbers:', error);
    });
}, []);

// Chapter No
useEffect(() => {
  // Fetch the text file from the public folder
  fetch('/Drop-down-data/Commentary Dropdowns/Commentary Surah Number.txt')
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
        setChapterNoOptions(chapters);
        setFilteredChapterNumber(chapters.slice(0, 11));
    })
    .catch((error) => {
      console.error('Error fetching chapterNo:', error);
    });
}, []);

// VerseNo
useEffect(() => {
  fetch('/Drop-down-data/Commentary Dropdowns/Commentary Ayat Number.txt')
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
      setFilteredVerseNumber(chapters.slice(0, 11));
    })
    .catch((error) => {
      console.error('Error fetching and sorting verse numbers:', error);
    });
}, []);

// themes
useEffect(() => {
  // Fetch the text file from the public folder
  fetch('/Drop-down-data/Commentary Dropdowns/Commentary Theme.txt')
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
      setFilteredThemes(chapters.slice(0, 8));
    })
    .catch((error) => {
      console.error('Error fetching themes:', error);
    });
}, []);

// Fetch mentioned persons from the text file
useEffect(() => {
  fetch('/Drop-down-data/Commentary Dropdowns/Commentary Mentions.txt')
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
      setFilteredMentions(chapters.slice(0, 8));

    })
    .catch((error) => {
      console.error('Error fetching mentioned persons:', error);
    });
}, []);

// Fetch sub theme from the text file
useEffect(() => {
  fetch('/Drop-down-data/Commentary Dropdowns/Commentary Sub-themes.txt')
    .then((response) => response.text())
    .then((data) => {
      // Split the file content by lines
      const lines = data.split('\n');
      // Process each line to extract the full name
      const subthemes = lines.map((line) => {
        const subtheme = line.trim();
        return { value: subtheme, label: subtheme };
      });
      // Set the options in state
      setSubThemeOptions(subthemes);
      setFilteredSubThemes(chapters.slice(0, 8));

    })
    .catch((error) => {
      console.error('Error fetching sub themes:', error);
    });
}, []);

//end

  return (
    <div className="commentary-query-builder">
      <div className="back-button-commentary">
        <img
          src={require('../../assets/back_button.png')}
          alt="Back Button"
          onClick={() => window.history.back()}
        />
      </div>
      
      <div className="radio-buttons-commentary">
        
        <label className={`radio-button-commentary ${selectedOption === 'hadith' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="queryType"
            value="hadith"
            onChange={() => handleRadioChange('hadith')}
            checked={selectedOption === 'hadith'}
          />
          <span> <p>Hadith</p> </span>
        </label>
        <label className={`radio-button-commentary ${selectedOption === 'verse' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="queryType"
            value="verse"
            onChange={() => handleRadioChange('verse')}
            checked={selectedOption === 'verse'}
          />
          <span> <p>Verse</p> </span>
        </label>
        <label className={`radio-button-commentary ${selectedOption === 'commentary' ? 'selected' : ''}`}>
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

      <div className="query-box-commentary">
      <div className="search-text-commentary">Find Commentary About:</div>
      <div className="dropdown-container-commentary">
        <div className="dropdown-commentary">
            <label htmlFor="surah_number">Commentary Number</label>
            <Select 
              options={filteredCommentaryNumbers}
              inputValue={commentaryNumberInputValue} 
              isSearchable={true} 
              onInputChange={handleCommentaryNumberInputChange}
              onChange={handleCommentaryNoChange} 
            />
        </div>
        
        <div className="dropdown-commentary">
            <label htmlFor="theme">Which has Theme</label>
            <Select 
              options={filteredThemes} 
              inputValue={themeInputValue}
              isSearchable={true}
              onInputChange={handleThemeInputChange} 
              onChange={handleThemeChange} 
            />
        </div>

        <div className="dropdown-commentary">
            <label htmlFor="sub_theme">Which has the Sub-Theme</label>
            <Select 
              options={filteredSubThemes}
              inputValue={subThemeInputValue} 
              isSearchable={true} 
              onInputChange={handleSubThemeInputChange} 
              onChange={handleSubThemeChange} 
            />
        </div>
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

        <div className="dropdown-container-commentary-2">
            <div className="search-text-commentary-2">Which References the Verse:</div>
            <div className="dropdown-commentary-2">
                <label htmlFor="surah_number">Surah Number</label>
                <Select 
                  options={filteredChapterNumber}
                  inputValue={chapterNumberInputValue}  
                  isSearchable={true}
                  onInputChange={handleChapterNumberInputChange} 
                  onChange={handleChapterNoChange} 
                />
            </div>
            <div className="dropdown-commentary-2">
                <label htmlFor="ayat_number">Ayat Number</label>
                <Select 
                  options={filteredVerseNumber} 
                  inputValue={verseNumberInputValue}  
                  isSearchable={true} 
                  onInputChange={handleVerseNumberInputChange} 
                  onChange={handleVerseNoChange} 
                />
            </div>
        </div>

        <div className="run-query-button-commentary">
          <button className="run-button" onClick={SendDataToBackend}>
            Run Query
          </button>
        </div>

        <div className="limit-results-box-commentary">
          <label htmlFor="limit-results">Limit Search Results</label>
          <div className="limit-input-commentary">
            <button className="decrement-commentary" onClick={decrementValue}>-</button>
            <input
              type="number"
              id="limit-results"
              value={limitValue}
              onChange={(e) => setLimitValue(Math.max(0, parseInt(e.target.value)))}
            />
            <button className="increment-commentary" onClick={incrementValue}>+</button>
          </div>
      </div>
      </div>
      <div className='Footer-portion'>
        <Footer />
      </div> 
    </div>
  );
};

export default CommentaryQueryBuilder;
