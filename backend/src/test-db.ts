import dbPool from './config/db';
import MigrationRunner from './utils/migrations';

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const client = await dbPool.connect();
    console.log('✅ Database connection successful');
    
    // Test query
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Query test successful');
    console.log('Current time:', result.rows[0].current_time);
    console.log('PostgreSQL version:', result.rows[0].pg_version);
    
    client.release();

    // Test migration
    console.log('\n🔍 Checking database schema...');
    const tablesExist = await MigrationRunner.checkTablesExist();
    
    if (!tablesExist) {
      console.log('📦 Running database migration...');
      await MigrationRunner.runInitialMigration();
      console.log('✅ Migration completed');
    } else {
      console.log('✅ Tables already exist');
    }

    console.log('\n🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await dbPool.end();
    process.exit(0);
  }
}

testDatabase();
