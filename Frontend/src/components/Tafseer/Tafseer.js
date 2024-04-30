import React, { useState, useEffect } from 'react';
import './Tafseer.css';
import Spinner from '../Spinner/Spinner'; // Import Spinner component
import { useNavigate } from 'react-router-dom';

const XMLRenderer = () => {
  const navigate = useNavigate(); // Declare navigate using useNavigate hook
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(localStorage.getItem('selectedFolder') || '');
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(localStorage.getItem('selectedFile') || '');
  const [xmlData, setXmlData] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileIndex, setFileIndex] = useState(0);
  const [enlargedView, setEnlargedView] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Define the file mapping object
  const fileMapping = {
    "sure_0_section.xml": "S000A MuqadimaA",
    "sure_1_section_0.11-0.16.xml": "S001M - Part 1",
    "sure_1_section_1.1-1.14.xml": "S001M - Part 2",
    "sure_2_section_2.1-2.42.xml": "S002A - Part 1",
    "sure_2_section_2.113-2.165.xml": "S002A - Part 2",
    "sure_2_section_2.166-2.210.xml": "S002A - Part 3",
    "sure_2_section_2.211-2.263.xml": "S002A - Part 4",
    "sure_2_section_2.264-2.297.xml": "S002A - Part 5",
    "sure_2_section_2.298-2.344.xml": "S002A - Part 6",
    "sure_2_section_2.345-2.395.xml": "S002A - Part 7",
    "sure_2_section_2.396-2.439.xml": "S002A - Part 8",
    "sure_2_section_2.43-2.77.xml": "S002A - Part 9",
    "sure_2_section_2.440-2.482.xml": "S002A - Part 10",
    "sure_2_section_2.483-2.498.xml": "S002A - Part 11",
    "sure_2_section_2.499-2.523.xml": "S002A - Part 12",
    "sure_2_section_2.524-2.532.xml": "S002A - Part 13",
    "sure_2_section_2.533-2.548.xml": "S002A - Part 14",
    "sure_2_section_2.549-2.582.xml": "S002A - Part 15",
    "sure_2_section_2.583-2.613.xml": "S002A - Part 16",
    "sure_2_section_2.614-2.626.xml": "S002A - Part 17",
    "sure_2_section_2.627-2.648.xml": "S002A - Part 18",
    "sure_2_section_2.649-2.672.xml": "S002A - Part 19",
    "sure_2_section_2.673-2.685.xml": "S002A - Part 20",
    "sure_2_section_2.686-2.717.xml": "S002A - Part 21",
    "sure_2_section_2.718-2.750.xml": "S002A - Part 22",
    "sure_2_section_2.751-2.797.xml": "S002A - Part 23",
    "sure_2_section_2.78-2.112.xml": "S002A - Part 24",
    "sure_2_section_2.798-2.830.xml": "S002A - Part 25",
    "sure_3_section_3.1-3.48.xml": "S003A - Part 1",
    "sure_3_section_3.139-3.171.xml": "S003A - Part 2",
    "sure_3_section_3.172-3.210.xml": "S003A - Part 3",
    "sure_3_section_3.211-3.249.xml": "S003A - Part 4",
    "sure_3_section_3.250-3.290.xml": "S003A - Part 5",
    "sure_3_section_3.291-3.301.xml": "S003A - Part 6",
    "sure_3_section_3.49-3.95.xml": "S003A - Part 7",
    "sure_3_section_3.96-3.138.xml": "S003A - Part 8",
    "sure_4_section_4.1-4.27.xml": "S004N - Part 1",
    "sure_4_section_4.115-4.148.xml": "S004N - Part 2",
    "sure_4_section_4.149-4.197.xml": "S004N - Part 3",
    "sure_4_section_4.198-4.208.xml": "S004N - Part 4",
    "sure_4_section_4.209-4.241.xml": "S004N - Part 5",
    "sure_4_section_4.242-4.277.xml": "S004N - Part 6",
    "sure_4_section_4.278-4.302.xml": "S004N - Part 7",
    "sure_4_section_4.28-4.57.xml": "S004N - Part 8",
    "sure_4_section_4.58-4.84.xml": "S004N - Part 9",
    "sure_4_section_4.85-4.114.xml": "S004N - Part 10",
    "sure_5_section_5.1-5.35.xml": "S005Cat NER MA - Part 1",
    "sure_5_section_5.106-5.125.xml": "S005Cat NER MA - Part 2",
    "sure_5_section_5.126-5.137.xml": "S005Cat NER MA - Part 3",
    "sure_5_section_5.138-5.178.xml": "S005Cat NER MA - Part 4",
    "sure_5_section_5.179-5.205.xml": "S005Cat NER MA - Part 5",
    "sure_5_section_5.206-5.224.xml": "S005Cat NER MA - Part 6",
    "sure_5_section_5.225-5.256.xml": "S005Cat NER MA - Part 7",
    "sure_5_section_5.36-5.52.xml": "S005Cat NER MA - Part 8",
    "sure_5_section_5.53-5.105.xml": "S005Cat NER MA - Part 9",
    "sure_6_section_6.1-6.63.xml": "S006N - Part 1",
    "sure_6_section_6.101-6.144.xml": "S006N - Part 2",
    "sure_6_section_6.145-6.199.xml": "S006N - Part 3",
    "sure_6_section_6.200-6.234.xml": "S006N - Part 4",
    "sure_6_section_6.235-6.241.xml": "S006N - Part 5",
    "sure_6_section_6.64-6.100.xml": "S006N - Part 6",
    "sure_7_section_7.1-7.48.xml": "S007A - Part 1",
    "sure_7_section_7.151-7.191.xml": "S007A - Part 2",
    "sure_7_section_7.192-7.232.xml": "S007A - Part 3",
    "sure_7_section_7.233-7.235.xml": "S007A - Part 4",
    "sure_7_section_7.49-7.89.xml": "S007A - Part 5",
    "sure_7_section_7.90-7.150.xml": "S007A - Part 6",
    "sure_8_section_8.1-8.26.xml": "S008CatA - Part 1",
    "sure_8_section_8.27-8.56.xml": "S008CatA - Part 2",
    "sure_8_section_8.57-8.83.xml": "S008CatA - Part 3",
    "sure_9_section_9.1-9.28.xml": "S009CatA - Part 1",
    "sure_9_section_9.116-9.131.xml": "S009CatA - Part 2",
    "sure_9_section_9.29-9.62.xml": "S009CatA - Part 3",
    "sure_9_section_9.63-9.92.xml": "S009CatA - Part 4",
    "sure_9_section_9.93-9.115.xml": "S009CatA - Part 5",
    "sure_10_section_10.1-10.68.xml": "S010M - Part 1",
    "sure_10_section_10.69-10.108.xml": "S010M - Part 2",
    "sure_11_section_11.1-11.42.xml": "S011CatA - Part 1",
    "sure_11_section_11.43-11.81.xml": "S011CatA - Part 2",
    "sure_11_section_11.82-11.112.xml": "S011CatA - Part 3",
    "sure_12_section_12.1-12.22.xml": "S012CatA - Part 1",
    "sure_12_section_12.23-12.60.xml": "S012CatA - Part 2",
    "sure_12_section_12.61-12.84.xml": "S012CatA - Part 3",
    "sure_12_section_12.85-12.91.xml": "S012CatA - Part 4",
    "sure_13_section_13.1-13.21.xml": "S013M - Part 1",
    "sure_13_section_13.22-13.39.xml": "S013M - Part 2",
    "sure_14_section_14.1-14.34.xml": "S014M - Part 1",
    "sure_14_section_14.35-14.44.xml": "S014M - Part 2",
    "sure_15_section_15.1-15.44.xml": "S015M - Part 1",
    "sure_15_section_15.45-15.51.xml": "S015M - Part 2",
    "sure_16_section_16.1-16.61.xml": "S016A - Part 1",
    "sure_16_section_16.112-16.112.xml": "S016A - Part 2",
    "sure_16_section_16.62-16.111.xml": "S016A - Part 3",
    "sure_17_section_17.1-17.13.xml": "S017N - Part 1",
    "sure_17_section_17.14-17.53.xml": "S017N - Part 2",
    "sure_17_section_17.54-17.86.xml": "S017N - Part 3",
    "sure_17_section_17.87-17.102.xml": "S017N - Part 4",
    "sure_18_section_18.1-18.26.xml": "S018CatA - Part 1",
    "sure_18_section_18.27-18.64.xml": "S018CatA - Part 2",
    "sure_18_section_18.65-18.77.xml": "S018CatA - Part 3",
    "sure_19_section_19.1-19.38.xml": "S019N - Part 1",
    "sure_19_section_19.39-19.67.xml": "S019N - Part 2",
    "sure_20_section_20.1-20.42.xml": "S020CatA - Part 1",
    "sure_20_section_20.43-20.71.xml": "S020CatA - Part 2",
    "sure_21_section_21.1-21.61.xml": "S021CatA - Part 1",
    "sure_21_section_21.62-21.85.xml": "S021CatA - Part 2",
    "sure_22_section_22.1-22.27.xml": "S022CatA - Part 1",
    "sure_22_section_22.28-22.63.xml": "S022CatA - Part 2",
    "sure_23_section_23.1-23.67.xml": "S023CatN - Part 1",
    "sure_24_section_24.1-24.27.xml": "S024CatA - Part 1",
    "sure_24_section_24.28-24.52.xml": "S024CatA - Part 2",
    "sure_24_section_24.53-24.55.xml": "S024CatA - Part 3",
    "sure_25_section_25.1-25.46.xml": "S025N - Part 1",
    "sure_25_section_25.47-25.52.xml": "S025N - Part 2",
    "sure_26_section_26.1-26.67.xml": "S026N - Part 1",
    "sure_26_section_26.68-26.69.xml": "S026N - Part 2",
    "sure_27_section_27.1-27.50.xml": "S027N - Part 1",
    "sure_27_section_27.51-27.56.xml": "S027N - Part 2",
    "sure_28_section_28.1-28.38.xml": "S028N - Part 1",
    "sure_28_section_28.39-28.73.xml": "S028N - Part 2",
    "sure_29_section_29.1-29.60.xml": "S029M - Part 1",
    "sure_30_section_30.1-30.50.xml": "S030M - Part 1",
    "sure_31_section_31.1-31.28.xml": "S031M - Part 1",
    "sure_32_section_32.1-32.21.xml": "S032M - Part 1",
    "sure_33_section_33.1-33.26.xml": "S033N - Part 1",
    "sure_33_section_33.27-33.51.xml": "S033N - Part 2",
    "sure_34_section_34.1-34.45.xml": "S034N - Part 1",
    "sure_35_section_35.1-35.31.xml": "S035N - Part 1",
    "sure_36_section_36.1-36.39.xml": "S036N - Part 1",
    "sure_37_section_37.1-37.32.xml": "S037CatA - Part 1",
    "sure_37_section_37.33-37.47.xml": "S037CatA - Part 2",
    "sure_38_section_38.1-38.23.xml": "S038A - Part 1",
    "sure_38_section_38.24-38.34.xml": "S038A - Part 2",
    "sure_39_section_39.1-39.51.xml": "S039A - Part 1",
    "sure_40_section_40.1-40.53.xml": "S040A - Part 1",
    "sure_41_section_41.1-41.39.xml": "S041CatN - Part 1",
    "sure_42_section_42.1-42.36.xml": "S042A - Part 1",
    "sure_43_section_43.1-43.50.xml": "S043A - Part 1",
    "sure_44_section_44.1-44.20.xml": "S044M - Part 1",
    "sure_45_section_45.1-45.30.xml": "S045M - Part 1",
    "sure_46_section_46.1-46.28.xml": "S046CatN - Part 1",
    "sure_47_section_47.1-47.24.xml": "S047M - Part 1",
    "sure_48_section_48.1-48.20.xml": "S048A - Part 1",
    "sure_49_section_49.1-49.16.xml": "S049CatN - Part 1",
    "sure_50_section_50.1-50.22.xml": "S050CatN - Part 1",
    "sure_51_section_51.1-51.25.xml": "S051A - Part 1",
    "sure_52_section_52.1-52.19.xml": "S052A - Part 1",
    "sure_53_section_53.1-53.18.xml": "S053AN - Part 1",
    "sure_54_section_54.1-54.20.xml": "S054A - Part 1",
    "sure_55_section_55.1-55.20.xml": "S055N - Part 1",
    "sure_56_section_56.1-56.20.xml": "S056N - Part 1",
    "sure_57_section_57.1-57.23.xml": "S057N - Part 1",
    "sure_58_section_58.1-58.20.xml": "S058N - Part 1",
    "sure_59_section_59.1-59.17.xml": "S059N - Part 1",
    "sure_60_section_60.1-60.12.xml": "S060A - Part 1",
    "sure_61_section_61.1-61.10.xml": "S061M - Part 1",
    "sure_62_section_62.1-62.10.xml": "S062M - Part 1",
    "sure_63_section_63.1-63.10.xml": "S063CatM - Part 1",
    "sure_64_section_64.1-64.14.xml": "S064M - Part 1",
    "sure_65_section_65.1-65.8.xml": "S065A - Part 1",
    "sure_66_section_66.1-66.12.xml": "S066A - Part 1",
    "sure_67_section_67.1-67.19.xml": "S067M - Part 1",
    "sure_68_section_68.1-68.19.xml": "S068N - Part 1",
    "sure_69_section_69.1-69.13.xml": "S069N - Part 1",
    "sure_70_section_70.1-70.11.xml": "S070N - Part 1",
    "sure_71_section_71.1-71.9.xml": "S071M - Part 1",
    "sure_72_section_72.1-72.11.xml": "S072CatN - Part 1",
    "sure_73_section_73.1-73.8.xml": "S073N - Part 1",
    "sure_74_section_74.1-74.10.xml": "S074N - Part 1",
    "TT_s074_div010.xml": "S074N - Part 2",
    "sure_75_section_75.1-75.8.xml": "S075N - Part 1",
    "sure_76_section_76.1-76.14.xml": "S076M - Part 1",
    "sure_77_section_77.1-77.10.xml": "S077N - Part 1",
    "sure_78_section_78.1-78.9.xml": "S078N - Part 1",
    "sure_79_section_79.1-79.9.xml": "S079N - Part 1",
    "sure_80_section_80.1-80.6.xml": "S080M - Part 1",
    "sure_81_section_81.1-81.6.xml": "S081M - Part 1",
    "sure_82_section_82.1-82.4.xml": "S082M - Part 1",
    "sure_83_section_83.1-83.9.xml": "S083M - Part 1",
    "sure_84_section_84.1-84.5.xml": "S084M - Part 1",
    "sure_85_section_85.1-85.6.xml": "S085CatM - Part 1",
    "sure_86_section_86.1-86.2.xml": "S086M - Part 1",
    "sure_87_section_87.1-87.3.xml": "S087M - Part 1",
    "sure_88_section_88.1-88.4.xml": "S088M - Part 1",
    "sure_89_section_89.1-89.6.xml": "S089CatN - Part 1",
    "sure_90_section_90.1-90.3.xml": "S090A - Part 1",
    "sure_91_section_91.1-91.2.xml": "S091M - Part 1",
    "sure_92_section_92.1-92.3.xml": "S092CatM - Part 1",
    "sure_93_section_93.1-93.2.xml": "S093M - Part 1",
    "sure_94_section_94.1-94.1.xml": "S094M - Part 1",
    "sure_95_section_95.1-95.2.xml": "S095M - Part 1",
    "sure_96_section_96.1-96.5.xml": "S096M - Part 1",
    "sure_97_section_97.1-97.1.xml": "S097M - Part 1",
    "sure_98_section_98.1-98.4.xml": "S098M - Part 1",
    "sure_99_section_99.1-99.1.xml": "S099M - Part 1",
    "sure_100_section_100.1-100.1.xml": "S100M - Part 1",
    "sure_101_section_101.1-101.1.xml": "S101M - Part 1",
    "sure_102_section_102.1-102.1.xml": "S102M - Part 1",
    "sure_103_section_103.1-103.1.xml": "S103CatM - Part 1",
    "sure_104_section_104.1-104.1.xml": "S104CatM - Part 1",
    "sure_105_section_105.1-105.1.xml": "S105CatM - Part 1",
    "sure_106_section_106.1-106.1.xml": "S106CatM - Part 1",
    "sure_107_section_107.1-107.1.xml": "S107M - Part 1",
    "sure_108_section_108.1-108.1.xml": "S108NM - Part 1",
    "sure_109_section_109.1-109.1.xml": "S109CatM - Part 1",
    "sure_110_section_110.1-110.1.xml": "S110M - Part 1",
    "sure_111_section_111.1-111.1.xml": "S111CatM - Part 1",
    "sure_112_section_112.1-112.1.xml": "S112CatM - Part 1",
    "sure_113_section_113.1-113.1.xml": "S113CatM - Part 1",
    "sure_114_section_114.1-114.1.xml": "S114\u0658M - Part 1"
};

  useEffect(() => {
    fetchFolders();
  }, []);

  // useEffect(() => {
  //   if (files.length > 0) {
  //     setSelectedFile(files[fileIndex]);
  //   }
  // }, [files, fileIndex]);

  useEffect(() => {
    if (selectedFolder) {
      fetchFiles(selectedFolder);
      // Reset fileIndex to 0 when selectedFolder changes
      setFileIndex(0);
    }
  }, [selectedFolder]);
  

  useEffect(() => {
    console.log("selectedFolder:", selectedFolder);
    console.log("selectedFile:", selectedFile);
  
    // Check if both selectedFolder and selectedFile are not empty strings
    if (selectedFolder && selectedFile && selectedFile !== "Select Tafseer") {
      // Check if the selectedFile exists in the files array for the selectedFolder
      if (files.includes(selectedFile)) {
        fetchXmlData(selectedFolder, selectedFile);
      } else {
        // Handle the case where the selected file doesn't exist in the selected folder
        console.error(`Selected file "${selectedFile}" does not exist in the folder "${selectedFolder}".`);
        // You can set xmlData to null or handle the error in a different way
        setXmlData(null);
      }
    }
  }, [selectedFolder, selectedFile, files]);
  

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

  useEffect(() => {
    if (files.length > 0) {
      const storedFileIndex = parseInt(localStorage.getItem('selectedFileIndex'), 10) || 0;
      if (storedFileIndex < files.length) {
        setSelectedFile(files[storedFileIndex]);
        setFileIndex(storedFileIndex);
      }
    }
  }, [files]);
  
  const handleNextFile = () => {
    const currentIndex = files.indexOf(selectedFile);
    if (currentIndex < files.length - 1) {
      const nextFile = files[currentIndex + 1];
      setSelectedFile(nextFile);
      setFileIndex(currentIndex + 1);
      localStorage.setItem('selectedFile', nextFile);
      localStorage.setItem('selectedFileIndex', currentIndex + 1);
    }
  };
  
  const handlePreviousFile = () => {
    const currentIndex = files.indexOf(selectedFile);
    if (currentIndex > 0) {
      const prevFile = files[currentIndex - 1];
      setSelectedFile(prevFile);
      setFileIndex(currentIndex - 1);
      localStorage.setItem('selectedFile', prevFile);
      localStorage.setItem('selectedFileIndex', currentIndex - 1);
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
                className={`clickable-name ${role ? role.replace(/\s+/g, '') : ''} ${tagName === 'persname' ? 'persName' : ''} clickable-name-with-background`}
                title={role}
              >
                {name}
              </span>
            );
          } else if (tagName === 'p') {
            // Insert paragraph break element
            return (
              <React.Fragment key={index}>
                <p>{traverseNodes(node.childNodes)}</p>
                {/* Adjust this line to add spacing as needed */}
              </React.Fragment>
            );
          }
          else if (tagName === 'head') {
            // Insert paragraph break element
            return (
              <React.Fragment key={index}>
                <head>{traverseNodes(node.childNodes)}</head>
                {/* Adjust this line to add spacing as needed */}
              </React.Fragment>
            );
          } else {
            // Recursively traverse child nodes
            return traverseNodes(node.childNodes);
          }
        }
        return null; // Ignore other types of nodes
      });
    };
    
  
    const clickableNames = traverseNodes(xmlDoc.childNodes);
  
    return (
      <div className={enlargedView ? 'full-xml-container' : 'details-T p'} onClick={toggleEnlargedView}>
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

  useEffect(() => {
    localStorage.setItem('selectedFolder', selectedFolder);
    localStorage.setItem('selectedFile', selectedFile);
  }, [selectedFolder, selectedFile]);

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
        <p style={{ marginLeft: "42%" }}>
          {selectedFolder && selectedFolder !== "Select Surah"
            ? selectedFile && selectedFile !== "Select Tafseer"
              ? "Please Select Tafseer"
              : "Please Select Surah and Tafseer"
            : "Please Select Surah and Tafseer"}
        </p>
        )}
      </>
    )}
  </div>
);
};

export default XMLRenderer;

