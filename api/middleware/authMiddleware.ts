import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';


const getSecret = () => process.env.JWT_SECRET || 'secret123';

export interface AuthRequest extends Request {
    user?: any;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ message: 'Not logged in' });
    }
    jwt.verify(token, getSecret(), {}, (err, info) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.user = info;
        next();
    });
};

export default authMiddleware;
