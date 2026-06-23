import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export const generateToken = (userId: number, roleId: number, avatarUrl: string | null) => {
  return jwt.sign({ userId, roleId, avatarUrl }, ENV.JWT_SECRET, {
    expiresIn: '7d',
  });
};