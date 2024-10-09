import { Request, Response } from 'express';
import { AppError } from '../utils/error';
import { propertyTypeService } from '../services/property-type.service';

export const propertyTypeController = {
  async getAllPropertyTypes(req: Request, res: Response) {
    try {
      const propertyTypes = await propertyTypeService.getAllPropertyTypes();
      res.status(200).json(propertyTypes);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  },

  async getPropertyTypeById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const propertyType = await propertyTypeService.getPropertyTypeById(id);
      if (!propertyType) {
        throw new AppError('Property type not found', 404);
      }
      res.status(200).json(propertyType);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  async createPropertyType(req: Request, res: Response) {
    try {
      const propertyType = await propertyTypeService.createPropertyType(req.body);
      res.status(201).json(propertyType);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  async updatePropertyType(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedPropertyType = await propertyTypeService.updatePropertyType(id, req.body);
      if (!updatedPropertyType) {
        throw new AppError('Property type not found', 404);
      }
      res.status(200).json(updatedPropertyType);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },

  async deletePropertyType(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await propertyTypeService.deletePropertyType(id);
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