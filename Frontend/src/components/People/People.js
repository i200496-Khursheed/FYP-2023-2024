import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './People.css';
import Footer from '../Footer/Footer'; // Import Footer component

const People = () => {
  const location = useLocation();
  const { resultsData } = location.state || {};

  const [selectedValue, setSelectedValue] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(resultsData || []);
  }, [resultsData]);

  const renderTableData = () => {
    return (
      tableData &&
      tableData.map((data, index) => (
        <tr key={index}>
          <td>{data.abstract}</td>
          <td>{data.death}</td>
        </tr>
      ))
    );
  };

  const handleDropdownChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleRenderTable = () => {
    if (selectedValue) {
      fetchData(selectedValue);
    }
  };

  const fetchData = async (selectedName) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/query_federated/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ person: selectedName }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Backend Response:', data);
  
        if (data && data.result && data.result.results && Array.isArray(data.result.results.bindings)) {
          setTableData(
            data.result.results.bindings.map(item => ({
              abstract: item.abstract?.value || '',
              death: item.death?.value || '',
            }))
          );
  
          setShowTable(true);
        } else {
          console.error('Invalid backend response:', data);
        }
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

    return (
      <div>
        <div className="back-button-VQR" onClick={() => window.history.back()}>
          <img src={require('../../assets/back_button.png')} alt="Back Button" />
        </div>
        <div className={`query-text-box-P`}>
        <select onChange={handleDropdownChange} value={selectedValue}>
          <option value="">Select...</option>
          <option value="محمد">محمد</option>
          {/* Add other options here */}
        </select>

        <button onClick={handleRenderTable}>Learn About the Person</button>
      </div>

      {showTable && (
        <div className="details-table-P">
          <table>
            <thead>
              <tr>
                <th>Abstract</th>
                <th>Death</th>
              </tr>
            </thead>
            <tbody>{renderTableData()}</tbody>
          </table>
        </div>
      )}

      <div className="Footer-portion-P">
        <Footer />
      </div>
    </div>
  );
};

export default People;


