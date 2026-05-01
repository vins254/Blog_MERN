/**
 * FILE: api/controllers/authController.ts
 * PURPOSE: Manages user authentication, including registration, login, profile retrieval, and logout.
 * 
 * HOW IT WORKS:
 * 1. Registration: Validates inputs, checks password strength, hashes passwords using bcrypt, 
 *    and saves the user to MongoDB.
 * 2. Login: Verifies credentials, generates a JSON Web Token (JWT), and sends it to the 
 *    client via a secure, HttpOnly cookie.
 * 3. Session Management: The 'profile' endpoint extracts the JWT from cookies to 
 *    re-authenticate users on page reload.
 * 4. Security: Uses salted hashing for passwords and secure cookie flags for tokens.
 */
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET || 'secret123';

/**
 * Handles new user registration.
 * Includes password complexity checks and unique user validation.
 */
export const register = async (req: Request, res: Response) => {
    const { username, email, password, confirmPassword } = req.body;
    
    // Basic field validation
    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Password strength scoring logic (requires mixed characters and length >= 6)
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (hasUpper && hasLower) score++;
    if (hasNumber) score++;
    if (hasSymbol) score++;

    if (password.length < 6 || score <= 1) {
        return res.status(400).json({ message: 'Password is too weak. Must be at least 6 characters and use mixed character types.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        // Securely hash the password before storing in DB
        const userDoc = await User.create({
            username,
            email,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (e: any) {
        // Handle MongoDB duplicate key errors (Username/Email already taken)
        if (e.code === 11000) {
            const field = Object.keys(e.keyValue)[0];
            return res.status(400).json({ message: `${field} already exists` });
        }
        res.status(400).json({ message: 'Registration failed. Please try again.' });
    }
};

/**
 * Handles user login and session creation.
 * Issues a JWT token stored in a secure HttpOnly cookie.
 */
export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const userDoc: any = await User.findOne({ username });
    
    if (!userDoc) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Verify the provided password matches the hashed password in the DB
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
        // Create session token containing public user info
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            // Send token as a cookie
            // sameSite: 'none' and secure: true are required for cross-site cookie support in production
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            }).json({
                id: userDoc._id,
                username,
            });
        });
    } else {
        return res.status(400).json({ message: 'Invalid username or password' });
    }
};

/**
 * Retrieves the currently logged-in user's profile info from the JWT cookie.
 * Used for persistent sessions across page refreshes.
 */
export const profile = (req: Request, res: Response) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: 'Not logged in' });
    }
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        res.json(info);
    });
};

/**
 * Logs the user out by clearing the authentication cookie.
 */
export const logout = (req: Request, res: Response) => {
    res.cookie('token', '', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        expires: new Date(0) // Expire immediately
    }).json({ message: 'Logged out successfully' });
};
