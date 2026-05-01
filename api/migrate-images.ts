import mongoose from 'mongoose';
import Post from './models/Post.js';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

async function migrate() {
    if (!process.env.MONGO_URL) {
        console.error('MONGO_URL not found in .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        // Find posts with local filenames (not URLs)
        const posts = await Post.find({ 
            cover: { $exists: true, $ne: null, $not: /^http/ } 
        });
        
        console.log(`Found ${posts.length} local images to migrate to Cloudinary`);

        for (const post of posts) {
            const fileName = post.cover;
            if (fileName) {
                const filePath = path.join(__dirname, 'uploads', fileName);
                
                if (fs.existsSync(filePath)) {
                    try {
                        console.log(`Uploading ${fileName} to Cloudinary...`);
                        const result = await cloudinary.uploader.upload(filePath, {
                            folder: 'blog_posts',
                        });
                        
                        post.cover = result.secure_url;
                        await post.save();
                        console.log(`Successfully migrated: ${fileName} -> ${post.cover}`);
                    } catch (uploadErr) {
                        console.error(`Failed to upload ${fileName}:`, uploadErr);
                    }
                } else {
                    console.warn(`Local file not found at ${filePath}, skipping...`);
                }
            }
        }

        console.log('Migration process finished.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        mongoose.connection.close();
    }
}

migrate();
