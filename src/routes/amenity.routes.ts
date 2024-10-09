import { Router } from 'express';
import { amenityController } from '../controllers/amenity.controller';
import { validateRequest } from '../middlewares/validation';
import { createAmenitySchema, updateAmenitySchema } from '../types/amenity.schema';
import { authenticateToken, authorizeRoles } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticateToken);

router.use(authorizeRoles(Role.ADMIN));

router.get('/', amenityController.getAllAmenities);
router.get('/:id', amenityController.getAmenityById);
router.post('/', validateRequest(createAmenitySchema), amenityController.createAmenity);
router.put('/:id', validateRequest(updateAmenitySchema), amenityController.updateAmenity);
router.delete('/:id', amenityController.deleteAmenity);

export default router;
