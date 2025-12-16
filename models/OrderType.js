const db = require('../config/connectDB');

class OrderType {
    static async create({ type_name, description, is_active = true }) {
        const query = `
      INSERT INTO order_types (type_name, description, is_active)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
        const values = [type_name, description, is_active];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM order_types WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async findAll({ is_active } = {}) {
        let query = 'SELECT * FROM order_types WHERE 1=1';
        const values = [];

        if (is_active !== undefined) {
            query += ' AND is_active = $1';
            values.push(is_active);
        }

        query += ' ORDER BY type_name';
        const result = await db.query(query, values);
        return result.rows;
    }

    static async update(id, { type_name, description, is_active }) {
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

        if (fields.length === 0) return null;

        values.push(id);

        const query = `
      UPDATE order_types 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM order_types WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = OrderType;
