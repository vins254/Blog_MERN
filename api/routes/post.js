const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const authMiddleware = require('../middleware/authMiddleware');
const { createPost, updatePost, getPosts, getPost, deletePost } = require('../controllers/postController');

router.get('/post', getPosts);
router.get('/post/:id', getPost);

// Protected routes
router.post('/post', authMiddleware, uploadMiddleware.single('file'), createPost);
router.put('/post', authMiddleware, uploadMiddleware.single('file'), updatePost);
router.delete('/post/:id', authMiddleware, deletePost);

module.exports = router;
