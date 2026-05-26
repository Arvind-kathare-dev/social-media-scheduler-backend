import Folder from '../models/Folder.js';

export const getFolders = async (req, res) => {
    try {
        const user_id = req.user.id;
        const role = req.user.role;
        const folders = await Folder.findAll({ user_id, role });
        res.status(200).json({ status: 'success', data: folders });
    } catch (error) {
        console.error('Error fetching folders:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export const createFolder = async (req, res) => {
    try {
        const { name, assigned_to, platforms } = req.body;
        
        if (!name) {
            return res.status(400).json({ status: 'error', message: 'Folder name is required' });
        }

        const newFolder = await Folder.create({
            name,
            assigned_to,
            created_by: req.user.id,
            platforms
        });

        res.status(201).json({ status: 'success', data: newFolder });
    } catch (error) {
        console.error('Error creating folder:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export const updateFolder = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (isNaN(parseInt(id, 10))) {
            return res.status(400).json({ status: 'error', message: 'Invalid folder ID' });
        }

        const { name, assigned_to, platforms } = req.body;

        const updatedFolder = await Folder.update(id, { name, assigned_to, platforms });
        
        if (!updatedFolder) {
            return res.status(404).json({ status: 'error', message: 'Folder not found' });
        }

        res.status(200).json({ status: 'success', data: updatedFolder });
    } catch (error) {
        console.error('Error updating folder:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export const deleteFolder = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(parseInt(id, 10))) {
            return res.status(400).json({ status: 'error', message: 'Invalid folder ID' });
        }

        const deletedFolder = await Folder.delete(id);
        
        if (!deletedFolder) {
            return res.status(404).json({ status: 'error', message: 'Folder not found' });
        }

        res.status(200).json({ status: 'success', message: 'Folder deleted successfully' });
    } catch (error) {
        console.error('Error deleting folder:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
