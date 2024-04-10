import React, { useState } from 'react';
import './App.css';
import Header from './components/header';
import TranscriptionContainer from './components/transcription_box';
import WelcomePage from './components/WelcomePage';
import { AuthProvider, useAuth } from './components/auth_context';
import CompanySearchBar from './components/companysearchbar';
import Portfolio from './components/portfolio';

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [symbol, setSymbol] = useState<string | null>(null);
  console.log(symbol)

  const handleLoginSuccess = () => {
    setLoggedIn(true);
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
          <WelcomePage onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </AuthProvider>
  );
};

export default App;