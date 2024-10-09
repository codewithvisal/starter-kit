import { Response, NextFunction } from 'express';
import { AvailabilityService } from '../services/availability.service';
import { AuthenticatedRequest } from '../types';
import { AppError } from '../utils/error';

const availabilityService = new AvailabilityService();

export const availabilityController = {
  async createAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { propertyId, date, isAvailable, price } = req.body;
      const availability = await availabilityService.createAvailability({
        propertyId,
        date: new Date(date),
        isAvailable,
        price,
      });
      res.status(201).json(availability);
    } catch (error) {
      next(error);
    }
  },

  async createBulkAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      console.log('Received bulk availability request:', req.body);
      const { propertyId, startDate, endDate, isAvailable, price } = req.body;
      const availabilities = await availabilityService.createBulkAvailability({
        propertyId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isAvailable,
        price,
      });
      res.status(201).json(availabilities);
    } catch (error) {
      console.error('Error in createBulkAvailability controller:', error);
      next(error);
    }
  },

  async getAvailabilityForProperty(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { propertyId } = req.params;
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate || typeof startDate !== 'string' || typeof endDate !== 'string') {
        throw new AppError('Invalid date range', 400);
      }
      const availabilities = await availabilityService.getAvailabilityForProperty(
        propertyId,
        new Date(startDate),
        new Date(endDate)
      );
      res.status(200).json(availabilities);
    } catch (error) {
      next(error);
    }
  },

  async updateAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { isAvailable, price } = req.body;
      const availability = await availabilityService.updateAvailability(id, { isAvailable, price });
      res.status(200).json(availability);
    } catch (error) {
      next(error);
    }
  },

  async deleteAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await availabilityService.deleteAvailability(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
