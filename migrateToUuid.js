import { getPool } from './config/connectDB.js';
import connectDB from './config/connectDB.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../Social Scheduler Backend/.env' });

async function run() {
  const pool = getPool();
  try {
    // We will drop the foreign key constraints first
    const dropConstraints = `
      ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_assigned_to_fkey, DROP CONSTRAINT IF EXISTS tasks_created_by_fkey;
      ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey, DROP CONSTRAINT IF EXISTS notifications_task_id_fkey;
      ALTER TABLE folders DROP CONSTRAINT IF EXISTS folders_created_by_fkey;
      ALTER TABLE assets DROP CONSTRAINT IF EXISTS assets_folder_id_fkey, DROP CONSTRAINT IF EXISTS assets_author_id_fkey;
      ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_parent_id_fkey, DROP CONSTRAINT IF EXISTS comments_task_id_fkey, DROP CONSTRAINT IF EXISTS comments_user_id_fkey;
      ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_task_id_fkey, DROP CONSTRAINT IF EXISTS submissions_submitted_by_fkey;
      ALTER TABLE task_comments DROP CONSTRAINT IF EXISTS task_comments_task_id_fkey, DROP CONSTRAINT IF EXISTS task_comments_user_id_fkey;
    `;
    await pool.query(dropConstraints);
    console.log("Dropped existing constraints");

    // Alter columns to VARCHAR(255)
    const alterTypes = `
      ALTER TABLE users ALTER COLUMN id TYPE VARCHAR(255) USING id::VARCHAR;
      
      ALTER TABLE tasks 
        ALTER COLUMN id TYPE VARCHAR(255) USING id::VARCHAR,
        ALTER COLUMN assigned_to TYPE VARCHAR(255) USING assigned_to::VARCHAR,
        ALTER COLUMN created_by TYPE VARCHAR(255) USING created_by::VARCHAR;
        
      ALTER TABLE notifications
        ALTER COLUMN id TYPE VARCHAR(255) USING id::VARCHAR,
        ALTER COLUMN user_id TYPE VARCHAR(255) USING user_id::VARCHAR,
        ALTER COLUMN task_id TYPE VARCHAR(255) USING task_id::VARCHAR;
        
      ALTER TABLE folders
        ALTER COLUMN id TYPE VARCHAR(255) USING id::VARCHAR,
        ALTER COLUMN created_by TYPE VARCHAR(255) USING created_by::VARCHAR;
        
      ALTER TABLE assets
        ALTER COLUMN id TYPE VARCHAR(255) USING id::VARCHAR,
        ALTER COLUMN folder_id TYPE VARCHAR(255) USING folder_id::VARCHAR,
        ALTER COLUMN author_id TYPE VARCHAR(255) USING author_id::VARCHAR;
        
      ALTER TABLE comments
        ALTER COLUMN id TYPE VARCHAR(255) USING id::VARCHAR,
        ALTER COLUMN parent_id TYPE VARCHAR(255) USING parent_id::VARCHAR,
        ALTER COLUMN task_id TYPE VARCHAR(255) USING task_id::VARCHAR,
        ALTER COLUMN user_id TYPE VARCHAR(255) USING user_id::VARCHAR;
        
      ALTER TABLE submissions
        ALTER COLUMN id TYPE VARCHAR(255) USING id::VARCHAR,
        ALTER COLUMN task_id TYPE VARCHAR(255) USING task_id::VARCHAR,
        ALTER COLUMN submitted_by TYPE VARCHAR(255) USING submitted_by::VARCHAR;
        
      ALTER TABLE task_comments
        ALTER COLUMN id TYPE VARCHAR(255) USING id::VARCHAR,
        ALTER COLUMN task_id TYPE VARCHAR(255) USING task_id::VARCHAR,
        ALTER COLUMN user_id TYPE VARCHAR(255) USING user_id::VARCHAR;
    `;
    await pool.query(alterTypes);
    console.log("Altered column types to VARCHAR(255)");

    // Re-add foreign key constraints
    const addConstraints = `
      ALTER TABLE tasks 
        ADD CONSTRAINT tasks_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
        ADD CONSTRAINT tasks_created_by_fkey FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
        
      ALTER TABLE notifications 
        ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        ADD CONSTRAINT notifications_task_id_fkey FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE;
        
      ALTER TABLE folders 
        ADD CONSTRAINT folders_created_by_fkey FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE;
        
      ALTER TABLE assets 
        ADD CONSTRAINT assets_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE,
        ADD CONSTRAINT assets_author_id_fkey FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE;
        
      ALTER TABLE comments 
        ADD CONSTRAINT comments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
        ADD CONSTRAINT comments_task_id_fkey FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
        
      ALTER TABLE submissions 
        ADD CONSTRAINT submissions_task_id_fkey FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        ADD CONSTRAINT submissions_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE CASCADE;
        
      ALTER TABLE task_comments 
        ADD CONSTRAINT task_comments_task_id_fkey FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        ADD CONSTRAINT task_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    `;
    await pool.query(addConstraints);
    console.log("Re-added foreign key constraints successfully");

  } catch (e) {
    console.error("Migration Error:", e);
  } finally {
    process.exit(0);
  }
}

connectDB().then(run);
