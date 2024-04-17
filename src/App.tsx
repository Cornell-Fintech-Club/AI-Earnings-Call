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
  console.log(symbol)

  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  const handleSignUpClick = () => {
    setShowRegistration(true);
  };

  const handleRegisterSuccess = () => {
    setShowRegistration(false);
    console.log("good")
  };

  return (
    <AuthProvider>
      <div>
        <Header />
        {loggedIn ? (
          <>
            <CompanySearchBar setFinalSymbol={setSymbol} />
            {symbol && <div className="app-container d-flex justify-content-between">
              <TranscriptionContainer onLogout={() => setLoggedIn(false)} username="junchoi" symbol = {symbol}/>
              <Portfolio username = "junchoi" />
            </div>}
          </>
        ) : (
          showRegistration ? <RegisterPage onRegisterSuccess={handleRegisterSuccess} /> : <WelcomePage onLoginSuccess={handleLoginSuccess} onSignUpClick={handleSignUpClick} />        )}
      </div>
    </AuthProvider>
  );
};

export default App;