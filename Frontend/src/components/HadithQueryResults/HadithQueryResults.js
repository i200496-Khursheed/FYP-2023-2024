import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './HadithQueryResults.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import '../../fonts.css';

const HadithQueryResults = () => {
  const location = useLocation();
  const { resultsData } = location.state || {};
  const navigate = useNavigate();

  const [narratorNames, setNarratorNames] = useState([]);

  useEffect(() => {
    fetch('/Drop-down-data/Hadith Dropdowns/Hadith Narrator Names.txt')
      .then((response) => response.text())
      .then((data) => {
        const names = data.split('\n').map(name => name.trim());
        setNarratorNames(names);
      })
      .catch((error) => {
        console.error('Error fetching narrator names:', error);
      });
  }, []);

  const extractHadithNumber = (hadithNo) => {
    const match = hadithNo.match(/HD_(\d+)/);
    return match ? match[1] : hadithNo;
  };

  const sendHadithNumberToDifferentBackend = (hadithNo) => {
    const extractedNumber = extractHadithNumber(hadithNo);
    if (!extractedNumber) {
      console.error('Invalid HadithNo format:', hadithNo);
      return;
    }

    console.log('POST to a different backend endpoint');
    const url = 'http://127.0.0.1:8000/api/chain_narrators/';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hadithNo: extractedNumber }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        // Use navigate to move to the Chain page
        navigate('/chain-page', { state: { resultsData: responseData } });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleHadithNumberClick = (hadithNo) => {
    sendHadithNumberToDifferentBackend(hadithNo);
  };

  const handleNarratorNameClick = (Refer) => {
    // Define the action when narrator name is clicked
    console.log('Narrator Name clicked:', Refer);
    navigate('/people-page', { state: { Refer } });
  };

  const parseHadithText = (hadithText, narratorNames, rootNarrator, refers) => {
    if (!hadithText) return hadithText;
  
    const narratorNamesArray = narratorNames ? narratorNames.split(',').map(name => name.trim()) : [];
    const rootNarratorArray = rootNarrator ? rootNarrator.split(',').map(name => name.trim()) : [];
    const refersArray = refers ? refers.split(',').map(name => name.trim()) : [];
    const namesArray = [...narratorNamesArray, ...rootNarratorArray, ...refersArray];
  
    const textWithClickableNames = [];
    let currentIndex = 0;
  
    namesArray.forEach(name => {
      const index = hadithText.indexOf(name, currentIndex);
      if (index !== -1) {
        textWithClickableNames.push(hadithText.substring(currentIndex, index));
  
        textWithClickableNames.push(
          <span className="narrator-name" onClick={() => handleNarratorNameClick(name)}>
            {name}
          </span>
        );
  
        currentIndex = index + name.length;
      }
    });
  
    textWithClickableNames.push(hadithText.substring(currentIndex));
  
    return textWithClickableNames;
  };
  
  const renderTableData = () => {
    return (
      resultsData &&
      resultsData.map((data, index) => (
        <tr key={index}>
          <td className="sortable" onClick={() => handleHadithNumberClick(extractHadithNumber(data.HadithNo1?.value))}>
            {extractHadithNumber(data.HadithNo1?.value)}
          </td>
          <td>
            {data.NarratorNames?.value.split(',').map((name, index) => (
              <span
                key={index}
                className="narrator-name"
                onClick={() => handleNarratorNameClick(name.trim())}
              >
                {name.trim()}
              </span>
            )).reduce((prev, curr) => [prev, ', ', curr], [])}
          </td>
          <td>{data.NarratorTypes?.value}</td>
          <td>
            {data.Refers?.value.split(',').map((refer, index) => (
              <span
                key={index}
                className="refer-name"
                onClick={() => handleNarratorNameClick(refer.trim())}
              >
                {refer.trim()}
              </span>
            )).reduce((prev, curr) => [prev, ', ', curr], [])}
          </td>
          <td>
            {data.Texts?.value && parseHadithText(data.Texts?.value, data.NarratorNames?.value, data.RootNarrators?.value, data.Refers?.value)}
          </td>
          <td>{data.Themes?.value}</td>
        </tr>
      ))
    );
  };
  
  return (
    <div>
      <div className="back-button-HQR" onClick={() => window.history.back()}>
        <img src={require('../../assets/back_button.png')} alt="Back Button" />
      </div>
      {resultsData && (
        <div className="details-table-HQR">
          <table>
            <thead>
              <tr>
                <th>HadithNo</th>
                <th>NarratorNames</th>
                <th>NarratorTypes</th>
                <th>Refers</th>
                <th>Hadith Text</th>
                <th>Themes</th>
              </tr>
            </thead>
            <tbody>{renderTableData()}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HadithQueryResults;
