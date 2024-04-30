import React, { useState } from 'react';
import './App.css';
import Header from './components/header';
import TranscriptionContainer from './components/transcription_box';
import WelcomePage from './components/WelcomePage';
import { AuthProvider, useAuth } from './components/auth_context';
import CompanySearchBar from './components/companysearchbar';
import Portfolio from './components/portfolio';
import RegisterPage from './components/RegisterPage';

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [symbol, setSymbol] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  const handleSignUpClick = () => {
    setShowRegistration(true);
  };

  const handleRegisterSuccess = () => {
    setShowRegistration(false);
  };

  return (
    <AuthProvider>
      <div>
        <Header />
        {loggedIn ? (
          <>
            <CompanySearchBar setFinalSymbol={setSymbol} />
            <div className="app-container d-flex justify-content-between">
              {/* Portfolio section */}
              <div className="portfolio-container1">
                <Portfolio username="junchoi" />
              </div>
              {/* Transcription section */}
              <div className="transcription-container">
                <TranscriptionContainer onLogout={() => setLoggedIn(false)} username="junchoi" symbol={symbol} />
              </div>
            </div>
          </>
        ) : (
          showRegistration ? <RegisterPage onRegisterSuccess={handleRegisterSuccess} /> : <WelcomePage onLoginSuccess={handleLoginSuccess} onSignUpClick={handleSignUpClick} />
        )}
      </div>
    </AuthProvider>
  );
};

export default App;
