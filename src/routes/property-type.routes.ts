import { Router } from 'express';
import { propertyTypeController } from '../controllers/property-type.controller';
import { validateRequest } from '../middlewares/validation';
import { createPropertyTypeSchema, updatePropertyTypeSchema } from '../types/property-type.schema';
import { authenticateToken, authorizeRoles } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = Router();

router.use(authenticateToken);

router.use(authorizeRoles(Role.ADMIN));

router.get('/', propertyTypeController.getAllPropertyTypes);
router.get('/:id', propertyTypeController.getPropertyTypeById);
router.post('/', validateRequest(createPropertyTypeSchema), propertyTypeController.createPropertyType);
router.put('/:id', validateRequest(updatePropertyTypeSchema), propertyTypeController.updatePropertyType);
router.delete('/:id', propertyTypeController.deletePropertyType);

export default router;