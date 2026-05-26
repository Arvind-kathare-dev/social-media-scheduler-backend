import connectDB, { getPool } from "./config/connectDB.js";
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await connectDB();
  const pool = getPool();
  try {
    await pool.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type VARCHAR(50);`);
    await pool.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS task_id INT REFERENCES tasks(id) ON DELETE CASCADE;`);
    console.log("Columns added");
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
