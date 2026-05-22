import { getPool } from './config/connectDB.js';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';

dotenv.config();

async function run() {
  const pool = getPool();
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'physician',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
    console.log('✅ Successfully created the users table!');
  } catch (e) {
    console.error('❌ Error creating table:', e);
  } finally {
    process.exit(0);
  }
}

connectDB().then(run);
