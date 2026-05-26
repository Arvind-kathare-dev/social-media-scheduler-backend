import { getPool } from './config/connectDB.js';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';

dotenv.config();

async function run() {
  const pool = getPool();
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS assets (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          folder_id INT REFERENCES folders(id) ON DELETE CASCADE,
          platform VARCHAR(100),
          copy TEXT,
          author_id INT REFERENCES users(id) ON DELETE SET NULL,
          files JSONB DEFAULT '[]',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
    console.log('✅ Successfully created the assets table!');
  } catch (e) {
    console.error('❌ Error creating table:', e);
  } finally {
    process.exit(0);
  }
}

connectDB().then(run);
