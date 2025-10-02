import express from 'express';
import * as testimonialController from './testimonial.controller.js';
import { authenticated } from '../../middlewares/authentication.js';
import { authorize } from '../../middlewares/authorize.js';

const router = express.Router();

// Public routes
router.get('/', testimonialController.getTestimonials);
router.get('/featured', testimonialController.getFeaturedTestimonials);
router.get('/latest', testimonialController.getLatestTestimonials);
router.get('/:id', testimonialController.getTestimonialById);

// Admin routes - require authentication and admin role
// CRUD operations
router.post('/', 
  authenticated,
  authorize(['admin']),
  testimonialController.validateTestimonialData,
  testimonialController.createTestimonial
);

router.put('/:id', 
  authenticated,
  authorize(['admin']),
  testimonialController.validateTestimonialData,
  testimonialController.updateTestimonial
);

router.delete('/:id', 
  authenticated,
  authorize(['admin']),
  testimonialController.deleteTestimonial
);

// Status toggles
router.patch('/:id/toggle-status', 
  authenticated,
  authorize(['admin']),
  testimonialController.toggleTestimonialStatus
);

router.patch('/:id/toggle-featured', 
  authenticated,
  authorize(['admin']),
  testimonialController.toggleFeaturedStatus
);

// Bulk operations
router.patch('/bulk/order', 
  authenticated,
  authorize(['admin']),
  testimonialController.bulkUpdateOrder
);

// Google integration
router.post('/google/fetch', 
  authenticated,
  authorize(['admin']),
  testimonialController.validateGoogleFetchData,
  testimonialController.fetchGoogleReviews
);

// Analytics
router.get('/admin/stats', 
  authenticated,
  authorize(['admin']),
  testimonialController.getTestimonialStats
);

export default router;
