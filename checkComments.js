import 'dotenv/config';
import connectDB from "./config/connectDB.js";

async function main() {
  const pool = await connectDB();
  const res = await pool.query("SELECT * FROM comments ORDER BY created_at DESC LIMIT 5");
  console.table(res.rows);
  process.exit(0);
}
main().catch(console.error);
