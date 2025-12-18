import { getPool } from '../config/connectDB.js';

class Supply {
    static async create({
        order_id,
        patient_name,
        clinician_name,
        items,
        total_items,
        order_date,
        insurance_type,
        is_approve = false,
        is_decline = false,
        created_by
    }) {
        const pool = getPool();
        const query = `
            INSERT INTO supplies (order_id, patient_name, clinician_name, items, total_items, order_date, insurance_type, is_approve, is_decline, created_by, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING *
        `;
        const values = [order_id, patient_name, clinician_name, items, total_items, order_date, insurance_type, is_approve, is_decline, created_by];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const pool = getPool();
        const query = 'SELECT * FROM supplies WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async findByOrderId(order_id) {
        const pool = getPool();
        const query = 'SELECT * FROM supplies WHERE order_id = $1';
        const result = await pool.query(query, [order_id]);
        return result.rows[0];
    }

    static async findAll({ insurance_type, is_approve, is_decline } = {}) {
        const pool = getPool();
        let query = 'SELECT * FROM supplies WHERE 1=1';
        const values = [];
        let paramCount = 1;

        if (insurance_type !== undefined) {
            query += ` AND insurance_type = $${paramCount++}`;
            values.push(insurance_type);
        }

        if (is_approve !== undefined) {
            query += ` AND is_approve = $${paramCount++}`;
            values.push(is_approve);
        }

        if (is_decline !== undefined) {
            query += ` AND is_decline = $${paramCount++}`;
            values.push(is_decline);
        }

        query += ' ORDER BY order_date DESC';
        const result = await pool.query(query, values);
        return result.rows;
    }

    static async update(id, { order_id, patient_name, clinician_name, items, total_items, order_date, insurance_type, is_approve, is_decline, updated_by }) {
        const pool = getPool();
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (order_id) {
            fields.push(`order_id = $${paramCount++}`);
            values.push(order_id);
        }
        if (patient_name) {
            fields.push(`patient_name = $${paramCount++}`);
            values.push(patient_name);
        }
        if (clinician_name) {
            fields.push(`clinician_name = $${paramCount++}`);
            values.push(clinician_name);
        }
        if (items !== undefined) {
            fields.push(`items = $${paramCount++}`);
            values.push(items);
        }
        if (total_items !== undefined) {
            fields.push(`total_items = $${paramCount++}`);
            values.push(total_items);
        }
        if (order_date !== undefined) {
            fields.push(`order_date = $${paramCount++}`);
            values.push(order_date);
        }
        if (insurance_type !== undefined) {
            fields.push(`insurance_type = $${paramCount++}`);
            values.push(insurance_type);
        }
        if (is_approve !== undefined) {
            fields.push(`is_approve = $${paramCount++}`);
            values.push(is_approve);
        }
        if (is_decline !== undefined) {
            fields.push(`is_decline = $${paramCount++}`);
            values.push(is_decline);
        }
        if (updated_by !== undefined) {
            fields.push(`updated_by = $${paramCount++}`);
            values.push(updated_by);
        }

        if (fields.length === 0) return null;

        values.push(id);

        const query = `
            UPDATE supplies 
            SET ${fields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `;
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const pool = getPool();
        const query = 'DELETE FROM supplies WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}

export default Supply;
