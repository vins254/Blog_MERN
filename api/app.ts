import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/post.js';

/**
 * Main Express Application configuration.
 * Handles middleware, database connection, and routing for the API.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Helper to clean up URLs for CORS matching
const normalizeUrl = (url: string | undefined): string | null => url ? url.replace(/\/+$/, "") : null;

// Defined origins allowed to access this API
const allowedOrigins = [
    normalizeUrl(process.env.CLIENT_URL),
    "http://localhost:3000",
    "http://127.0.0.1:3000",
].filter((url): url is string => Boolean(url));

/**
 * CORS Configuration
 * 'credentials: true' allows cookies to be sent from the frontend.
 * Origin check ensures only trusted domains can communicate with the server.
 */
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

// Standard Middlewares
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies from headers (for JWT session)
const UPLOADS_PATH = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(UPLOADS_PATH)); // Serve uploaded images as static assets

/**
 * Database Connection logic.
 * Uses MONGO_URL from environment variables.
 */
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

// API Routes
app.use('/', authRoutes);
app.use('/', postRoutes);

app.get("/", (req, res) => {
    res.send("MERN Blog API is running");
});

/**
 * Global Error Handling Middleware
 * Catch-all for server errors and specific Multer (file upload) errors.
 */
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled Server Error:', err);

    // Handle Multer errors specifically (e.g., if a field value exceeds size limits)
    if (err.name === 'MulterError') {
        return res.status(413).json({
            message: `Upload error: ${err.message}`,
            code: err.code
        });
    }

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

export default app;
