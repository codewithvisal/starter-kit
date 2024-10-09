import { Booking, BookingStatus } from '@prisma/client';
import { AppError } from '../utils/error';
import db from '../configs/db';

export const bookingService = {
  async getAllBookings(): Promise<Booking[]> {
    return db.booking.findMany({
      include: {
        guest: true,
        property: true,
      },
    });
  },

  async getBookingById(id: string): Promise<Booking | null> {
    return db.booking.findUnique({
      where: { id },
      include: {
        guest: true,
        property: true,
      },
    });
  },

  async createBooking(data: {
    startDate: string;
    endDate: string;
    propertyId: string;
    guestId: string;
  }): Promise<Booking> {
    const { startDate, endDate, propertyId, guestId } = data;

    // Check if the property is available for the given dates
    const availability = await db.availability.findMany({
      where: {
        propertyId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        isAvailable: true,
      },
    });

    console.log('Booking request:', { propertyId, startDate, endDate });
    console.log('Availability:', availability);
    console.log('Date difference:', (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) + 1);

    if (availability.length !== (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) + 1) {
      throw new AppError('Property is not available for the selected dates', 400);
    }

    // Calculate total price
    const property = await db.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      throw new AppError('Property not found', 404);
    }

    const totalPrice = property.price * availability.length;

    // Create booking
    const booking = await db.booking.create({
      data: {
        ...data,
        status: BookingStatus.PENDING,
        totalPrice,
      },
      include: {
        guest: true,
        property: true,
      },
    });

    // Update availability
    await db.availability.updateMany({
      where: {
        propertyId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      data: {
        isAvailable: false,
      },
    });

    return booking;
  },

  async updateBooking(id: string, data: Partial<Pick<Booking, 'status'>>): Promise<Booking | null> {
    try {
      return await db.booking.update({
        where: { id },
        data,
        include: {
          guest: true,
          property: true,
        },
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  },

  async deleteBooking(id: string): Promise<void> {
    try {
      const booking = await db.booking.findUnique({ where: { id } });
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      // Update availability
      await db.availability.updateMany({
        where: {
          propertyId: booking.propertyId,
          date: {
            gte: booking.startDate,
            lte: booking.endDate,
          },
        },
        data: {
          isAvailable: true,
        },
      });

      await db.booking.delete({ where: { id } });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        throw new AppError('Booking not found', 404);
      }
      throw error;
    }
  },

  async getBookingsByUserId(userId: string): Promise<Booking[]> {
    return db.booking.findMany({
      where: { guestId: userId },
      include: {
        guest: true,
        property: true,
      },
    });
  },

  async getBookingsByPropertyId(propertyId: string): Promise<Booking[]> {
    return db.booking.findMany({
      where: { propertyId },
      include: {
        guest: true,
        property: true,
      },
    });
  },

  async isPropertyOwner(userId: string, propertyId: string): Promise<boolean> {
    const property = await db.property.findUnique({
      where: { id: propertyId },
      select: { ownerId: true },
    });
    return property?.ownerId === userId;
  },
};