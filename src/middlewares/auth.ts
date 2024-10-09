import { NextFunction, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { AppError } from '../utils/error';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '../types';

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new AppError('Authentication required', 401));
  }

  try {
    (req as AuthenticatedRequest).user = await authService.verifyToken(token);
    next();
  } catch (error) {
    next(new AppError(error instanceof Error ? error.message : 'Invalid token', 401));
  }
};

export const authorizeRoles = (...roles: Role[]) => (
  req: Request | AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user || !roles.includes(authReq.user.role)) {
    return next(new AppError('Not authorized', 403));
  }
  next();
};