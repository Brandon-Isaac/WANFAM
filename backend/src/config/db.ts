import { Pool, PoolConfig } from 'pg';

const dbConfig: PoolConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'wanfam_db',
  password: process.env.DB_PASSWORD || 'password',
  port: Number(process.env.DB_PORT) || 5432,
  max: 20, // maximum number of clients in pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle
  connectionTimeoutMillis: 2000, // how long to wait when connecting a client
};

const dbPool = new Pool(dbConfig);

// Test the connection
dbPool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

dbPool.on('error', async (err) => {
  console.error('Unexpected error on idle client', err);
  await gracefulShutdown(err);
});

async function gracefulShutdown(error: Error) {
  console.error('Shutting down gracefully due to error:', error.message);
  try {
    await dbPool.end();
    console.log('Database pool has been closed.');
  } catch (shutdownError) {
    console.error('Error during database pool shutdown:', shutdownError);
  } finally {
    process.exit(1); // Exit with a non-zero status code to indicate failure
  }
}
export default dbPool;
