import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

import { ChartOptions } from 'chart.js';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
  const [chartBox, setChartBox] = useState(false);

  useEffect(() => {
    const fetchTranscriptions = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/get_transcripts?username=${username}`);
        if (response.data.transcriptions) {
          setTranscriptions(response.data.transcriptions);
        } else {
          console.error('No transcriptions available:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching transcriptions:', error);
      }
    };

    fetchTranscriptions();
  }, [username]);

  const toggleChartBox = () => {
    setChartBox(!chartBox);
  };

  const toggleExpanded = (index: number) => {
    setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const handleDelete = async (company: string) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/delete_box/${company}`);
      if (response.status === 200) {
        setTranscriptions(prev => prev.filter(t => t.company !== company));
      } else {
        console.error('Failed to delete transcription:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting transcription:', error);
    }
  };

  const chartData = {
    labels: transcriptions.map(t => t.company),
    datasets: [{
      label: 'Sentiment Score',
      data: transcriptions.map(t => t.sentiment_score),
      backgroundColor: 'rgba(200, 150, 150, 1)',
      borderColor: 'rgba(180, 150, 150, 1)',
      borderWidth: 1,
    }],
  };

  const chartOptions: ChartOptions<"bar"> = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,  // Assuming you don't want to display the legend as per your earlier request
      },
      title: {
        display: true,
        text: 'Sentiment Score Comparison',
        font: {
          size: 15,  // Making the title font larger for better visibility
        },
        padding: {
          top: 20,
          bottom: 20
        }
      }}
  };

  return (
    <div className="portfolio-container">
      <h1>Portfolio</h1>
      <div className={`company-box ${chartBox ? 'expanded' : ''}`}>
        <div className="company-header" onClick={toggleChartBox}>
          <h3>Charts</h3>
          <button className="expand-button">{chartBox ? 'Hide' : 'View'}</button>
        </div>
        {chartBox ? (
          transcriptions.length > 0 ? (
            <div className="additional-info">
              <Bar data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="additional-info">
              No transcriptions stored.
            </div>
          )
        ) : null}
      </div>
      {transcriptions.map((transcription, index) => (
        <div key={index} className={`company-box ${expandedIndex === index ? 'expanded' : ''}`}>
          <div className="company-header" onClick={() => toggleExpanded(index)}>
            <h3>{transcription.company}</h3>
            <button className="expand-button">{expandedIndex === index ? 'Hide' : 'View'}</button>
            <button onClick={() => handleDelete(transcription.company)}>Delete</button>
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
