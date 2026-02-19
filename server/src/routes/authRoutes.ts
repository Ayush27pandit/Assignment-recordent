import { Router } from 'express';
import { register, login, logout, refresh } from '../controllers/authController';
import { strictAuthLimiter, refreshLimiter } from '../middleware/rateLimiters';

const router = Router();

router.post('/register', strictAuthLimiter, register);
router.post('/login', strictAuthLimiter, login);
router.post('/logout', logout);
router.post('/refresh', refreshLimiter, refresh);

export default router;
