import dbPool from '../config/db';
import { PoolClient } from 'pg';

export class DatabaseService {
  // Execute a query with parameters
  static async query(text: string, params?: any[]): Promise<any> {
    const client = await dbPool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Execute multiple queries in a transaction
  static async transaction(callback: (client: PoolClient) => Promise<any>): Promise<any> {
    const client = await dbPool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Check if database connection is healthy
  static async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

export default DatabaseService;
