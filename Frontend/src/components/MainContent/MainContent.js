/* MainContent.js */
import React, { useRef, useState } from 'react'; // Importing useRef and useState hooks
import './MainContent.css';
import InfoBox from '../InfoBox/InfoBox'; // Adjusting the path to match the actual file structure
import Footer from '../Footer/Footer'; // Import Footer component
import AboutDialog from './AboutDialog'; // Import the AboutDialog component

function MainContent() {
  const infoBoxesRef = useRef(null);
  const [showAboutDialog, setShowAboutDialog] = useState(false); // State to control the visibility of the AboutDialog

  const handleExploreClick = () => {
    // Scroll to the info-boxes section
    if (infoBoxesRef.current) {
      infoBoxesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const handleAboutClick = () => {
    // Set the state to show the AboutDialog
    setShowAboutDialog(true);
  };

  const handleCloseAboutDialog = () => {
    // Set the state to hide the AboutDialog
    setShowAboutDialog(false);
  };
  return (
    <div>
      {showAboutDialog && <AboutDialog onClose={handleCloseAboutDialog} />} {/* Render the AboutDialog component conditionally */}

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
              <button className="explore-button" onClick={handleExploreClick}>Explore</button>
              <button className="about-button" onClick={handleAboutClick}>About</button>
            </div>
          </div>
          <img src={require('../../assets/kg-icon1.jpg')} alt="Knowledge Graph Image" className="box-image" />
          
          <div className="info-boxes" ref={infoBoxesRef}>
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
              title="Read Tafseer Al-Tabari" 
              description="Access the complete Tafseer Al-Tabari" 
              imageSrc={require('../../assets/stack-of-books.png')}
              linkTo="/tafseer-page" 
            />
            <InfoBox 
              title="Graph View" 
              description="Visualize Tafseer Al-Tabari Graph" 
              imageSrc={require('../../assets/graph_view.png')}
              linkTo="/al-tabari-graph" 
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
