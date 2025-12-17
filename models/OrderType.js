import { getPool } from '../config/connectDB.js';

class OrderType {
    static async create({ type_name, description, is_active = true, created_by }) {
        const pool = getPool();
        const query = `
      INSERT INTO order_types (type_name, description, is_active, created_by, created_at, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
        const values = [type_name, description, is_active, created_by];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const pool = getPool();
        const query = 'SELECT * FROM order_types WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async findByName(type_name) {
        const pool = getPool();
        const query = 'SELECT * FROM order_types WHERE type_name = $1';
        const result = await pool.query(query, [type_name]);
        return result.rows[0];
    }

    static async findAll({ is_active, search } = {}) {
        const pool = getPool();
        let query = 'SELECT * FROM order_types WHERE 1=1';
        const values = [];
        let paramCount = 1;

        if (is_active !== undefined) {
            query += ` AND is_active = $${paramCount++}`;
            values.push(is_active);
        }
        if (search) {
            query += ` AND (type_name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
            values.push(`%${search}%`);
            paramCount++;
        }

        query += ' ORDER BY created_at DESC';
        const result = await pool.query(query, values);
        return result.rows;
    }

    static async update(id, { type_name, description, is_active, updated_by }) {
        const pool = getPool();
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (type_name) {
            fields.push(`type_name = $${paramCount++}`);
            values.push(type_name);
        }
        if (description !== undefined) {
            fields.push(`description = $${paramCount++}`);
            values.push(description);
        }
        if (is_active !== undefined) {
            fields.push(`is_active = $${paramCount++}`);
            values.push(is_active);
        }
        if (updated_by) {
            fields.push(`updated_by = $${paramCount++}`);
            values.push(updated_by);
        }

        if (fields.length === 0) return null;

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
      UPDATE order_types 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const pool = getPool();
        const query = 'DELETE FROM order_types WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}

export default OrderType;
