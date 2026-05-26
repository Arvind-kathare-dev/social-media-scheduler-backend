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

    const notificationQuery = `
      CREATE TABLE IF NOT EXISTS notifications (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          message TEXT NOT NULL,
          type VARCHAR(50),
          task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
          is_read BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(notificationQuery);
    console.log('✅ Successfully created the notifications table!');
    
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

    const alterNotificationQuery = `
      ALTER TABLE notifications
      ADD COLUMN IF NOT EXISTS type VARCHAR(50),
      ADD COLUMN IF NOT EXISTS task_id INT REFERENCES tasks(id) ON DELETE CASCADE;
    `;
    await pool.query(alterNotificationQuery);

    console.log('✅ Successfully created and updated the tasks and notifications tables!');
  } catch (e) {
    console.error('❌ Error creating table:', e);
  } finally {
    process.exit(0);
  }
}

connectDB().then(run);
