import { getPool } from '../config/connectDB.js';

class Physician {
    static async create({
        agency_id, physician_type, status = 'active',
        first_name, last_name, display_name,
        primary_email, secondary_email, phone_number, fax_number, preferred_contact_method,
        login_enabled = true, login_email, role = 'physician', account_status,
        specialty = [], department, tags = [], internal_notes,
        npi_number, npi_source, pecos_id, pecos_status, pecos_source,
        default_delivery_method, auto_notify = true, reminder_enabled = true, preferred_sla,
        created_by
    }) {
        const pool = getPool();
        const query = `
      INSERT INTO physicians (
        agency_id, physician_type, status,
        first_name, last_name, display_name,
        primary_email, secondary_email, phone_number, fax_number, preferred_contact_method,
        login_enabled, login_email, role, account_status,
        specialty, department, tags, internal_notes,
        npi_number, npi_source, pecos_id, pecos_status, pecos_source,
        default_delivery_method, auto_notify, reminder_enabled, preferred_sla,
        created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)
      RETURNING *
    `;
        const values = [
            agency_id,              // $1
            physician_type,         // $2
            status,                 // $3
            first_name,             // $4
            last_name,              // $5
            display_name,           // $6
            primary_email,          // $7
            secondary_email,        // $8
            phone_number,           // $9
            fax_number,             // $10
            preferred_contact_method, // $11
            login_enabled,          // $12
            login_email,            // $13
            role,                   // $14
            account_status,         // $15
            JSON.stringify(specialty), // $16
            department,             // $17
            JSON.stringify(tags),   // $18
            internal_notes,         // $19
            npi_number,             // $20
            npi_source,             // $21
            pecos_id,               // $22
            pecos_status,           // $23
            pecos_source,           // $24
            default_delivery_method, // $25
            auto_notify,            // $26
            reminder_enabled,       // $27
            preferred_sla,          // $28
            created_by              // $29
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findById(physician_id) {
        const pool = getPool();
        const query = 'SELECT * FROM physicians WHERE physician_id = $1';
        const result = await pool.query(query, [physician_id]);
        return result.rows[0];
    }

    static async findByAgency(agency_id, { physician_type, status, search } = {}) {
        const pool = getPool();
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
        if (search) {
            query += ` AND (first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount} OR primary_email ILIKE $${paramCount} OR npi_number ILIKE $${paramCount})`;
            values.push(`%${search}%`);
            paramCount++;
        }

        query += ' ORDER BY last_name, first_name';
        const result = await pool.query(query, values);
        return result.rows;
    }

    static async findByEmail(primary_email) {
        const pool = getPool();
        const query = 'SELECT * FROM physicians WHERE primary_email = $1';
        const result = await pool.query(query, [primary_email]);
        return result.rows[0];
    }

    static async findAll({ physician_type, status, agency_id, search } = {}) {
        const pool = getPool();
        let query = 'SELECT * FROM physicians WHERE 1=1';
        const values = [];
        let paramCount = 1;

        if (agency_id) {
            query += ` AND agency_id = $${paramCount++}`;
            values.push(agency_id);
        }
        if (physician_type) {
            query += ` AND physician_type = $${paramCount++}`;
            values.push(physician_type);
        }
        if (status) {
            query += ` AND status = $${paramCount++}`;
            values.push(status);
        }
        if (search) {
            query += ` AND (first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount} OR primary_email ILIKE $${paramCount} OR npi_number ILIKE $${paramCount})`;
            values.push(`%${search}%`);
            paramCount++;
        }

        query += ' ORDER BY last_name, first_name';
        const result = await pool.query(query, values);
        return result.rows;
    }

    static async update(physician_id, data) {
        const pool = getPool();
        const fields = [];
        const values = [];
        let paramCount = 1;

        const allowedFields = [
            'physician_type', 'status', 'first_name', 'last_name', 'display_name',
            'primary_email', 'secondary_email', 'phone_number', 'fax_number', 'preferred_contact_method',
            'login_enabled', 'login_email', 'role', 'account_status',
            'specialty', 'department', 'tags', 'internal_notes',
            'npi_number', 'npi_source', 'pecos_id', 'pecos_status', 'pecos_source',
            'default_delivery_method', 'auto_notify', 'reminder_enabled', 'preferred_sla',
            'updated_by'
        ];

        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                // Convert arrays to JSON for specialty and tags
                if (field === 'specialty' || field === 'tags') {
                    fields.push(`${field} = $${paramCount++}`);
                    values.push(JSON.stringify(data[field]));
                } else {
                    fields.push(`${field} = $${paramCount++}`);
                    values.push(data[field]);
                }
            }
        });

        if (fields.length === 0) return null;

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(physician_id);

        const query = `
      UPDATE physicians 
      SET ${fields.join(', ')}
      WHERE physician_id = $${paramCount}
      RETURNING *
    `;
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async deactivate(physician_id, { deactivated_by, deactivation_reason }) {
        const pool = getPool();
        const query = `
      UPDATE physicians 
      SET status = 'inactive',
          deactivated_by = $1,
          deactivated_at = CURRENT_TIMESTAMP,
          deactivation_reason = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE physician_id = $3
      RETURNING *
    `;
        const result = await pool.query(query, [deactivated_by, deactivation_reason, physician_id]);
        return result.rows[0];
    }

    static async activate(physician_id, updated_by) {
        const pool = getPool();
        const query = `
      UPDATE physicians 
      SET status = 'active',
          deactivated_by = NULL,
          deactivated_at = NULL,
          deactivation_reason = NULL,
          updated_by = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE physician_id = $2
      RETURNING *
    `;
        const result = await pool.query(query, [updated_by, physician_id]);
        return result.rows[0];
    }

    static async delete(physician_id) {
        const pool = getPool();
        const query = 'DELETE FROM physicians WHERE physician_id = $1 RETURNING *';
        const result = await pool.query(query, [physician_id]);
        return result.rows[0];
    }
}

export default Physician;
