const { Pool } = require('pg');

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'lakshmi',
  password: process.env.PG_PASSWORD || 'lakshmi@postgresql',
  port: process.env.PG_PORT || 5432,
  
  // Connection pool settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL database connection established successfully');
    
    // Test query
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    console.log(`🕐 Database time: ${result.rows[0].current_time}`);
    console.log(`🐘 PostgreSQL version: ${result.rows[0].postgres_version.split(' ')[0]} ${result.rows[0].postgres_version.split(' ')[1]}`);
    
    client.release();
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL database:', error.message);
    console.error('💡 Please ensure PostgreSQL is running and connection details are correct');
    process.exit(1);
  }
};

// Connection event handlers
pool.on('connect', (client) => {
  console.log('🔗 New PostgreSQL client connected');
});

pool.on('acquire', (client) => {
  console.log('📦 PostgreSQL client acquired from pool');
});

pool.on('remove', (client) => {
  console.log('🗑️ PostgreSQL client removed from pool');
});

pool.on('error', (err, client) => {
  console.error('❌ Unexpected error on idle PostgreSQL client:', err);
  process.exit(-1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  try {
    await pool.end();
    console.log('✅ PostgreSQL pool has ended');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during pool shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  try {
    await pool.end();
    console.log('✅ PostgreSQL pool has ended');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during pool shutdown:', error);
    process.exit(1);
  }
});

// Export pool and test function
module.exports = {
  pool,
  testConnection
};

// Auto-test connection when module is loaded
testConnection(); 