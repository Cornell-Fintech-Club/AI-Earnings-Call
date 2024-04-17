import React, { useState } from "react";
import "../App.css";

interface RegisterProps {
  onRegisterSuccess: () => void;
}

const RegisterPage: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [registered, setRegistered] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleRegister = async () => {
    try {
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
        onRegisterSuccess(); // Callback to handle navigation after successful registration
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

  if (registered) {
    // Manually redirect after successful registration
    window.location.href = "/login";
  }

  return (
    <div className="container">
      <h1>Register</h1>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleRegister}>Register</button>
      </div>
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
};

export default RegisterPage;
