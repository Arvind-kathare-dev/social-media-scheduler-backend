const db = require('../config/connectDB');

class OrderHistory {
    static async create({ order_id, from_state, to_state, changed_by, notes, metadata = {} }) {
        const query = `
      INSERT INTO order_history (order_id, from_state, to_state, changed_by, notes, metadata)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
        const values = [order_id, from_state, to_state, changed_by, notes, JSON.stringify(metadata)];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findByOrderId(order_id) {
        const query = `
      SELECT oh.*, u.name as changed_by_name
      FROM order_history oh
      LEFT JOIN users u ON oh.changed_by = u.id
      WHERE oh.order_id = $1
      ORDER BY oh.changed_at DESC
    `;
        const result = await db.query(query, [order_id]);
        return result.rows;
    }

    static async findAll({ order_id, from_state, to_state, limit = 100, offset = 0 } = {}) {
        let query = `
      SELECT oh.*, u.name as changed_by_name
      FROM order_history oh
      LEFT JOIN users u ON oh.changed_by = u.id
      WHERE 1=1
    `;
        const values = [];
        let paramCount = 1;

        if (order_id) {
            query += ` AND oh.order_id = $${paramCount++}`;
            values.push(order_id);
        }
        if (from_state) {
            query += ` AND oh.from_state = $${paramCount++}`;
            values.push(from_state);
        }
        if (to_state) {
            query += ` AND oh.to_state = $${paramCount++}`;
            values.push(to_state);
        }

        query += ` ORDER BY oh.changed_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
        values.push(limit, offset);

        const result = await db.query(query, values);
        return result.rows;
    }
}

module.exports = OrderHistory;
