import React, { useState } from "react";
import "../App.css";

const styles = {
  container: {
    marginTop: '20px',
  },
  input: {
    width: '36%',
    height: '40px',
    borderRadius: '10px',
    border: 'none',
    outline: 'none',
    paddingLeft: '20px',
    backgroundColor: 'rgb(250, 252, 251)',
    marginBottom: '10px',
  },
  button: {
    width: '30%',
    height: '35px',
    borderRadius: '10px',
    border: 'none',
    outline: 'none',
    paddingLeft: '10px',
    paddingRight: '20px',
    backgroundColor: 'rgb(200, 173, 173)',
    cursor: 'pointer',
    marginRight: '10px',
  },
  errorMessage: {
    color: 'red',
    marginTop: '10px',
  },
};

interface RegisterProps {
  onRegisterSuccess: () => void;
}

const RegisterPage: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [registered, setRegistered] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match");
        return;
      }

      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful:", data.message);
        setRegistered(true);
        onRegisterSuccess();
      } else {
        const errorData = await response.json();
        console.log("Registration failed:", errorData.message);
        if (errorData.message === "Username already exists") {
          setErrorMessage("Username already exists");
        } else {
          setRegistered(true);
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("An error occurred during registration");
    }
  };

  const handleHomeClick = () => {
    window.location.href = "/"; // Redirect to home page
  };

  if (registered) {
    window.location.href = "/login";
  }

  return (
    <div className="container" style={styles.container}>
      <h1 className="title">Register</h1>
      <div>
        <input
          style={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <input
          style={styles.input}
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleRegister} style={styles.button}>Register</button>
        <button onClick={handleHomeClick} style={styles.button}>Already Registered?</button>
      </div>
      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
    </div>
  );
};

export default RegisterPage;
