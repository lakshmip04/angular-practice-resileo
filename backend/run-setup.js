// Script to set up the PostgreSQL database
const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function setupDatabase() {
    try {
        console.log('🔧 Setting up PostgreSQL database...');
        
        // Read the SQL setup file
        const sqlFile = path.join(__dirname, 'setup-database.sql');
        const sqlScript = fs.readFileSync(sqlFile, 'utf8');
        
        // Execute the SQL script
        await pool.query(sqlScript);
        
        console.log('✅ Database setup completed successfully!');
        console.log('📋 Tables created and sample data inserted.');
        
        // Test the connection
        const result = await pool.query('SELECT COUNT(*) FROM students');
        console.log(`📊 Students in database: ${result.rows[0].count}`);
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
        console.log('🔌 Database connection closed');
    }
}

// Run the setup
setupDatabase(); 