import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';


const secret = process.env.JWT_SECRET || 'secret123';

export interface AuthRequest extends Request {
    user?: any;
}

/**
 * Auth Middleware
 * Intercepts requests to verify the JWT token stored in cookies.
 * Decodes the token and attaches the user information to the request object 
 * so that downstream controllers can know which user is making the request.
 */
const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    
    // Check if the authentication cookie exists
    if (!token) {
        return res.status(401).json({ message: 'Not logged in' });
    }

    // Verify the JWT token using the secret key
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        
        // Attach the decoded token payload (containing user info) to the request
        req.user = info; 
        next(); // Proceed to the next middleware or controller
    });
};

export default authMiddleware;
