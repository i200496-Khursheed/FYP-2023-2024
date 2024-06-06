// Chain.js

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import './Chain.css';

const Chain = () => {
  const location = useLocation();
  console.log("I am here Location ", location.state); // Log location.state here

  const resultsData = location.state ? location.state.resultsData : null;

  const [isExpanded, setIsExpanded] = useState(false);
  const [displayText, setDisplayText] = useState('Dummy Text');

  const [uniqueNarratorNames, setUniqueNarratorNames] = useState([]);

  const navigate = useNavigate();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const narrators = [
    { name: 'Narrator A' },  { name: 'Narrator O' },
    { name: 'Narrator B' },  { name: 'Narrator P' },
    { name: 'Narrator C' },  { name: 'Narrator Q' },
    { name: 'Narrator D' },  { name: 'Narrator R' },
    { name: 'Narrator E' },  { name: 'Narrator S' },
    { name: 'Narrator F' },  { name: 'Narrator T' },
    { name: 'Narrator G' },  { name: 'Narrator U' },
    { name: 'Narrator H' },  { name: 'Narrator V' },
    { name: 'Narrator I' },  { name: 'Narrator W' },
    { name: 'Narrator J' },  { name: 'Narrator X' },
    { name: 'Narrator K' },  { name: 'Narrator Y' },
    { name: 'Narrator L' },  { name: 'Narrator Z' },
    { name: 'Narrator M' },
    { name: 'Narrator N' },
    // Add more narrators as needed
  ];

  useEffect(() => {
    setTimeout(() => {
      calculateLinePositions();
    }, 0);
    window.addEventListener('resize', calculateLinePositions);
  
    return () => {
      window.removeEventListener('resize', calculateLinePositions);
    };
  }, [isExpanded]);
  

  
  const calculateLinePositions = () => {
    const container = document.querySelector('.chain-container');
  
    if (!container) {
      console.log("Container not found!");
      return; // Exit if container is null
    }
  
    const links = document.querySelectorAll('.link-line');
  
    // Check if links NodeList is empty
    if (!links.length) {
      console.log("No links found!");
      return;
    }
  
    console.log("Container:", container);
    console.log("Links:", links);
  
    const containerRect = container.getBoundingClientRect();
  
    narrators.forEach((narrator, index) => {
      const block = document.getElementById(`narrator-block-${index}`);
      if (!block) {
        console.log("Block not found for index:", index);
        return; // Exit if block is null
      }
  
      const blockRect = block.getBoundingClientRect();
  
      const link = links[index];
  
      if (!link) {
        console.log("Link not found for index:", index);
        return; // Exit if link is null
      }
  
      // Calculate top and height based on the position of the next block
      const nextBlock = document.getElementById(`narrator-block-${index + 1}`);
      const nextBlockRect = nextBlock ? nextBlock.getBoundingClientRect() : null;
  
      const top = blockRect.bottom;
      const height = nextBlockRect ? nextBlockRect.top - blockRect.top : 0;
  
      console.log("Link:", link);
  
      link.style.top = `${top}px`;
      link.style.height = `${height}px`;
    });
  };
  
  

  console.log("RESULTS DATA:", resultsData); // Log the resultsData here

  useEffect(() => {
    if (resultsData && resultsData.result && resultsData.result.results && resultsData.result.results.bindings && resultsData.result.results.bindings.length > 0) {
      let textValue, rootNarrator;
  
      // Check if the 'Text' property exists in the first binding
      if (resultsData.result.results.bindings[0].Text) {
        textValue = resultsData.result.results.bindings[0].Text.value;
        rootNarrator = resultsData.result.results.bindings[0]?.RootNarrator.value;
      } else if (resultsData.result.results.bindings[0]['?Text']) {
        // Handle the case for decimal-based values with different property names
        textValue = resultsData.result.results.bindings[0]['?Text'].value;
        rootNarrator = resultsData.result.results.bindings[0]['?RootNarrator'].value;
      } else {
        console.error('Unknown data structure:', resultsData);
        return;
      }
  
      setDisplayText(parseDisplayText(textValue, uniqueNarratorNames, rootNarrator));
    }
  }, [resultsData, uniqueNarratorNames]);
  
  
  
  
useEffect(() => {
    const uniqueNames = resultsData && resultsData.result && resultsData.result.results &&
      Array.from(new Set(
        resultsData.result.results.bindings.map(
          (binding) => binding.NarratorName.value
        )
      ));
    setUniqueNarratorNames(uniqueNames);
  }, [resultsData]);

  useEffect(() => {
    calculateLinePositions();
    window.addEventListener('resize', calculateLinePositions);

    return () => {
      window.removeEventListener('resize', calculateLinePositions);
    };
  }, [isExpanded]);
  

  const handleNarratorNameClick = (Refer) => {
    // Define the action when narrator name is clicked
    console.log("Narrator Name clicked:", Refer);
    navigate('/people-page', { state: { Refer} });
  };

  const parseDisplayText = (text, uniqueNarratorNames, rootNarrator) => {
    if (!text || !uniqueNarratorNames || uniqueNarratorNames.length === 0) return text;
  
    const textWithClickableNames = [];
    let currentIndex = 0;
  
    const allNames = [...uniqueNarratorNames, rootNarrator];
  
    allNames.forEach(name => {
      const index = text.indexOf(name, currentIndex);
      if (index !== -1) {
        textWithClickableNames.push(text.substring(currentIndex, index));
  
        textWithClickableNames.push(
          <span className="narrator-name-Chain" onClick={() => handleNarratorNameClick(name)}>
            {name}
          </span>
        );
  
        currentIndex = index + name.length;
      }
    });
  
    textWithClickableNames.push(text.substring(currentIndex));
  
    return textWithClickableNames;
  };
  
  return (
  <div className={`hadith-query-results-chain ${isExpanded ? 'expanded' : ''}`}>
    <div className="back-button-HQR" onClick={() => window.history.back()}>
      <img src={require('../../assets/back_button.png')} alt="Back Button" />
    </div>
    <button className="show-chain-button" onClick={toggleExpand}>
      {isExpanded ? 'Hide Chain' : 'Show Chain'}
    </button>
    <div className={`query-text-box-chain ${isExpanded ? 'expanded' : ''}`}>
      <p>{displayText}</p>
    </div>

    {isExpanded && narrators && narrators.length > 0 && (
      <div className="details-chain">
        <div className="chain-container">
          <div className="container-with-stroke">
            {narrators.map((narrator, index) => {
              let narratorValue;

              if (index === 0) {
                // Display RootNarrator in the first block
                narratorValue = resultsData.result.results.bindings[0]?.RootNarrator.value;
              } else {
                // Extract unique NarratorName values for subsequent blocks
                const uniqueNarratorNames = Array.from(
                  new Set(
                    resultsData &&
                      resultsData.result &&
                      resultsData.result.results &&
                      resultsData.result.results.bindings &&
                      resultsData.result.results.bindings.map(
                        (binding) => binding.NarratorName.value
                      )
                  )
                );

                // Get NarratorName value for the current index if available
                narratorValue = uniqueNarratorNames[index - 1] || null; // Subtract 1 to account for RootNarrator
              }

              // Render the block only if narratorValue exists
              return narratorValue && (
                <div key={index} className="narrator-block" id={`narrator-block-${index}`}>
                  <p>{narratorValue}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="chain-links">
          {narrators.length > 1 &&
            narrators.map((_, index) => (
              index < narrators.length - 1 && (
                <div key={index} className="link-line"></div>
              )
            ))}
        </div>
      </div>
    )}
  </div>
);
};

export default Chain;
