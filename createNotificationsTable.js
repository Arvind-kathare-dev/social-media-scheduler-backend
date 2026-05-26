import connectDB, { getPool } from "./config/connectDB.js";
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await connectDB();
  const pool = getPool();
  
  const query = `
    CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        type VARCHAR(50),
        task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
  console.log("Notifications table created successfully");
  
  process.exit(0);
}
run();
