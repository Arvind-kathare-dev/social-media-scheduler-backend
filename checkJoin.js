import { getPool } from './config/connectDB.js';
import connectDB from './config/connectDB.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../Social Scheduler Backend/.env' });

async function run() {
  const pool = getPool();
  try {
    const query = `
      SELECT s.id, s.submitted_by, u.name as submitted_by_name
      FROM submissions s
      LEFT JOIN users u ON s.submitted_by = u.id
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
