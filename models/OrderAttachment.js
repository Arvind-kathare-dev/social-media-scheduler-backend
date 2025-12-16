const db = require('../config/connectDB');

class OrderAttachment {
    static async create({ order_id, file_name, file_path, file_type, file_size, uploaded_by, description }) {
        const query = `
      INSERT INTO order_attachments (order_id, file_name, file_path, file_type, file_size, uploaded_by, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
        const values = [order_id, file_name, file_path, file_type, file_size, uploaded_by, description];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM order_attachments WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async findByOrderId(order_id) {
        const query = `
      SELECT oa.*, u.name as uploaded_by_name
      FROM order_attachments oa
      LEFT JOIN users u ON oa.uploaded_by = u.id
      WHERE oa.order_id = $1
      ORDER BY oa.uploaded_at DESC
    `;
        const result = await db.query(query, [order_id]);
        return result.rows;
    }

    static async delete(id) {
        const query = 'DELETE FROM order_attachments WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = OrderAttachment;
