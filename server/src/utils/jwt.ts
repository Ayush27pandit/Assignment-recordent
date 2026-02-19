import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const generateAccessToken = (userId: number): string => {
    return jwt.sign({ userId }, env.JWT_SECRET, { 
        expiresIn: '10m'
    });
};

export const generateRefreshToken = (userId: number): string => {
    return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { 
        expiresIn: '7d'
    });
};

export const verifyAccessToken = (token: string): { userId: number } => {
    return jwt.verify(token, env.JWT_SECRET) as { userId: number };
};

export const verifyRefreshToken = (token: string): { userId: number } => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: number };
};

export const decodeToken = (token: string): jwt.JwtPayload | null => {
    try {
        return jwt.decode(token) as jwt.JwtPayload;
    } catch {
        return null;
    }
};
