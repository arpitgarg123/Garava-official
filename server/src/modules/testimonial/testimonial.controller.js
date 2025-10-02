import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import * as testimonialService from './testimonial.service.js';
import ApiError from '../../shared/utils/ApiError.js';

// Public endpoints
export const getTestimonials = asyncHandler(async (req, res) => {
  const result = await testimonialService.getTestimonialsService(req.query);
  res.json({
    success: true,
    data: result
  });
});

export const getFeaturedTestimonials = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 8;
  const testimonials = await testimonialService.getFeaturedTestimonialsService(limit);
  res.json({
    success: true,
    data: testimonials
  });
});

export const getLatestTestimonials = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const testimonials = await testimonialService.getLatestTestimonialsService(limit);
  res.json({
    success: true,
    data: testimonials
  });
});

export const getTestimonialById = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.getTestimonialByIdService(req.params.id);
  res.json({
    success: true,
    data: testimonial
  });
});

// Admin endpoints
export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonialData = {
    ...req.body,
    source: 'manual'
  };
  
  const testimonial = await testimonialService.createTestimonialService(testimonialData);
  res.status(201).json({
    success: true,
    message: 'Testimonial created successfully',
    data: testimonial
  });
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.updateTestimonialService(
    req.params.id,
    req.body
  );
  res.json({
    success: true,
    message: 'Testimonial updated successfully',
    data: testimonial
  });
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  await testimonialService.deleteTestimonialService(req.params.id);
  res.json({
    success: true,
    message: 'Testimonial deleted successfully'
  });
});

export const toggleTestimonialStatus = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.toggleTestimonialStatusService(req.params.id);
  res.json({
    success: true,
    message: 'Testimonial status updated successfully',
    data: testimonial
  });
});

export const toggleFeaturedStatus = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.toggleFeaturedStatusService(req.params.id);
  res.json({
    success: true,
    message: 'Featured status updated successfully',
    data: testimonial
  });
});

export const bulkUpdateOrder = asyncHandler(async (req, res) => {
  const { updates } = req.body;
  
  if (!Array.isArray(updates)) {
    throw new ApiError(400, 'Updates must be an array');
  }

  await testimonialService.bulkUpdateOrderService(updates);
  res.json({
    success: true,
    message: 'Order updated successfully'
  });
});

// Google Integration
export const fetchGoogleReviews = asyncHandler(async (req, res) => {
  const result = await testimonialService.fetchGoogleReviewsService();
  res.json({
    success: true,
    message: `Successfully imported ${result.imported} testimonials from Google`,
    data: result
  });
});

// Analytics
export const getTestimonialStats = asyncHandler(async (req, res) => {
  const stats = await testimonialService.getTestimonialStatsService();
  res.json({
    success: true,
    data: stats
  });
});

// Validation middleware
export const validateTestimonialData = (req, res, next) => {
  const { name, content, rating } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Name is required'
    });
  }
  
  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Content is required'
    });
  }
  
  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5'
    });
  }
  
  next();
};

export const validateGoogleFetchData = (req, res, next) => {
  // No validation needed as we're using environment variables
  next();
};
