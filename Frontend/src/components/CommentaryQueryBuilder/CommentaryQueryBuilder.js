import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './CommentaryQueryBuilder.css';
import Footer from '../Footer/Footer'; // Import Footer component


// Commentary Contents
// const ayatNumberOptions = [
//   { value: '15', label: 'Verse 015' },
//   { value: '6', label: 'Verse 006' },
//   { value: '13', label: 'Verse 013' },
// ];

// const surahNumberOptions = [
//   { value: '12', label: 'يوسف 12' },
//   { value: '10', label: 'يونس 10' },
//   { value: '19', label: 'مريم 19' },
// ];

const subThemeOptions = [
    { value: 'afaalibad', label: 'afaalibad' },
    { value: 'khairshar', label: 'khairshar' },
    { value: 'sifatilahi', label: 'sifatilahi' },
    { value: 'murad', label: 'murad' },
  ];

const CommentaryQueryBuilder = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('commentary');
  const [data, setData] = useState({
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
      surah_number: selectedOption.value,
    });
  };
  
  const handleVerseNoChange = (selectedOption) => {
    setData({
      ...data,
      verseNo: selectedOption.value,
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
  //         navigate('/commentary-query-results', { state: { resultsData: data.result } });
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //     });
  // };


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


// Fetch from txt
const [chapterNoOptions, setChapterNoOptions] = useState([]);

const [verseNoOptions, setVerseNoOptions] = useState([]);
const [themeOptions, setThemeOptions] = useState([]);
const [mentionsOptions, setMentionsOptions] = useState([]);


// Chapter No
useEffect(() => {
  // Fetch the text file from the public folder
  fetch('/Drop-down-data/Chapter Information.txt')
    .then((response) => response.text())
    .then((data) => {
      // Split the file content by lines and start from line 2
      const chapters = data.split('\n').slice(1).map((chapter) => {
        // Split each line to get the numeric value and chapter name
        const [chapterNumber, chapterName] = chapter.split('\t');
        return { value: chapterNumber, label: chapterName.trim() };
      });
      setChapterNoOptions(chapters);
    })
    .catch((error) => {
      console.error('Error fetching chapterNo:', error);
    });
}, []);

// VerseNo
useEffect(() => {
  fetch('/Drop-down-data/Verse Information.txt')
    .then((response) => response.text())
    .then((data) => {
      const verses = data.split('\n').slice(1).map((verse) => ({
        value: verse.trim(),
        label: verse.trim(),
      }));
      setVerseNoOptions(verses);
    })
    .catch((error) => {
      console.error('Error fetching verse numbers:', error);
    });
}, []);


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
            <label htmlFor="surah_number">Surah Number</label>
            <Select options={chapterNoOptions} isSearchable={true} onChange={handleChapterNoChange} />
        </div>
        <div className="dropdown-commentary">
            <label htmlFor="ayat_number">Ayat Number</label>
            <Select options={verseNoOptions} isSearchable={true} onChange={handleVerseNoChange} />
        </div>

        <div className="dropdown-commentary">
            <label htmlFor="theme">Which has Theme</label>
            <Select options={themeOptions} isSearchable={true} onChange={handleThemeChange} />
        </div>

        <div className="dropdown-commentary">
            <label htmlFor="sub_theme">Which has the Sub-Theme</label>
            <Select options={subThemeOptions} isSearchable={true} onChange={handleSubThemeChange} />
        </div>
        </div>

        <div className="that-mentions">
          <div className="search-text">That Mentions:</div>
          <div className="dropdown">
            <label htmlFor="mentions">Mentions</label>
            <Select options={mentionsOptions} isSearchable={true} onChange={handleMentionsChange} />
          </div>
        </div>

        <div className="dropdown-container-commentary-2">
            <div className="search-text-commentary-2">Which References the Verse:</div>
            <div className="dropdown-commentary-2">
                <label htmlFor="surah_number">Surah Number</label>
                <Select options={chapterNoOptions} isSearchable={true} onChange={handleChapterNoChange} />
            </div>
            <div className="dropdown-commentary-2">
                <label htmlFor="ayat_number">Ayat Number</label>
                <Select options={verseNoOptions} isSearchable={true} onChange={handleVerseNoChange} />
            </div>

            <div className="dropdown-commentary-2">
                <label htmlFor="theme">Which has Theme</label>
                <Select options={themeOptions} isSearchable={true} onChange={handleThemeChange} />
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
