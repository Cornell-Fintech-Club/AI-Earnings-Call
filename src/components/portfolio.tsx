import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom/client';
import { Link } from 'react-router-dom';


interface PortfolioProps {
  username: string;
}

interface Transcription {
  id: number;
  company: string;
  transcription: string;
}

const Portfolio: React.FC<PortfolioProps> = ({ username }) => {
  const [transcriptions, setTranscriptions] = useState<any[]>([]);
  console.log(transcriptions)

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
        console.error('Error fetching transcriptions:',);
      }
    };

    fetchTranscriptions();
  }, [username]);


  return (
    <div className="portfolio-container">
      <h1>Portfolio</h1>

      {transcriptions.map((transcription, index) => (
        <div key={index} className="company-box">
          <h3>Symbol: {transcription.company}</h3>
          <p>Transcription: {transcription.transcription}</p>
          <Link to={`/portfolio_details/${transcription.id}`}>Show More</Link>

        </div>
      ))}
    </div>
  );
};

export default Portfolio;
