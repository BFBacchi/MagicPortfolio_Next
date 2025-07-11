import { Pool } from 'pg';

let pool: Pool | null = null;

const initializePool = () => {
  if (pool) {
    return pool;
  }
  
  const connectionString = process.env.POSTGRES_URL;

  if (!connectionString) {
    throw new Error('POSTGRES_URL environment variable is not set');
  }

  pool = new Pool({
    connectionString,
    // ssl: {
    //   rejectUnauthorized: false,
    // },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  return pool;
};

export const db = initializePool(); 