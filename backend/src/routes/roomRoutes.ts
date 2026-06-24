import { Router } from 'express';
import { getRooms, createRoom, getRoomMessages, updateRoom, deleteRoom, searchGifs, getInviteCode, joinWithInvite, updateRoomTheme } from '../controllers/roomController';
import { sendMessage, softDeleteMessage } from '../controllers/messageController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Preuzmi sve sobe za trenutnog korisnika
 *     tags:
 *       - Sobe
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista soba
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *       401:
 *         description: Niste autentifikovani
 */
router.get('/', getRooms);

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Kreiraj novu sobu
 *     tags:
 *       - Sobe
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Razvoj Chat-a
 *               description:
 *                 type: string
 *                 example: Soba za diskusiju o razvoju
 *     responses:
 *       201:
 *         description: Soba uspešno kreirana
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       400:
 *         description: Nevalidni podaci
 */
router.post('/', createRoom);

/**
 * @swagger
 * /api/rooms/gifs:
 *   get:
 *     summary: Pretraži GIF slike
 *     tags:
 *       - Sobe
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Ključna reč za pretragu
 *     responses:
 *       200:
 *         description: Lista GIF slika
 *       400:
 *         description: Nedostaje query parametar
 */
router.get('/gifs', searchGifs);

/**
 * @swagger
 * /api/rooms/{roomId}:
 *   put:
 *     summary: Ažuriraj sobu
 *     tags:
 *       - Sobe
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID sobe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Soba uspešno ažurirana
 *       404:
 *         description: Soba nije pronađena
 */
router.put('/:roomId', updateRoom);

/**
 * @swagger
 * /api/rooms/{roomId}:
 *   delete:
 *     summary: Obriši sobu
 *     tags:
 *       - Sobe
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Soba uspešno obrisana
 *       404:
 *         description: Soba nije pronađena
 */
router.delete('/:roomId', deleteRoom);

/**
 * @swagger
 * /api/rooms/{roomId}/messages:
 *   get:
 *     summary: Preuzmi sve poruke iz sobe
 *     tags:
 *       - Poruke
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Lista poruka
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       404:
 *         description: Soba nije pronađena
 */
router.get('/:roomId/messages', getRoomMessages);

/**
 * @swagger
 * /api/rooms/{roomId}/messages:
 *   post:
 *     summary: Pošalji novu poruku u sobu
 *     tags:
 *       - Poruke
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Evo moje poruke!
 *     responses:
 *       201:
 *         description: Poruka uspešno poslata
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Nedostaje sadržaj poruke
 */
router.post('/:roomId/messages', sendMessage);

/**
 * @swagger
 * /api/rooms/join:
 *   post:
 *     summary: Pridruži se sobi koristeći kod
 *     tags:
 *       - Sobe
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - inviteCode
 *             properties:
 *               inviteCode:
 *                 type: string
 *                 example: ABC123XYZ
 *     responses:
 *       200:
 *         description: Uspešno ste se pridružili sobi
 *       404:
 *         description: Kod nije validan
 */
router.post('/join', joinWithInvite);

/**
 * @swagger
 * /api/rooms/{roomId}/invite:
 *   get:
 *     summary: Preuzmi kod za pozivanje u sobu
 *     tags:
 *       - Sobe
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Kod pozivanja
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inviteCode:
 *                   type: string
 */
router.get('/:roomId/invite', getInviteCode);

/**
 * @swagger
 * /api/rooms/{roomId}/theme:
 *   patch:
 *     summary: Ažuriraj temu sobe
 *     tags:
 *       - Sobe
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - theme
 *             properties:
 *               theme:
 *                 type: string
 *                 example: dark
 *     responses:
 *       200:
 *         description: Tema uspešno ažurirana
 */
router.patch('/:roomId/theme', updateRoomTheme);

/**
 * @swagger
 * /api/rooms/messages/{messageId}:
 *   delete:
 *     summary: Obriši poruku
 *     tags:
 *       - Poruke
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Poruka uspešno obrisana
 *       404:
 *         description: Poruka nije pronađena
 */
router.delete('/messages/:messageId', softDeleteMessage);

export default router;