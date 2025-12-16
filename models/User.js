const db = require('../config/connectDB');

class User {
    static async create({ name, email, password, role = 'physician', is_active = true }) {
        const query = `
      INSERT INTO users (name, email, password, role, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        const values = [name, email, password, role, is_active];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db.query(query, [email]);
        return result.rows[0];
    }

    static async findAll({ role, is_active } = {}) {
        let query = 'SELECT * FROM users WHERE 1=1';
        const values = [];
        let paramCount = 1;

        if (role) {
            query += ` AND role = $${paramCount++}`;
            values.push(role);
        }
        if (is_active !== undefined) {
            query += ` AND is_active = $${paramCount++}`;
            values.push(is_active);
        }

        query += ' ORDER BY created_at DESC';
        const result = await db.query(query, values);
        return result.rows;
    }

    static async update(id, { name, email, role, is_active }) {
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (name) {
            fields.push(`name = $${paramCount++}`);
            values.push(name);
        }
        if (email) {
            fields.push(`email = $${paramCount++}`);
            values.push(email);
        }
        if (role) {
            fields.push(`role = $${paramCount++}`);
            values.push(role);
        }
        if (is_active !== undefined) {
            fields.push(`is_active = $${paramCount++}`);
            values.push(is_active);
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = User;
