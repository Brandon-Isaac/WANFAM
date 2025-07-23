import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import dbPool from './config/db';
import MigrationRunner from './utils/migrations';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection and run migrations
const initializeDatabase = async () => {
  try {
    const client = await dbPool.connect();
    console.log('✅ Database connected successfully');
    client.release();

    // Check if tables exist, if not run initial migration
    const tablesExist = await MigrationRunner.checkTablesExist();
    if (!tablesExist) {
      console.log('📦 Running initial database migration...');
      await MigrationRunner.runInitialMigration();
    } else {
      console.log('✅ Database tables already exist');
    }
  } catch (err) {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  }
};

// Initialize database connection
initializeDatabase();

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'WANFAM Backend API is running!',
    version: '1.0.0',
    database: 'PostgreSQL'
  });
});

app.get('/health', async (req, res) => {
  try {
    const client = await dbPool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.json({ 
      status: 'healthy', 
      database: 'connected', 
      timestamp: result.rows[0].now 
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'unhealthy', 
      database: 'disconnected', 
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
});

// API Routes
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
});

