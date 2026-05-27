import { getPool } from "../config/connectDB.js";
import { createNotification } from "./NotificationController.js";
import { v7 as uuidv7 } from 'uuid';

// Fetch comments for a specific task (including user details)
export const getCommentsByTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const pool = getPool();
    const query = `
      SELECT c.*, u.name as user_name, u.email as user_email 
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.task_id = $1
      ORDER BY c.created_at ASC
    `;
    const result = await pool.query(query, [taskId]);
    
    // Process into nested structure
    const comments = result.rows;
    const commentMap = {};
    const rootComments = [];

    comments.forEach(c => {
      c.replies = [];
      commentMap[c.id] = c;
    });

    comments.forEach(c => {
      if (c.parent_id) {
        if (commentMap[c.parent_id]) {
          commentMap[c.parent_id].replies.push(c);
        }
      } else {
        rootComments.push(c);
      }
    });

    res.status(200).json({ status: "Success", data: rootComments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ status: "Error", message: "Failed to fetch comments." });
  }
};

// Add a new comment or reply
export const addComment = async (req, res) => {
  const { taskId } = req.params;
  const { content, parent_id } = req.body;
  const user_id = req.user.id;

  try {
    const pool = getPool();
    const id = uuidv7();
    const query = `
      INSERT INTO comments (id, task_id, user_id, content, parent_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(query, [id, taskId, user_id, content, parent_id || null]);
    let newComment = result.rows[0];

    // Fetch user details for the new comment
    const userResult = await pool.query(`SELECT name, email FROM users WHERE id = $1`, [user_id]);
    if (userResult.rows.length > 0) {
      newComment.user_name = userResult.rows[0].name;
      newComment.user_email = userResult.rows[0].email;
    }
    newComment.replies = [];

    // Broadcast comment via socket
    const io = req.app.get('io');
    if (io) {
      // Emit to task room
      io.to(`task_${taskId}`).emit('new_comment', newComment);
      
      // Emit notification ONLY if a user is mentioned
      const taskRes = await pool.query(`SELECT title FROM tasks WHERE id = $1`, [taskId]);
      if (taskRes.rows.length > 0) {
        const task = taskRes.rows[0];
        
        // Extract raw text for mention detection
        const rawText = (content || '').replace(/<[^>]*>?/gm, '');
        
        // Fetch ALL users to check for mentions
        const allUsersRes = await pool.query('SELECT id, name FROM users');
        const allUsers = allUsersRes.rows;
        
        for (const user of allUsers) {
            if (String(user.id) !== String(user_id)) {
                if (rawText.includes(`@${user.name}`)) {
                    const msg = `${newComment.user_name} mentioned you in a comment on "${task.title}"`;
                    await createNotification(user.id, msg, 'mention', taskId, io);
                }
            }
        }
      }
    }

    res.status(201).json({ status: "Success", data: newComment });
  } catch (error) {
    console.error("Error adding comment:", error.message, error.stack);
    if (error.code === '23503') { // Foreign key violation
        return res.status(401).json({ status: "Error", message: "User session invalid or task not found. Please login again." });
    }
    res.status(500).json({ status: "Error", message: "Failed to add comment. Details: " + error.message });
  }
};
