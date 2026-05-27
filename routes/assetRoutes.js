import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadAssets, getAssets, deleteAsset } from '../controllers/AssetController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import fs from 'fs';

const router = express.Router();

// Configure multer storage
const storage = multer.memoryStorage();

const upload = multer({ 
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB max file size
});

router.use(authenticateToken);

// Multi upload endpoint
router.post('/upload', upload.array('files', 10), uploadAssets);
router.get('/', getAssets);
router.delete('/:id', deleteAsset);

export default router;
