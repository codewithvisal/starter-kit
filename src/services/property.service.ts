import { Property } from '@prisma/client';
import { AppError } from '../utils/error';
import db from '../configs/db';

export const propertyService = {
  async getAllProperties(): Promise<Property[]> {
    return db.property.findMany({
      include: {
        owner: true,
        propertyType: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    });
  },

  async getPropertyById(id: string): Promise<Property | null> {
    return db.property.findUnique({
      where: { id },
      include: {
        owner: true,
        propertyType: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    });
  },

  async createProperty(data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'> & { amenityIds?: string[] }): Promise<Property> {
    const { amenityIds, ...propertyData } = data;
    return db.property.create({
      data: {
        ...propertyData,
        amenities: {
          create: amenityIds?.map(amenityId => ({ amenityId })),
        },
      },
      include: {
        owner: true,
        propertyType: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
      },
    });
  },

  async updateProperty(id: string, data: Partial<Omit<Property, 'id' | 'createdAt' | 'updatedAt'>> & { amenityIds?: string[] }): Promise<Property | null> {
    const { amenityIds, ...propertyData } = data;
    try {
      return await db.property.update({
        where: { id },
        data: {
          ...propertyData,
          amenities: amenityIds ? {
            deleteMany: {},
            create: amenityIds.map(amenityId => ({ amenityId })),
          } : undefined,
        },
        include: {
          owner: true,
          propertyType: true,
          amenities: {
            include: {
              amenity: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  },

  async deleteProperty(id: string): Promise<void> {
    try {
      await db.$transaction(async (prisma) => {
        // Delete related PropertyAmenity records
        await prisma.propertyAmenity.deleteMany({
          where: { propertyId: id },
        });

        // Delete related Booking records
        await prisma.booking.deleteMany({
          where: { propertyId: id },
        });

        // Delete related Review records
        await prisma.review.deleteMany({
          where: { propertyId: id },
        });

        // Delete related Availability records
        await prisma.availability.deleteMany({
          where: { propertyId: id },
        });

        // Delete related Conversation records
        await prisma.conversation.deleteMany({
          where: { propertyId: id },
        });

        // Finally, delete the property
        await prisma.property.delete({
          where: { id },
        });
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        throw new AppError('Property not found', 404);
      }
      throw error;
    }
  },
};