//FAQ.js
import React, { useState, useEffect, useRef } from 'react';
import './FAQ.css';
import Footer from '../Footer/Footer';

const FAQ = () => {
  const questionsSet1 = [
    { question: 'Which Quranic Verse Mentions "ابن عباس"', query: 'competency_question1' },
    { question: 'What is the chain of narrators for hadith h135', query: 'competency_question2' },
    { question: 'Which Quranic verse discusses the theme "Kalam"', query: 'competency_question3' },
  ];

  const questionsSet2 = [
    { question: 'What is the book location for the verse: 1:2', query: 'competency_question4' },
    { question: 'List Hadith are narrated by "ابن عباس"', query: 'competency_question5' },
    { question: 'How many hadith narrated by a rawi', query: 'competency_question6' },
  ];

  const questionsSet3 = [
    { question: 'List of narrators by the number of their narrations', query: 'competency_question7' },
    { question: 'What verses are used as a reference in the commentary of the verse 1:2', query: 'competency_question8' },
    { question: 'Explain the topic "اهل_المعرفه"', query: 'competency_question9' },
  ];

  const questionsSet4 = [
    { question: 'What has been said about a certain Person محمد', query: 'competency_question10' },
    { question: 'Which RAWI narrated most hadiths about اهل_المعرفه', query: 'competency_question11' },
    { question: 'Number of hadith by TOPIC narrated by "ابن عباس"', query: 'competency_question12' },
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