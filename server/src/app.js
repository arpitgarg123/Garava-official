  import express from 'express';
  import dotenv from 'dotenv';
  dotenv.config();

  import connectDb from './shared/db.js';
  import cors from 'cors';
  import cookieParser from 'cookie-parser';
  import morgan from 'morgan';
  import helmet from 'helmet';
  import rateLimit from 'express-rate-limit';
  import { env } from './config/env.js';
  import { logger } from './shared/logger.js'; 

  // routers

  const app = express();
  const port = env.PORT || 3000;

  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  if (env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
  } else {
    app.use(morgan('dev'));
  }

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api', limiter);

  app.get('/healthz', (_, res) =>
    res.json({
      status: 'ok',
      uptime: process.uptime(),
    })
  );

  const start = async () => {
    try {
      await connectDb();
      app.listen(port, () => {
        logger.info(`Server running on http://localhost:${env.PORT}`);
      });
    } catch (err) {
      logger.error('server failed to start', err);
      process.exit(1);
    }
  };

  // graceful shutdown
  process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully...');
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully...');
    process.exit(0);
  }); 

  start();
  export default app; 
 