import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { AppError } from '../utils/error';
import { Role } from '@prisma/client';
import { AuthenticatedUser } from '../types';

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new AppError('Authentication required', 401));
  }

  try {
    const decoded = await authService.verifyToken(token);
    req.user = decoded as AuthenticatedUser;
    next();
  } catch (error) {
    if (error instanceof Error) {
      next(new AppError(error.message, 401));
    } else {
      next(new AppError('Invalid token', 401));
    }
  }
};

export const authorizeRoles = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as AuthenticatedUser | undefined;
    if (!user || !roles.includes(user.role)) {
      return next(new AppError('Not authorized', 403));
    }
    next();
  };
};