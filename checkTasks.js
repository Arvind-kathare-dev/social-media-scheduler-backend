import { getPool } from './config/connectDB.js';
import connectDB from './config/connectDB.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../Social Scheduler Backend/.env' });

async function run() {
  const pool = getPool();
  try {
    const res = await pool.query(`SELECT id, title FROM tasks`);
    console.table(res.rows);
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

connectDB().then(run);
