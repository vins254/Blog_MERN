const Post = require('../models/Post');
const fs = require('fs');

/**
 * Creates a new blog post.
 * Expects multiform data with an optional 'file' and required 'title', 'summary', 'content', 'category'.
 * Automatically assigns the authenticated user (from req.user) as the author.
 */
const createPost = async (req, res) => {
    try {
        let newPath = null;
        // Image processing: Move the file to include its extension
        if (req.file) {
            const { originalname, path: tempPath } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            // Ensure we use a clean relative path for the DB, but real path for rename
            newPath = tempPath + '.' + ext;
            fs.renameSync(tempPath, newPath);
            
            // Store only the part relevant to the static server (uploads/...)
            // Multer path usually looks like 'api/uploads/filename' or 'uploads/filename'
            const relativePath = newPath.replace(/\\/g, '/'); // Normalize windows slashes
            const uploadIndex = relativePath.indexOf('uploads/');
            if (uploadIndex !== -1) {
                newPath = relativePath.substring(uploadIndex);
            }
        }

        const { title, summary, content, category } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            category: category || 'Other',
            cover: newPath,
            author: req.user.id, // req.user populated by authMiddleware
        });
        res.json(postDoc);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Updates an existing blog post.
 * Author Verification: Only the original author can modify the post.
 */
const updatePost = async (req, res) => {
    try {
        let newPath = null;
        if (req.file) {
            const { originalname, path: tempPath } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            newPath = tempPath + '.' + ext;
            fs.renameSync(tempPath, newPath);
            
            // Normalize path for DB
            const relativePath = newPath.replace(/\\/g, '/');
            const uploadIndex = relativePath.indexOf('uploads/');
            if (uploadIndex !== -1) {
                newPath = relativePath.substring(uploadIndex);
            }
        }

        const { id, title, summary, content, category } = req.body;
        const postDoc = await Post.findById(id);
        if (!postDoc) {
            return res.status(404).json('post not found');
        }

        // Ownership check before any update
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(req.user.id);
        if (!isAuthor) {
            return res.status(403).json('you are not the author');
        }
        
        postDoc.title = title;
        postDoc.summary = summary;
        postDoc.content = content;
        postDoc.category = category || 'Other';
        if (newPath) {
            postDoc.cover = newPath;
        }

        await postDoc.save();
        res.json(postDoc);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Lists the most recent posts.
 * Populates author information for the frontend UI.
 */
const getPosts = async (req, res) => {
    res.json(
        await Post.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20)
    );
};

/**
 * Fetches a single post specifically by its MongoDB ID.
 */
const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const postDoc = await Post.findById(id).populate('author', ['username']);
        if (!postDoc) return res.status(404).json('post not found');
        res.json(postDoc);
    } catch (e) {
        res.status(400).json('invalid id');
    }
};

/**
 * Deletes a post and cleans up associated files.
 * Author Verification: Strict check to ensure only the owner can delete.
 */
const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const postDoc = await Post.findById(id);
        if (!postDoc) return res.status(404).json('post not found');

        // Security check
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(req.user.id);
        if (!isAuthor) {
            return res.status(403).json('you are not the author');
        }

        // Clean up: Remove the physical file from the uploads directory
        if (postDoc.cover && fs.existsSync(postDoc.cover)) {
            fs.unlinkSync(postDoc.cover);
        }

        await postDoc.deleteOne();
        res.json('ok');
    } catch (e) {
        res.status(400).json('invalid id or server error');
    }
};

/**
 * Fetches all posts created by a specific user.
 * Used for the "My Blogs" profile view.
 */
const getUserPosts = async (req, res) => {
    const { id } = req.params;
    try {
        const posts = await Post.find({ author: id })
            .populate('author', ['username'])
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (e) {
        res.status(400).json('Error fetching user posts');
    }
};

module.exports = {
    createPost,
    updatePost,
    getPosts,
    getPost,
    getUserPosts,
    deletePost
};
