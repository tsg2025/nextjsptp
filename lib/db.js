import Dexie from 'dexie';

const db = new Dexie('StockDatabase');
db.version(1).stores({
  stocks: '++id,symbol,data,lastUpdated'
});

export default db;
