import { Router } from 'express';
import { register, login, logout } from '../controllers/authController';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registruj novog korisnika
 *     tags:
 *       - Autentifikacija
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securePassword123
 *     responses:
 *       201:
 *         description: Korisnik uspešno registrovan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: Greška pri registraciji (invalid input ili duplicate user)
 *       500:
 *         description: Greška na serveru
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Prijavi korisnika
 *     tags:
 *       - Autentifikacija
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: Uspešna prijava
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       401:
 *         description: Nevalidne kredencijale
 *       500:
 *         description: Greška na serveru
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Odjavi korisnika
 *     tags:
 *       - Autentifikacija
 *     responses:
 *       200:
 *         description: Uspešna odjava
 *       500:
 *         description: Greška na serveru
 */
router.post('/logout', logout);

export default router;