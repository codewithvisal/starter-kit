import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { Role } from '@prisma/client';

interface AuthRequest extends Request {
  body: { email: string; password: string; role?: Role };
}

export const register = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;
    const user = await authService.register(email, password, role);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.status(200).json({ message: 'Logged in successfully', user });
  } catch (error) {
    next(error);
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('token', { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.status(200).json({ message: 'Logged out successfully' });
};