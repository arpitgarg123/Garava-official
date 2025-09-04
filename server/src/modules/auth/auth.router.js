import {Router} from 'express';
import { forgotPassword, login, logout, refreshSession, resendVerificationEmail, resetPassword, signup, verifyEmail } from './auth.controller.js';
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
export default router;