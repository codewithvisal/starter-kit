import { z } from 'zod';

export const createPropertyTypeSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    imageUrl: z.string().url().optional(),
  }),
});

export const updatePropertyTypeSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    imageUrl: z.string().url().optional(),
  }),
});