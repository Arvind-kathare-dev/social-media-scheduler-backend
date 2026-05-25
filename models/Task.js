import { getPool } from '../config/connectDB.js';

class Task {
    static async create({ title, description, status = 'todo', priority = 'medium', assigned_to, assigned_to_multi, created_by, due_date, tone, hashtags, platforms, visual_reference, notes }) {
        const pool = getPool();
        const query = `
      INSERT INTO tasks (title, description, status, priority, assigned_to, assigned_to_multi, created_by, due_date, tone, hashtags, platforms, visual_reference, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
        const values = [
            title, description, status, priority, assigned_to, 
            assigned_to_multi ? JSON.stringify(assigned_to_multi) : '[]', 
            created_by, due_date, tone || null, 
            hashtags ? JSON.stringify(hashtags) : null, 
            platforms ? JSON.stringify(platforms) : null, 
            visual_reference || null, 
            notes || null
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const pool = getPool();
        const query = 'SELECT * FROM tasks WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async findAll({ status, assigned_to, created_by } = {}) {
        const pool = getPool();
        let query = `
            SELECT t.*, 
                   u1.name as assigned_to_name, u1.email as assigned_to_email,
                   u2.name as created_by_name
            FROM tasks t
            LEFT JOIN users u1 ON t.assigned_to = u1.id
            LEFT JOIN users u2 ON t.created_by = u2.id
            WHERE 1=1
        `;
        const values = [];
        let paramCount = 1;

        if (status) {
            query += ` AND t.status = $${paramCount++}`;
            values.push(status);
        }
        if (assigned_to) {
            query += ` AND t.assigned_to = $${paramCount++}`;
            values.push(assigned_to);
        }
        if (created_by) {
            query += ` AND t.created_by = $${paramCount++}`;
            values.push(created_by);
        }

        query += ' ORDER BY t.created_at DESC';
        const result = await pool.query(query, values);
        return result.rows;
    }

    static async update(id, { title, description, status, priority, assigned_to, assigned_to_multi, due_date, tone, hashtags, platforms, visual_reference, notes }) {
        const pool = getPool();
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (title !== undefined) {
            fields.push(`title = $${paramCount++}`);
            values.push(title);
        }
        if (description !== undefined) {
            fields.push(`description = $${paramCount++}`);
            values.push(description);
        }
        if (status !== undefined) {
            fields.push(`status = $${paramCount++}`);
            values.push(status);
        }
        if (priority !== undefined) {
            fields.push(`priority = $${paramCount++}`);
            values.push(priority);
        }
        if (assigned_to !== undefined) {
            fields.push(`assigned_to = $${paramCount++}`);
            values.push(assigned_to);
        }
        if (assigned_to_multi !== undefined) {
            fields.push(`assigned_to_multi = $${paramCount++}`);
            values.push(assigned_to_multi ? JSON.stringify(assigned_to_multi) : '[]');
        }
        if (due_date !== undefined) {
            fields.push(`due_date = $${paramCount++}`);
            values.push(due_date);
        }
        if (tone !== undefined) {
            fields.push(`tone = $${paramCount++}`);
            values.push(tone);
        }
        if (hashtags !== undefined) {
            fields.push(`hashtags = $${paramCount++}`);
            values.push(hashtags ? JSON.stringify(hashtags) : null);
        }
        if (platforms !== undefined) {
            fields.push(`platforms = $${paramCount++}`);
            values.push(platforms ? JSON.stringify(platforms) : null);
        }
        if (visual_reference !== undefined) {
            fields.push(`visual_reference = $${paramCount++}`);
            values.push(visual_reference);
        }
        if (notes !== undefined) {
            fields.push(`notes = $${paramCount++}`);
            values.push(notes);
        }


        if (fields.length === 0) return null;

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
      UPDATE tasks 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async updateStatus(id, status) {
        const pool = getPool();
        const query = `
      UPDATE tasks 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
        const result = await pool.query(query, [status, id]);
        return result.rows[0];
    }

    static async delete(id) {
        const pool = getPool();
        const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}

export default Task;
