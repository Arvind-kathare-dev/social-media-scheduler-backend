import { getPool } from './config/connectDB.js';
import connectDB from './config/connectDB.js';
import dotenv from 'dotenv';
import { v7 as uuidv7 } from 'uuid';

dotenv.config({ path: '../Social Scheduler Backend/.env' });

async function run() {
  const pool = getPool();
  try {
    // 1. Fetch all existing users
    const usersRes = await pool.query(`SELECT id FROM users`);
    const users = usersRes.rows;

    if (users.length === 0) {
      console.log('No users to update.');
      process.exit(0);
    }

    // Map old ID to new UUID
    const idMap = {};
    for (const user of users) {
      if (!user.id.includes('-')) { // If it's not already a UUID
        idMap[user.id] = uuidv7();
      }
    }

    if (Object.keys(idMap).length === 0) {
      console.log('All users already have UUIDs.');
      process.exit(0);
    }

    console.log('Mapping old IDs to new UUIDs:', idMap);

    // Disable foreign keys temporarily for updates
    // In Postgres, we can do this by setting constraints deferred, but our constraints aren't deferrable.
    // So we just drop them and recreate, or we can update them in a specific order if we drop FKs.
    // Wait, I already added constraints with ON DELETE CASCADE but NOT ON UPDATE CASCADE.
    // Let's drop them again to safely update IDs.

    console.log("Dropping constraints...");
    const dropConstraints = `
      ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_assigned_to_fkey, DROP CONSTRAINT IF EXISTS tasks_created_by_fkey;
      ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
      ALTER TABLE folders DROP CONSTRAINT IF EXISTS folders_created_by_fkey;
      ALTER TABLE assets DROP CONSTRAINT IF EXISTS assets_author_id_fkey;
      ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_user_id_fkey;
      ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_submitted_by_fkey;
      ALTER TABLE task_comments DROP CONSTRAINT IF EXISTS task_comments_user_id_fkey;
    `;
    await pool.query(dropConstraints);

    // Update each table
    for (const [oldId, newUuid] of Object.entries(idMap)) {
      console.log(`Updating old ID ${oldId} to ${newUuid}...`);

      // Update Users
      await pool.query(`UPDATE users SET id = $1 WHERE id = $2`, [newUuid, oldId]);

      // Update basic foreign keys
      await pool.query(`UPDATE tasks SET assigned_to = $1 WHERE assigned_to = $2`, [newUuid, oldId]);
      await pool.query(`UPDATE tasks SET created_by = $1 WHERE created_by = $2`, [newUuid, oldId]);
      
      await pool.query(`UPDATE notifications SET user_id = $1 WHERE user_id = $2`, [newUuid, oldId]);
      await pool.query(`UPDATE folders SET created_by = $1 WHERE created_by = $2`, [newUuid, oldId]);
      await pool.query(`UPDATE assets SET author_id = $1 WHERE author_id = $2`, [newUuid, oldId]);
      await pool.query(`UPDATE comments SET user_id = $1 WHERE user_id = $2`, [newUuid, oldId]);
      await pool.query(`UPDATE submissions SET submitted_by = $1 WHERE submitted_by = $2`, [newUuid, oldId]);
      await pool.query(`UPDATE task_comments SET user_id = $1 WHERE user_id = $2`, [newUuid, oldId]);

      // Update JSONB arrays (assigned_to_multi in tasks)
      // Since it's a JSON array of strings like ["11"], we can fetch all tasks, string replace, and update.
    }

    // Handle JSONB fields explicitly for all tasks
    const tasksRes = await pool.query(`SELECT id, assigned_to_multi FROM tasks`);
    for (const task of tasksRes.rows) {
      let multi = task.assigned_to_multi;
      if (multi && Array.isArray(multi)) {
        let changed = false;
        const newMulti = multi.map(val => {
          const strVal = String(val);
          if (idMap[strVal]) {
            changed = true;
            return idMap[strVal];
          }
          return strVal;
        });
        if (changed) {
          await pool.query(`UPDATE tasks SET assigned_to_multi = $1 WHERE id = $2`, [JSON.stringify(newMulti), task.id]);
        }
      }
    }

    // Handle JSONB fields explicitly for folders (assigned_to)
    const foldersRes = await pool.query(`SELECT id, assigned_to FROM folders`);
    for (const folder of foldersRes.rows) {
      let multi = folder.assigned_to;
      if (multi && Array.isArray(multi)) {
        let changed = false;
        const newMulti = multi.map(val => {
          const strVal = String(val);
          if (idMap[strVal]) {
            changed = true;
            return idMap[strVal];
          }
          return strVal;
        });
        if (changed) {
          await pool.query(`UPDATE folders SET assigned_to = $1 WHERE id = $2`, [JSON.stringify(newMulti), folder.id]);
        }
      }
    }

    // Re-add constraints
    console.log("Re-adding constraints...");
    const addConstraints = `
      ALTER TABLE tasks 
        ADD CONSTRAINT tasks_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
        ADD CONSTRAINT tasks_created_by_fkey FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;
        
      ALTER TABLE notifications 
        ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
        
      ALTER TABLE folders 
        ADD CONSTRAINT folders_created_by_fkey FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE;
        
      ALTER TABLE assets 
        ADD CONSTRAINT assets_author_id_fkey FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE;
        
      ALTER TABLE comments 
        ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
        
      ALTER TABLE submissions 
        ADD CONSTRAINT submissions_submitted_by_fkey FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE CASCADE;
        
      ALTER TABLE task_comments 
        ADD CONSTRAINT task_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    `;
    await pool.query(addConstraints);

    console.log('✅ Successfully migrated old user IDs to UUID v7!');

  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

connectDB().then(run);
