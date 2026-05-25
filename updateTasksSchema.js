import { getPool } from './config/connectDB.js';
import connectDB from './config/connectDB.js';
import dotenv from 'dotenv';
dotenv.config();

const updateSchema = async () => {
  await connectDB();
  const pool = getPool();
  try {
    const alterQuery = `
      ALTER TABLE tasks
      ADD COLUMN IF NOT EXISTS assigned_to_multi JSONB DEFAULT '[]'::jsonb;
    `;
    await pool.query(alterQuery);

    console.log('✅ Successfully added assigned_to_multi column to tasks table!');
  } catch (e) {
    console.error('❌ Error updating table:', e);
  } finally {
    process.exit(0);
  }
};

updateSchema();
