//VerseQueryBuilder.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './VerseQueryBuilder.css';
import Footer from '../Footer/Footer'; // Import Footer component

// Verse Contents
// const verseNoOptions = [
//   { value: '7', label: 'Verse 007' },
//   { value: '6', label: 'Verse 006' },
//   { value: '2', label: 'Verse 002' },
// ];

// const chapterNoOptions = [
//   { value: 'الفاتحة', label: 'الفاتحة	' },
//   { value: 'يونس', label: 'يونس' },
//   { value: 'مريم', label: 'مريم ' },
// ];

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
    chapterNo: '',
    verseNo: '',
    theme: '',
    hadithTheme: '',
    narrator: [{ title: '', name: '' }],
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
    updatedNarrators[index][type] = value;
    setData({
      ...data,
      narrator: updatedNarrators,
    });
  };

 const handleAddNarrator = () => {
  setData((prevData) => ({
    ...prevData,
    narrator: [...prevData.narrator, { title: '', name: '' }],
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
    console.log(data.hadithTheme);  // Add this line
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
const [narratorLogic, setNarratorLogic] = useState(Array(data.narrator.length).fill('AND'));

const handleNarratorLogicChange = (index) => {
  setNarratorLogic((prevLogic) => {
    const updatedLogic = [...prevLogic];
    updatedLogic[index] = updatedLogic[index] === 'AND' ? 'OR' : 'AND';
    return updatedLogic;
  });
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

// hadithThemes
useEffect(() => {
  // Fetch the text file from the public folder
  fetch('/Drop-down-data/THEMES OF HADITH.txt')
    .then((response) => response.text())
    .then((data) => {
      // Split the file content by lines and start from line 2
      const hadithThemes = data.split('\n').slice(1).map((hadithTheme) => {
        // Remove the leading colon from each theme
        const trimmedHadithTheme = hadithTheme.trim();
        const hadithThemeWithoutColon = trimmedHadithTheme.startsWith(':') ? trimmedHadithTheme.substring(1) : trimmedHadithTheme;
        return { value: hadithThemeWithoutColon, label: hadithThemeWithoutColon };
      });
      setHadithThemeOptions(hadithThemes);
    })
    .catch((error) => {
      console.error('Error fetching hadithThemes:', error);
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
  fetch('/Drop-down-data/verse mentions.txt')
    .then((response) => response.text())
    .then((data) => {
      // Split the file content by lines
      const lines = data.split('\n');
      // Process each line to extract the full name
      const mentionedPersons = lines.slice(1).map((line) => {
        const fullName = line.trim();
        return { value: fullName, label: fullName };
      });
      // Set the options in state
      setMentionsOptions(mentionedPersons);
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
              <label htmlFor="chapterNo">Surah Number</label>
              <Select options={chapterNoOptions} isSearchable={true} onChange={handleChapterNoChange} />
            </div>
            <div className="dropdown-verse">
              <label htmlFor="Verseno">Ayat Number</label>
              <Select options={verseNoOptions} isSearchable={true} onChange={handleVerseNoChange} />
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
                <label> Theme </label>
              <Select options={hadithThemeOptions} isSearchable={true} onChange={handleHadithThemeChange} />
              </div>

              {/* <div className="dropdown-verse">
                <label htmlFor={`narrator_title_${index}`}>Narrator Title</label>
                <Select
                  options={narratorTitleOptions}
                  isSearchable={true}
                  onChange={(selectedOption) =>
                    handleNarratorChange(index, 'title', selectedOption.value)
                  }
                />
              </div> */}
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
