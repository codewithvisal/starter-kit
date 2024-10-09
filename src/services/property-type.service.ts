import { PrismaClient, PropertyType } from '@prisma/client';
import { AppError } from '../utils/error';

const prisma = new PrismaClient();

export const propertyTypeService = {
  async getAllPropertyTypes(): Promise<PropertyType[]> {
    return prisma.propertyType.findMany();
  },

  async getPropertyTypeById(id: string): Promise<PropertyType | null> {
    return prisma.propertyType.findUnique({ where: { id } });
  },

  async createPropertyType(data: Omit<PropertyType, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyType> {
    return prisma.propertyType.create({ data });
  },

  async updatePropertyType(id: string, data: Partial<Omit<PropertyType, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PropertyType | null> {
    try {
      return await prisma.propertyType.update({
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

  async deletePropertyType(id: string): Promise<void> {
    try {
      await prisma.propertyType.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'P2025') {
        throw new AppError('Property type not found', 404);
      }
      throw error;
    }
  },
};