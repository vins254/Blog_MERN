import mongoose from 'mongoose';
import Post from './models/Post.js';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

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
            if (oldPath) {
                const newFilename = path.basename(oldPath);
                if (oldPath !== newFilename) {
                    post.cover = newFilename;
                    await post.save();
                    console.log(`Migrated: ${oldPath} -> ${post.cover}`);
                }
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
