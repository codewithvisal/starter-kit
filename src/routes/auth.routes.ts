import express from 'express';
import { register, login, logout } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validation';
import { registerSchema, loginSchema } from '../types/auth.schema';
import { authenticateToken, authorizeRoles } from '../middlewares/auth';
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', authenticateToken, logout);

// Example of a protected route that only admins can access
router.get('/admin-only', authenticateToken, authorizeRoles(Role.ADMIN), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

export default router;