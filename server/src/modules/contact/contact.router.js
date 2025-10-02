import express from "express";
import rateLimit from "express-rate-limit";
import { submitContactForm } from "./contact.controller.js";

const router = express.Router();

// Rate limiting for contact form - prevent spam
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Max 3 contact form submissions per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many contact form submissions. Please try again later.",
    retryAfter: "15 minutes"
  }
});

// POST /api/contact - Submit contact form
router.post("/", contactLimiter, submitContactForm);

export default router;