import { Router } from 'express';
import { availabilityController } from '../controllers/availability.controller';
import { authenticateToken, authorizeRoles } from '../middlewares/auth';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '../types';

const router = Router();

router.use(authenticateToken);

router.post('/', authorizeRoles(Role.HOST, Role.ADMIN), (req, res, next) => 
  availabilityController.createAvailability(req as AuthenticatedRequest, res, next)
);

router.post('/bulk', authorizeRoles(Role.HOST, Role.ADMIN), (req, res, next) => {
  console.log('Bulk availability route hit');
  availabilityController.createBulkAvailability(req as AuthenticatedRequest, res, next)
});

router.get('/property/:propertyId', (req, res, next) => 
  availabilityController.getAvailabilityForProperty(req as unknown as AuthenticatedRequest, res, next)
);

router.put('/:id', authorizeRoles(Role.HOST, Role.ADMIN), (req, res, next) => 
  availabilityController.updateAvailability(req as AuthenticatedRequest, res, next)
);

router.delete('/:id', authorizeRoles(Role.HOST, Role.ADMIN), (req, res, next) => 
  availabilityController.deleteAvailability(req as AuthenticatedRequest, res, next)
);

export default router;
