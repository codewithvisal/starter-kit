import { z } from 'zod';
import { BookingStatus } from '@prisma/client';

export const createBookingSchema = z.object({
  body: z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    propertyId: z.string().cuid(),
    // Remove guestId from here as it will be set by the server
  }),
});

export const updateBookingSchema = z.object({
  body: z.object({
    status: z.nativeEnum(BookingStatus).optional(),
  }),
});