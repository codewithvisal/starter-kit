import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import passport from 'passport';
import jwt from 'jsonwebtoken';

interface LoginRequest extends Request {
  body: { email: string; password: string };
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;
    const user = await authService.register(email, password, role);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: LoginRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.status(200).json({ message: 'Logged in successfully', user });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token', { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleAuthCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.redirect('/');
  })(req, res, next);
};