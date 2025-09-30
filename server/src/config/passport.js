import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../modules/user/user.model.js';
import { env } from './env.js';

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: env.GOOGLE_CALLBACK_URL || `${env.CLIENT_URL.replace('5173', '8080')}/api/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google OAuth Strategy - Processing profile:', {
        id: profile.id,
        email: profile.emails?.[0]?.value,
        name: profile.displayName
      });

      // Check if user already exists
      let user = await User.findOne({ 
        $or: [
          { googleId: profile.id },
          { email: profile.emails[0]?.value }
        ]
      });

      if (user) {
        // User exists, update Google ID if missing
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
          console.log('Google OAuth Strategy - Updated existing user with Google ID:', user._id);
        } else {
          console.log('Google OAuth Strategy - Existing user found:', user._id);
        }
        return done(null, user);
      }

      // Create new user
      const newUser = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0]?.value,
        isVerified: true, // Google accounts are pre-verified
        profilePicture: profile.photos[0]?.value
      });

      await newUser.save();
      console.log('Google OAuth Strategy - Created new user:', newUser._id);
      
      return done(null, newUser);
    } catch (error) {
      console.error('Google OAuth Strategy Error:', error);
      return done(error, null);
    }
  }
));

export default passport;