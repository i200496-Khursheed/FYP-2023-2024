import React, { useState, useEffect } from 'react';
import './Tafseer.css';
import Spinner from '../Spinner/Spinner'; // Import Spinner component

const XMLRenderer = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [xmlData, setXmlData] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileIndex, setFileIndex] = useState(0);
  const [narratorNames, setNarratorNames] = useState([]);

  useEffect(() => {
    fetchFolders();
    fetchNarratorNames();
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
      const xml = await response.text();
      setXmlData(xml);
    } catch (error) {
      console.error('Error fetching XML:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNarratorNames = () => {
    fetch('/Drop-down-data/Hadith Dropdowns/Hadith Narrator Names.txt')
      .then((response) => response.text())
      .then((data) => {
        const narratorNamesArray = data.split('\n').map((name) => {
          const trimmedName = name.trim();
          return trimmedName.startsWith(':') ? trimmedName.substring(1) : trimmedName;
        }).filter((name) => name !== '');
        setNarratorNames(narratorNamesArray);
        console.log(narratorNamesArray); // Console log array of narrator names
      })
      .catch((error) => {
        console.error('Error fetching narrator names:', error);
      });
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

  const handleClickOnWord = (word) => {
    // Handle click on word
    console.log("Clicked on word:", word);
  };

  const renderXmlDataWithClickableNames = () => {
    if (!xmlData) return null;

    let parsedXmlData = xmlData;

    // Word to make clickable
    const clickableWord = ["أبو جعفر"];

    // Create a regular expression to match the word
    const regex = new RegExp(`(${clickableWord})`, 'g');
    // Replace occurrences of the word with clickable span
    parsedXmlData = parsedXmlData.replace(regex, `<span class="clickable-word" onClick="handleClickOnWord('${clickableWord}')">$1</span>`);

    return <div dangerouslySetInnerHTML={{ __html: parsedXmlData }} />;
  };

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
      {loading ? (
        <Spinner />
      ) : (
        <>
          {xmlData ? (
            <div className="details-T">
              {renderXmlDataWithClickableNames()}
            </div>
          ) : (
            <p>No XML data available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default XMLRenderer;
