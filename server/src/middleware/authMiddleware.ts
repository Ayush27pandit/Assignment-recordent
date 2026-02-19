import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthRequest extends Request {
    userId?: number;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access token required' });

    try {
        const decoded = verifyAccessToken(token);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired access token' });
    }
};
