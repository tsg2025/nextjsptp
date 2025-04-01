import { useState } from 'react';
import db from '../lib/db';

export default function Home() {
  const [symbol, setSymbol] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchAndStoreData = async () => {
    if (!symbol) return;
    
    setIsLoading(true);
    setMessage('');
    
    try {
      const existingData = await db.stocks.where('symbol').equals(symbol).first();
      
      if (existingData) {
        const oneDay = 24 * 60 * 60 * 1000;
        const isDataFresh = (new Date() - new Date(existingData.lastUpdated)) < oneDay;
        
        if (isDataFresh) {
          setMessage(`Using cached data for ${symbol}`);
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch(`/api/fetchStock?symbol=${symbol}`);
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      await db.stocks.put({
        symbol,
        data,
        lastUpdated: new Date().toISOString()
      });
      
      setMessage(`Successfully stored data for ${symbol}`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Stock Data Fetcher</h1>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        placeholder="Enter stock symbol (e.g., AAPL)"
      />
      <button onClick={fetchAndStoreData} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Fetch & Store Data'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
