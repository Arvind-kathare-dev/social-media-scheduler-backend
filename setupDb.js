import { getPool } from './config/connectDB.js';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';

dotenv.config();

async function run() {
  const pool = getPool();
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'physician',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
    console.log('✅ Successfully created the users table!');

    const taskQuery = `
      CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(50) DEFAULT 'todo',
          priority VARCHAR(50) DEFAULT 'medium',
          assigned_to INT REFERENCES users(id) ON DELETE SET NULL,
          created_by INT REFERENCES users(id) ON DELETE SET NULL,
          due_date TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(taskQuery);
    
    // Add new columns if they don't exist
    const alterQuery = `
      ALTER TABLE tasks
      ADD COLUMN IF NOT EXISTS tone VARCHAR(100),
      ADD COLUMN IF NOT EXISTS hashtags JSONB,
      ADD COLUMN IF NOT EXISTS platforms JSONB,
      ADD COLUMN IF NOT EXISTS visual_reference TEXT,
      ADD COLUMN IF NOT EXISTS notes TEXT;
    `;
    await pool.query(alterQuery);

    console.log('✅ Successfully created and updated the tasks table!');
  } catch (e) {
    console.error('❌ Error creating table:', e);
  } finally {
    process.exit(0);
  }
}

connectDB().then(run);
