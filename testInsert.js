import 'dotenv/config';
import connectDB from "./config/connectDB.js";
import { v7 as uuidv7 } from 'uuid';

async function main() {
  const pool = await connectDB();
  
  const taskId = '019e6974-355d-761e-8948-fbe14c7411bb';
  const content = 'Test comment';
  const parent_id = null; // or empty string
  const user_id = 'some-user-id'; // wait, I don't know a valid user_id.

  // Let's get a valid user_id
  const userRes = await pool.query('SELECT id FROM users LIMIT 1');
  const actualUserId = userRes.rows[0].id;

  const id = uuidv7();
  const query = `
    INSERT INTO comments (id, task_id, user_id, content, parent_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  try {
    const result = await pool.query(query, [id, taskId, actualUserId, content, parent_id || null]);
    console.log("Success:", result.rows[0]);
  } catch (error) {
    console.error("Insert error:", error);
  }
  
  process.exit(0);
}
main().catch(console.error);
