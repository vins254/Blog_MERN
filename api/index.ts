/**
 * API Entry Point
 * This file is executed to start the backend server.
 */
import dotenv from 'dotenv';
dotenv.config(); // Load variables from .env/environment into process.env

import app from './app.js';

// Use PORT from environment (defaulting to 4000 if not found)
const PORT = Number(process.env.PORT) || 4000;

/**
 * Start the Express server.
 * Explicitly binding to "0.0.0.0" is critical for Render production deployments
 * to pass the port scan and health check.
 */
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
