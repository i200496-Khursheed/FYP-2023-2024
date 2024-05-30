//FAQ.js
import React, { useState, useEffect, useRef } from 'react';
import './FAQ.css';
import Footer from '../Footer/Footer';

const FAQ = () => {
  const questionsSet1 = [
    { question: 'Which Quranic Verse Mentions "ابن عباس"', query: 'competency_question1' },
    { question: 'How many times has سفيان narrated hadith', query: 'competency_question2' },
    { question: 'No of Hadiths in each Theme"', query: 'competency_question3' },
  ];

  const questionsSet2 = [
    { question: 'List Hadith Numbers narrated by "ابن عباس"', query: 'competency_question4' },
    { question: 'List names of most heard from narrators with count', query: 'competency_question5' },
    { question: 'Theme of Hadith 189', query: 'competency_question6' },
  ];

  const questionsSet3 = [
    { question: 'What is the name of Surah 12', query: 'competency_question7' },
    { question: 'Who narrated a hadith and from whom', query: 'competency_question8' },
    { question: 'What is the text of Verse 3 in Surah 12?', query: 'competency_question9' },
  ];

  const questionsSet4 = [
    { question: 'What are all the names mentioned with their count in all Hadith?', query: 'competency_question10' },
    { question: 'What hadith follows what hadith?', query: 'competency_question11' },
    { question: '# Finding all verses which have used the word مِنْ', query: 'competency_question12' },
  ];

  const [result, setResult] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);


  const handleQuestionClick = async (question, query) => {
    const url = `http://127.0.0.1:8000/api/${query}/`;

    try {
      console.log('Fetching data from:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const resultData = await response.json();
        console.log('Result data:', resultData);

        if (
          resultData &&
          resultData.result &&
          resultData.result.results &&
          Array.isArray(resultData.result.results.bindings)
        ) {
          const resultArray = resultData.result.results.bindings;
          setResult(resultArray);

          // Set selectedQuestion based on the query
          setSelectedQuestion(query);
        } else {
          setResult([]);
          setSelectedQuestion(null);
          console.error('Unexpected data structure in resultData:', resultData);
        }
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderQuestionTable = () => {
    switch (selectedQuestion) {
      case 'competency_question1':
        return renderQuestion1Table();
      case 'competency_question2':
        return renderQuestion2Table();
      // Add cases for other questions if needed
      case 'competency_question3':
        return renderQuestion3Table();
      case 'competency_question4':
        return renderQuestion4Table();
      case 'competency_question5':
        return renderQuestion5Table();
      case 'competency_question6':
        return renderQuestion6Table();
      case 'competency_question7':
        return renderQuestion7Table();
      case 'competency_question8':
        return renderQuestion8Table();
      case 'competency_question9':
        return renderQuestion9Table();  
      case 'competency_question10':
        return renderQuestion10Table();      
      case 'competency_question11':
        return renderQuestion11Table();     
      case 'competency_question12':
        return renderQuestion12Table();   
      default:
        return null;
    }
  };
  

  
  const tableRef = useRef(null);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  // Function to render the table for Question 1 of questionsSet1
  const renderQuestion1Table = () => {
    return (
      result && (
        <div className="result-container">
          <h3>Result for competency Question 1:</h3>
          <table ref={tableRef}>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Text</th>
                <th>Chapter</th>
                <th>Verse Number</th>
                <th>Surah Name</th>
              </tr>
            </thead>
            <tbody>
              {result.map((item, index) => (
                <tr key={index}>
                  <td>{item.reference ? item.reference.value : '-'}</td>
                  <td>{item.Text ? item.Text.value : '-'}</td>
                  <td>{item.chapter ? item.chapter.value : '-'}</td>
                  <td>{item.Verseno ? item.Verseno.value : '-'}</td>
                  <td>{item.Surahname ? item.Surahname.value : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    );
  };
  

  const renderQuestion2Table = () => {
    return (
      result && (
        <div className="result-container">
          <h3>Result for competency Question 2:</h3>
          <table ref={tableRef}>
            <thead>
              <tr>
                <th>Narrator Name</th>
                <th>Total Hadith Heard Count</th>
              </tr>
            </thead>
            <tbody>
              {result.map((item, index) => (
                <tr key={index}>
                  <td>{item.narrator_name ? item.narrator_name.value : '-'}</td>
                  <td>{item.heard_count ? item.heard_count.value : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    );
  };
  
  const renderQuestion3Table = () => {
    return (
      result && (
        <div className="result-container">
          <h3>Result for competency Question 3:</h3>
          <table ref={tableRef}>
            <thead>
              <tr>
                <th>Theme Name</th>
                <th>Total Hadith Count</th>
              </tr>
            </thead>
            <tbody>
              {result.map((item, index) => (
                <tr key={index}>
                  <td>{item.Theme_Name ? item.Theme_Name.value : '-'}</td>
                  <td>{item.Hadis_count ? item.Hadis_count.value : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    );
  };

  const renderQuestion4Table = () => {
    return (
      result && (
        <div className="result-container">
          <h3>Result for competency Question 4:</h3>
          <table ref={tableRef}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Number</th>
              </tr>
            </thead>
            <tbody>
              {result.map((item, index) => (
                <tr key={index}>
                  <td>{item.name ? item.name.value : '-'}</td>
                  <td>{item.no ? item.no.value : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    );
  };

  const renderQuestion5Table = () => {
    return (
      result && (
        <div className="result-container">
          <h3>Result for competency Question 5:</h3>
          <table ref={tableRef}>
            <thead>
              <tr>
                <th>Narrator Name</th>
                <th>Total Hadith Heard Count</th>
              </tr>
            </thead>
            <tbody>
              {result.map((item, index) => (
                <tr key={index}>
                  <td>{item.narrator_name ? item.narrator_name.value : '-'}</td>
                  <td>{item.heard_count ? item.heard_count.value : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    );
  };

  const renderQuestion6Table = () => {
    return (
      result && (
        <div className="result-container">
          <h3>Result for competency Question 6:</h3>
          <table ref={tableRef}>
            <thead>
              <tr>
                <th>Hadith No</th>
                <th>Theme</th>
              </tr>
            </thead>
            <tbody>
              {result.map((item, index) => (
                <tr key={index}>
                  <td>{getHadithNo(item.HadithNo.value)}</td>
                  <td>{getTheme(item.Theme.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    );
  };
  
  // Function to extract the Hadith No from the URI
  const getHadithNo = (uri) => {
    return uri.substring(uri.lastIndexOf('#') + 1);
  };
  
  // Function to extract the Theme from the URI
  const getTheme = (uri) => {
    return uri.substring(uri.lastIndexOf('#') + 1);
  };
  

  const renderQuestion7Table = () => {
    return (
      result && (
        <div className="result-container">
          <h3>Result for competency Question 7:</h3>
          <table ref={tableRef}>
            <thead>
              <tr>
                <th>Surah Name</th>
              </tr>
            </thead>
            <tbody>
              {result.map((item, index) => (
                <tr key={index}>
                  <td>{item.Name ? item.Name.value : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    );
  };

  const renderQuestion8Table = () => {
    return (
      result && (
        <div className="result-container">
          <h3>Result for competency Question 8:</h3>
          <table ref={tableRef}>
            <thead>
              <tr>
                <th>Narrator Name</th>
                <th>Heard From</th>
              </tr>
            </thead>
            <tbody>
              {result.map((item, index) => (
                <tr key={index}>
                  <td>{item.name1 ? item.name1.value : '-'}</td>
                  <td>{item.name2 ? item.name2.value : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    );
  };

  const renderQuestion9Table = () => {
    return (
      result && (
        <div className="result-container">
          <h3>Result for competency Question 9:</h3>
          <table ref={tableRef}>
            <thead>
              <tr>
                <th>Text</th>
              </tr>
            </thead>
            <tbody>
              {result.map((item, index) => (
                <tr key={index}>
                  <td>{item.Text ? item.Text.value : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    );
  };

  const renderQuestion10Table = () => {
    return (
      result && (
        <div className="result-container">
          <h3>Result for competency Question 10:</h3>
          <table ref={tableRef}>
            <thead>
              <tr>
                <th>Person Name</th>
                <th>Number of times mentioned</th>
              </tr>
            </thead>
            <tbody>
              {result.map((item, index) => (
                <tr key={index}>
                  <td>{item.person_name ? item.person_name.value : '-'}</td>
                  <td>{item.mention_count ? item.mention_count.value : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    );
  };

  const renderQuestion11Table = () => {
    return (
      result && (
        <div className="result-container">
          <h3>Result for competency Question 11:</h3>
          <table ref={tableRef}>
            <thead>
              <tr>
                <th>Hadith No</th>
                <th>Follows</th>
              </tr>
            </thead>
            <tbody>
              {result.map((item, index) => (
                <tr key={index}>
                  <td>{item.hadith_no ? item.hadith_no.value : '-'}</td>
                  <td>{getHadithNo(item.follows.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    );
  };

  const renderQuestion12Table = () => {
    return (
      result && (
        <div className="result-container">
          <h3>Result for competency Question 12:</h3>
          <table ref={tableRef}>
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Text</th>
              </tr>
            </thead>
            <tbody>
              {result.map((item, index) => (
                <tr key={index}>
                  <td>{item.no ? item.no.value : '-'}</td>
                  <td>{item.name ? item.name.value : '-'}</td>
                  <td>{item.Text ? item.Text.value : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    );
  };
  const renderQuestion13Table = () => {
    // return (
    //   // Render table for competency_question2
    // );
  };

  // ... renderQuestion3Table, renderQuestion4Table, etc. ...

  
  

  return (
    <div>
      <div className={`FAQ-page`}>
        <div className="marquee-container">
          <div className="marquee-text">
            Al-Tabari Knowledge Queries -- Explore pre-built queries of Tafseer Al-Tabari
          </div>
        </div>

        <div className="back-button-FAQ" onClick={() => window.history.back()}>
          <img src={require('../../assets/back_button.png')} alt="Back Button" />
        </div>

        <div className="details-FAQ">
          {/* Container for the first set of questions */}
          <div className="FAQ-container-with-stroke">
            {questionsSet1.map((question, index) => (
              <div key={index} className="FAQ-block" id={`FAQ-block-${index}`}>
                {question.question}
                <img
                  src={require('../../assets/FAQ-button.png')}
                  alt="Run Button"
                  className="answer-button"
                  onClick={() => handleQuestionClick(question.question, question.query)}
                />
              </div>
            ))}
          </div>

          {/* Container for the second set of questions */}
          <div className="FAQ-container-with-stroke">
            {questionsSet2.map((question, index) => (
              <div key={index} className="FAQ-block" id={`FAQ-block-${index + questionsSet1.length}`}>
                {question.question}
                <img
                  src={require('../../assets/FAQ-button.png')}
                  alt="Run Button"
                  className="answer-button"
                  onClick={() => handleQuestionClick(question.question, question.query)}
                />
              </div>
            ))}
          </div>

          {/* Container for the third set of questions */}
          <div className="FAQ-container-with-stroke">
            {questionsSet3.map((question, index) => (
              <div key={index} className="FAQ-block" id={`FAQ-block-${index + questionsSet2.length}`}>
                {question.question}
                <img
                  src={require('../../assets/FAQ-button.png')}
                  alt="Run Button"
                  className="answer-button"
                  onClick={() => handleQuestionClick(question.question, question.query)}
                />
              </div>
            ))}
          </div>

          {/* Container for the fourth set of questions */}
          <div className="FAQ-container-with-stroke">
            {questionsSet4.map((question, index) => (
              <div key={index} className="FAQ-block" id={`FAQ-block-${index + questionsSet3.length}`}>
                {question.question}
                <img
                  src={require('../../assets/FAQ-button.png')}
                  alt="Run Button"
                  className="answer-button"
                  onClick={() => handleQuestionClick(question.question, question.query)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {renderQuestionTable()}

      
      <div className='Footer-portion'>
        <Footer />
      </div>  
    </div>
  );
};

export default FAQ;