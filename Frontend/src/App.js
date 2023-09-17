import React from 'react';
import Navbar from './components/Navbar/Navbar';
import MainContent from './components/MainContent/MainContent';

function App() {
  return (
    <div className="App">
      <Navbar />
      <header className="App-header">
        <MainContent />
      </header>
    </div>
  );
}

export default App;
