// AboutDialog.js
import React from 'react';
import './AboutDialog.css'; // Import the CSS file for styling

function AboutDialog({ onClose }) {
  return (
    <div className="about-dialog">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>About</h2>
        <p>
          Welcome to The Semantic Web Portal, a meticulously crafted platform dedicated to the study of Tafseer Al-Tabari. The portal is founded upon a robust knowledge graph derived from meticulously curated data sourced from Goethe University Frankfurt, Germany.
        </p>
        <p>This data, expertly annotated in XML format, has been further enriched through semantic annotation, providing users with a profoundly informative and navigable platform.</p>
        <p>
          At the core of the website lies a powerful query builder, empowering users to delve into the depths of Tafseer Al-Tabari. With this tool, users can seamlessly search for commentary, verses, and hadiths.
        </p>
        <p>Moreover, they can explore insights into the individuals mentioned within Tafseer Al-Tabari, gaining a deeper understanding of historical context and significance.</p>
        <p>
          A notable feature of the portal is the interactive visualization of the Tafseer Al-Tabari graph. Users can explore the intricate connections within the knowledge graph, immersing themselves in a visual representation of the data's depth and complexity.
        </p>
        <p>
          In addition to these functionalities, users have access to the complete Tafseer Al-Tabari, free of charge.
        </p>
        <p>Furthermore, a curated selection of pre-built queries is provided, enabling users to explore popular topics and themes within Al-Tabari's knowledge domain.</p>
      </div>
    </div>
  );
}

export default AboutDialog;
