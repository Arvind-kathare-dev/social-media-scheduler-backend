import { getPool } from '../config/connectDB.js';

class OrderState {
    static async create({ state_name, description, is_active = true, created_by }) {
        const pool = getPool();
        const query = `
      INSERT INTO order_states (state_name, description, is_active, created_by, created_at, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
        const values = [state_name, description, is_active, created_by];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const pool = getPool();
        const query = 'SELECT * FROM order_states WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async findByName(state_name) {
        const pool = getPool();
        const query = 'SELECT * FROM order_states WHERE state_name = $1';
        const result = await pool.query(query, [state_name]);
        return result.rows[0];
    }

    static async findAll({ is_active, search } = {}) {
        const pool = getPool();
        let query = 'SELECT * FROM order_states WHERE 1=1';
        const values = [];
        let paramCount = 1;

        if (is_active !== undefined) {
            query += ` AND is_active = $${paramCount++}`;
            values.push(is_active);
        }
        if (search) {
            query += ` AND (state_name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
            values.push(`%${search}%`);
            paramCount++;
        }

        query += ' ORDER BY created_at DESC';
        const result = await pool.query(query, values);
        return result.rows;
    }

    static async update(id, { state_name, description, is_active, updated_by }) {
        const pool = getPool();
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (state_name) {
            fields.push(`state_name = $${paramCount++}`);
            values.push(state_name);
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
      UPDATE order_states 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const pool = getPool();
        const query = 'DELETE FROM order_states WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}

export default OrderState;
