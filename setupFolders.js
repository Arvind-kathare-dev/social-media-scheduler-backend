import { getPool } from './config/connectDB.js';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';

dotenv.config();

async function run() {
  const pool = getPool();
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS folders (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          assigned_to JSONB DEFAULT '[]',
          created_by INT REFERENCES users(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
    console.log('✅ Successfully created the folders table!');
  } catch (e) {
    console.error('❌ Error creating table:', e);
  } finally {
    process.exit(0);
  }
}

connectDB().then(run);
