import dotenv from "dotenv";
dotenv.config();
import connectDB, { getPool } from "./config/connectDB.js";

async function setupNotifications() {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    const pool = getPool();

    const createNotificationsTable = `
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        type VARCHAR(50),
        task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Creating notifications table...");
    await pool.query(createNotificationsTable);
    console.log("✅ Notifications table created or verified successfully.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting up notifications table:", error.message);
    process.exit(1);
  }
}

setupNotifications();
