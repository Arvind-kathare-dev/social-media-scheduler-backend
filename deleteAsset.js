import 'dotenv/config';
import connectDB from "./config/connectDB.js";

async function main() {
  const pool = await connectDB();
  try {
    const res = await pool.query("DELETE FROM assets WHERE id = '14' RETURNING *;");
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
main().catch(console.error);
