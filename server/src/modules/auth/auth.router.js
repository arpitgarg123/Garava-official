import {Router} from 'express';
import { login, logout, refreshSession, signup } from './auth.controller.js';
import { authenticated } from '../../middlewares/authentication.js';

const router = Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', authenticated, logout);
router.post("/refresh", refreshSession);
export default router;