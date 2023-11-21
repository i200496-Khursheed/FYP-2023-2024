// FAQ.js
import React from 'react';
import './FAQ.css';
import Footer from '../Footer/Footer'; // Import Footer component

const FAQ = () => {
  const questionsSet1 = [
    { question: 'Which Quranic Verse Mentions "ابن عباس"' },
    { question: 'What is the chain of narrators for hadith h135' },
    { question: 'Which Quranic verse discusses the theme "Kalam"' },
  ];

  const questionsSet2 = [
    { question: 'What is the book location for the verse: 1:2' },
    { question: 'List Hadith are narrated by "ابن عباس"' },
    { question: 'How many hadith narrated by a rawi' },
  ];

  const questionsSet3 = [
    { question: 'List of narrators by the number of their narrations' },
    { question: 'What verses are used as a reference in the commentary of the verse 1:2' },
    { question: 'Explain the topic "اهل_المعرفه"' },
  ];

  const questionsSet4 = [
    { question: 'What has been said about a certain Person محمد' },
    { question: 'Which RAWI narrated most hadiths about اهل_المعرفه' },
    { question: 'Number of hadith by TOPIC narrated by "ابن عباس"' },
  ];

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
                <img src={require('../../assets/FAQ-button.png')} alt="Answer Button" className="answer-button" />
              </div>
            ))}
          </div>

          {/* Container for the second set of questions */}
          <div className="FAQ-container-with-stroke">
            {questionsSet2.map((question, index) => (
              <div key={index} className="FAQ-block" id={`FAQ-block-${index + questionsSet1.length}`}>
                {question.question}
                <img src={require('../../assets/FAQ-button.png')} alt="Answer Button" className="answer-button" />
              </div>
            ))}
          </div>

          {/* Container for the third set of questions */}
          <div className="FAQ-container-with-stroke">
            {questionsSet3.map((question, index) => (
              <div key={index} className="FAQ-block" id={`FAQ-block-${index + questionsSet2.length}`}>
                {question.question}
                <img src={require('../../assets/FAQ-button.png')} alt="Answer Button" className="answer-button" />
              </div>
            ))}
          </div>

          {/* Container for the fourth set of questions */}
          <div className="FAQ-container-with-stroke">
            {questionsSet4.map((question, index) => (
              <div key={index} className="FAQ-block" id={`FAQ-block-${index + questionsSet3.length}`}>
                {question.question}
                <img src={require('../../assets/FAQ-button.png')} alt="Answer Button" className="answer-button" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='Footer-portion'>
        <Footer />
      </div>  
    </div>
  );
};

export default FAQ;