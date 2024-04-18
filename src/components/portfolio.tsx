import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Transcription {
  id: number;
  company: string;
  transcription: string;
  summary: string;
  sentiment_score: number; 
}

interface PortfolioProps {
  username: string;
}

const Portfolio: React.FC<PortfolioProps> = ({ username }) => {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchTranscriptions = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/get_transcripts?username=${username}`);
        const data = response.data;

        if (data.transcriptions) {
          setTranscriptions(data.transcriptions);
        } else {
          console.error('Error fetching transcriptions:', data.error);
        }
      } catch (error) {
        console.error('Error fetching transcriptions:', error);
      }
    };

    fetchTranscriptions();
  }, [username]);

  const toggleExpanded = (index: number) => {
    setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const handleDelete = async (company: string) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/delete_box/${company}`);
      
      if (response.status === 200) {
        setTranscriptions(prevTranscriptions =>
          prevTranscriptions.filter(transcription => transcription.company !== company)
        );
      } else {
        console.error('Error deleting transcription:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting transcription:', error);
    }
  };

  return (
    <div className="portfolio-container">
      <h1>Portfolio</h1>

      {transcriptions.map((transcription, index) => (
        <div key={index} className={`company-box ${expandedIndex === index ? 'expanded' : ''}`}>
          <div className="company-header" onClick={() => toggleExpanded(index)}>
            <h3>{transcription.company}</h3>
            <button 
              className="expand-button" 
              style={{
                backgroundColor: 'rgb(206, 173, 173)',
                color: '#fff',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer'
              }}
            >
              {expandedIndex === index ? 'Close' : 'View'}
            </button>
            <button 
              onClick={() => handleDelete(transcription.company)}
              style={{
                backgroundColor: 'rgb(139, 0, 0)',
                color: '#fff',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
          {expandedIndex === index && (
            <div className="additional-info">
              <p><strong>Transcription</strong>: {transcription.transcription}</p>
              <p><strong>Summary</strong>: {transcription.summary}</p>
              <p><strong>Sentiment Score</strong>: {transcription.sentiment_score}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Portfolio;