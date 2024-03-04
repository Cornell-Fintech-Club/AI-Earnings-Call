import React, { useState } from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import logo from './logo.png';

const WelcomePage: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data.message);
        setLoginError(null); // Reset login error on successful login
        onLoginSuccess(); // Trigger the callback on successful login
        // You might want to store the access token in a secure way, depending on your application requirements.
      } else {
        const errorData = await response.json();
        console.log('Login failed:', errorData.message);
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:');
      setLoginError('Error during login');
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center" style={{ textAlign: 'center' }}>
      <h1 className="welcome-page-title">Welcome!</h1>

      <div className="button-group" style={{ width: '100%' }}>
        <button className="button-group">
          Login with Google
        </button>
      </div>

      {/* Login with Apple */}
      <div className="button-group" style={{ width: '100%' }}>
        <button className="button-group">
          Login with Apple
        </button>
      </div>

      {/* OR separator */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0', width: '100%' }}>
        <div style={{ width: '16.5%', height: '1px', backgroundColor: 'rgb(139, 0, 0)' }}></div>
        <div style={{ margin: '0 10px', fontWeight: 'bold', fontSize: '14px' }}>OR</div>
        <div style={{ width: '16.5%', height: '1px', backgroundColor: 'rgb(139, 0, 0)' }}></div>
      </div>

      {/* Email and Password input */}
      <div className="button-group" style={{ width: '100%' }}>
        <input
          type="email"
          placeholder="Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="email-input"
        />
      </div>

      <div className="button-group" style={{ width: '100%' }}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="email-input"
        />
      </div>

      {/* Show/Hide button for password */}
      <div className="button-group" style={{ width: '100%' }}>
        <button
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* Login button */}
      <div className="button-group">
        <button onClick={handleLogin}>Login</button>
      </div>

      {/* Error message display */}
      {loginError && (
        <div className="button-group">
          <span className="error-message">{loginError}</span>
        </div>
      )}

      {/* Forgot password link */}
      <div className="button-group">
        <span className="forgot-password">Forgot password?</span>
      </div>

      {/* Sign-up link */}
      <div className="sign-up-link">
        Don't have an account? <span className="sign-up">Sign up</span>
      </div>
    </div>
  );
};

export default WelcomePage;
