import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { z } from 'zod';
import { env } from '../config/env';

const sanitizeString = (str: string): string => {
    return str.trim().replace(/[<>]/g, '');
};

const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');

const registerSchema = z.object({
    name: z.string().min(2).max(100).transform(sanitizeString),
    email: z.string().email().max(255).transform(sanitizeString).transform(s => s.toLowerCase()),
    mobile: z.string().min(10).max(20).transform(sanitizeString),
    password: passwordSchema,
});

const loginSchema = z.object({
    identifier: z.string().min(1).transform(sanitizeString),
    password: z.string().min(1),
});

const isProduction = env.NODE_ENV === 'production';

export const register = async (req: Request, res: Response) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const { name, email, mobile, password } = validatedData;

        const [existingUsers]: any = await pool.execute(
            'SELECT id FROM users WHERE email = ? OR mobile = ?',
            [email, mobile]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email or Mobile already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const [result]: any = await pool.execute(
            'INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)',
            [name, email, mobile, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: isProduction ? 'Registration failed' : 'An error occurred during registration' 
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { identifier, password } = loginSchema.parse(req.body);

        const [users]: any = await pool.execute(
            'SELECT id, name, email, mobile, password FROM users WHERE email = ? OR mobile = ?',
            [identifier, identifier]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await pool.execute(
            'INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES (?, ?, ?)',
            [refreshToken, user.id, expiresAt]
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });

        res.json({
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                mobile: user.mobile
            }
        });
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        console.error('Login error:', error);
        res.status(500).json({ 
            message: isProduction ? 'Login failed' : 'An error occurred during login' 
        });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.cookies;
        if (refreshToken) {
            await pool.execute('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
        }
        res.clearCookie('refreshToken', { path: '/' });
        res.json({ message: 'Logged out successfully' });
    } catch (error: unknown) {
        console.error('Logout error:', error);
        res.clearCookie('refreshToken', { path: '/' });
        res.json({ message: 'Logged out successfully' });
    }
};

export const refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token missing' });
    }

    try {
        const decoded = verifyRefreshToken(refreshToken);
        
        const [tokens]: any = await pool.execute(
            'SELECT rt.*, u.id as user_id FROM refresh_tokens rt JOIN users u ON rt.user_id = u.id WHERE rt.token = ?',
            [refreshToken]
        );

        if (tokens.length === 0) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const tokenRecord = tokens[0];
        
        if (new Date(tokenRecord.expires_at) < new Date()) {
            await pool.execute('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
            return res.status(403).json({ message: 'Refresh token expired' });
        }

        if (tokenRecord.user_id !== decoded.userId) {
            await pool.execute('DELETE FROM refresh_tokens WHERE user_id = ?', [decoded.userId]);
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const accessToken = generateAccessToken(decoded.userId);
        
        res.json({ accessToken });
    } catch (error: unknown) {
        console.error('Refresh token error:', error);
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};
