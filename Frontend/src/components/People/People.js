import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Oval as Loader } from 'react-loader-spinner';
import './People.css';
import Footer from '../Footer/Footer';
import Select from 'react-select'; // Import the Select component

const People = () => {
  const location = useLocation();
  const { Refer } = location.state || {}; // Retrieve the Refer value from location state

  const [selectedValue, setSelectedValue] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mentionOptions, setMentionOptions] = useState([]);
  const [filteredMentions, setFilteredMentions] = useState([]);

  useEffect(() => {
    if (Refer) {
      // Set the selected value to the Refer value if available
      setSelectedValue({ value: Refer, label: Refer });
      // Invoke query_federated with the Refer value
      fetchData(Refer);
    }
  }, [Refer]);

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

  const handleInputChange = (selectedOption) => {
    setSelectedValue(selectedOption);
  };

  const handleRenderTable = () => {
    if (selectedValue) {
      setLoading(true);
      fetchData(selectedValue.value);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('/Drop-down-data/Hadith Dropdowns/Mentions Hadith.txt')
      .then((response) => response.text())
      .then((data) => {
        const lines = data.split('\n');
        const mentionedPersons = lines.slice(1).map((line) => {
          const fullName = line.trim();
          return { value: fullName, label: fullName };
        });
        setMentionOptions(mentionedPersons);
        setFilteredMentions(mentionedPersons.slice(0, 8));
      })
      .catch((error) => {
        console.error('Error fetching mentioned persons:', error);
      });
  }, []);

  const handleMentionsInputChange = (inputValue) => {
    const filteredOptions = mentionOptions.filter(option =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredMentions(filteredOptions);
  };

  return (
    <div>
      <div className="back-button-VQR" onClick={() => window.history.back()}>
        <img src={require('../../assets/back_button.png')} alt="Back Button" />
      </div>
      <div className={`query-text-box-P`}>
        <Select
          options={filteredMentions}
          value={selectedValue}
          onChange={handleInputChange}
          onInputChange={handleMentionsInputChange}
          isSearchable
          placeholder="Select or type to search..."
          styles={{
            control: (provided) => ({
              ...provided,
              width: '800px', // Adjust the width as needed
              margin: '5px'
            }),
          }}
        />
        <button onClick={handleRenderTable}>Learn About the Person</button>
      </div>

      {loading && (
        <div className="loader-container">
          <Loader type="Oval" color="#4639E3" height={40} width={40} />
        </div>
      )}

      {showTable && !loading && (
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
