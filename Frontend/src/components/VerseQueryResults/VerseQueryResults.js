import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './VerseQueryResults.css';
import Footer from '../Footer/Footer'; // Import Footer component


const VerseQueryResults = () => {
    const location = useLocation();
    const { resultsData } = location.state || {};
  
    const [isExpanded, setIsExpanded] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc'); // Initial sort order
  
    const toggleExpand = () => {
      setIsExpanded(!isExpanded);
    };
  
    const handleNarratorClick = async (selectedNarrator) => {
      try {
        // Simulate fetching related narrators (replace this with your actual API call)
        const relatedNarratorsResponse = await fetch(
          `your_backend_url/narrators?selectedNarrator=${selectedNarrator}`
        );
        const relatedNarratorsData = await relatedNarratorsResponse.json();
  
        // Add the selected narrator's name at the beginning of the array
        const narratorsData = [selectedNarrator, ...relatedNarratorsData.narrators];
  
        // Redirect to Chain page with the narrators' data
        window.location.href = `/chain-page?narratorsData=${JSON.stringify(narratorsData)}`;
      } catch (error) {
        console.error('Error fetching related narrators:', error);
      }
    };

    return (
      <div>
        <div className={`verse-query-results ${isExpanded ? 'expanded' : ''}`}>
        
        <div className="back-button-VQR" onClick={() => window.history.back()}>
          <img src={require('../../assets/back_button.png')} alt="Back Button" />
        </div>
        <div className={`query-text-box ${isExpanded ? 'expanded' : ''}`}>
          <div className="details-swipe-bar" onClick={toggleExpand}>
            <div className={`arrow ${isExpanded ? 'expanded' : ''}`}></div>
          </div>
        </div>

        {isExpanded && resultsData && resultsData.SurahNumber && (
        <div className="details-table">
            <table>
              <tbody>
                <tr>
                  <th>Surah Number</th>
                  <th>Surah Name</th>
                  <th>Ayat Number</th>
                  <th>Commentary Theme</th>
                  <th>Hadith Theme</th>
                  <th>Narrator Title</th>
                  <th>Narrator Name</th>
                </tr>
                {resultsData.SurahNumber.map((item, index) => (
                  <tr key={index}>
                    <td>{item}</td>
                    <td>{resultsData.SurahName?.[index] || 'N/A'}</td>
                    <td>{resultsData.AyatNumber?.[index] || 'N/A'}</td>
                    <td>{resultsData.CommentaryTheme?.[index] || 'N/A'}</td>
                    <td>{resultsData.HadithTheme?.[index] || 'N/A'}</td>
                    <td>{resultsData.NarratorTitle?.[index] || 'N/A'}</td>
                    <td
                      className="narrator-name"
                      onClick={() => handleNarratorClick(resultsData.NarratorName?.[index])}
                    >
                      {resultsData.NarratorName?.[index] || 'N/A'}
                    </td>
                  </tr>
                ))}
                {!resultsData.SurahNumber || resultsData.SurahNumber.length === 0 ? (
                  <tr>
                    <td colSpan="7">N/A</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className='Footer-portion-VQR'>
        <Footer />
      </div>
    </div>
  );
};

export default VerseQueryResults;
