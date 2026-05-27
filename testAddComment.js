import 'dotenv/config';
import connectDB from "./config/connectDB.js";
import { addComment } from "./controllers/commentController.js";

async function main() {
  const pool = await connectDB();
  
  // Get a valid user
  const userRes = await pool.query('SELECT id FROM users LIMIT 1');
  const actualUserId = userRes.rows[0].id;

  const req = {
    params: {
      taskId: '019e6974-355d-761e-8948-fbe14c7411bb'
    },
    body: {
      content: 'This is a test comment from the script',
      parent_id: ""
    },
    user: {
      id: actualUserId
    },
    app: {
      get: (key) => {
        if (key === 'io') return { to: () => ({ emit: () => {} }) };
      }
    }
  };

  const res = {
    status: (code) => {
      console.log(`Status set to ${code}`);
      return res;
    },
    json: (data) => {
      console.log(`Response JSON:`, data);
      return res;
    }
  };

  await addComment(req, res);
  process.exit(0);
}

main().catch(console.error);
