import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/error';
import db from '../configs/db';
import { Role } from '@prisma/client';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

export const authService = {
  async register(email: string, password: string, role: Role = Role.USER) {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await db.user.create({
      data: { email, password: hashedPassword, role },
    });

    return { id: user.id, email: user.email, role: user.role };
  },

  async login(email: string, password: string) {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  },

  async verifyToken(token: string): Promise<{ userId: string, role: Role }> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: Role };
      return decoded;
    } catch (error) {
      throw new AppError('Invalid token', 401);
    }
  },
};
