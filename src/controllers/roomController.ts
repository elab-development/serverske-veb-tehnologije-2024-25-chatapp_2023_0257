import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../config/prisma';

export const getRooms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, sortBy } = req.query;
    
    const rooms = await prisma.room.findMany({
      where: search ? { name: { contains: String(search), mode: 'insensitive' } } : {},
      orderBy: { createdAt: sortBy === 'oldest' ? 'asc' : 'desc' }
    });
    
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Greška pri povlačenju soba.' });
  }
};

export const createRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, isPrivate } = req.body;
    const userId = req.user!.userId;

    const newRoom = await prisma.$transaction(async (prismaClient) => {
      const room = await prismaClient.room.create({
        data: { name, isPrivate, creatorId: userId }
      });
      await prismaClient.roomMember.create({
        data: { roomId: room.id, userId }
      });
      return room;
    });

    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: 'Greška pri kreiranju sobe.' });
  }
};

export const getRoomMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const roomId = Number(req.params.roomId);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const messages = await prisma.message.findMany({
      where: { roomId },
      take: limit,
      skip: skip,
      orderBy: { createdAt: 'desc' },
      include: { sender: { select: { username: true, avatarUrl: true } } }
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Greška pri povlačenju poruka.' });
  }
};