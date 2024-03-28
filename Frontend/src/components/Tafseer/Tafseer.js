import React, { useState, useEffect } from 'react';
import './Tafseer.css';
import Spinner from '../Spinner/Spinner'; // Import Spinner component
import { useNavigate } from 'react-router-dom';

const XMLRenderer = () => {
  const navigate = useNavigate(); // Declare navigate using useNavigate hook
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [xmlData, setXmlData] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileIndex, setFileIndex] = useState(0);
  const [enlargedView, setEnlargedView] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Define the file mapping object
  const fileMapping = {
    "sure_0_section.xml": "MuqadimaA",
    "sure_1_section_0.11-0.16.xml": "S001M - Part 1",
    "sure_1_section_1.1-1.14.xml": "S001M - Part 2",
    "sure_3_section_3.1-3.48.xml": "S003A - Part 1",
    "sure_3_section_3.49-3.95.xml": "S003A - Part 2",
    "sure_3_section_3.96-3.138.xml": "S003A - Part 3",
    "sure_3_section_3.139-3.171.xml": "S003A - Part 4",
    "sure_3_section_3.172-3.210.xml": "S003A - Part 5",
    "sure_3_section_3.211-3.249.xml": "S003A - Part 6",
    "sure_3_section_3.250-3.290.xml": "S003A - Part 7",
    "sure_3_section_3.291-3.301.xml": "S003A - Part 8"
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (selectedFolder) {
      fetchFiles(selectedFolder);
    }
  }, [selectedFolder]);

  useEffect(() => {
    if (selectedFolder && selectedFile) {
      fetchXmlData(selectedFolder, selectedFile);
    }
  }, [selectedFolder, selectedFile]);

  useEffect(() => {
    if (files.length > 0) {
      setSelectedFile(files[fileIndex]);
    }
  }, [files, fileIndex]);

  const fetchFolders = async () => {
    try {
      const response = await fetch('/files.json');
      if (!response.ok) {
        throw new Error('Failed to fetch folder data');
      }
      const folderData = await response.json();
      const folderNames = Object.keys(folderData);
      setFolders(folderNames);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const fetchFiles = async (folder) => {
    try {
      const response = await fetch('/files.json');
      if (!response.ok) {
        throw new Error('Failed to fetch file data');
      }
      const folderData = await response.json();
      const fileNames = folderData[folder];
      setFiles(fileNames);
      setFileIndex(0);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const fetchXmlData = async (folder, file) => {
    try {
      setLoading(true);
      const response = await fetch(`/XMLFiles/${folder}/${file}`);
      if (!response.ok) {
        throw new Error('Failed to fetch XML data');
      }
      const xmlText = await response.text();

      // Set XML data
      setXmlData(xmlText);

      // Set loading to false
      setLoading(false);
    } catch (error) {
      console.error('Error fetching XML:', error);
      setLoading(false);
    }
  };

  const handleNextFile = () => {
    if (fileIndex < files.length - 1) {
      setFileIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePreviousFile = () => {
    if (fileIndex > 0) {
      setFileIndex(prevIndex => prevIndex - 1);
    }
  };

  const toggleEnlargedView = (event) => {
    if (event.target.classList.contains('enlarge-button')) {
      setEnlargedView(!enlargedView);
    }
  };

  const renderClickableNames = () => {
    if (!xmlData) return null;
  
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
  
    const removeDiacritics = (text) => {
      // Remove diacritics using a regular expression
      return text.replace(/[\u064B-\u065F]/g, '');
    };
    
    const handleNameClick = (name) => {
      const simplifiedName = removeDiacritics(name);
      console.log('handleNameClick triggered with simplified name:', simplifiedName);
      navigate('/people-page', { state: { Refer: simplifiedName } });
    };
  
    const traverseNodes = (nodes) => {
      return Array.from(nodes).map((node, index) => {
        if (node.nodeType === 3) {
          // Text node
          return node.textContent;
        } else if (node.nodeType === 1) {
          // Element node
          const tagName = node.tagName.toLowerCase();
          const name = node.textContent;
          const role = node.getAttribute('role') || node.getAttribute('ana');
  
          if (tagName === 'name' || tagName === 'persname') {
            return (
              <span
                key={index}
                onClick={() => handleNameClick(name)}
                className={`clickable-name ${role ? role.replace(/\s+/g, '') : ''} ${tagName === 'persname' ? 'persName' : ''}`}
                title={role}
              >
                {name}
              </span>
            );
          } else {
            // Recursively traverse child nodes
            return React.createElement(
              tagName,
              { key: index },
              traverseNodes(node.childNodes)
            );
          }
        }
      });
    };
  
    const clickableNames = traverseNodes(xmlDoc.childNodes);
  
    return (
      <div className={enlargedView ? 'full-xml-container' : 'details-T'} onClick={toggleEnlargedView}>
        <div className={enlargedView ? 'full-xml' : ''}>
          {clickableNames}
        </div>
      </div>
    );
  };
  
  
  const handleScroll = () => {
    if (window.pageYOffset > -10) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
  <div>
    <div className="back-button-T" onClick={() => window.history.back()}>
      <img src={require('../../assets/back_button.png')} alt="Back Button" />
    </div>
    <div className="folder">
      <label htmlFor="folder">Select a Surah:</label>
      <select id="folder" value={selectedFolder} onChange={(e) => setSelectedFolder(e.target.value)} className="select-option-folder">
        <option value="">Select a Surah</option>
        {folders.map((folder) => (
          <option key={folder} value={folder}>
            {folder}
          </option>
        ))}
      </select>
    </div>
    <div className="file">
      <label htmlFor="file">Select Tafseer:</label>
      <select id="file" value={selectedFile} onChange={(e) => setSelectedFile(e.target.value)} className="select-option-file">
        <option value="">Select Tafseer</option>
        {files.map((file) => (
          <option key={file} value={file}>
            {fileMapping[file] || file}
          </option>
        ))}
      </select>
      <button className="previous-button" onClick={handlePreviousFile} disabled={fileIndex === 0}>
        Previous
      </button>
      <button className="next-button" onClick={handleNextFile} disabled={fileIndex === files.length - 1}>
        Next
      </button>
    </div>
    {/* Enlarge/Shrink Button */}
    {xmlData && (
      <button className={`enlarge-button ${enlargedView ? 'shrink' : ''}`} onClick={toggleEnlargedView}>
        {enlargedView ? 'Shrink' : 'Enlarge'}
      </button>
    )}
    {loading ? (
      <Spinner />
    ) : (
      <>
        {xmlData ? (
          renderClickableNames()
        ) : (
          <p style={{ marginLeft: "42%" }}>No data available.</p>
        )}
      </>
    )}
  </div>
);
};

export default XMLRenderer;

