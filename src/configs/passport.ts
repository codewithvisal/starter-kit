import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { authService } from '../services/auth.service';
import { User } from '@prisma/client';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => {
      try {
        const user = await authService.findOrCreateGoogleUser(profile);
        if (user) {
          done(null, { userId: user.id, ...user });
        } else {
          done(null, false);
        }
      } catch (error) {
        done(error as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await authService.findUserById(id);
    if (user) {
      done(null, { userId: user.id, ...user });
    } else {
      done(null, null);
    }
  } catch (error) {
    done(error as Error);
  }
});

export default passport;