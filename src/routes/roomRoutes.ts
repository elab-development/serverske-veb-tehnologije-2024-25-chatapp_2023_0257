import { Router } from 'express';
import { getRooms, createRoom, getRoomMessages, updateRoom, deleteRoom, searchGifs, getInviteCode, joinWithInvite, updateRoomTheme } from '../controllers/roomController';
import { sendMessage, softDeleteMessage } from '../controllers/messageController';
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

router.post('/join', joinWithInvite); 
router.get('/:roomId/invite', getInviteCode);


router.patch('/:roomId/theme', updateRoomTheme);

// ovde cepamo konkretnu poruku 
router.delete('/messages/:messageId', softDeleteMessage);

export default router;