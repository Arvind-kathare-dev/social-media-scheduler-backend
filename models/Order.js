const db = require('../config/connectDB');

class Order {
    static async create({
        patient_id, physician_id, order_type_id, agency_id,
        service_type, source, state = 'Draft',
        clinical_instructions, notes, delivery_method,
        created_by
    }) {
        const query = `
      INSERT INTO orders (
        patient_id, physician_id, order_type_id, agency_id,
        service_type, source, state,
        clinical_instructions, notes, delivery_method,
        created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
        const values = [
            patient_id, physician_id, order_type_id, agency_id,
            service_type, source, state,
            clinical_instructions, notes, delivery_method,
            created_by
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const query = `
      SELECT o.*, 
             p.name as patient_name,
             ph.first_name || ' ' || ph.last_name as physician_name,
             ph.physician_type,
             ot.type_name as order_type_name,
             a.name as agency_name
      FROM orders o
      LEFT JOIN patients p ON o.patient_id = p.id
      LEFT JOIN physicians ph ON o.physician_id = ph.id
      LEFT JOIN order_types ot ON o.order_type_id = ot.id
      LEFT JOIN agencies a ON o.agency_id = a.id
      WHERE o.id = $1
    `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async findAll(filters = {}) {
        let query = `
      SELECT o.*, 
             p.name as patient_name,
             ph.first_name || ' ' || ph.last_name as physician_name,
             ph.physician_type,
             ot.type_name as order_type_name,
             a.name as agency_name
      FROM orders o
      LEFT JOIN patients p ON o.patient_id = p.id
      LEFT JOIN physicians ph ON o.physician_id = ph.id
      LEFT JOIN order_types ot ON o.order_type_id = ot.id
      LEFT JOIN agencies a ON o.agency_id = a.id
      WHERE 1=1
    `;
        const values = [];
        let paramCount = 1;

        if (filters.agency_id) {
            query += ` AND o.agency_id = $${paramCount++}`;
            values.push(filters.agency_id);
        }
        if (filters.physician_id) {
            query += ` AND o.physician_id = $${paramCount++}`;
            values.push(filters.physician_id);
        }
        if (filters.patient_id) {
            query += ` AND o.patient_id = $${paramCount++}`;
            values.push(filters.patient_id);
        }
        if (filters.state) {
            query += ` AND o.state = $${paramCount++}`;
            values.push(filters.state);
        }
        if (filters.order_type_id) {
            query += ` AND o.order_type_id = $${paramCount++}`;
            values.push(filters.order_type_id);
        }
        if (filters.physician_type) {
            query += ` AND ph.physician_type = $${paramCount++}`;
            values.push(filters.physician_type);
        }
        if (filters.date_from) {
            query += ` AND o.created_at >= $${paramCount++}`;
            values.push(filters.date_from);
        }
        if (filters.date_to) {
            query += ` AND o.created_at <= $${paramCount++}`;
            values.push(filters.date_to);
        }

        query += ' ORDER BY o.created_at DESC';

        if (filters.limit) {
            query += ` LIMIT $${paramCount++}`;
            values.push(filters.limit);
        }
        if (filters.offset) {
            query += ` OFFSET $${paramCount++}`;
            values.push(filters.offset);
        }

        const result = await db.query(query, values);
        return result.rows;
    }

    static async update(id, data) {
        const fields = [];
        const values = [];
        let paramCount = 1;

        const allowedFields = [
            'patient_id', 'physician_id', 'order_type_id', 'service_type',
            'state', 'clinical_instructions', 'notes', 'delivery_method',
            'external_tracking_id'
        ];

        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                fields.push(`${field} = $${paramCount++}`);
                values.push(data[field]);
            }
        });

        if (fields.length === 0) return null;

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
      UPDATE orders 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async updateState(id, state, userId) {
        const stateTimestamps = {
            'Unopened': 'submitted_at',
            'Unsigned': 'viewed_at',
            'Signed': 'signed_at',
            'Rejected': 'rejected_at',
            'Sent (External)': 'sent_external_at',
            'Signed (External)': 'signed_external_at',
            'Rejected (External)': 'rejected_external_at',
            'Delivered': 'delivered_at'
        };

        let query = `UPDATE orders SET state = $1, updated_at = CURRENT_TIMESTAMP`;
        const values = [state];
        let paramCount = 2;

        if (stateTimestamps[state]) {
            query += `, ${stateTimestamps[state]} = CURRENT_TIMESTAMP`;
        }

        if (state === 'Signed' || state === 'Rejected') {
            const userField = state === 'Signed' ? 'signed_by' : 'rejected_by';
            query += `, ${userField} = $${paramCount++}`;
            values.push(userId);
        }

        values.push(id);
        query += ` WHERE id = $${paramCount} RETURNING *`;

        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM orders WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = Order;
