import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './CommentaryQueryBuilder.css';
import Footer from '../Footer/Footer'; // Import Footer component
import { Oval as Loader } from 'react-loader-spinner';

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

  const [resetKey, setResetKey] = useState(0);

// mapping surah and ayat numbers
const chapterVerseCounts = {
  1: 7,
  2: 286,
  3: 200,
  4: 176,
  5: 120,
  6: 165,
  7: 206,
  8: 75,
  9: 129,
  10: 109,
  11: 123,
  12: 111,
  13: 43,
  14: 52,
  15: 99,
  16: 128,
  17: 111,
  18: 110,
  19: 98,
  20: 135,
  21: 112,
  22: 78,
  23: 118,
  24: 64,
  25: 77,
  26: 227,
  27: 93,
  28: 88,
  29: 69,
  30: 60,
  31: 34,
  32: 30,
  33: 73,
  34: 54,
  35: 45,
  36: 83,
  37: 182,
  38: 88,
  39: 75,
  40: 85,
  41: 54,
  42: 53,
  43: 89,
  44: 59,
  45: 37,
  46: 35,
  47: 38,
  48: 29,
  49: 18,
  50: 45,
  51: 60,
  52: 49,
  53: 62,
  54: 55,
  55: 78,
  56: 96,
  57: 29,
  58: 22,
  59: 24,
  60: 13,
  61: 14,
  62: 11,
  63: 11,
  64: 18,
  65: 12,
  66: 12,
  67: 30,
  68: 52,
  69: 52,
  70: 44,
  71: 28,
  72: 28,
  73: 20,
  74: 56,
  75: 40,
  76: 31,
  77: 50,
  78: 40,
  79: 46,
  80: 42,
  81: 29,
  82: 19,
  83: 36,
  84: 25,
  85: 22,
  86: 17,
  87: 19,
  88: 26,
  89: 30,
  90: 20,
  91: 15,
  92: 21,
  93: 11,
  94: 8,
  95: 8,
  96: 19,
  97: 5,
  98: 8,
  99: 8,
  100: 11,
  101: 11,
  102: 8,
  103: 3,
  104: 9,
  105: 5,
  106: 4,
  107: 7,
  108: 3,
  109: 6,
  110: 3,
  111: 5,
  112: 4,
  113: 5,
  114: 6
};

const resetFields = () => {
  setData({
    commno: '',
    chapterNo: '',
    verseNo: '',
    theme: '',
    subtheme: '',
    narrators: [{ title: '', name: '' }],
    mentions: '',
  });
  setLimitValue(0);
  setCommentaryNumberInputValue('');
  setChapterNumberInputValue('');
  setVerseNumberInputValue('');
  setThemeInputValue('');
  setSubThemeInputValue('');
  setMentionsInputValue('');

  // Reset filtered options
  setFilteredCommentaryNumbers(commentaryNoOptions.slice(0, 11));
  setFilteredChapterNumber(chapterNoOptions.slice(0, 11));
  setFilteredVerseNumber(verseNoOptions.slice(0, 11));
  setFilteredThemes(themeOptions.slice(0, 8));
  setFilteredSubThemes(subThemeOptions.slice(0, 8));
  setFilteredMentions(mentionsOptions.slice(0, 8));

  // Increment the reset key to force re-render
  setResetKey(prevKey => prevKey + 1);
};

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
    const selectedChapter = selectedOption.value;
    setData({
      ...data,
      chapterNo: selectedChapter,
    });
  
    // Get the maximum verse number for the selected chapter
    const maxVerseNumber = chapterVerseCounts[selectedChapter];
  
    // Filter the verse numbers based on the selected chapter
    const filteredVerses = verseNoOptions.filter(
      (verse) => parseInt(verse.value) <= maxVerseNumber
    );
  
    setFilteredVerseNumber(filteredVerses.slice(0, 11));
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

    // Check if any field is selected
    if (
      data.commno === '' &&
      data.chapterNo === '' &&
      data.narrators.every((narrator) => narrator.title === '' && narrator.name === '') &&
      data.verseNo === '' &&
      data.subtheme === '' &&
      data.theme === '' && 
      data.mentions === ''
    ) {
      // If no field is selected, show alert
      alert('Please select at least one option');
      return;
    }


    console.log("POST")
    const url = 'http://127.0.0.1:8000/api/query_commentary/';
    setLoading(true);

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data, applyLimit: true, limit: limitValue }), // Include limit value in JSON data
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
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );
  setFilteredChapterNumber(filteredOptions.slice(0, 11));
};


