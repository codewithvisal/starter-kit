import { z } from 'zod';

export const createAmenitySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    icon: z.string().optional(),
  }),
});

export const updateAmenitySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    icon: z.string().optional(),
  }),
});
