import { getPool } from './config/connectDB.js';
import connectDB from './config/connectDB.js';
import dotenv from 'dotenv';
dotenv.config();

const updateSchema = async () => {
  await connectDB();
  const pool = getPool();
  try {
    const alterQuery = `
      ALTER TABLE folders
      ADD COLUMN IF NOT EXISTS platforms JSONB DEFAULT '[]'::jsonb;
    `;
    await pool.query(alterQuery);

    console.log('✅ Successfully added platforms column to folders table!');
  } catch (e) {
    console.error('❌ Error updating table:', e);
  } finally {
    process.exit(0);
  }
};

updateSchema();
