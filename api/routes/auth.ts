import express from 'express';
const router = express.Router();
import { register, login, profile, logout } from '../controllers/authController.js';

/**
 * Authentication Routes
 * These routes handle user entry points and session validation.
 */

// Register a new account
router.post('/register', register);

// Login to an existing account (returns a JWT cookie)
router.post('/login', login);

// Get the authenticated user's profile info from the cookie
router.get('/profile', profile);

// Logout and clear the session cookie
router.post('/logout', logout);

export default router;
