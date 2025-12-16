const db = require('../config/connectDB');

class OrderRejection {
    static async create({ order_id, rejected_by, rejection_reason, rejection_category, additional_notes }) {
        const query = `
      INSERT INTO order_rejections (order_id, rejected_by, rejection_reason, rejection_category, additional_notes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        const values = [order_id, rejected_by, rejection_reason, rejection_category, additional_notes];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findByOrderId(order_id) {
        const query = `
      SELECT orj.*, u.name as rejected_by_name
      FROM order_rejections orj
      LEFT JOIN users u ON orj.rejected_by = u.id
      WHERE orj.order_id = $1
      ORDER BY orj.rejected_at DESC
    `;
        const result = await db.query(query, [order_id]);
        return result.rows;
    }

    static async findAll({ rejection_category, limit = 100, offset = 0 } = {}) {
        let query = `
      SELECT orj.*, u.name as rejected_by_name, o.id as order_id
      FROM order_rejections orj
      LEFT JOIN users u ON orj.rejected_by = u.id
      LEFT JOIN orders o ON orj.order_id = o.id
      WHERE 1=1
    `;
        const values = [];
        let paramCount = 1;

        if (rejection_category) {
            query += ` AND orj.rejection_category = $${paramCount++}`;
            values.push(rejection_category);
        }

        query += ` ORDER BY orj.rejected_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
        values.push(limit, offset);

        const result = await db.query(query, values);
        return result.rows;
    }
}

module.exports = OrderRejection;
