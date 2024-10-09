import { PrismaClient, Amenity } from '@prisma/client';
import { AppError } from '../utils/error';

const prisma = new PrismaClient();

export const amenityService = {
  async getAllAmenities(): Promise<Amenity[]> {
    return prisma.amenity.findMany();
  },

  async getAmenityById(id: string): Promise<Amenity | null> {
    return prisma.amenity.findUnique({ where: { id } });
  },

  async createAmenity(data: Omit<Amenity, 'id' | 'createdAt' | 'updatedAt'>): Promise<Amenity> {
    return prisma.amenity.create({ data });
  },

  async updateAmenity(id: string, data: Partial<Omit<Amenity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Amenity | null> {
    try {
      return await prisma.amenity.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  },

  async deleteAmenity(id: string): Promise<void> {
    try {
      await prisma.amenity.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        throw new AppError('Amenity not found', 404);
      }
      throw error;
    }
  },
};
