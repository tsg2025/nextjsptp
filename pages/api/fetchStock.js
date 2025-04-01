import { parseSymbols } from '../../lib/csvParser';
import db from '../../lib/db';

export default async function handler(req, res) {
  try {
    const symbols = await parseSymbols();
    const results = [];
    
    for (const symbol of symbols) {
      const existing = await db.stocks.where('symbol').equals(symbol).first();
      if (!existing) {
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1mo&interval=1d`);
        const data = await response.json();
        
        if (data.chart?.result) {
          await db.stocks.put({
            symbol,
            data: data.chart.result[0],
            lastUpdated: new Date().toISOString()
          });
          results.push({ symbol, status: 'success' });
        }
      } else {
        results.push({ symbol, status: 'already_exists' });
      }
    }
    
    res.status(200).json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
