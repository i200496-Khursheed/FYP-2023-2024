/* MainContent.js */
import React from 'react';
import './MainContent.css';
import InfoBox from '../InfoBox/InfoBox'; // Adjusting the path to match the actual file structure
import Footer from '../Footer/Footer'; // Import Footer component

function MainContent() {
  return (
    <div>
      <div className="main-content">
        <div className="box">
          <div className="text">KnowledgeVerse</div>
          <div className="secondary-text">
            <div className="secondary-heading">
              Knowledge Driven Semantic Web portal for Tafsir Al-Tabari
            </div>
            <div className="square"></div>
            <div className="side-text">
              <span className="italic-text">
                Semantic Web Portal to Facilitate in Research & Self-Learning of Tafseer Al-Tabari
              </span>
            </div>
            <div className="buttons">
              <button className="explore-button">Explore</button>
              <button className="about-button">About</button>
            </div>
          </div>
          <img src={require('../../assets/kg-icon1.jpg')} alt="Knowledge Graph Image" className="box-image" />
          
          <div className="info-boxes">
            <InfoBox 
              title="Verse" 
              description="Explore Tafseer Al-Tabari for verse commentary" 
              imageSrc={require('../../assets/verse_search.png')}
              linkTo="/verse-query-builder"
            />
            <InfoBox 
              title="Hadith" 
              description="Examine hadith for narrator chain & more information" 
              imageSrc={require('../../assets/hadith_search.png')}
              linkTo="/hadith-query-builder" 
            />
            <InfoBox 
              title="Rawi" 
              description="In Al-Tabari, find & learn about Rawi" 
              imageSrc={require('../../assets/people_search.png')}
              linkTo="/people-page" 
            />
            <InfoBox 
              title="Al-Tabari Knowledge Queries" 
              description="Explore pre-built queries of Tafseer Al-Tabari" 
              imageSrc={require('../../assets/top_queries.png')}
              linkTo="/faq-page" 
            />
            <InfoBox 
              title="Statistics" 
              description="View statistical data of Al-Tabari knowledge graph" 
              imageSrc={require('../../assets/statistics.png')}
            />
            <InfoBox 
              title="Graph View" 
              description="Visualize Tafseer Al-Tabari Graph" 
              imageSrc={require('../../assets/graph_view.png')}
            />
        </div>
        </div>
      </div>
      
      <div className='Footer-portion'>
          <Footer />
      
      </div>
    </div>
  
  );
}

export default MainContent;
