import { getPool } from '../config/connectDB.js';

class Submission {
    static async create({ task_id, submitted_by, files, live_link, doc_content, designer_note }) {
        const pool = getPool();
        const query = `
            INSERT INTO submissions (task_id, submitted_by, files, live_link, doc_content, designer_note)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [
            task_id,
            submitted_by,
            JSON.stringify(files || []),
            live_link || '',
            doc_content || '',
            designer_note || ''
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findByTaskId(task_id) {
        const pool = getPool();
        const query = `
            SELECT s.*, u.name as submitted_by_name, u.role as submitter_role
            FROM submissions s
            LEFT JOIN users u ON s.submitted_by = u.id
            WHERE s.task_id = $1
            ORDER BY s.created_at DESC
        `;
        const result = await pool.query(query, [task_id]);
        return result.rows;
    }

    static async updateStatus(id, status) {
        const pool = getPool();
        const query = 'UPDATE submissions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
        const result = await pool.query(query, [status, id]);
        return result.rows[0];
    }
}

export default Submission;
