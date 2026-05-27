import 'dotenv/config';
import connectDB from "./config/connectDB.js";

async function main() {
  const pool = await connectDB();
  const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'assets';");
  console.table(res.rows);
  process.exit(0);
}
main().catch(console.error);
