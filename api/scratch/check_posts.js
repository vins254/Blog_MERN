
import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

import Post from './models/Post.js';

async function checkPosts() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const posts = await Post.find({});
        console.log('Total posts:', posts.length);
        posts.forEach(p => {
            console.log(`Title: ${p.title}, Cover: ${p.cover}`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
}

checkPosts();
