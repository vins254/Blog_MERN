/**
 * MERN Blog API - Entry Point
 * This file initializes the Express server, connects to MongoDB,
 * and sets up the global middleware and route handlers.
 */

require('dotenv').config();
const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');

const app = express();
const PORT = process.env.PORT || 4000;

/**
 * Global Middleware
 * - CORS: Configured for secure credentials & specific origin
 * - JSON: Parsing incoming request bodies
 * - Cookies: Parsing cookies for authenticated sessions
 * - Static: Serving uploaded cover images
 */
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

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

// Start the listener
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
