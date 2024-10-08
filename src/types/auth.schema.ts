import { z } from 'zod';

const RoleEnum = z.enum(['ADMIN', 'HOST', 'USER']);

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: RoleEnum.optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});