import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export const generateToken = (userId: number, roleId: number) => {
  return jwt.sign({ userId, roleId }, ENV.JWT_SECRET, {
    expiresIn: '7d',
  });
};