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

  const deleteTranscription = async (id: string | undefined, index: number) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/delete_transcription/${id}`);
      setTranscriptions(prevTranscriptions => {
        const updatedTranscriptions = [...prevTranscriptions];
        updatedTranscriptions.splice(index, 1); // Remove the deleted transcription from the array
        return updatedTranscriptions;
      });
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
            <button className="expand-button">{expandedIndex === index ? 'Collapse' : 'Expand'}</button>
            <button onClick={(event) => { event.stopPropagation(); deleteTranscription(transcription.company, index); }} className="delete-button">Delete</button>
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
