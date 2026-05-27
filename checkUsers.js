import 'dotenv/config';
import connectDB from "./config/connectDB.js";

async function main() {
  const pool = await connectDB();
  const res = await pool.query("SELECT id FROM users LIMIT 5;");
  console.table(res.rows);
  process.exit(0);
}
main().catch(console.error);
