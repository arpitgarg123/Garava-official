import { logger } from '../shared/logger.js';

export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        console.log('Authorization: No user or role found');
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      // Handle both string and array of roles
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      
      if (!roles.includes(req.user.role)) {
        console.log(`Authorization: User role '${req.user.role}' not in allowed roles:`, roles);
        return res.status(403).json({
          message: 'Forbidden: Insufficient permissions',
        });
      }
      
      console.log(`Authorization: User '${req.user.id}' with role '${req.user.role}' authorized`);
      next();
    } catch (error) {
      logger.error('Authorization error', error);
      res.status(500).json({ message: 'Server error in authorization' });
    }
  };
};
