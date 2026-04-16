const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;

/**
 * Handles new user registration.
 * Includes strict email format validation, password matching,
 * and a tiered password strength check (uppercase, lowercase, digits, symbols).
 */
const register = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    
    // Basic field presence check
    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Password Strength Check (Backend Hardening)
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

    // Deny Weak passwords (Score <= 1 or Length < 6)
    if (password.length < 6 || score <= 1) {
        return res.status(400).json({ message: 'Password is too weak. Must be at least 6 characters and use mixed character types.' });
    }

    // Strict regex-based email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        // Create user with hashed password
        const userDoc = await User.create({
            username,
            email,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (e) {
        // Handle Duplicate Key Error (Username or Email already exists)
        if (e.code === 11000) {
            const field = Object.keys(e.keyValue)[0];
            return res.status(400).json({ message: `${field} already exists` });
        }
        res.status(400).json(e);
    }
};

/**
 * Handles user login and session creation.
 * Implements anti-enumeration protection by using generic error messages.
 */
const login = async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    
    // Generic message prevents attackers from discovering valid usernames
    if (!userDoc) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
        // Sign JWT and set httpOnly cookie for secure session management
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
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
 */
const profile = (req, res) => {
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
const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        expires: new Date(0)
    }).json('ok');
};

module.exports = {
    register,
    login,
    profile,
    logout
};
