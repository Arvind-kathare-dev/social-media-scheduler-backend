import Submission from '../models/Submission.js';
import Task from '../models/Task.js';

export const createSubmission = async (req, res) => {
    try {
        const taskId = parseInt(req.params.id, 10);
        if (isNaN(taskId)) return res.status(400).json({ status: 'error', message: 'Invalid task ID' });

        const { live_link, doc_content, designer_note } = req.body;
        const submitted_by = req.user.id;

        // Ensure task exists
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ status: 'error', message: 'Task not found' });
        }

        let files = [];
        if (req.files && req.files.length > 0) {
            files = req.files.map(file => ({
                url: `${process.env.BACKEND_URL || 'http://localhost:8000'}/uploads/${file.filename}`,
                name: file.originalname,
                type: file.mimetype,
                platform: req.body.platform || 'General'
            }));
        }

        if (files.length === 0 && !live_link && !doc_content) {
            return res.status(400).json({ status: 'error', message: 'Must provide at least one file, live link, or document content' });
        }

        const submission = await Submission.create({
            task_id: taskId,
            submitted_by,
            files,
            live_link,
            doc_content,
            designer_note
        });

        // Update task status automatically
        await Task.updateStatus(taskId, 'uploaded');

        res.status(201).json({ status: 'success', data: submission });
    } catch (error) {
        console.error('Error creating submission:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export const getSubmissionsByTask = async (req, res) => {
    try {
        const taskId = parseInt(req.params.id, 10);
        if (isNaN(taskId)) return res.status(400).json({ status: 'error', message: 'Invalid task ID' });

        const submissions = await Submission.findByTaskId(taskId);
        res.status(200).json({ status: 'success', data: submissions });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export const updateSubmissionStatus = async (req, res) => {
    try {
        const submissionId = parseInt(req.params.submissionId, 10);
        const { status } = req.body;

        if (isNaN(submissionId) || !status) {
            return res.status(400).json({ status: 'error', message: 'Invalid request' });
        }

        const submission = await Submission.updateStatus(submissionId, status);
        if (!submission) {
            return res.status(404).json({ status: 'error', message: 'Submission not found' });
        }

        res.status(200).json({ status: 'success', data: submission });
    } catch (error) {
        console.error('Error updating submission:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
