import Task from '../models/Task.js';
import { createNotification } from './NotificationController.js';

export const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, assigned_to, assigned_to_multi, due_date, tone, hashtags, platforms, visual_reference, notes } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Task title is required' });
        }

        const task = await Task.create({
            title,
            description,
            status: status || 'todo',
            priority: priority || 'medium',
            assigned_to: assigned_to || null,
            assigned_to_multi: assigned_to_multi || [],
            created_by: req.user.id, // Assuming authMiddleware sets req.user
            due_date: due_date || null,
            tone,
            hashtags,
            platforms,
            visual_reference,
            notes
        });

        const io = req.app.get('io');
        if (io) {
            const allAssignees = assigned_to_multi || (assigned_to ? [assigned_to] : []);
            for (const userId of allAssignees) {
                if (userId && String(userId) !== String(req.user.id)) {
                    await createNotification(
                        userId, 
                        `You have been assigned a new task: "${title}"`, 
                        'task_assigned', 
                        task.id || task._id, 
                        io
                    );
                }
            }
            io.emit('tasks_refresh_needed');
        }

        res.status(201).json({
            message: 'Task created successfully',
            task
        });
    } catch (error) {
        console.error('Create Task error:', error);
        res.status(500).json({ error: 'Failed to create task', details: error.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const { status, assigned_to, created_by } = req.query;
        
        // If user is not admin, they might only see tasks assigned to them or created by them
        // For now, let's just return all based on query filters
        const filters = {};
        if (status) filters.status = status;
        if (assigned_to) filters.assigned_to = assigned_to;
        if (created_by) filters.created_by = created_by;

        const tasks = await Task.findAll(filters);

        res.status(200).json({
            count: tasks.length,
            tasks
        });
    } catch (error) {
        console.error('Get Tasks error:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ task });
    } catch (error) {
        console.error('Get Task By Id error:', error);
        res.status(500).json({ error: 'Failed to fetch task' });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, assigned_to, assigned_to_multi, due_date, tone, hashtags, platforms, visual_reference, notes } = req.body;

        const existingTask = await Task.findById(id);
        if (!existingTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const updatedTask = await Task.update(id, {
            title,
            description,
            status,
            priority,
            assigned_to,
            assigned_to_multi,
            due_date,
            tone,
            hashtags,
            platforms,
            visual_reference,
            notes
        });

        const io = req.app.get('io');
        if (io) {
            const allAssignees = assigned_to_multi || (assigned_to ? [assigned_to] : []);
            
            // Notify current assignees
            for (const userId of allAssignees) {
                if (userId && String(userId) !== String(req.user.id)) {
                    await createNotification(
                        userId,
                        `A task assigned to you was updated: "${title || existingTask.title}"`,
                        'task_assigned',
                        id,
                        io
                    );
                }
            }
            
            // Emit a general task updated event to the task room so anyone viewing it gets it updated
            io.to(`task_${id}`).emit('task_updated', updatedTask);
            // We can also emit a global event to let all connected clients know they might need to refresh their tasks list
            io.emit('tasks_refresh_needed');
        }

        res.status(200).json({
            message: 'Task updated successfully',
            task: updatedTask
        });
    } catch (error) {
        console.error('Update Task error:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
};

export const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const existingTask = await Task.findById(id);
        if (!existingTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        const updatedTask = await Task.updateStatus(id, status);

        res.status(200).json({
            message: 'Task status updated successfully',
            task: updatedTask
        });
    } catch (error) {
        console.error('Update Task Status error:', error);
        res.status(500).json({ error: 'Failed to update task status' });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const existingTask = await Task.findById(id);
        if (!existingTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await Task.delete(id);

        const io = req.app.get('io');
        if (io) {
            io.emit('tasks_refresh_needed');
        }

        res.status(200).json({
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error('Delete Task error:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
};
