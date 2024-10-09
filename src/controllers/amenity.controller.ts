import { Request, Response } from 'express';
import { AppError } from '../utils/error';
import { amenityService } from '../services/amenity.service';

export const amenityController = {
  async getAllAmenities(req: Request, res: Response) {
    try {
      const amenities = await amenityService.getAllAmenities();
      res.status(200).json(amenities);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  },

  async getAmenityById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const amenity = await amenityService.getAmenityById(id);
      if (!amenity) {
        throw new AppError('Amenity not found', 404);
      }
      res.status(200).json(amenity);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  async createAmenity(req: Request, res: Response) {
    try {
      const amenity = await amenityService.createAmenity(req.body);
      res.status(201).json(amenity);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  async updateAmenity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedAmenity = await amenityService.updateAmenity(id, req.body);
      if (!updatedAmenity) {
        throw new AppError('Amenity not found', 404);
      }
      res.status(200).json(updatedAmenity);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  async deleteAmenity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await amenityService.deleteAmenity(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },
};
