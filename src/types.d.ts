import { Request } from 'express';
import { User as PrismaUser, Role } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user: PrismaUser & { role: Role };
}

export {};