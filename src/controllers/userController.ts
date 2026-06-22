import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../config/prisma';

export const uploadAvatar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file || !req.user) {
      res.status(400).json({ error: 'Fajl nije poslat ili korisnik nije ulogovan.' });
      return;
    }
    const avatarUrl = `/uploads/${req.file.filename}`;
    
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { avatarUrl }
    });

    res.status(200).json({ message: 'Avatar uspešno ažuriran', avatarUrl });
  } catch (error) {
    res.status(500).json({ error: 'Greška pri uploadu avatara.' });
  }
};