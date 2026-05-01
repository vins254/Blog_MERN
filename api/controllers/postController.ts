/**
 * FILE: api/controllers/postController.ts
 * PURPOSE: Manages the lifecycle of blog posts (CRUD) and handles file uploads.
 * 
 * HOW IT WORKS:
 * 1. File Handling: Uses Multer to receive images, renames them with their original 
 *    extension, and stores only the final filename in the database.
 * 2. Ownership: For 'update' and 'delete' operations, it compares the current user's 
 *    ID with the post author's ID to prevent unauthorized changes.
 * 3. Populating: When fetching posts, it 'populates' the author field to include the 
 *    creator's username rather than just an ID.
 * 4. Cleanup: When a post is deleted, it automatically deletes the corresponding 
 *    image file from the '/uploads' folder.
 */
import { Response } from 'express';
import Post from '../models/Post.js';
import fs from 'fs';
import path from 'path';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_PATH = path.join(__dirname, '..', 'uploads');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

/**
 * Creates a new blog post.
 * Uploads cover image to Cloudinary and stores the secure URL in MongoDB.
 */
export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        let imageUrl: string | undefined = undefined;
        if (req.file) {
            // Upload the file to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'blog_posts',
            });
            imageUrl = result.secure_url;
            
            // Clean up the temporary file from the 'uploads' folder
            fs.unlinkSync(req.file.path);
        }

        const { title, summary, content, category } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            category: category || 'Other',
            cover: imageUrl,
            author: req.user?.id,
        });
        res.json(postDoc);
    } catch (error) {
        console.error('Create Post Error:', error);
        res.status(500).json({ message: "Server error during post creation" });
    }
};

/**
 * Updates an existing blog post.
 * Verifies that the requesting user is the original author before allowing modifications.
 */
export const updatePost = async (req: AuthRequest, res: Response) => {
    try {
        let imageUrl: string | undefined = undefined;
        if (req.file) {
            // Upload new image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'blog_posts',
            });
            imageUrl = result.secure_url;
            
            // Clean up temporary local file
            fs.unlinkSync(req.file.path);
        }

        const { id, title, summary, content, category } = req.body;
        const postDoc = await Post.findById(id);
        if (!postDoc) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Ownership Check
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(req.user?.id);
        if (!isAuthor) {
            return res.status(403).json({ message: 'You are not the author of this post' });
        }
        
        // Update fields
        postDoc.title = title;
        postDoc.summary = summary;
        postDoc.content = content;
        postDoc.category = category || 'Other';
        if (imageUrl) {
            postDoc.cover = imageUrl;
        }

        await postDoc.save();
        res.json(postDoc);
    } catch (error) {
        console.error('Update Post Error:', error);
        res.status(500).json({ message: 'Server error during post update' });
    }
};

/**
 * Lists the most recent posts.
 * Populates 'author' to get the username along with the post data.
 */
export const getPosts = async (req: AuthRequest, res: Response) => {
    res.json(
        await Post.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20)
    );
};

/**
 * Fetches data for a single blog post by its MongoDB ID.
 */
export const getPost = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const postDoc = await Post.findById(id).populate('author', ['username']);
        if (!postDoc) return res.status(404).json({ message: 'Post not found' });
        res.json(postDoc);
    } catch (e) {
        res.status(400).json({ message: 'Invalid post ID' });
    }
};

/**
 * Deletes a post.
 * Verifies authorship and removes the cover image from the filesystem.
 */
export const deletePost = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const postDoc = await Post.findById(id);
        if (!postDoc) return res.status(404).json({ message: 'Post not found' });

        // Security check: Only the author can delete their post
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(req.user?.id);
        if (!isAuthor) {
            return res.status(403).json({ message: 'You are not the author of this post' });
        }

        // Clean up linked asset if it's a local file (legacy)
        if (postDoc.cover && !postDoc.cover.startsWith('http')) {
            const coverPath = path.join(UPLOADS_PATH, postDoc.cover);
            if (fs.existsSync(coverPath)) {
                fs.unlinkSync(coverPath);
            }
        }

        await postDoc.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (e) {
        res.status(400).json({ message: 'Invalid ID or server error' });
    }
};

/**
 * Fetches all posts created by a specific user.
 */
export const getUserPosts = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const posts = await Post.find({ author: id })
            .populate('author', ['username'])
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (e) {
        res.status(400).json({ message: 'Error fetching user posts' });
    }
};
