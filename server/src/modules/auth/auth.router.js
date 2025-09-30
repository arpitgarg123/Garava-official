import {Router} from 'express';
import { forgotPassword, login, logout, refreshSession, resendVerificationEmail, resetPassword, signup, verifyEmail, googleAuth, googleCallback } from './auth.controller.js';
import { authenticated } from '../../middlewares/authentication.js';

const router = Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', authenticated, logout);
router.post("/refresh", refreshSession);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Debug route to check cookies (development only)
if (process.env.NODE_ENV === 'development') {
  router.get('/debug/cookies', (req, res) => {
    console.log('Debug - Request cookies:', req.cookies);
    res.json({
      cookies: req.cookies || {},
      hasRefreshToken: !!req.cookies?.refreshToken,
      hasAccessToken: !!req.cookies?.token
    });
  });
}

export default router;