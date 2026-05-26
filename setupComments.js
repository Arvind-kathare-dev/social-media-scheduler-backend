import dotenv from "dotenv";
dotenv.config();
import connectDB, { getPool } from "./config/connectDB.js";

async function setupComments() {
  try {
    console.log("Connecting to the database...");
    await connectDB();
    const pool = getPool();

    const createCommentsTable = `
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Creating comments table...");
    await pool.query(createCommentsTable);
    console.log("✅ Comments table created or verified successfully.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting up comments table:", error.message);
    process.exit(1);
  }
}

setupComments();
