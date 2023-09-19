import React from 'react';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage';
//import Footer from './components/Footer/Footer';
//import MainContent from './components/MainContent/MainContent';


function App() {
  return (
    
    <div className="App">
      <Navbar />
      <header className="App-header">
        <LandingPage />
      </header>
    </div>
  );
}

export default App;
