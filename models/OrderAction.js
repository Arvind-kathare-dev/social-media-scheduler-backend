const db = require('../config/connectDB');

class OrderAction {
    static async create({ order_id, action_type, performed_by, from_physician_id, to_physician_id, notes, metadata = {} }) {
        const query = `
      INSERT INTO order_actions (order_id, action_type, performed_by, from_physician_id, to_physician_id, notes, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
        const values = [order_id, action_type, performed_by, from_physician_id, to_physician_id, notes, JSON.stringify(metadata)];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findByOrderId(order_id) {
        const query = `
      SELECT oa.*, u.name as performed_by_name,
             fp.first_name || ' ' || fp.last_name as from_physician_name,
             tp.first_name || ' ' || tp.last_name as to_physician_name
      FROM order_actions oa
      LEFT JOIN users u ON oa.performed_by = u.id
      LEFT JOIN physicians fp ON oa.from_physician_id = fp.id
      LEFT JOIN physicians tp ON oa.to_physician_id = tp.id
      WHERE oa.order_id = $1
      ORDER BY oa.performed_at DESC
    `;
        const result = await db.query(query, [order_id]);
        return result.rows;
    }

    static async findAll({ order_id, action_type, performed_by, limit = 100, offset = 0 } = {}) {
        let query = `
      SELECT oa.*, u.name as performed_by_name
      FROM order_actions oa
      LEFT JOIN users u ON oa.performed_by = u.id
      WHERE 1=1
    `;
        const values = [];
        let paramCount = 1;

        if (order_id) {
            query += ` AND oa.order_id = $${paramCount++}`;
            values.push(order_id);
        }
        if (action_type) {
            query += ` AND oa.action_type = $${paramCount++}`;
            values.push(action_type);
        }
        if (performed_by) {
            query += ` AND oa.performed_by = $${paramCount++}`;
            values.push(performed_by);
        }

        query += ` ORDER BY oa.performed_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
        values.push(limit, offset);

        const result = await db.query(query, values);
        return result.rows;
    }
}

module.exports = OrderAction;
