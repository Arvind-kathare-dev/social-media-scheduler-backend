import { getPool } from '../config/connectDB.js';

class Folder {
    static async create({ name, assigned_to, created_by, platforms }) {
        const pool = getPool();
        const query = `
      INSERT INTO folders (name, assigned_to, created_by, platforms)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
        const values = [
            name,
            assigned_to ? JSON.stringify(assigned_to) : '[]',
            created_by,
            platforms ? JSON.stringify(platforms) : '[]'
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const pool = getPool();
        const query = 'SELECT * FROM folders WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async findAll({ user_id, role } = {}) {
        const pool = getPool();
        let query = 'SELECT * FROM folders WHERE 1=1';
        const values = [];
        let paramCount = 1;

        if (role !== 'admin' && user_id) {
            query += ` AND (created_by = $${paramCount} OR assigned_to @> $${paramCount+1}::jsonb)`;
            values.push(user_id);
            values.push(JSON.stringify([String(user_id)]));
            paramCount += 2;
        }

        query += ' ORDER BY created_at DESC';
        const result = await pool.query(query, values);
        return result.rows;
    }

    static async update(id, { name, assigned_to, platforms }) {
        const pool = getPool();
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (name !== undefined) {
            fields.push(`name = $${paramCount++}`);
            values.push(name);
        }
        if (assigned_to !== undefined) {
            fields.push(`assigned_to = $${paramCount++}`);
            values.push(assigned_to ? JSON.stringify(assigned_to) : '[]');
        }
        if (platforms !== undefined) {
            fields.push(`platforms = $${paramCount++}`);
            values.push(platforms ? JSON.stringify(platforms) : '[]');
        }

        if (fields.length === 0) return null;

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
      UPDATE folders 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const pool = getPool();
        const query = 'DELETE FROM folders WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}

export default Folder;
