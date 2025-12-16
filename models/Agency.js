import { getPool } from '../config/connectDB.js';

class Agency {
    static async create({ agency_name, email, contact_no, date_of_birth, agency_no, license_no, hospital_name, sign_threshold, is_active = true, created_by, password, role = 'Staff' }) {
        const pool = getPool();
        const query = `
      INSERT INTO agencies (agency_name, email, contact_no, date_of_birth, agency_no, license_no, hospital_name, sign_threshold, is_active, created_by, password, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
        const values = [agency_name, email, contact_no, date_of_birth, agency_no, license_no, hospital_name, sign_threshold, is_active, created_by, password, role];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const pool = getPool();
        const query = 'SELECT * FROM agencies WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const pool = getPool();
        const query = 'SELECT * FROM agencies WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    static async findAll({ is_active, hospital_name, search, role } = {}) {
        const pool = getPool();
        let query = 'SELECT * FROM agencies WHERE 1=1';
        const values = [];
        let paramCount = 1;

        if (is_active !== undefined) {
            query += ` AND is_active = $${paramCount++}`;
            values.push(is_active);
        }
        if (hospital_name) {
            query += ` AND hospital_name = $${paramCount++}`;
            values.push(hospital_name);
        }
        if (role) {
            query += ` AND role = $${paramCount++}`;
            values.push(role);
        }
        if (search) {
            query += ` AND (agency_name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR agency_no ILIKE $${paramCount})`;
            values.push(`%${search}%`);
            paramCount++;
        }

        query += ' ORDER BY created_at DESC';
        const result = await pool.query(query, values);
        return result.rows;
    }

    static async update(id, { agency_name, email, contact_no, date_of_birth, agency_no, license_no, hospital_name, sign_threshold, is_active, updated_by, password, role }) {
        const pool = getPool();
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (agency_name) {
            fields.push(`agency_name = $${paramCount++}`);
            values.push(agency_name);
        }
        if (email !== undefined) {
            fields.push(`email = $${paramCount++}`);
            values.push(email);
        }
        if (contact_no !== undefined) {
            fields.push(`contact_no = $${paramCount++}`);
            values.push(contact_no);
        }
        if (date_of_birth !== undefined) {
            fields.push(`date_of_birth = $${paramCount++}`);
            values.push(date_of_birth);
        }
        if (agency_no !== undefined) {
            fields.push(`agency_no = $${paramCount++}`);
            values.push(agency_no);
        }
        if (license_no !== undefined) {
            fields.push(`license_no = $${paramCount++}`);
            values.push(license_no);
        }
        if (hospital_name !== undefined) {
            fields.push(`hospital_name = $${paramCount++}`);
            values.push(hospital_name);
        }
        if (sign_threshold !== undefined) {
            fields.push(`sign_threshold = $${paramCount++}`);
            values.push(sign_threshold);
        }
        if (is_active !== undefined) {
            fields.push(`is_active = $${paramCount++}`);
            values.push(is_active);
        }
        if (password !== undefined) {
            fields.push(`password = $${paramCount++}`);
            values.push(password);
        }
        if (role !== undefined) {
            fields.push(`role = $${paramCount++}`);
            values.push(role);
        }
        if (updated_by) {
            fields.push(`updated_by = $${paramCount++}`);
            values.push(updated_by);
        }

        if (fields.length === 0) return null;

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
      UPDATE agencies 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const pool = getPool();
        const query = 'DELETE FROM agencies WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}

export default Agency;
