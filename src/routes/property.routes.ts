import { Router } from 'express';
import { propertyController } from '../controllers/property.controller';
import { validateRequest } from '../middlewares/validation';
import { createPropertySchema, updatePropertySchema } from '../types/property.schema';
import { authenticateToken, authorizeRoles } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticateToken);

router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);

router.use(authorizeRoles(Role.ADMIN, Role.HOST));

router.post('/', validateRequest(createPropertySchema), propertyController.createProperty);
router.put('/:id', validateRequest(updatePropertySchema), propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);

export default router;