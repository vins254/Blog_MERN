/**
 * MERN Blog API - Express App Configuration
 * This file creates and configures the Express app, connects to MongoDB,
 * and sets up the global middleware and route handlers.
 * Separated from server startup to enable testing with Supertest.
 */

require('dotenv').config();
const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

const app = express();

/**
 * Global Middleware
 * - CORS: Configured for secure credentials & specific origin
 * - JSON: Parsing incoming request bodies
 * - Cookies: Parsing cookies for authenticated sessions
 * - Static: Serving uploaded cover images
 */
/**
 * CORS Configuration
 * Dynamically allows the production client URL (normalized to remove trailing slashes) 
 * and localhost for development.
 */
const normalizeUrl = (url) => url ? url.replace(/\/+$/, "") : null;

const allowedOrigins = [
    normalizeUrl(process.env.CLIENT_URL),
    "http://localhost:3000",
].filter(Boolean);

app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
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

/**
 * Database Connection logic using Mongoose
 */
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error", error);
    }
}
connectDB();

/**
 * API Route Handlers
 * - '/' : Handles Auth (Login, Register, Profile) and Post CRUD
 */
app.use('/', authRoutes);
app.use('/', postRoutes);

app.get("/", (req, res) => {
    res.send("MERN Blog API is running");
});

module.exports = app;
