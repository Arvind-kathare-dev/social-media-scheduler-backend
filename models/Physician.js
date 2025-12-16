const db = require('../config/connectDB');

class Physician {
    static async create({
        agency_id, user_id, physician_type, status = 'active',
        first_name, last_name, display_name,
        primary_email, secondary_email, phone_number, fax_number, preferred_contact_method,
        login_enabled = false, login_email, role = 'physician', account_status,
        specialty = [], department, tags = [], internal_notes,
        npi_number, npi_source, pecos_id, pecos_status, pecos_source,
        default_delivery_method, auto_notify = true, reminder_enabled = true, preferred_sla,
        created_by
    }) {
        const query = `
      INSERT INTO physicians (
        agency_id, user_id, physician_type, status,
        first_name, last_name, display_name,
        primary_email, secondary_email, phone_number, fax_number, preferred_contact_method,
        login_enabled, login_email, role, account_status,
        specialty, department, tags, internal_notes,
        npi_number, npi_source, pecos_id, pecos_status, pecos_source,
        default_delivery_method, auto_notify, reminder_enabled, preferred_sla,
        created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30)
      RETURNING *
    `;
        const values = [
            agency_id, user_id, physician_type, status,
            first_name, last_name, display_name,
            primary_email, secondary_email, phone_number, fax_number, preferred_contact_method,
            login_enabled, login_email, role, account_status,
            specialty, department, tags, internal_notes,
            npi_number, npi_source, pecos_id, pecos_status, pecos_source,
            default_delivery_method, auto_notify, reminder_enabled, preferred_sla,
            created_by
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM physicians WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async findByAgency(agency_id, { physician_type, status } = {}) {
        let query = 'SELECT * FROM physicians WHERE agency_id = $1';
        const values = [agency_id];
        let paramCount = 2;

        if (physician_type) {
            query += ` AND physician_type = $${paramCount++}`;
            values.push(physician_type);
        }
        if (status) {
            query += ` AND status = $${paramCount++}`;
            values.push(status);
        }

        query += ' ORDER BY last_name, first_name';
        const result = await db.query(query, values);
        return result.rows;
    }

    static async findByEmail(primary_email) {
        const query = 'SELECT * FROM physicians WHERE primary_email = $1';
        const result = await db.query(query, [primary_email]);
        return result.rows[0];
    }

    static async update(id, data) {
        const fields = [];
        const values = [];
        let paramCount = 1;

        const allowedFields = [
            'user_id', 'physician_type', 'status', 'first_name', 'last_name', 'display_name',
            'primary_email', 'secondary_email', 'phone_number', 'fax_number', 'preferred_contact_method',
            'login_enabled', 'login_email', 'role', 'account_status',
            'specialty', 'department', 'tags', 'internal_notes',
            'npi_number', 'npi_source', 'pecos_id', 'pecos_status', 'pecos_source',
            'default_delivery_method', 'auto_notify', 'reminder_enabled', 'preferred_sla',
            'updated_by'
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
      UPDATE physicians 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async deactivate(id, { deactivated_by, deactivation_reason }) {
        const query = `
      UPDATE physicians 
      SET status = 'inactive',
          deactivated_by = $1,
          deactivated_at = CURRENT_TIMESTAMP,
          deactivation_reason = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
        const result = await db.query(query, [deactivated_by, deactivation_reason, id]);
        return result.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM physicians WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = Physician;
