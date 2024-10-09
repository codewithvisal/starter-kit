import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error';
import { bookingService } from '../services/booking.service';
import { Role, BookingStatus } from '@prisma/client';
import { updateBookingSchema } from '../types/booking.schema';
import { AuthenticatedRequest } from '../types';

export const bookingController = {
  async getAllBookings(req: AuthenticatedRequest, res: Response) {
    try {
      const bookings = await bookingService.getAllBookings();
      res.status(200).json(bookings);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  },

  async getBookingById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const booking = await bookingService.getBookingById(id);
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }
      res.status(200).json(booking);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  async createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { propertyId, startDate, endDate } = req.body;
      const user = req.user;
      if (!user) {
        throw new AppError('User not authenticated', 401);
      }
      const booking = await bookingService.createBooking({
        propertyId,
        startDate,
        endDate,
        guestId: user.id,
      });
      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  },

  async updateBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { startDate, endDate, status } = req.body;
      const user = req.user;
      if (!user) {
        throw new AppError('User not authenticated', 401);
      }
      const { id: userId, role: userRole } = user;
      const booking = await bookingService.getBookingById(id);
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      // Validate request body
      const { body } = updateBookingSchema.parse(req);
      const { status: newStatus } = body;

      // Check permissions based on role
      if (userRole === Role.USER) {
        if (booking.guestId !== userId) {
          throw new AppError('Unauthorized', 403);
        }
        if (newStatus && newStatus !== BookingStatus.CANCELLED) {
          throw new AppError('Users can only cancel bookings', 403);
        }
      } else if (userRole === Role.HOST) {
        const isOwner = await bookingService.isPropertyOwner(userId, booking.propertyId);
        if (!isOwner) {
          throw new AppError('Unauthorized', 403);
        }
        if (newStatus && newStatus !== BookingStatus.CONFIRMED && newStatus !== BookingStatus.CANCELLED) {
          throw new AppError('Hosts can only confirm or cancel bookings', 403);
        }
      }
      // ADMIN can update to any status

      const updatedBooking = await bookingService.updateBooking(id, body);
      if (!updatedBooking) {
        throw new AppError('Booking not found', 404);
      }
      res.status(200).json(updatedBooking);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  async deleteBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = req.user;
      if (!user) {
        throw new AppError('User not authenticated', 401);
      }
      const { id: userId, role: userRole } = user;
      const booking = await bookingService.getBookingById(id);
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      if (userRole === Role.USER) {
        if (booking.guestId !== userId) {
          throw new AppError('Unauthorized', 403);
        }
        if (booking.status === BookingStatus.CONFIRMED) {
          throw new AppError('Cannot delete confirmed booking', 403);
        }
      } else if (userRole === Role.HOST) {
        const isOwner = await bookingService.isPropertyOwner(userId, booking.propertyId);
        if (!isOwner) {
          throw new AppError('Unauthorized', 403);
        }
      }
      // ADMIN can delete any booking

      await bookingService.deleteBooking(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  async getMyBookings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) {
        throw new AppError('User not authenticated', 401);
      }
      const bookings = await bookingService.getBookingsByUserId(user.id);
      res.status(200).json(bookings);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  },

  async getBookingsForProperty(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { propertyId } = req.params;
      const user = req.user;
      if (!user) {
        throw new AppError('User not authenticated', 401);
      }
      const { id: userId, role: userRole } = user;

      if (userRole === Role.HOST) {
        // Check if the user owns the property
        const isOwner = await bookingService.isPropertyOwner(userId, propertyId);
        if (!isOwner) {
          throw new AppError('Unauthorized', 403);
        }
      }

      const bookings = await bookingService.getBookingsByPropertyId(propertyId);
      res.status(200).json(bookings);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },
};