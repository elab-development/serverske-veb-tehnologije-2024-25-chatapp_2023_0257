import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import roomRoutes from './roomRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/users', userRoutes);

export default router;