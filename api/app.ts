import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/post.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const normalizeUrl = (url: string | undefined): string | null => url ? url.replace(/\/+$/, "") : null;

const allowedOrigins = [
    normalizeUrl(process.env.CLIENT_URL),
    "http://localhost:3000",
    "http://127.0.0.1:3000",
].filter((url): url is string => Boolean(url));

app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        const normalizedOrigin = normalizeUrl(origin);
        
        if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
            callback(null, true);
        } else {
            console.error(`CORS Error: Origin [${origin}] (normalized: [${normalizedOrigin}]) not allowed. Expected one of: ${JSON.stringify(allowedOrigins)}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

async function connectDB() {
    try {
        if (!process.env.MONGO_URL) throw new Error("MONGO_URL not found");
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error", error);
    }
}
connectDB();

app.use('/', authRoutes);
app.use('/', postRoutes);

app.get("/", (req, res) => {
    res.send("MERN Blog API is running");
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled Server Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

export default app;
