import Papa from 'papaparse';

export async function parseSymbols() {
  const response = await fetch('/symbols.csv');
  const text = await response.text();
  const results = Papa.parse(text, { header: true });
  return results.data.map(item => item.Symbol).filter(Boolean);
}
