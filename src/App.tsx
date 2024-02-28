import React, { useState } from 'react';
import './App.css';
import logo from './logo.png';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleTranscribe = async () => {
    try {
      if (file) {
        console.log("REACHED")
        const formData = new FormData();
        formData.append('audio', file);
  
        const response = await fetch('http://127.0.0.1:5000/transcribe', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          const result = await response.json();
          setTranscription(result.transcription);
        } else {
          console.error('Error transcribing audio:', response.statusText);
        }
      } else {
        console.error('No file selected for transcription.');
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setTranscription('Error transcribing audio.');
    }
  };
  

  return (
    <div>
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <div className="title">AI Earnings Call</div>
      </div>
      <div className="app-container">
        <div className="transcription-container">
          <h1>Audio Transcription</h1>
          <input type="file" accept=".mp3, audio/*" onChange={handleFileChange} />
          <button onClick={handleTranscribe}>Transcribe</button>
          {transcription && <div>Transcription: {transcription}</div>}
        </div>
        <div className="divider"></div>
        <div className="portfolio-container">
          <h1>Portfolio</h1>
          <div className="company-box">Company 1</div>
          <div className="company-box">Company 2</div>
          <div className="company-box">Company 3</div>
          {/* Add more company boxes as needed */}
        </div>
      </div>
    </div>
  );
};

export default App;
