import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../config/prisma';
import { ENV } from '../config/env';

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


export const updateRoom = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const roomId = Number(req.params.roomId);
        const { name } = req.body;
        const userId = req.user!.userId;

        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room || room.creatorId !== userId) {
            res.status(403).json({ error: 'Samo kreator može izmeniti sobu.' });
            return;
        }

        const updatedRoom = await prisma.room.update({
            where: { id: roomId },
            data: { name }
        });

        res.status(200).json(updatedRoom);
    } catch (error) {
        res.status(500).json({ error: 'Greška pri ažuriranju sobe.' });
    }
};

export const deleteRoom = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const roomId = Number(req.params.roomId);
        const userId = req.user!.userId;

        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room || room.creatorId !== userId) {
            res.status(403).json({ error: 'Samo kreator može obrisati sobu.' });
            return;
        }

        await prisma.room.delete({ where: { id: roomId } });

        res.status(200).json({ message: 'Soba je uspešno obrisana.' });
    } catch (error) {
        res.status(500).json({ error: 'Greška pri brisanju sobe.' });
    }
};

export const searchGifs = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const query = req.query.q;
        if (!query) {
            res.status(400).json({ error: 'Morate uneti termin za pretragu.' });
            return;
        }

        const apiKey = ENV.GIPHY_API_KEY
        const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=5`);
        const data = await response.json();

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Greška pri povlačenju GIF-ova.' });
    }
};


export const getInviteCode = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const roomId = Number(req.params.roomId);
        const room = await prisma.room.findUnique({ where: { id: roomId }, select: { inviteCode: true } });

        if (!room) {
            res.status(404).json({ error: 'Soba nije pronađena.' });
            return;
        }

        res.status(200).json({ inviteCode: room.inviteCode });
    } catch (error) {
        res.status(500).json({ error: 'Greška pri povlačenju invite koda.' });
    }
};

export const joinWithInvite = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { inviteCode } = req.body;
        const userId = req.user!.userId;

        const room = await prisma.room.findUnique({ where: { inviteCode } });
        if (!room) {
            res.status(404).json({ error: 'Nevažeći invite kod.' });
            return;
        }

        const existingMember = await prisma.roomMember.findUnique({
            where: { roomId_userId: { roomId: room.id, userId } }
        });

        if (existingMember) {
            res.status(400).json({ error: 'Već ste član ove sobe.' });
            return;
        }

        await prisma.roomMember.create({ data: { roomId: room.id, userId } });
        res.status(200).json({ message: 'Uspešno ste se pridružili sobi!', roomId: room.id });
    } catch (error) {
        res.status(500).json({ error: 'Greška pri pridruživanju sobi.' });
    }
};

export const updateRoomTheme = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const roomId = Number(req.params.roomId);
    const { themeColor } = req.body;
    const userId = req.user!.userId;

    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room || room.creatorId !== userId) {
      res.status(403).json({ error: 'Samo kreator može menjati temu sobe.' });
      return;
    }

    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: { themeColor }
    });

    res.status(200).json({ message: 'Tema uspešno promenjena', themeColor: updatedRoom.themeColor });
  } catch (error) {
    res.status(500).json({ error: 'Greška pri promeni teme.' });
  }
};