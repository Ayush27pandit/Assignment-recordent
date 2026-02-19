import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    mobile: z.string().min(10),
    password: z.string().min(6),
});

const loginSchema = z.object({
    identifier: z.string(), // can be email or mobile
    password: z.string(),
});

export const register = async (req: Request, res: Response) => {
    try {
        const validatedData = registerSchema.parse(req.body);
        const { name, email, mobile, password } = validatedData;

        // Check if user exists
        const [existingUsers]: any = await pool.execute(
            'SELECT id FROM users WHERE email = ? OR mobile = ?',
            [email, mobile]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email or Mobile already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Insert user
        const [result]: any = await pool.execute(
            'INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)',
            [name, email, mobile, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { identifier, password } = loginSchema.parse(req.body);

        // Find user by email or mobile
        const [users]: any = await pool.execute(
            'SELECT * FROM users WHERE email = ? OR mobile = ?',
            [identifier, identifier]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Store refresh token in DB
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        await pool.execute(
            'INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES (?, ?, ?)',
            [refreshToken, user.id, expiresAt]
        );

        // Set cookie for refresh token
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
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
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ message: error.message });
    }
};

export const logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
        await pool.execute('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
};

export const refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token missing' });

    try {
        const [tokens]: any = await pool.execute(
            'SELECT * FROM refresh_tokens WHERE token = ?',
            [refreshToken]
        );

        if (tokens.length === 0) return res.status(403).json({ message: 'Invalid refresh token' });

        const accessToken = generateAccessToken(tokens[0].user_id);
        res.json({ accessToken });
    } catch (error: any) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
};
