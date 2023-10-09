//HadithQueryBuilderPage.js
import React from 'react';
import HadithQueryBuilder from '../components/HadithQueryBuilder/HadithQueryBuilder'; // Import HadithQueryBuilder component
import { useNavigate } from 'react-router-dom';


function HadithQueryBuilderPage() {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleRunQuery = () => {
    // Add the logic to handle the query results here
    // You can navigate to the results page using a similar approach as below
    navigate('/hadith-query-results');
  };
  
  return (
    <div>
      <HadithQueryBuilder onRunQuery={handleRunQuery} />
    </div>
  );
}

export default HadithQueryBuilderPage;
