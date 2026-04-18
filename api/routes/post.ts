import express from 'express';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import authMiddleware from '../middleware/authMiddleware.js';
import { createPost, updatePost, getPosts, getPost, deletePost, getUserPosts } from '../controllers/postController.js';

/**
 * Post Routes
 * Handles CRUD operations for blog posts and file uploads.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

/**
 * Multer Middleware
 * Handles 'multipart/form-data' used for uploading cover images.
 * Files are temporarily stored in the 'uploads' directory.
 * Increased 'fieldSize' allows for extremely large blog post content (Quill HTML).
 */
const UPLOADS_PATH = path.join(__dirname, '..', 'uploads');
const uploadMiddleware = multer({ 
    dest: UPLOADS_PATH,
    limits: { fieldSize: 50 * 1024 * 1024 } // 50MB limit
});

// Public Routes
router.get('/post', getPosts);
router.get('/post/:id', getPost);
router.get('/post/user/:id', getUserPosts);

// Protected Routes (Authentication Required)
router.post('/post', authMiddleware, uploadMiddleware.single('file'), (req, res) => createPost(req as any, res));
router.put('/post', authMiddleware, uploadMiddleware.single('file'), (req, res) => updatePost(req as any, res));
router.delete('/post/:id', authMiddleware, (req, res) => deletePost(req as any, res));

export default router;
