// Test Database Connection
// Run: node test-db-connection.js

const pool = require('./config/database');
// Note: This file doesn't use bcrypt, but if it did, use bcryptjs

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Config:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER
  });
  console.log('');

  try {
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Database connection successful!');
    console.log('Current time:', result.rows[0].current_time);
    console.log('PostgreSQL version:', result.rows[0].pg_version.split(',')[0]);
    console.log('');

    // Test admin_users table
    const adminResult = await pool.query('SELECT COUNT(*) as count FROM admin_users');
    console.log('✅ Admin users table accessible');
    console.log('Admin users count:', adminResult.rows[0].count);
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('');
    console.error('Possible issues:');
    console.error('  1. Database not running');
    console.error('  2. Wrong credentials');
    console.error('  3. Network connectivity issue');
    console.error('  4. host.docker.internal not resolving');
    process.exit(1);
  }
}

testConnection();

