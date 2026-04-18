/**
 * Post Controller
 * Manages blog post operations including creation, deletion, retrieval, and file management.
 */

import { Response } from 'express';
import Post from '../models/Post.js';
import fs from 'fs';
import path from 'path';
import { AuthRequest } from '../middleware/authMiddleware.js';

/**
 * Creates a new blog post.
 * Handles image file renaming (adding extension) and stores metadata in MongoDB.
 */
export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        let newPath: string | null = null;
        if (req.file) {
            // Process the uploaded image file
            const { originalname, path: tempPath } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            newPath = tempPath + '.' + ext;
            fs.renameSync(tempPath, newPath); // Add the file extension
            newPath = path.basename(newPath); // Store only the filename in the DB
        }

        const { title, summary, content, category } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            category: category || 'Other',
            cover: newPath,
            author: req.user?.id, // Associate post with the logged-in user
        });
        res.json(postDoc);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Updates an existing blog post.
 * Verifies that the requesting user is the original author before allowing modifications.
 */
export const updatePost = async (req: AuthRequest, res: Response) => {
    try {
        let newPath: string | null = null;
        if (req.file) {
            const { originalname, path: tempPath } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            newPath = tempPath + '.' + ext;
            fs.renameSync(tempPath, newPath);
            newPath = path.basename(newPath);
        }

        const { id, title, summary, content, category } = req.body;
        const postDoc: any = await Post.findById(id);
        if (!postDoc) {
            return res.status(404).json('post not found');
        }

        // Ownership Check: Ensure stringified IDs match
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(req.user?.id);
        if (!isAuthor) {
            return res.status(403).json('you are not the author');
        }
        
        // Update fields
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
        if (!postDoc) return res.status(404).json('post not found');
        res.json(postDoc);
    } catch (e) {
        res.status(400).json('invalid id');
    }
};

/**
 * Deletes a post.
 * Verifies authorship and removes the cover image from the filesystem.
 */
export const deletePost = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const postDoc: any = await Post.findById(id);
        if (!postDoc) return res.status(404).json('post not found');

        // Security check: Only the author can delete their post
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(req.user?.id);
        if (!isAuthor) {
            return res.status(403).json('you are not the author');
        }

        // Clean up linked asset if it exists
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
 */
export const getUserPosts = async (req: AuthRequest, res: Response) => {
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
