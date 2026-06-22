import { Router } from 'express';
import { getRooms, createRoom, getRoomMessages } from '../controllers/roomController';
import { sendMessage } from '../controllers/messageController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getRooms);
router.post('/', createRoom);

// Ugnježdene rute
router.get('/:roomId/messages', getRoomMessages);
router.post('/:roomId/messages', sendMessage);

export default router;