import { useState } from 'react';
import db from '../lib/db';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState([]);

  const fetchAllStocks = async () => {
    setIsLoading(true);
    setProgress([]);
    
    try {
      const response = await fetch('/api/fetchAll');
      const { results } = await response.json();
      setProgress(results);
    } catch (error) {
      setProgress([{ symbol: 'Error', status: error.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Stock Data Batch Fetcher</h1>
      <button 
        onClick={fetchAllStocks} 
        disabled={isLoading}
      >
        {isLoading ? 'Fetching...' : 'Fetch All Symbols'}
      </button>
      
      <div style={{ marginTop: '20px' }}>
        <h3>Progress:</h3>
        <ul>
          {progress.map((item, i) => (
            <li key={i}>
              {item.symbol}: {item.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
