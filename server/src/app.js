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
import { errorHandler } from './shared/utils/errorHandler.js';

// router imports
import authRouter from './modules/auth/auth.router.js';
import userRouter from './modules/user/user.router.js';
import orderRouter from "./modules/order/order.router.js";
import addressRouter from "./modules/address/address.router.js";
import adminProductRouter from "./modules/product/admin/product.admin.router.js";
import productRouter from "./modules/product/product.router.js";
import adminOrderRouter from "./modules/order/admin/order.admin.router.js";
import cartRouter from "./modules/cart/cart.router.js"; 
import wishlistRouter from "./modules/wishlist/wishlist.router.js";
import reviewRouter from "./modules/review/review.router.js";
import appointmentRouter from "./modules/appointment/appointment.router.js";
import newsletterRouter from "./modules/newsletter/newsletter.router.js";

  // routers
  const app = express();
  const port = env.PORT || 3000;

  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    })
  );

 app.use(express.json({
  verify: (req, res, buf) => {
    if (buf && buf.length) {
      req.rawBody = buf.toString("utf8");
    }
  },
  limit: "1mb"
}));

 app.use(express.urlencoded({ extended: true, verify: (req, res, buf) => { req.rawBody = buf.toString("utf8"); } }));
  app.use(cookieParser());

  if (env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
  } else {
    app.use(morgan('dev'));
  }

  // General API rate limiter - more generous for normal usage
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Increased from 100 to 500 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    }
  });

  // Stricter limiter for auth endpoints to prevent abuse
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes  
    max: 50, // 50 auth requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Too many authentication requests, please try again later.',
      retryAfter: '15 minutes'
    }
  });

  app.use('/api', generalLimiter);
  app.use('/api/auth', authLimiter);

  app.get('/healthz', (_, res) =>
    res.json({
      status: 'ok',
      uptime: process.uptime(),
    })
  );

  // routes

  app.use('/api/auth', authRouter);
  app.use('/api/user', userRouter);
  app.use("/api/address", addressRouter); 
  app.use("/api/admin/product", adminProductRouter);
  app.use("/api/product", productRouter);
  app.use("/api/order", orderRouter);
  app.use("/api/admin/order", adminOrderRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/wishlist", wishlistRouter);
  app.use("/api/reviews", reviewRouter);
  app.use("/api/appointment", appointmentRouter);
  app.use("/api/newsletter", newsletterRouter);

  // global error handler
  app.use(errorHandler);

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
  
 