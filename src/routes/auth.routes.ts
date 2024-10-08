import express from 'express';
import { register, login, logout, googleAuth, googleAuthCallback } from '../controllers/auth.controller';
import { registerSchema, loginSchema } from '../types/auth.schema';
import { Role } from '@prisma/client';
import { validateRequest } from '../middlewares/validation';
import { authenticateToken, authorizeRoles } from '../middlewares/auth';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', authenticateToken, logout);
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

// Example of a protected route that only admins can access
router.get('/admin-only', authenticateToken, authorizeRoles(Role.ADMIN), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

export default router;