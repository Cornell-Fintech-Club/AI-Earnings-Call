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
        <button className = "button-group" style = {{ width: '36%', height: '40px', backgroundColor: 
              'rgb(250, 252, 251)'}}>
          Login with Google
        </button>
      </div>
      <div className="button-group">
      <button className = "button-group" style = {{ width: '36%', height: '40px', backgroundColor: 
              'rgb(250, 252, 251)'}}>
          Login with Apple
        </button>
      
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
  <div style={{ width: '16.5%', height: '1px', backgroundColor: 'rgb(139, 0, 0)' }}></div>
  <div style={{ margin: '0 10px', fontWeight: 'bold' , fontSize: '14px'}}>OR</div>
  <div style={{ width: '16.5%', height: '1px', backgroundColor: 'rgb(139, 0, 0)' }}></div>
</div>


</div>
<div className="button-group">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="email-input"
        />
      </div>
      <div className="button-group" style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '31.5%', height: '40px', borderRadius:
             '10px', borderTopRightRadius: 0, borderBottomRightRadius: 0, border:
              'none', outline: 'none', paddingLeft: '20px' ,  backgroundColor: 
              'rgb(250, 252, 251)'}} 
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            style={{  width: '45px', height: '42px' , borderTopRightRadius:
             '10px', borderBottomRightRadius: '10px', borderTopLeftRadius: 0, 
             borderBottomLeftRadius: 0, border: 'none', outline: 'none',
              cursor: 'pointer',  backgroundColor: 'rgb(250, 252, 251)' }}
            >
            {showPassword ? 'Hide' : 'Show'}
          </button>
      </div>
      <div className="button-group">
        <span className="forgot-password">Forgot password?</span>
      </div>
      <div className="button-group">
        <button onClick={handleLogin} className="login-button">
          Login
        </button>
      </div>
      <div className="sign-up-link">
  Don't have an account? <span className="sign-up">Sign up</span>
</div>
    
    </div>
  </div>
);
  }

export default WelcomePage;
