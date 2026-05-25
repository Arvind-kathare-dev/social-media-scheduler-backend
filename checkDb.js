import connectDB, { getPool } from './config/connectDB.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await connectDB();
  const pool = getPool();
  try {
    // Alter the hashtags column to be jsonb
    await pool.query("ALTER TABLE tasks ALTER COLUMN hashtags TYPE jsonb USING to_jsonb(hashtags);");
    console.log("Successfully converted hashtags to JSONB");
  } catch (error) {
    console.error("Error converting hashtags to JSONB:", error);
  } finally {
    process.exit(0);
  }
}
run();
