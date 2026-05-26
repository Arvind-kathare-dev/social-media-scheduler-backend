import { getPool } from "../config/connectDB.js";
import { createNotification } from "./NotificationController.js";

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
    const query = `
      INSERT INTO comments (task_id, user_id, content, parent_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [taskId, user_id, content, parent_id || null]);
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
      
      // Emit notification to involved users (creator and assignees)
      const taskRes = await pool.query(`SELECT created_by, assigned_to, assigned_to_multi, title FROM tasks WHERE id = $1`, [taskId]);
      if (taskRes.rows.length > 0) {
        const task = taskRes.rows[0];
        
        // Gather all users related to the task
        const involvedUsers = new Set();
        if (task.created_by) involvedUsers.add(task.created_by);
        if (task.assigned_to) involvedUsers.add(task.assigned_to);
        
        // If assigned_to_multi is stored as JSON array in postgres, we parse it or use directly if already parsed
        if (task.assigned_to_multi) {
            let multiArr = task.assigned_to_multi;
            if (typeof multiArr === 'string') {
                try { multiArr = JSON.parse(multiArr); } catch(e) {}
            }
            if (Array.isArray(multiArr)) {
                multiArr.forEach(id => involvedUsers.add(id));
            }
        }

        // Extract raw text for mention detection
        const rawText = content.replace(/<[^>]*>?/gm, '');
        
        // Notify everyone involved except the sender
        for (const userId of involvedUsers) {
            if (userId && String(userId) !== String(user_id)) {
                // Determine if they were mentioned
                let type = 'new_message';
                let msg = `${newComment.user_name} commented on task "${task.title}"`;
                
                // Fetch the user's name to see if it's in the text
                const userRes = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
                if (userRes.rows.length > 0) {
                    const userName = userRes.rows[0].name;
                    if (rawText.includes(`@${userName}`)) {
                        type = 'mention';
                        msg = `${newComment.user_name} mentioned you in a comment on "${task.title}"`;
                    }
                }
                
                await createNotification(userId, msg, type, taskId, io);
            }
        }
      }
    }

    res.status(201).json({ status: "Success", data: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ status: "Error", message: "Failed to add comment." });
  }
};
