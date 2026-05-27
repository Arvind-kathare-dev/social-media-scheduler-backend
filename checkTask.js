import 'dotenv/config';
import connectDB from "./config/connectDB.js";

async function main() {
  const pool = await connectDB();
  const res = await pool.query("SELECT id FROM tasks WHERE id = '019e6974-355d-761e-8948-fbe14c7411bb'");
  console.log(res.rows);
  process.exit(0);
}
main().catch(console.error);
