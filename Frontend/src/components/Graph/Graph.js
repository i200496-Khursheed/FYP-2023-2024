import React from 'react';
import './Graph.css'; // Import your CSS file

const Graph = () => {
  // Construct the URL with parameters to navigate to the visual graph options
  const graphDBUrl = 'http://HafuzTunn:7200/graphs-visualizations'; // Example URL
  // Add any necessary parameters to navigate to the visual graph options
  const params = new URLSearchParams({
    option: 'visual', // Example parameter to specify visual graph options
  });

  // Combine the base URL with parameters
  const srcUrl = `${graphDBUrl}?${params}`;

  return (
    <div className="graph-container">
      <div className="back-button-Graph" onClick={() => window.history.back()}>
        <img src={require('../../assets/back_button.png')} alt="Back Button" />
      </div>
      <iframe
        className="graph-iframe"
        src={srcUrl}
        title="GraphDB Interface"
      />
    </div>
  );
};

export default Graph;
