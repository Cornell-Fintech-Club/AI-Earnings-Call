import React, { useState, useEffect } from 'react';
import './transcription_box.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      <div>Loading transcription...</div>
    </div>
  );
};

interface TranscriptionContainerProps {
  onLogout: () => void;
  username: string;
  symbol: string | null;
}

interface Transcription {
  company: string;
  transcription: string;
  summary: string;
  sentiment_score: number;
}

const TranscriptionContainer: React.FC<TranscriptionContainerProps> = ({ onLogout, username, symbol }) => {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [sentimentScore, setSentimentScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [fileError, setFileError] = useState<string>('');

  useEffect(() => {
    console.log(`Welcome, ${username}!`);
  }, [username]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleTranscribe = async () => {
    try {
      setIsLoading(true);
      setTranscription('');
      setFileError('');

      if (!file) {
        setFileError('No file selected for transcription.');
        return;
      }

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
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setTranscription('Error transcribing audio.');
    } finally {
      setIsLoading(false);
    }
  };

  const apiKey = 'fake';
  const handleSummarize = async () => {
    try {
      if (transcription && symbol) {
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
          setSentimentScore(result.score); 
        } else {
          console.error('Error summarizing transcription:', response.statusText);
        }
      } else {
        console.error('No transcription available to summarize or symbol submitted.');
      }
    } catch (error) {
      console.error('Error summarizing transcription:', error);
    }
  };

  const handleStore = async () => {
    try {
      if (transcription && summary && sentimentScore && symbol) {
        const response = await fetch('http://127.0.0.1:5000/store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, transcription, summary, sentiment_score: sentimentScore, symbol }),
        });
  
        if (response.ok) {
          console.log('Transcription stored successfully!');
          handleNewTranscription({ company: symbol, transcription, summary, sentiment_score: sentimentScore });
        } else {
          console.error('Error storing transcription:', response.statusText);
        }
      } else {
        console.error('Missing transcription, summary, sentiment score, or symbol.');
      }
    } catch (error) {
      console.error('Error storing transcription:', error);
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  const handleNewTranscription = (newTranscription: Transcription) => {
    setTranscriptions(prevTranscriptions => [...prevTranscriptions, newTranscription]);
  };

  return (
    <div className="transcription-container-2">
      <h1>Audio Transcription</h1>
      <input type="file" accept=".mp3, audio/*" onChange={handleFileChange} />
      {fileError && <div className="error-message">{fileError}</div>}
      <button 
        onClick={handleTranscribe} 
        disabled={!symbol} 
        style={{
          backgroundColor: 'rgb(206, 171, 171)',
          color: 'black',
          border: '2px solid darkred',
          padding: '8px 16px',
          cursor: 'pointer'
        }}
      >
        Transcribe
      </button>
      {isLoading && <LoadingSpinner />}
      {transcription && !isLoading && (
        <div className="result-box" style={{ backgroundColor: 'rgb(206, 171, 171)', border: '2px solid darkred', padding: '10px', color: 'black' }}>
          <strong>Transcription:</strong>
          <div>{transcription}</div>
        </div>
      )}
  
      <button 
        onClick={handleSummarize} 
        disabled={!transcription || !symbol} 
        style={{
          backgroundColor: 'rgb(206, 171, 171)',
          color: 'black',
          border: '2px solid darkred',
          padding: '8px 16px',
          cursor: 'pointer'
        }}
      >
        Summarize
      </button>
      {summary && (
        <div className="result-box" style={{ backgroundColor: 'rgb(206, 171, 171)', border: '2px solid darkred', padding: '10px', color: 'black' }}>
          <strong>Summary:</strong>
          <div>{summary}</div>
        </div>
      )}
      <div style={{ margin: '15px 0' }}></div>
      {sentimentScore !== null && (
        <div className="result-box" style={{ backgroundColor: 'rgb(206, 171, 171)', border: '2px solid darkred', padding: '10px', color: 'black' }}>
          <strong>Sentiment Score:</strong>
          <div>{sentimentScore}</div>
        </div>
      )}
      <button 
        onClick={handleStore} 
        disabled={!transcription || !summary || sentimentScore === null || !symbol} 
        className="store-button"
        style={{
          backgroundColor: 'rgb(206, 171, 171)',
          color: 'black',
          border: '2px solid darkred',
          padding: '8px 16px',
          cursor: 'pointer'
        }}
      >
        Store
      </button>
      <button 
        onClick={handleLogout} 
        className="logout-button"
        style={{
          backgroundColor: 'rgb(206, 171, 171)',
          color: 'black',
          border: '2px solid darkred',
          padding: '8px 16px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  );
  };

export default TranscriptionContainer;