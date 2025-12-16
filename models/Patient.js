const db = require('../config/connectDB');

class Patient {
    static async create({ name, dob, contact_phone, contact_email, address, medical_record_number }) {
        const query = `
      INSERT INTO patients (name, dob, contact_phone, contact_email, address, medical_record_number)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
        const values = [name, dob, contact_phone, contact_email, address, medical_record_number];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT * FROM patients WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async findByMRN(medical_record_number) {
        const query = 'SELECT * FROM patients WHERE medical_record_number = $1';
        const result = await db.query(query, [medical_record_number]);
        return result.rows[0];
    }

    static async findAll({ search, limit = 50, offset = 0 } = {}) {
        let query = 'SELECT * FROM patients WHERE 1=1';
        const values = [];
        let paramCount = 1;

        if (search) {
            query += ` AND (name ILIKE $${paramCount} OR medical_record_number ILIKE $${paramCount})`;
            values.push(`%${search}%`);
            paramCount++;
        }

        query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        values.push(limit, offset);

        const result = await db.query(query, values);
        return result.rows;
    }

    static async update(id, { name, dob, contact_phone, contact_email, address, medical_record_number }) {
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (name) {
            fields.push(`name = $${paramCount++}`);
            values.push(name);
        }
        if (dob) {
            fields.push(`dob = $${paramCount++}`);
            values.push(dob);
        }
        if (contact_phone !== undefined) {
            fields.push(`contact_phone = $${paramCount++}`);
            values.push(contact_phone);
        }
        if (contact_email !== undefined) {
            fields.push(`contact_email = $${paramCount++}`);
            values.push(contact_email);
        }
        if (address !== undefined) {
            fields.push(`address = $${paramCount++}`);
            values.push(address);
        }
        if (medical_record_number) {
            fields.push(`medical_record_number = $${paramCount++}`);
            values.push(medical_record_number);
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
      UPDATE patients 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM patients WHERE id = $1 RETURNING *';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = Patient;
