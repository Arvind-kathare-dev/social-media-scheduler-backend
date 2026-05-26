import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Asset from '../models/Asset.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadAssets = async (req, res) => {
    try {
        const { title, folderId, platform, copy, externalLink } = req.body;
        const author_id = req.user.id;

        if (!title) {
            return res.status(400).json({ status: 'error', message: 'Title is required' });
        }

        if ((!req.files || req.files.length === 0) && !externalLink) {
            return res.status(400).json({ status: 'error', message: 'At least one file or external link is required' });
        }

        let files = [];
        if (req.files && req.files.length > 0) {
            files = req.files.map(file => ({
                url: `${process.env.BACKEND_URL || 'http://localhost:8000'}/uploads/${file.filename}`,
                name: file.originalname,
                type: file.mimetype,
                platform: platform || 'General'
            }));
        } else if (externalLink) {
            files = [{
                url: externalLink,
                name: title,
                type: 'link',
                platform: platform || 'General'
            }];
        }

        const parsedFolderId = folderId && folderId !== 'null' ? parseInt(folderId, 10) : null;
        
        const newAsset = await Asset.create({
            title,
            folder_id: isNaN(parsedFolderId) ? null : parsedFolderId,
            platform,
            copy,
            author_id,
            files
        });

        res.status(201).json({ status: 'success', data: newAsset });
    } catch (error) {
        console.error('Error uploading assets:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export const getAssets = async (req, res) => {
    try {
        const { folderId } = req.query;
        let assets;
        if (folderId) {
            assets = await Asset.findByFolder(parseInt(folderId, 10));
        } else {
            assets = await Asset.findAll();
        }
        res.status(200).json({ status: 'success', data: assets });
    } catch (error) {
        console.error('Error fetching assets:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

export const deleteAsset = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(parseInt(id, 10))) {
            return res.status(400).json({ status: 'error', message: 'Invalid asset ID' });
        }

        // Fetch asset first to get its file paths
        const asset = await Asset.findById(parseInt(id, 10));
        if (!asset) {
            return res.status(404).json({ status: 'error', message: 'Asset not found' });
        }

        // Delete physical files from disk (skip external links)
        const files = typeof asset.files === 'string' ? JSON.parse(asset.files) : (asset.files || []);
        files.forEach(file => {
            if (file.type !== 'link' && file.url && file.url.includes('/uploads/')) {
                const filename = file.url.split('/uploads/').pop();
                if (filename) {
                    const filePath = path.join(__dirname, '..', 'uploads', filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        console.log(`🗑️ Deleted file: ${filePath}`);
                    }
                }
            }
        });

        // Delete the DB record
        await Asset.delete(parseInt(id, 10));

        res.status(200).json({ status: 'success', message: 'Asset deleted successfully' });
    } catch (error) {
        console.error('Error deleting asset:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
