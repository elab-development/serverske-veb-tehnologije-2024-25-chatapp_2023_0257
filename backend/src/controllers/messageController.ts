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

export const softDeleteMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const messageId = Number(req.params.messageId);
    const userId = req.user!.userId;
    const message = await prisma.message.findUnique({ where: { id: messageId } });
    if (!message || message.senderId !== userId) {
      res.status(403).json({ error: 'Možete obrisati samo svoje poruke.' });
      return;
    }

    await prisma.message.update({
      where: { id: messageId },
      data: { isDeleted: true, content: 'Ova poruka je obrisana.' }
    });

    res.status(200).json({ message: 'Poruka je uklonjena.' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Greška pri brisanju poruke.' });
  }
};