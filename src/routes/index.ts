import { Router } from 'express';
import userRoutes from '../modules/users/user.routes';
import authRoutes from '../modules/auth/auth.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
router.use('/users', userRoutes);
router.use('/auth', authRoutes);

// Additional routes will be mounted here
// router.use('/products', productRoutes);
// router.use('/orders', orderRoutes);

export default router;
