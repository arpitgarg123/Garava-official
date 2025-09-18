import { logger } from '../shared/logger.js';
import { verifyAccessToken } from '../modules/auth/token.service.js';

export const authenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Auth error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
