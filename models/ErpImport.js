const db = require('../config/connectDB');

class ErpImport {
    static async create({ order_id, erp_source, external_order_id, import_status = 'pending', import_data = {}, error_message }) {
        const query = `
      INSERT INTO erp_imports (order_id, erp_source, external_order_id, import_status, import_data, error_message)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
        const values = [order_id, erp_source, external_order_id, import_status, JSON.stringify(import_data), error_message];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM erp_imports WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async findByOrderId(order_id) {
        const query = 'SELECT * FROM erp_imports WHERE order_id = $1 ORDER BY imported_at DESC';
        const result = await db.query(query, [order_id]);
        return result.rows;
    }

    static async findAll({ erp_source, import_status, limit = 100, offset = 0 } = {}) {
        let query = 'SELECT * FROM erp_imports WHERE 1=1';
        const values = [];
        let paramCount = 1;

        if (erp_source) {
            query += ` AND erp_source = $${paramCount++}`;
            values.push(erp_source);
        }
        if (import_status) {
            query += ` AND import_status = $${paramCount++}`;
            values.push(import_status);
        }

        query += ` ORDER BY imported_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
        values.push(limit, offset);

        const result = await db.query(query, values);
        return result.rows;
    }

    static async updateStatus(id, { import_status, error_message, processed_at = new Date() }) {
        const query = `
      UPDATE erp_imports 
      SET import_status = $1, error_message = $2, processed_at = $3
      WHERE id = $4
      RETURNING *
    `;
        const result = await db.query(query, [import_status, error_message, processed_at, id]);
        return result.rows[0];
    }
}

module.exports = ErpImport;
