// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import './HadithQueryResults.css';
// import Footer from '../Footer/Footer'; 

// const HadithQueryResults = () => {
//   const location = useLocation();
//   const { resultsData } = location.state || {};

//   const [isExpanded, setIsExpanded] = useState(false);
//   const [sortOrder, setSortOrder] = useState('asc');

//   const toggleExpand = () => {
//     setIsExpanded(!isExpanded);
//   };

//   const handleSort = (field) => {
//     if (sortOrder === 'asc') {
//       resultsData?.sort((a, b) => a[field]?.value.localeCompare(b[field]?.value));
//       setSortOrder('desc');
//     } else {
//       resultsData?.sort((a, b) => b[field]?.value.localeCompare(a[field]?.value));
//       setSortOrder('asc');
//     }
//   };

//   const renderTableData = () => {
//     return (
//       resultsData &&
//       resultsData.map((data, index) => (
//         <tr key={index}>
//           <td>{data.HadithNo?.value}</td>
//           <td>{data.NarratorName?.value}</td>
//           <td>{data.NarratorType?.value}</td>
//           <td>{data.RootNarrator?.value}</td>
//           <td>{data.Text?.value}</td>
//           <td>{data.Theme?.value}</td>
//           <td>{data.RootNarratorType?.value}</td>
//         </tr>
//       ))
//     );
//   };
  
//   return (
//     <div>
//       <div className={`hadith-query-results ${isExpanded ? 'expanded' : ''}`}>
//         <div className="back-button-HQR" onClick={() => window.history.back()}>
//           <img src={require('../../assets/back_button.png')} alt="Back Button" />
//         </div>
//         <div className={`query-text-box ${isExpanded ? 'expanded' : ''}`}>
//           <div className="details-swipe-bar" onClick={toggleExpand}>
//             <div className={`arrow ${isExpanded ? 'expanded' : ''}`}></div>
//           </div>
//         </div>

//         {isExpanded && resultsData && (
//           <div className="details-table">
//             <table>
//               <thead>
//                 <tr>
//                   <th className="sortable" onClick={() => handleSort('HadithNo')}>
//                     Hadith Number {sortOrder === 'asc' ? '▲' : '▼'}
//                   </th>
//                   <th>Narrator Name</th>
//                   <th>Narrator Type</th>
//                   <th>Root Narrator</th>
//                   <th>Text</th>
//                   <th>Theme</th>
//                   <th>Root Narrator Type</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {renderTableData()}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//       <div className='Footer-portion-HQR'>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default HadithQueryResults;


import React, { useState } from 'react';
import { useLocation, navigate } from 'react-router-dom';
import './HadithQueryResults.css';
import Footer from '../Footer/Footer';

const HadithQueryResults = () => {
  const location = useLocation();
  const { resultsData } = location.state || {};

  const [isExpanded, setIsExpanded] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
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

  const sendHadithNumberToDifferentBackend = (hadithNo) => {
    console.log("here", hadithNo)
    console.log('POST to a different backend endpoint');
    const url = 'http://127.0.0.1:8000/api/different_backend_endpoint/';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hadithNo }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log('Success:', responseData);
        // Handle the response data as needed
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleHadithNumberClick = (hadithNo) => {
    sendHadithNumberToDifferentBackend(hadithNo);
  };

  const renderTableData = () => {
    return (
      resultsData &&
      resultsData.map((data, index) => (
        <tr key={index}>
          <td>
            <button
              className="hadith-number-button"
              onClick={() => handleHadithNumberClick(data.HadithNo?.value)}
              style={{
                backgroundColor: '#3498db',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '5px',
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
              }}
            >
              {data.HadithNo?.value}
            </button>
          </td>
          <td>{data.NarratorName?.value}</td>
          <td>{data.NarratorType?.value}</td>
          <td>{data.RootNarrator?.value}</td>
          <td>{data.Text?.value}</td>
          <td>{data.Theme?.value}</td>
          <td>{data.RootNarratorType?.value}</td>
        </tr>
      ))
    );
  };

  return (
    <div>
      <div className={`hadith-query-results ${isExpanded ? 'expanded' : ''}`}>
        <div className="back-button-HQR" onClick={() => window.history.back()}>
          <img src={require('../../assets/back_button.png')} alt="Back Button" />
        </div>
        <div className={`query-text-box ${isExpanded ? 'expanded' : ''}`}>
          <div className="details-swipe-bar" onClick={toggleExpand}>
            <div className={`arrow ${isExpanded ? 'expanded' : ''}`}></div>
          </div>
        </div>

        {isExpanded && resultsData && (
          <div className="details-table">
            <table>
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleSort('HadithNo')}>
                    Hadith Number {sortOrder === 'asc' ? '▲' : '▼'}
                  </th>
                  <th>Narrator Name</th>
                  <th>Narrator Type</th>
                  <th>Root Narrator</th>
                  <th>Text</th>
                  <th>Theme</th>
                  <th>Root Narrator Type</th>
                </tr>
              </thead>
              <tbody>{renderTableData()}</tbody>
            </table>
          </div>
        )}
      </div>
      <div className='Footer-portion-HQR'>
        <Footer />
      </div>
    </div>
  );
};

export default HadithQueryResults;
