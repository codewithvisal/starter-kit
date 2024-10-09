import { Router } from 'express';
import { bookingController } from '../controllers/booking.controller';
import { validateRequest } from '../middlewares/validation';
import { createBookingSchema, updateBookingSchema } from '../types/booking.schema';
import { authenticateToken, authorizeRoles } from '../middlewares/auth';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '../types';

const router = Router();

router.use(authenticateToken);

router.get('/', authorizeRoles(Role.ADMIN), (req, res, next) => 
  bookingController.getAllBookings(req as AuthenticatedRequest, res)
);

router.get('/my-bookings', (req, res, next) => 
  bookingController.getMyBookings(req as AuthenticatedRequest, res, next)
);

router.get('/property/:propertyId', authorizeRoles(Role.ADMIN, Role.HOST), (req, res, next) => 
  bookingController.getBookingsForProperty(req as AuthenticatedRequest, res, next)
);

router.get('/:id', (req, res) => 
  bookingController.getBookingById(req as unknown as AuthenticatedRequest, res)
);

router.post('/', authorizeRoles(Role.USER), validateRequest(createBookingSchema), (req, res, next) => 
  bookingController.createBooking(req as AuthenticatedRequest, res, next)
);

router.put('/:id', validateRequest(updateBookingSchema), (req, res, next) => 
  bookingController.updateBooking(req as AuthenticatedRequest, res, next)
);

router.delete('/:id', (req, res, next) => 
  bookingController.deleteBooking(req as unknown as AuthenticatedRequest, res, next)
);

export default router;