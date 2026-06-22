import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export interface AuthRequest extends Request {
  user?: { userId: number; roleId: number };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'Pristup odbijen. Token nije obezbeđen.' });
    return;
  }
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { userId: number; roleId: number };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Nevažeći token.' });
  }
};