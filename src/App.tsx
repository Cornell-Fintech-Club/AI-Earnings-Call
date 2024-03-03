import React, { useState } from 'react';
import './App.css';
import Header from './components/header';
import TranscriptionContainer from './components/transcription_box';
import WelcomePage from './components/WelcomePage';
import { AuthProvider, useAuth } from './components/auth_context';
import CompanySearchBar from './components/companysearchbar';

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  return (
    <AuthProvider>
      <div>
        <Header />
        {loggedIn && <CompanySearchBar />} {/* Render only if logged in */}
        <div className="app-container d-flex justify-content-between">
          {loggedIn ? (
            <>
            <TranscriptionContainer onLogout={() => setLoggedIn(false)} username="junchoi" />
              <div className="portfolio-container">
                <h1>Portfolio</h1>
                <div className="company-box">Company 1</div>
                <div className="company-box">Company 2</div>
                <div className="company-box">Company 3</div>
              </div>
            </>
          ) : (
            <WelcomePage onLoginSuccess={handleLoginSuccess} />
          )}
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;