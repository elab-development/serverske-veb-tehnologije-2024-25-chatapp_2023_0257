import { Router } from 'express';
import { uploadAvatar } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.post('/avatar', authenticate, upload.single('avatar'), uploadAvatar);

export default router;