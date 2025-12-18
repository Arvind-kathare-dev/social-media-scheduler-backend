import { getPool } from '../config/connectDB.js';

class Inventory {
    static async create({
        item_name,
        item_code,
        description,
        category,
        quantity,
        unit_of_measure,
        reorder_level,
        unit_price,
        supplier_name,
        supplier_contact,
        location,
        expiry_date,
        batch_number,
        is_active = true,
        created_by
    }) {
        const pool = getPool();
        const query = `
      INSERT INTO inventory (
        item_name, item_code, description, category, quantity, unit_of_measure,
        reorder_level, unit_price, supplier_name, supplier_contact, location,
        expiry_date, batch_number, is_active, created_by, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
        const values = [
            item_name,
            item_code,
            description,
            category,
            quantity,
            unit_of_measure,
            reorder_level,
            unit_price,
            supplier_name,
            supplier_contact,
            location,
            expiry_date,
            batch_number,
            is_active,
            created_by
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const pool = getPool();
        const query = 'SELECT * FROM inventory WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async findByItemCode(item_code) {
        const pool = getPool();
        const query = 'SELECT * FROM inventory WHERE item_code = $1';
        const result = await pool.query(query, [item_code]);
        return result.rows[0];
    }

    static async findAll({ is_active, category, search, low_stock } = {}) {
        const pool = getPool();
        let query = 'SELECT * FROM inventory WHERE 1=1';
        const values = [];
        let paramCount = 1;

        if (is_active !== undefined) {
            query += ` AND is_active = $${paramCount++}`;
            values.push(is_active);
        }

        if (category) {
            query += ` AND category = $${paramCount++}`;
            values.push(category);
        }

        if (search) {
            query += ` AND (item_name ILIKE $${paramCount} OR item_code ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
            values.push(`%${search}%`);
            paramCount++;
        }

        if (low_stock === 'true') {
            query += ` AND quantity <= reorder_level`;
        }

        query += ' ORDER BY created_at DESC';
        const result = await pool.query(query, values);
        return result.rows;
    }

    static async update(id, {
        item_name,
        item_code,
        description,
        category,
        quantity,
        unit_of_measure,
        reorder_level,
        unit_price,
        supplier_name,
        supplier_contact,
        location,
        expiry_date,
        batch_number,
        is_active,
        updated_by
    }) {
        const pool = getPool();
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (item_name !== undefined) {
            fields.push(`item_name = $${paramCount++}`);
            values.push(item_name);
        }
        if (item_code !== undefined) {
            fields.push(`item_code = $${paramCount++}`);
            values.push(item_code);
        }
        if (description !== undefined) {
            fields.push(`description = $${paramCount++}`);
            values.push(description);
        }
        if (category !== undefined) {
            fields.push(`category = $${paramCount++}`);
            values.push(category);
        }
        if (quantity !== undefined) {
            fields.push(`quantity = $${paramCount++}`);
            values.push(quantity);
        }
        if (unit_of_measure !== undefined) {
            fields.push(`unit_of_measure = $${paramCount++}`);
            values.push(unit_of_measure);
        }
        if (reorder_level !== undefined) {
            fields.push(`reorder_level = $${paramCount++}`);
            values.push(reorder_level);
        }
        if (unit_price !== undefined) {
            fields.push(`unit_price = $${paramCount++}`);
            values.push(unit_price);
        }
        if (supplier_name !== undefined) {
            fields.push(`supplier_name = $${paramCount++}`);
            values.push(supplier_name);
        }
        if (supplier_contact !== undefined) {
            fields.push(`supplier_contact = $${paramCount++}`);
            values.push(supplier_contact);
        }
        if (location !== undefined) {
            fields.push(`location = $${paramCount++}`);
            values.push(location);
        }
        if (expiry_date !== undefined) {
            fields.push(`expiry_date = $${paramCount++}`);
            values.push(expiry_date);
        }
        if (batch_number !== undefined) {
            fields.push(`batch_number = $${paramCount++}`);
            values.push(batch_number);
        }
        if (is_active !== undefined) {
            fields.push(`is_active = $${paramCount++}`);
            values.push(is_active);
        }
        if (updated_by) {
            fields.push(`updated_by = $${paramCount++}`);
            values.push(updated_by);
        }

        if (fields.length === 0) return null;

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
      UPDATE inventory 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async updateQuantity(id, quantity_change, updated_by) {
        const pool = getPool();
        const query = `
      UPDATE inventory 
      SET quantity = quantity + $1,
          updated_by = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
        const values = [quantity_change, updated_by, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const pool = getPool();
        const query = 'DELETE FROM inventory WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async getLowStockItems() {
        const pool = getPool();
        const query = `
      SELECT * FROM inventory 
      WHERE quantity <= reorder_level 
      AND is_active = true
      ORDER BY quantity ASC
    `;
        const result = await pool.query(query);
        return result.rows;
    }

    static async getExpiringSoon(days = 30) {
        const pool = getPool();
        const query = `
      SELECT * FROM inventory 
      WHERE expiry_date IS NOT NULL 
      AND expiry_date <= CURRENT_DATE + $1 * INTERVAL '1 day'
      AND expiry_date >= CURRENT_DATE
      AND is_active = true
      ORDER BY expiry_date ASC
    `;
        const result = await pool.query(query, [days]);
        return result.rows;
    }

    static async getByCategory(category) {
        const pool = getPool();
        const query = `
      SELECT * FROM inventory 
      WHERE category = $1 
      AND is_active = true
      ORDER BY item_name ASC
    `;
        const result = await pool.query(query, [category]);
        return result.rows;
    }
}

export default Inventory;
