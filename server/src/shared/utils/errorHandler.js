// src/middleware/errorHandler.js
import { env } from '../../config/env.js';

export const errorHandler = (err, req, res, next) => {
  console.error('🔥 Error:', err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
