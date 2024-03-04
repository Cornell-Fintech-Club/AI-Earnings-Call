import React, { useState } from 'react';
import axios from 'axios';
import './companysearchbar.css';

interface CompanySearchBarProps {
  setFinalSymbol: (newSymbol: string) => void;
}

const CompanySearchBar: React.FC<CompanySearchBarProps> = ({ setFinalSymbol }) => {
  const [symbol, setSymbol] = useState('');
  const [error, setError] = useState('');
  const [companyInfo, setCompanyInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      // Validate if symbol is empty
      if (!symbol) {
        setError('Please enter a company symbol');
        return;
      }

      setError('');
      setLoading(true);

      const response = await axios.get(`http://127.0.0.1:5000/company-info/${symbol}`);
      const data = response.data;

      if (data.error) {
        setError(data.error);
        setCompanyInfo(null);
      } else {
        setError('');
        setCompanyInfo(data);
      }
    } catch (error) {
      setError('Invalid symbol or API key');
      setCompanyInfo(null);
    } finally {
      setLoading(false);
      setFinalSymbol(symbol)
    }
  };

  return (
    <div className="company-search-bar d-flex justify-content-center align-items-center">
      <input
        type="text"
        placeholder="Enter company symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
      {error && <p className="error-message">{error}</p>}

      {companyInfo && (
        <div className="company-info-box">
          <h3>{companyInfo.name}</h3>
          <p>Symbol: {companyInfo.symbol}</p>
          <p>Industry: {companyInfo.industry}</p>
          <p>Sector: {companyInfo.sector}</p>

          <p>Previous Closing Price: ${companyInfo.prev_price}</p>
          {companyInfo.change !== 0 && <p>Current Stock Price: ${companyInfo.price}</p>}
          {companyInfo.change !== 0 && <p>Daily Change: {companyInfo.change}</p>}
          {companyInfo.change !== 0 && <p>Daily Change Percent: {companyInfo.change_percent}%</p>}

          {companyInfo.change !== 0 && <p>Daily High: {companyInfo.high}</p>}
          {companyInfo.change !== 0 && <p>Daily Low: {companyInfo.low}</p>}

          {companyInfo.change === 0 && <p>Markets Are Closed</p>}
        </div>
      )}
    </div>
  );
};

export default CompanySearchBar;
