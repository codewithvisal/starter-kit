import { Router } from 'express';
import { validateRequest } from '../middlewares/validation';
import { createPropertySchema, updatePropertySchema } from '../types/property.schema';
import { authenticateToken, authorizeRoles } from '../middlewares/auth';
import { Role } from '@prisma/client';
import { propertyController } from '../controllers/property.controller';
import { AuthenticatedRequest } from '../types';

const router = Router();

router.use(authenticateToken);

router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);

router.use(authorizeRoles(Role.ADMIN, Role.HOST));

router.post('/', 
  validateRequest(createPropertySchema), 
  (req, res, next) => propertyController.createProperty(req as AuthenticatedRequest, res, next)
);

router.put('/:id', 
  validateRequest(updatePropertySchema), 
  (req, res, next) => propertyController.updateProperty(req as AuthenticatedRequest, res, next)
);

router.delete('/:id', 
  (req, res, next) => propertyController.deleteProperty(req as unknown as AuthenticatedRequest, res, next)
);

export default router;