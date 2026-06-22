import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../config/prisma';

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const roomId = Number(req.params.roomId);
    const { content } = req.body;
    const userId = req.user!.userId;

    const apiResponse = await fetch(`https://www.purgomalum.com/service/json?text=${encodeURIComponent(content)}`);
    const apiData = await apiResponse.json();
    const cleanContent = apiData.result;

    const message = await prisma.message.create({
      data: {
        roomId,
        senderId: userId,
        content: cleanContent
      },
      include: { sender: { select: { username: true } } }
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Greška pri slanju poruke.' });
  }
};