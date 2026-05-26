import { getPool } from '../config/connectDB.js';
import { sendEmail } from '../utils/emailHandler.js';

// Get notifications for the authenticated user
export const getNotifications = async (req, res) => {
    try {
        const pool = getPool();
        const userId = req.user.id;
        
        const result = await pool.query(
            `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
            [userId]
        );
        
        res.status(200).json({ notifications: result.rows });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
    try {
        const pool = getPool();
        const notificationId = req.params.id;
        const userId = req.user.id;
        
        await pool.query(
            `UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2`,
            [notificationId, userId]
        );
        
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Failed to update notification' });
    }
};

// Mark all notifications as read for the authenticated user
export const markAllAsRead = async (req, res) => {
    try {
        const pool = getPool();
        const userId = req.user.id;
        
        await pool.query(
            `UPDATE notifications SET is_read = TRUE WHERE user_id = $1`,
            [userId]
        );
        
        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ error: 'Failed to update notifications' });
    }
};

// Helper function to create a notification (Internal Backend Use Only)
export const createNotification = async (userId, message, type, taskId, io) => {
    try {
        if (!userId) return;
        const pool = getPool();
        
        const result = await pool.query(
            `INSERT INTO notifications (user_id, message, type, task_id) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, message, type, taskId || null]
        );
        
        const newNotification = result.rows[0];
        
        // Broadcast the real-time notification to the user's socket room
        if (io) {
            io.to(`user_${userId}`).emit('notification', newNotification);
        }
        
        // Send email based on notification type
        if (['task_assigned', 'mention', 'new_message'].includes(type)) {
            const userResult = await pool.query(`SELECT name, email FROM users WHERE id = $1`, [userId]);
            if (userResult.rows.length > 0) {
                const user = userResult.rows[0];
                if (user.email) {
                    let subject = 'New Notification';
                    let heading = 'Notification';
                    
                    if (type === 'task_assigned') {
                        subject = 'You have a new task assigned';
                        heading = 'New Task Assignment';
                    } else if (type === 'mention') {
                        subject = 'You were mentioned in a task';
                        heading = 'New Mention';
                    } else if (type === 'new_message') {
                        subject = 'New comment on your task';
                        heading = 'New Comment';
                    }
                    
                    const htmlContent = `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                            <h2 style="color: #0f172a; margin-top: 0;">${heading}</h2>
                            <p style="color: #334155; font-size: 16px;">Hi <strong>${user.name}</strong>,</p>
                            <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #14a879; margin: 20px 0;">
                                <p style="color: #0f172a; font-size: 16px; margin: 0;">${message}</p>
                            </div>
                            <br/>
                            <p style="color: #64748b; font-size: 14px;">Please log in to your Social Media Scheduler dashboard to view the details.</p>
                        </div>
                    `;
                    // Send asynchronously to avoid blocking
                    sendEmail(user.email, subject, htmlContent);
                }
            }
        }
        
        return newNotification;
    } catch (error) {
        console.error('Error creating internal notification:', error);
    }
};
