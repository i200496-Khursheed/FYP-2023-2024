// XMLRenderer.js
import React, { useState, useEffect } from 'react';
import xmljs from 'xml-js';
import './Tafseer.css';
import Spinner from '../Spinner/Spinner'; // Import Spinner component

const XMLRenderer = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [xmlData, setXmlData] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (selectedFolder) {
      fetchFiles(selectedFolder);
    }
  }, [selectedFolder]);

  useEffect(() => {
    if (selectedFolder && files.length > 0) {
      fetchXmlData(selectedFolder, files[selectedFileIndex]);
    }
  }, [selectedFolder, selectedFileIndex, files]);

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
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const fetchXmlData = async (folder, file) => {
    try {
      setLoading(true); // Set loading state to true when fetching XML data
      const response = await fetch(`/XMLFiles/${folder}/${file}`);
      if (!response.ok) {
        throw new Error('Failed to fetch XML data');
      }
      const xml = await response.text();
      const jsonData = xmljs.xml2json(xml, { compact: true, spaces: 4 });
      setXmlData(JSON.parse(jsonData));
    } catch (error) {
      console.error('Error fetching XML:', error);
    } finally {
      setLoading(false); // Set loading state to false when fetching is done
    }
  };

  const handleFolderChange = (e) => {
    setSelectedFolder(e.target.value);
    setSelectedFileIndex(0);
  };

  const handleFileChange = (e) => {
    setSelectedFileIndex(Number(e.target.value));
  };

  const handleNext = () => {
    setSelectedFileIndex((prevIndex) => (prevIndex + 1) % files.length);
  };

  const handlePrevious = () => {
    setSelectedFileIndex((prevIndex) => (prevIndex - 1 + files.length) % files.length);
  };

  const renderTaggedEntities = (content) => {
    if (!content || typeof content !== 'string') return content;
    const entitiesRegex = /<name role="([^"]+)">([^<]+)<\/name>/g;
    return content.split(entitiesRegex).map((segment, index) => {
      if (index % 3 === 1) {
        const roleName = segment;
        const entityContent = arguments[index + 1];
        return <span key={index} className={roleName}>{entityContent}</span>;
      }
      return segment;
    });
  };

  return (
    <div>
      <div className="folder">
        <label htmlFor="folder">Select a folder:</label>
        <select id="folder" value={selectedFolder} onChange={handleFolderChange} className="select-option-folder">
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
        <select id="file" value={selectedFileIndex} onChange={handleFileChange} className="select-option-file">
          {files.map((file, index) => (
            <option key={file} value={index}>
              {file}
            </option>
          ))}
        </select>
        <button className="previous-button" onClick={handlePrevious} disabled={files.length === 0 || selectedFileIndex === 0}>
          Previous
        </button>
        <button className="next-button" onClick={handleNext} disabled={files.length === 0 || selectedFileIndex === files.length - 1}>
          Next
        </button>
      </div>
      {loading ? (
        <Spinner /> // Show spinner while loading
      ) : (
        xmlData ? (
          <div className="details-T">
            <h1>{xmlData.TEI._attributes.default}</h1>
            <div>
              <div>
                <div>
                  <h2>{xmlData.TEI.teiHeader.fileDesc.titleStmt.title._text}</h2>
                </div>
              </div>
            </div>
            <div>
              <div>
                {Array.isArray(xmlData.TEI.text.body.div) ? (
                  xmlData.TEI.text.body.div.map((div, index) => (
                    <div key={index}>
                      {div.head && <h2>{renderTaggedEntities(div.head._text)}</h2>}
                      {Array.isArray(div.p) && div.p.map((p, index) => (
                        <p key={index}>
                          {p._attributes && p._attributes.n === 'hadith' && p.note && (
                            <React.Fragment>
                              <strong>Hadith ({p.note._text}): </strong>
                              {renderTaggedEntities(p._text)}
                            </React.Fragment>
                          )}
                          {p._attributes && p._attributes.n === 'hadith' && !p.note && (
                            <React.Fragment>
                              <strong>Hadith: </strong>
                              {renderTaggedEntities(p._text)}
                            </React.Fragment>
                          )}
                          {(!p._attributes || p._attributes.n !== 'hadith') && renderTaggedEntities(p._text)}
                        </p>
                      ))}
                    </div>
                  ))
                ) : (
                  <div>
                    {xmlData.TEI.text.body.div.head && (
                      <h2>{renderTaggedEntities(xmlData.TEI.text.body.div.head._text)}</h2>
                    )}
                    {Array.isArray(xmlData.TEI.text.body.div.p) && xmlData.TEI.text.body.div.p.map((p, index) => (
                      <p key={index}>
                        {p._attributes && p._attributes.n === 'hadith' && p.note && (
                          <React.Fragment>
                            <strong>Hadith ({p.note._text}): </strong>
                            {renderTaggedEntities(p._text)}
                          </React.Fragment>
                        )}
                        {p._attributes && p._attributes.n === 'hadith' && !p.note && (
                          <React.Fragment>
                            <strong>Hadith: </strong>
                            {renderTaggedEntities(p._text)}
                          </React.Fragment>
                        )}
                        {(!p._attributes || p._attributes.n !== 'hadith') && renderTaggedEntities(p._text)}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>No XML data available.</p> // Show message if no XML data is available
        )
      )}
    </div>
  );
};

export default XMLRenderer;
