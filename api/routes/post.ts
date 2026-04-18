import express from 'express';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import authMiddleware from '../middleware/authMiddleware.js';
import { createPost, updatePost, getPosts, getPost, deletePost, getUserPosts } from '../controllers/postController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const uploadMiddleware = multer({ 
    dest: path.join(__dirname, '../uploads'),
    limits: { fieldSize: 50 * 1024 * 1024 } // 50MB limit for form fields (large blog posts)
});

router.get('/post', getPosts);
router.get('/post/:id', getPost);
router.get('/post/user/:id', getUserPosts);

// Protected routes
router.post('/post', authMiddleware, uploadMiddleware.single('file'), (req, res) => createPost(req as any, res));
router.put('/post', authMiddleware, uploadMiddleware.single('file'), (req, res) => updatePost(req as any, res));
router.delete('/post/:id', authMiddleware, (req, res) => deletePost(req as any, res));

export default router;
