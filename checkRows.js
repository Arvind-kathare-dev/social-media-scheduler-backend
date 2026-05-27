import { getPool } from './config/connectDB.js';
import connectDB from './config/connectDB.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../Social Scheduler Backend/.env' });

async function run() {
  const pool = getPool();
  try {
    // Drop all tables and recreate them because it's a dev environment and changing all FKs is very complex.
    // Let's ask the user if they want to drop or if we should write a complex alter.
    // Wait, let's just query how many rows exist.
    const res = await pool.query(`SELECT count(*) as c FROM users`);
    console.log("Users count:", res.rows[0].c);
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

connectDB().then(run);
