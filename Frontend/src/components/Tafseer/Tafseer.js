// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import './Tafseer.css';
import Spinner from '../Spinner/Spinner'; // Import Spinner component

const XMLRenderer = () => {
  // State variables
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [xmlData, setXmlData] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileIndex, setFileIndex] = useState(0);
  const [enlargedView, setEnlargedView] = useState(false); // New state variable
  const [showButton, setShowButton] = useState(false); // New state variable for showing the button

  // useEffect hook to fetch folders data and add event listeners
  useEffect(() => {
    fetchFolders();
  }, []);

  // useEffect hook to fetch files data whenever selectedFolder changes
  useEffect(() => {
    if (selectedFolder) {
      fetchFiles(selectedFolder);
    }
  }, [selectedFolder]);

  // useEffect hook to fetch XML data whenever selectedFolder or selectedFile changes
  useEffect(() => {
    if (selectedFolder && selectedFile) {
      fetchXmlData(selectedFolder, selectedFile);
    }
  }, [selectedFolder, selectedFile]);

  // useEffect hook to set selectedFile whenever files or fileIndex changes
  useEffect(() => {
    if (files.length > 0) {
      setSelectedFile(files[fileIndex]);
    }
  }, [files, fileIndex]);

  // Function to fetch folders data
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

  // Function to fetch files data
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

  // Function to fetch XML data
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

  // Function to handle next file
  const handleNextFile = () => {
    if (fileIndex < files.length - 1) {
      setFileIndex(prevIndex => prevIndex + 1);
    }
  };

  // Function to handle previous file
  const handlePreviousFile = () => {
    if (fileIndex > 0) {
      setFileIndex(prevIndex => prevIndex - 1);
    }
  };

  // Function to handle click on a name
  const handleNameClick = (name) => {
    console.log('Clicked on name:', name);
  };

 // Function to handle toggling the enlargement of the XML data container
  const toggleEnlargedView = (event) => {
    // Check if the clicked element is the Enlarge button
    if (event.target.classList.contains('enlarge-button')) {
      setEnlargedView(!enlargedView);
    }
  };

  // Function to render clickable names
  const renderClickableNames = () => {
    if (!xmlData) return null;

    // Parse the XML string
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, 'text/xml');

    // Replace names with clickable spans
    const nameElements = xmlDoc.querySelectorAll('name[role]');
    nameElements.forEach((nameElement) => {
      const name = nameElement.textContent;
      const role = nameElement.getAttribute('role'); // Get the role attribute

      // Create a span element for the clickable name
      const span = document.createElement('span');
      span.textContent = name;
      span.classList.add('clickable-name');
      span.classList.add(role); // Add the role as a class to the span

      // Add event listener
      span.addEventListener('click', () => handleNameClick(name));

      // Add tooltip for the role
      span.setAttribute('title', role);

      // Replace the original name element with the span
      nameElement.parentNode.replaceChild(span, nameElement);
    });

    // Get the updated XML string
    const updatedXmlData = new XMLSerializer().serializeToString(xmlDoc);

    return (
      <div className={enlargedView ? 'full-xml-container' : 'details-T'} onClick={toggleEnlargedView}>
        <div className={enlargedView ? 'full-xml' : ''} dangerouslySetInnerHTML={{ __html: updatedXmlData }} />
      </div>
    );
  };

  // Function to handle scroll event
  const handleScroll = () => {
    if (window.pageYOffset > -10) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  // Add event listener for scroll on mount
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <div className="folder">
        <label htmlFor="folder">Select a folder:</label>
        <select id="folder" value={selectedFolder} onChange={(e) => setSelectedFolder(e.target.value)} className="select-option-folder">
          <option value="">Select a folder</option>
          {folders.map((folder) => (
            <option key={folder} value={folder}>
              {folder}
            </option>
          ))}
        </select>
      </div>
      <div className="file">
        <label htmlFor="file">Select an XML file:</label>
        <select id="file" value={selectedFile} onChange={(e) => setSelectedFile(e.target.value)} className="select-option-file">
          <option value="">Select an XML file</option>
          {files.map((file) => (
            <option key={file} value={file}>
              {file}
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
            <p style={{ marginLeft: "42%" }}>No XML data available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default XMLRenderer;
