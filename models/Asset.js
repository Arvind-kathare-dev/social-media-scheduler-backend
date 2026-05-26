import { getPool } from '../config/connectDB.js';

class Asset {
    static async create({ title, folder_id, platform, copy, author_id, files }) {
        const pool = getPool();
        const query = `
      INSERT INTO assets (title, folder_id, platform, copy, author_id, files)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
        const values = [
            title,
            folder_id || null,
            platform || 'General',
            copy || '',
            author_id,
            JSON.stringify(files || [])
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findAll() {
        const pool = getPool();
        const query = 'SELECT * FROM assets ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    }

    static async findByFolder(folderId) {
        const pool = getPool();
        const query = 'SELECT * FROM assets WHERE folder_id = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [folderId]);
        return result.rows;
    }
    static async findById(id) {
        const pool = getPool();
        const query = 'SELECT * FROM assets WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async delete(id) {
        const pool = getPool();
        const query = 'DELETE FROM assets WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}

export default Asset;
