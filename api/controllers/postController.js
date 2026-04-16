const Post = require('../models/Post');
const fs = require('fs');

const createPost = async (req, res) => {
    try {
        let newPath = null;
        if (req.file) {
            const { originalname, path } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            newPath = path + '.' + ext;
            fs.renameSync(path, newPath);
        }

        const { title, summary, content, category } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            category: category || 'Other',
            cover: newPath,
            author: req.user.id,
        });
        res.json(postDoc);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const updatePost = async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    const { id, title, summary, content, category } = req.body;
    const postDoc = await Post.findById(id);
    if (!postDoc) {
        return res.status(404).json('post not found');
    }
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(req.user.id);
    if (!isAuthor) {
        return res.status(400).json('you are not the author');
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
};

const getPosts = async (req, res) => {
    res.json(
        await Post.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20)
    );
};

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

const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const postDoc = await Post.findById(id);
        if (!postDoc) return res.status(404).json('post not found');

        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(req.user.id);
        if (!isAuthor) {
            return res.status(403).json('you are not the author');
        }

        // Delete the cover image file if it exists
        if (postDoc.cover && fs.existsSync(postDoc.cover)) {
            fs.unlinkSync(postDoc.cover);
        }

        await postDoc.deleteOne();
        res.json('ok');
    } catch (e) {
        res.status(400).json('invalid id or server error');
    }
};

module.exports = {
    createPost,
    updatePost,
    getPosts,
    getPost,
    deletePost
};
