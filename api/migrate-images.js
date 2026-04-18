const mongoose = require('mongoose');
const Post = require('./models/Post');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function migrate() {
    if (!process.env.MONGO_URL) {
        console.error('MONGO_URL not found in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        const posts = await Post.find({ cover: { $exists: true, $ne: null } });
        console.log(`Found ${posts.length} posts to check`);

        for (const post of posts) {
            const oldPath = post.cover;
            const newFilename = path.basename(oldPath);
            if (oldPath !== newFilename) {
                post.cover = newFilename;
                await post.save();
                console.log(`Migrated: ${oldPath} -> ${post.cover}`);
            }
        }

        console.log('Migration complete');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        mongoose.connection.close();
    }
}

migrate();
