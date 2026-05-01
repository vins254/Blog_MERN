import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URL = process.env.MONGO_URL;
const salt = bcrypt.genSaltSync(10);

async function seed() {
    if (!MONGO_URL) {
        console.error("MONGO_URL not found in .env");
        return;
    }

    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB for seeding...");

        const demoUser = await User.findOne({ username: 'demo' });
        if (!demoUser) {
            await User.create({
                username: 'demo',
                email: 'demo@example.com',
                password: bcrypt.hashSync('demo123', salt),
            });
            console.log("Demo user created: demo / demo123");
        } else {
            console.log("Demo user already exists.");
        }

        await mongoose.connection.close();
        console.log("Seeding complete.");
    } catch (error) {
        console.error("Seeding error:", error);
    }
}

seed();
