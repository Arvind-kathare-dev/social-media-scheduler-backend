import { getPool } from './config/connectDB.js';
import connectDB from './config/connectDB.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../Social Scheduler Backend/.env' });

async function run() {
  const pool = getPool();
  try {
    const query = `
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND column_name IN ('id', 'user_id', 'task_id', 'assigned_to', 'created_by', 'upload_id', 'author_id', 'parent_id', 'folder_id', 'brief_id', 'submitted_by')
      ORDER BY table_name, column_name;
    `;
    const res = await pool.query(query);
    console.table(res.rows);
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

connectDB().then(run);
