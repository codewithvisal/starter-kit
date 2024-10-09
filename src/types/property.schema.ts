import { z } from 'zod';

export const createPropertySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    basePrice: z.number().positive('Base price must be positive'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    zipCode: z.string().min(1, 'Zip code is required'),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    bedrooms: z.number().int().positive('Bedrooms must be a positive integer'),
    bathrooms: z.number().int().positive('Bathrooms must be a positive integer'),
    maxGuests: z.number().int().positive('Max guests must be a positive integer'),
    imageUrl: z.string().url().optional(),
    propertyTypeId: z.string().min(1, 'Property type is required'),
    amenityIds: z.array(z.string()).optional(),
  }),
});

export const updatePropertySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    basePrice: z.number().positive('Base price must be positive').optional(),
    address: z.string().min(1, 'Address is required').optional(),
    city: z.string().min(1, 'City is required').optional(),
    state: z.string().min(1, 'State is required').optional(),
    country: z.string().min(1, 'Country is required').optional(),
    zipCode: z.string().min(1, 'Zip code is required').optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    bedrooms: z.number().int().positive('Bedrooms must be a positive integer').optional(),
    bathrooms: z.number().int().positive('Bathrooms must be a positive integer').optional(),
    maxGuests: z.number().int().positive('Max guests must be a positive integer').optional(),
    imageUrl: z.string().url().optional(),
    propertyTypeId: z.string().min(1, 'Property type is required').optional(),
    amenityIds: z.array(z.string()).optional(),
  }),
});