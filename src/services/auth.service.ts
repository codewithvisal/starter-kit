import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/error';
import db from '../configs/db';
import { Role, User } from '@prisma/client';
import { Profile } from 'passport-google-oauth20';

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

    // Check if the user has a password (i.e., not a Google user)
    if (!user.password) {
      throw new AppError('Please log in with Google', 401);
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  },

  async verifyToken(token: string): Promise<Express.User> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: Role };
      return { userId: decoded.userId, role: decoded.role };
    } catch (error) {
      throw new AppError('Invalid token', 401);
    }
  },

  async findOrCreateGoogleUser(profile: Profile): Promise<User> {
    const existingUser = await db.user.findUnique({ where: { googleId: profile.id } });
    if (existingUser) {
      return existingUser;
    }

    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new AppError('No email found in Google profile', 400);
    }

    // Check if a user with this email already exists
    const userWithEmail = await db.user.findUnique({ where: { email } });
    if (userWithEmail) {
      // If the user exists but doesn't have a googleId, update it
      if (!userWithEmail.googleId) {
        return db.user.update({
          where: { id: userWithEmail.id },
          data: { googleId: profile.id }
        });
      }
      return userWithEmail;
    }

    // Create a new user if one doesn't exist
    const newUser = await db.user.create({
      data: {
        email,
        googleId: profile.id,
        displayName: profile.displayName,
        role: Role.USER,
      },
    });

    return newUser;
  },

  async findUserById(id: string): Promise<User | null> {
    return db.user.findUnique({ where: { id } });
  },
};
