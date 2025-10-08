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
import passport from './config/passport.js'; // Import passport configuration
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
import blogRouter from "./modules/blogs/blog.router.js";
import blogAdminRouter from "./modules/blogs/admin/blog.admin.router.js";
import faqRouter from "./modules/faq/faq.router.js";
import faqAdminRouter from "./modules/faq/admin/faq.admin.router.js";
import notificationRouter from "./modules/notification/notification.router.js";
import newseventsRouter from "./modules/newsevents/newsevents.router.js";
import newseventsAdminRouter from "./modules/newsevents/admin/newsevents.admin.router.js";
import contactRouter from "./modules/contact/contact.router.js";
import testimonialRouter from "./modules/testimonial/testimonial.router.js";
import instagramRouter from "./modules/instagram/instagram.router.js";

  // routers
  const app = express();
  const port = env.PORT || 10000;

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:", "data:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: [
          "'self'", 
          "data:", 
          "https://ik.imagekit.io",
          "https://*.imagekit.io",
          "https:",
          "http:"
        ],
        fontSrc: ["'self'", "data:", "https:", "http:"],
        connectSrc: ["'self'", "https:", "http:", "ws:", "wss:"],
        mediaSrc: ["'self'", "https:", "http:", "data:"],
        objectSrc: ["'none'"],
        frameSrc: ["'self'", "https:"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));
  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // In production, allow your domain and localhost for development
        const allowedOrigins = [
          'http://localhost:5173', // Development
          'http://localhost:3000', // Development
          env.CLIENT_URL, // Production URL from environment
          'https://garava-official.onrender.com', // Your Render URL
        ].filter(Boolean); // Remove undefined values
        
        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
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
  
  // Add session configuration for better cookie handling
  app.use((req, res, next) => {
    // Set security headers for cookies
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests 
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
      res.sendStatus(200);
    } else {
      next();
    }
  }); 
  app.use((req, res, next) => {
    // Set security headers for cookies
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
      res.sendStatus(200);
    } else {
      next();
    }
  });
  
  // Initialize Passport
  app.use(passport.initialize());

  // Serve static files from the React app build (excluding API routes)
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    express.static(path.join(__dirname, '../public'))(req, res, next);
  });

  if (env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
  } else {
    app.use(morgan('dev'));
  }

  // General API rate limiter - more generous for normal usage
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased for development and normal usage
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    }
  });

  // More generous limiter for auth endpoints during development
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes  
    max: env.NODE_ENV === 'production' ? 100 : 500, // More generous in development
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Too many authentication requests, please try again later.',
      retryAfter: '15 minutes'
    },
    // Skip rate limiting for specific OAuth endpoints in development
    skip: (req) => {
      if (env.NODE_ENV !== 'production') {
        // Skip rate limiting for Google OAuth in development
        return req.path.includes('/google');
      }
      return false;
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
  app.use("/api/orders", orderRouter);
  app.use("/api/admin/order", adminOrderRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/wishlist", wishlistRouter);
  app.use("/api/reviews", reviewRouter);
  app.use("/api/appointment", appointmentRouter);
  app.use("/api/blog", blogRouter);
  app.use("/api/newsletter", newsletterRouter);
  app.use("/api/admin/blog", blogAdminRouter);
  app.use("/api/faq", faqRouter);
  app.use("/api/admin/faq", faqAdminRouter);
  app.use("/api/admin/notifications", notificationRouter);
  app.use("/api/newsevents", newseventsRouter);
  app.use("/api/admin/newsevents", newseventsAdminRouter);
  app.use("/api/contact", contactRouter);
  app.use("/api/testimonials", testimonialRouter);
  app.use("/api/instagram", instagramRouter);

  // Catch all handler: send back React's index.html file for client-side routing
  // Only for non-API routes
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

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