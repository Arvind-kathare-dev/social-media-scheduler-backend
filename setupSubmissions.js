import { getPool } from './config/connectDB.js';
import connectDB from './config/connectDB.js';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  await connectDB();
  const pool = getPool();
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS submissions (
          id VARCHAR(255) PRIMARY KEY,
          task_id VARCHAR(255) REFERENCES tasks(id) ON DELETE CASCADE,
          submitted_by VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
          files JSONB DEFAULT '[]',
          live_link TEXT,
          doc_content TEXT,
          designer_note TEXT,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
    console.log('✅ Successfully created the submissions table!');
  } catch (e) {
    console.error('❌ Error creating table:', e);
  } finally {
    process.exit(0);
  }
}

run();
