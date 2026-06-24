import { Router } from 'express';
import { uploadAvatar } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

/**
 * @swagger
 * /api/users/avatar:
 *   post:
 *     summary: Otpremi avatar za korisnika
 *     tags:
 *       - Korisnici
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Slika avatara (max 5MB)
 *     responses:
 *       200:
 *         description: Avatar uspešno otpremljen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Avatar uspešno otpremljen
 *                 avatarUrl:
 *                   type: string
 *       400:
 *         description: Datoteka nije validna
 *       401:
 *         description: Niste autentifikovani
 */
router.post('/avatar', authenticate, upload.single('avatar'), uploadAvatar);

export default router;