/* Commentary Ayat Number Filter Selection */
const [verseNumberInputValue, setVerseNumberInputValue] = useState('');
const [filteredVerseNumber, setFilteredVerseNumber] = useState([]);

const handleVerseNumberInputChange = (inputValue) => {
  setVerseNumberInputValue(inputValue);

  // Get the maximum verse number for the selected chapter
  const maxVerseNumber = chapterVerseCounts[data.chapterNo];

  const filteredOptions = verseNoOptions.filter(
    (option) => option.label.toLowerCase().startsWith(inputValue.toLowerCase()) &&
                parseInt(option.value) <= maxVerseNumber
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
    // Fetch commentary numbers
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


// Chapter No
    // Fetch chapter numbers
    fetch('/Drop-down-data/Commentary Dropdowns/Commentary Surah Number.txt')
      .then((response) => response.text())
      .then((data) => {
        const chapters = data
          .split('\n')
          .map((chapter) => {
            const [number, name] = chapter.split(' ');
            return {
              value: number.trim(),
              label: `${number.trim()} ${name.trim()}`,
            };
          })
          .filter((chapter) => chapter.value !== ''); // Remove empty lines, if any
        setChapterNoOptions(chapters);
        setFilteredChapterNumber(chapters.slice(0, 11));
      })
      .catch((error) => {
        console.error('Error fetching chapterNo:', error);
      });

// VerseNo
    // Fetch verse numbers
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
      setFilteredVerseNumber(verses.slice(0, 11));
    })
    .catch((error) => {
      console.error('Error fetching and sorting verse numbers:', error);
    });
    

// themes

  // Fetch the text file from the public folder
    // Fetch themes
    fetch('/Drop-down-data/Commentary Dropdowns/Commentary Theme.txt')
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


// Fetch mentioned persons from the text file

    // Fetch mentioned persons
    fetch('/Drop-down-data/Commentary Dropdowns/Commentary Mentions.txt')
      .then((response) => response.text())
      .then((data) => {
        const lines = data.split('\n');
        const mentionedPersons = lines.map((line) => {
          const fullName = line.trim();
          return { value: fullName, label: fullName };
        });
        setMentionsOptions(mentionedPersons);
        setFilteredMentions(mentionedPersons.slice(0, 8));
      })
      .catch((error) => {
        console.error('Error fetching mentioned persons:', error);
      });


// Fetch sub theme from the text file

    // Fetch sub themes
    fetch('/Drop-down-data/Commentary Dropdowns/Commentary Sub-themes.txt')
      .then((response) => response.text())
      .then((data) => {
        const lines = data.split('\n');
        const subthemes = lines.map((line) => {
          const subtheme = line.trim();
          return { value: subtheme, label: subtheme };
        });
        setSubThemeOptions(subthemes);
        setFilteredSubThemes(subthemes.slice(0, 8));
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
          <span> <p id="rH">Hadith</p> </span>
        </label>
        <label className={`radio-button-commentary ${selectedOption === 'verse' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="queryType"
            value="verse"
            onChange={() => handleRadioChange('verse')}
            checked={selectedOption === 'verse'}
          />
          <span> <p id="rV">Verse</p> </span>
        </label>
        <label className={`radio-button-commentary ${selectedOption === 'commentary' ? 'selected' : ''}`}>
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
      
      {/* Reset button */}
      <div className="reset-button-container">
        <span className="reset-button" onClick={resetFields}>Reset Fields</span>
      </div>

      <div className="query-box-commentary">
      <div className="search-text-commentary">Find Commentary About:</div>
      <div className="dropdown-container-commentary">
        {/* <div className="dropdown-commentary">
            <label htmlFor="surah_number">Commentary Number</label>
            <Select 
              options={filteredCommentaryNumbers}
              inputValue={commentaryNumberInputValue} 
              isSearchable={true} 
              onInputChange={handleCommentaryNumberInputChange}
              onChange={handleCommentaryNoChange} 
            />
        </div> */}
        
        <div className="dropdown-commentary">
            <label htmlFor="theme">Which has Theme</label>
            <Select 
              key={resetKey} // Add this line

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
              key={resetKey} // Add this line

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
              key={resetKey} // Add this line

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
                  key={resetKey} // Add this line

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
                  key={resetKey} // Add this line

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
      
      {loading && (
      <div className="loader-container4">
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

export default CommentaryQueryBuilder;