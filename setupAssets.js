import { getPool } from './config/connectDB.js';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';

dotenv.config();

async function run() {
  const pool = getPool();
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS assets (
          id VARCHAR(255) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          folder_id VARCHAR(255) REFERENCES folders(id) ON DELETE CASCADE,
          platform VARCHAR(100),
          copy TEXT,
          author_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
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
