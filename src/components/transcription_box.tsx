import React, { useState, useEffect } from 'react';
import './transcription_box.css';

interface TranscriptionContainerProps {
  onLogout: () => void;
  username: string; // Add a prop to pass the username
  symbol: string | null;
}

const TranscriptionContainer: React.FC<TranscriptionContainerProps> = ({ onLogout, username, symbol }) => {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [summary, setSummary] = useState<string>('');

  useEffect(() => {
    // Display the welcome message with the username
    console.log(`Welcome, ${username}!`);
  }, [username]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleTranscribe = async () => {
    try {
      if (file) {
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
  const apiKey = 'fake_api_key';
  const handleSummarize = async () => {
    try {
      if (transcription) {
        // Send the transcription to OpenAI for summarization
        const response = await fetch('http://127.0.0.1:5000/summarize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`, 
          },
          body: JSON.stringify({ transcription , symbol}),
        });

        if (response.ok) {
          const result = await response.json();
          setSummary(result.summary);
        } else {
          console.error('Error summarizing transcription:', response.statusText);
        }
      } else {
        console.error('No transcription available to summarize.');
      }
    } catch (error) {
      console.error('Error summarizing transcription:', error);
    }
  };

  const handleStore = async () => {
    try {
      if (transcription) {
        // Send the transcription to be stored
        const response = await fetch('http://127.0.0.1:5000/store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, transcription, summary , symbol}),
        });

        if (response.ok) {
          console.log('Transcription stored successfully!');
        } else {
          console.error('Error storing transcription:', response.statusText);
        }
      } else {
        console.error('No transcription available to store.');
      }
    } catch (error) {
      console.error('Error storing transcription:', error);
    }
  };

  const handleLogout = () => {
    // Perform any necessary cleanup or additional logout logic here
    onLogout();
  };

  return (
    <div className="transcription-container">
      <h1>Audio Transcription</h1>
      <input type="file" accept=".mp3, audio/*" onChange={handleFileChange} />
      <button onClick={handleTranscribe}>Transcribe</button>
      {transcription && (
        <div className="result-box" style={{ backgroundColor: 'rgb(206, 171, 171)', border: '2px solid darkred', padding: '10px', color: 'black' }}>
          <strong>Transcription:</strong>
          <div>{transcription}</div>
        </div>
      )}
      <button onClick={handleSummarize}>Summarize</button>
      {summary && <div>Summary: {summary}</div>}
      <button onClick={handleStore} className="store-button">Store</button>
      <p>Welcome, {username}!</p>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
  
  
  
  
};

export default TranscriptionContainer;
