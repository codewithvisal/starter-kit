import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export interface AuthenticatedUser {
  userId: string;
  role: Role;
}