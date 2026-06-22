import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
      res.status(400).json({ error: 'Korisnik sa ovim email-om ili korisničkim imenom već postoji.' });
      return;
    }

    const userRole = await prisma.role.findUnique({ where: { name: 'USER' } });
    
    if (!userRole) {
      res.status(500).json({ error: 'Uloga USER nije pronađena u bazi.' });
      return;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        roleId: userRole.id
      }
    });

    res.status(201).json({ message: 'Uspesna registracija!', userId: newUser.id });
  } catch (error) {
    console.error('[Auth] Register error:', error);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      res.status(401).json({ error: 'Pogrešni kredencijali.' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Pogrešni kredencijali.' });
      return;
    }

    const token = generateToken(user.id, user.roleId);

    res.status(200).json({
      message: 'Uspešan login.',
      token,
      user: { id: user.id, username: user.username, roleId: user.roleId }
    });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
};