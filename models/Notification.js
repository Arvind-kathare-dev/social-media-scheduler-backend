const db = require('../config/connectDB');

class Notification {
    static async create({ user_id, order_id, notification_type, title, message, metadata = {} }) {
        const query = `
      INSERT INTO notifications (user_id, order_id, notification_type, title, message, metadata)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
        const values = [user_id, order_id, notification_type, title, message, JSON.stringify(metadata)];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM notifications WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async findByUserId(user_id, { is_read, limit = 50, offset = 0 } = {}) {
        let query = 'SELECT * FROM notifications WHERE user_id = $1';
        const values = [user_id];
        let paramCount = 2;

        if (is_read !== undefined) {
            query += ` AND is_read = $${paramCount++}`;
            values.push(is_read);
        }

        query += ` ORDER BY created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
        values.push(limit, offset);

        const result = await db.query(query, values);
        return result.rows;
    }

    static async markAsRead(id) {
        const query = `
      UPDATE notifications 
      SET is_read = true, read_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async markAllAsRead(user_id) {
        const query = `
      UPDATE notifications 
      SET is_read = true, read_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND is_read = false
      RETURNING *
    `;
        const result = await db.query(query, [user_id]);
        return result.rows;
    }

    static async delete(id) {
        const query = 'DELETE FROM notifications WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = Notification;
