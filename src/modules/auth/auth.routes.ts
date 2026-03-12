import { Router } from 'express';
import { loginHandler } from './auth.controller';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Login user using stored procedure
 * @access  Public
 */
router.post('/login', loginHandler);

export default router;
