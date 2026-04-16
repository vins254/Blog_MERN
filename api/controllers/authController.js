const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;

const register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch (e) {
        console.log(e);
        res.status(400).json(e);
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
        return res.status(400).json('user not found');
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
        res.status(400).json('wrong credentials');
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
