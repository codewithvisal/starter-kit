import { Request, Response } from 'express';
import { AppError } from '../utils/error';
import { propertyService } from '../services/property.service';

export const propertyController = {
  async getAllProperties(req: Request, res: Response) {
    try {
      const properties = await propertyService.getAllProperties();
      res.status(200).json(properties);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  },

  async getPropertyById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const property = await propertyService.getPropertyById(id);
      if (!property) {
        throw new AppError('Property not found', 404);
      }
      res.status(200).json(property);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  async createProperty(req: Request, res: Response) {
    try {
      const property = await propertyService.createProperty(req.body);
      res.status(201).json(property);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  async updateProperty(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedProperty = await propertyService.updateProperty(id, req.body);
      if (!updatedProperty) {
        throw new AppError('Property not found', 404);
      }
      res.status(200).json(updatedProperty);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  async deleteProperty(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await propertyService.deleteProperty(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else if (error instanceof Error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
      } else {
        console.error('Unknown error deleting property:', error);
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  },
};