import { logger } from '../shared/logger.js';

export const authorize = (allowedRole) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      if (req.user.role !== allowedRole) {
        return res.status(403).json({
          message: 'Forbidden: Only ' + allowedRole + ' can access this',
        });
      }
      next();
    } catch (error) {
      logger.error('Authorization error', error);
      res.status(500).json({ message: 'Server error in authorization' });
    }
  };
};
