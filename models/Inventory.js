import { getPool } from '../config/connectDB.js';

class Inventory {
    static async create({
        sku,
        item_name,
        location,
        current_stock,
        last_restock,
        cost_per_unit,
        supply_status = 'Active',
        created_by
    }) {
        const pool = getPool();
        const query = `
            INSERT INTO inventory (sku, item_name, location, current_stock, last_restock, cost_per_unit, supply_status, created_by, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING *
        `;
        const values = [sku, item_name, location, current_stock, last_restock, cost_per_unit, supply_status, created_by];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findById(id) {
        const pool = getPool();
        const query = 'SELECT * FROM inventory WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async findBySku(sku) {
        const pool = getPool();
        const query = 'SELECT * FROM inventory WHERE sku = $1';
        const result = await pool.query(query, [sku]);
        return result.rows[0];
    }

    static async findAll({ supply_status, location } = {}) {
        const pool = getPool();
        let query = 'SELECT * FROM inventory WHERE 1=1';
        const values = [];
        let paramCount = 1;

        if (supply_status !== undefined) {
            query += ` AND supply_status = $${paramCount++}`;
            values.push(supply_status);
        }

        if (location !== undefined) {
            query += ` AND location = $${paramCount++}`;
            values.push(location);
        }

        query += ' ORDER BY item_name';
        const result = await pool.query(query, values);
        return result.rows;
    }

    static async update(id, { sku, item_name, location, current_stock, last_restock, cost_per_unit, supply_status, updated_by }) {
        const pool = getPool();
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (sku) {
            fields.push(`sku = $${paramCount++}`);
            values.push(sku);
        }
        if (item_name) {
            fields.push(`item_name = $${paramCount++}`);
            values.push(item_name);
        }
        if (location !== undefined) {
            fields.push(`location = $${paramCount++}`);
            values.push(location);
        }
        if (current_stock !== undefined) {
            fields.push(`current_stock = $${paramCount++}`);
            values.push(current_stock);
        }
        if (last_restock !== undefined) {
            fields.push(`last_restock = $${paramCount++}`);
            values.push(last_restock);
        }
        if (cost_per_unit !== undefined) {
            fields.push(`cost_per_unit = $${paramCount++}`);
            values.push(cost_per_unit);
        }
        if (supply_status !== undefined) {
            fields.push(`supply_status = $${paramCount++}`);
            values.push(supply_status);
        }
        if (updated_by !== undefined) {
            fields.push(`updated_by = $${paramCount++}`);
            values.push(updated_by);
        }

        if (fields.length === 0) return null;

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

    static async updateStock(id, quantity_change, updated_by) {
        const pool = getPool();
        const query = `
            UPDATE inventory 
            SET current_stock = current_stock + $1,
                updated_by = $2,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING *
        `;
        const result = await pool.query(query, [quantity_change, updated_by, id]);
        return result.rows[0];
    }

    static async delete(id) {
        const pool = getPool();
        const query = 'DELETE FROM inventory WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}

export default Inventory;
