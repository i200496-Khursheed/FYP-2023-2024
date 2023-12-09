//VerseQueryResults.js
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

    const handleSort = (field) => {
      if (sortOrder === 'asc') {
        resultsData?.sort((a, b) => a[field]?.value.localeCompare(b[field]?.value));
        setSortOrder('desc');
      } else {
        resultsData?.sort((a, b) => b[field]?.value.localeCompare(a[field]?.value));
        setSortOrder('asc');
      }
    };

    const renderTableData = () => {
      return (
        resultsData &&
        resultsData.map((data, index) => (
          <tr key={index}>
            <td>{data.Verseno?.value}</td>
            <td>{data.Surahname?.value}</td>
            <td>{data.Text?.value}</td>
            <td>{data.chapter?.value}</td>
            <td>{data.commno?.value}</td>
            <td className="commentary-text">{data.commtext?.value}</td>
            <td>{data.hadithno?.value}</td>
            <td>{data.hadithtext?.value}</td>
            <td>{data.name?.value}</td>
            <td>{data.reference?.value}</td>
            <td>{data.segment_text?.value}</td>
            <td>{data.subtheme?.value}</td>
            <td>{data.themename?.value}</td>
          </tr>
        ))
      );
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

        {isExpanded && resultsData && (
        <div className="details-table-VQR">
        <table>
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort('Verseno')}>
                Verse Number {sortOrder === 'asc' ? '▲' : '▼'}
              </th>
              <th>Surah Name</th>
              <th>Text</th>
              <th>Chapter</th>
              <th>Commentary Number</th>
              <th>Commentary Text</th>
              <th>Hadith Number</th>
              <th>Hadith Text</th>
              <th>Name</th>
              <th>Reference</th>
              <th>Segment Text</th>
              <th>Subtheme</th>
              <th>Theme Name</th>
            </tr>
          </thead>
          <tbody>
            {renderTableData()}
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
