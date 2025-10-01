import { logger } from '../shared/logger.js';
import { verifyAccessToken } from '../modules/auth/token.service.js';

export const authenticated = (req, res, next) => {
  try {
    let token = null;
    
    // Try to get token from cookies first (primary method)
    if (req.cookies.token) {
      token = req.cookies.token;
      console.log('Auth: Using cookie token');
    } 
    // Fallback to Authorization header (for API clients)
    else if (req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log('Auth: Using Bearer token');
      }
    }
    
    if (!token) {
      console.log('Auth: No token found in cookies or headers');
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      console.log('Auth: Token verification failed');
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    console.log('Auth: Token verified successfully for user:', decoded.id);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Auth error:', error);
    console.log('Auth: Error during authentication:', error.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
 