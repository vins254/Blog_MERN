const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;

const register = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    
    // Basic validations
    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Strict email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        const userDoc = await User.create({
            username,
            email,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (e) {
        console.log(e);
        if (e.code === 11000) {
            const field = Object.keys(e.keyValue)[0];
            return res.status(400).json({ message: `${field} already exists` });
        }
        res.status(400).json(e);
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    
    if (!userDoc) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
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
        res.status(400).json({ message: 'Invalid username or password' });
    }
};

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
