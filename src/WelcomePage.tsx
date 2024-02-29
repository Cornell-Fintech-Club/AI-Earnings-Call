import React, { useState } from 'react';
import './App.css';
import logo from './logo.png';

const WelcomePage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="container">
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <div className="title">AI Earnings Call</div>
      </div>
      <div className="welcome-page">
        <h1 className="welcome-page-title">Welcome!</h1>
        <div className="button-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '40%' }} 
          />
        </div>
        <div className="button-group">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '40%' }} 
          />
          <button onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? 'Hide' : 'Show'} 
          </button>
        </div>
        <div className="button-group">
          <button onClick={handleLogin} style={{ width: '40%' }}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
