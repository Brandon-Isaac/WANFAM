import fs from 'fs';
import path from 'path';
import dbPool from '../config/db';

export class MigrationRunner {
  static async runInitialMigration(): Promise<void> {
    try {
      const sqlPath = path.join(__dirname, '../database/init.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');
      
      console.log('Running initial database migration...');
      await dbPool.query(sql);
      console.log('✅ Initial migration completed successfully');
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  static async checkTablesExist(): Promise<boolean> {
    try {
      const result = await dbPool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('users', 'sessions')
      `);
      
      return result.rows.length === 2;
    } catch (error) {
      console.error('Error checking tables:', error);
      return false;
    }
  }
}

export default MigrationRunner;
