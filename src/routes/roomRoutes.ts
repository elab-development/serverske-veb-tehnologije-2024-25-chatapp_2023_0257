import { Router } from 'express';
import { getRooms, createRoom, getRoomMessages, updateRoom, deleteRoom, searchGifs } from '../controllers/roomController';
import { sendMessage } from '../controllers/messageController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getRooms);
router.post('/', createRoom);

router.get('/gifs', searchGifs); 

router.put('/:roomId', updateRoom);
router.delete('/:roomId', deleteRoom);

router.get('/:roomId/messages', getRoomMessages);
router.post('/:roomId/messages', sendMessage);

export default router;