import { Response } from 'express';
import Post from '../models/Post.js';
import fs from 'fs';
import path from 'path';
import { AuthRequest } from '../middleware/authMiddleware.js';

/**
 * Creates a new blog post.
 */
export const createPost = async (req: AuthRequest, res: Response) => {
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

        const { title, summary, content, category } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            category: category || 'Other',
            cover: newPath,
            author: req.user?.id,
        });
        res.json(postDoc);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Updates an existing blog post.
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

        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(req.user?.id);
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
 * Fetches a single post specifically by its MongoDB ID.
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
 * Deletes a post and cleans up associated files.
 */
export const deletePost = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const postDoc: any = await Post.findById(id);
        if (!postDoc) return res.status(404).json('post not found');

        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(req.user?.id);
        if (!isAuthor) {
            return res.status(403).json('you are not the author');
        }

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
