import { Availability } from '@prisma/client';
import db from '../configs/db';
import { AppError } from '../utils/error';

export class AvailabilityService {
  private generateDateRange(startDate: Date, endDate: Date): Date[] {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  async createAvailability(data: {
    propertyId: string;
    date: Date;
    isAvailable: boolean;
    price?: number;
  }): Promise<Availability> {
    try {
      return await db.availability.create({
        data,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unique constraint failed')) {
        throw new AppError('Availability for this date already exists', 400);
      }
      throw error;
    }
  }

  async createBulkAvailability(data: {
    propertyId: string;
    startDate: Date;
    endDate: Date;
    isAvailable: boolean;
    price?: number;
  }): Promise<Availability[]> {
    const { propertyId, startDate, endDate, isAvailable, price } = data;
    const dates = this.generateDateRange(startDate, endDate);

    try {
      const createdAvailabilities = await db.availability.createMany({
        data: dates.map(date => ({
          propertyId,
          date,
          isAvailable,
          price,
          // Note: bookingId is not set here as it's only set when a booking is made
        })),
        skipDuplicates: true,
      });

      console.log(`Created ${createdAvailabilities.count} availability records`);

      return await db.availability.findMany({
        where: {
          propertyId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          date: 'asc',
        },
      });
    } catch (error) {
      console.error('Error creating bulk availability:', error);
      throw new AppError('Failed to create bulk availability', 500);
    }
  }

  async getAvailabilityForProperty(propertyId: string, startDate: Date, endDate: Date): Promise<Availability[]> {
    return await db.availability.findMany({
      where: {
        propertyId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
  }

  async updateAvailability(id: string, data: Partial<Availability>): Promise<Availability> {
    try {
      return await db.availability.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Record to update not found')) {
        throw new AppError('Availability not found', 404);
      }
      throw error;
    }
  }

  async deleteAvailability(id: string): Promise<void> {
    try {
      await db.availability.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
        throw new AppError('Availability not found', 404);
      }
      throw error;
    }
  }
}
