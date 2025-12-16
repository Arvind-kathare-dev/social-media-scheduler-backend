const db = require('../config/connectDB');

class OrderState {
    static async create({ state_name, description, display_order, is_internal = true }) {
        const query = `
      INSERT INTO order_states (state_name, description, display_order, is_internal)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
        const values = [state_name, description, display_order, is_internal];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM order_states WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async findByName(state_name) {
        const query = 'SELECT * FROM order_states WHERE state_name = $1';
        const result = await db.query(query, [state_name]);
        return result.rows[0];
    }

    static async findAll({ is_internal } = {}) {
        let query = 'SELECT * FROM order_states WHERE 1=1';
        const values = [];

        if (is_internal !== undefined) {
            query += ' AND is_internal = $1';
            values.push(is_internal);
        }

        query += ' ORDER BY display_order';
        const result = await db.query(query, values);
        return result.rows;
    }

    static async update(id, { state_name, description, display_order, is_internal }) {
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
        if (display_order !== undefined) {
            fields.push(`display_order = $${paramCount++}`);
            values.push(display_order);
        }
        if (is_internal !== undefined) {
            fields.push(`is_internal = $${paramCount++}`);
            values.push(is_internal);
        }

        if (fields.length === 0) return null;

        values.push(id);

        const query = `
      UPDATE order_states 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM order_states WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = OrderState;
