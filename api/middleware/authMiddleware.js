const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: 'Not logged in' });
    }
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.user = info;
        next();
    });
};

module.exports = authMiddleware;
