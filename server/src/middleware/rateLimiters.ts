import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const strictAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: env.AUTH_RATE_LIMIT_MAX,
    message: { message: 'Too many authentication attempts, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

export const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: { message: 'Too many refresh requests, please login again.' },
    standardHeaders: true,
    legacyHeaders: false,
});

export const generalLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    message: { message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
