// PortfolioDetails.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Transcription {
  id: number;
  company: string;
  transcription: string;
  summary: string;
}

const PortfolioDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [transcription, setTranscription] = useState<Transcription | null>(null);

  useEffect(() => {
    const fetchTranscriptionDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/get_transcription_details?id=${id}`);
        const data = response.data;

        if (data.transcription) {
          setTranscription(data.transcription);
        } else {
          console.error('Error fetching transcription details:', data.error);
        }
      } catch (error) {
        console.error('Error fetching transcription details:', error);
      }
    };

    fetchTranscriptionDetails();
  }, [id]);

  if (!transcription) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Transcription-details">
      <h2>{transcription.company}</h2>
      <p><strong>Transcription:</strong> {transcription.transcription}</p>
      <p><strong>Summary:</strong> {transcription.summary}</p>
    </div>
  );
};


export default PortfolioDetails;
