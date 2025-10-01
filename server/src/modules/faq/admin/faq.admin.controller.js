import { asyncHandler } from '../../../shared/utils/asyncHandler.js';
import * as faqService from '../faq.service.js';

// Get all FAQs (admin)
export const getAllFAQs = asyncHandler(async (req, res) => {
  const { page, limit, category, isActive, search } = req.query;
  
  const result = await faqService.getAllFAQsService({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 20,
    category,
    isActive: isActive !== undefined ? isActive === 'true' : null,
    search
  });
  
  res.json({
    success: true,
    ...result
  });
});

// Create FAQ
export const createFAQ = asyncHandler(async (req, res) => {
  const faq = await faqService.createFAQService(req.body);
  
  res.status(201).json({
    success: true,
    data: faq,
    message: 'FAQ created successfully'
  });
});

// Update FAQ
export const updateFAQ = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const faq = await faqService.updateFAQService(id, req.body);
  
  res.json({
    success: true,
    data: faq,
    message: 'FAQ updated successfully'
  });
});

// Delete FAQ
export const deleteFAQ = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await faqService.deleteFAQService(id);
  
  res.json({
    success: true,
    message: 'FAQ deleted successfully'
  });
});

// Get FAQ by ID
export const getFAQ = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const faq = await faqService.getFAQByIdService(id);
  
  res.json({
    success: true,
    data: faq
  });
});

// Bulk create FAQs (for importing)
export const bulkCreateFAQs = asyncHandler(async (req, res) => {
  const { faqs } = req.body;
  
  if (!Array.isArray(faqs)) {
    return res.status(400).json({
      success: false,
      message: 'FAQs must be an array'
    });
  }
  
  const results = [];
  const errors = [];
  
  for (let i = 0; i < faqs.length; i++) {
    try {
      const faq = await faqService.createFAQService(faqs[i]);
      results.push(faq);
    } catch (error) {
      errors.push({
        index: i,
        error: error.message,
        data: faqs[i]
      });
    }
  }
  
  res.json({
    success: true,
    data: {
      created: results,
      errors: errors,
      summary: {
        total: faqs.length,
        created: results.length,
        failed: errors.length
      }
    }
  });
});

// Toggle FAQ status
export const toggleFAQStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const faq = await faqService.getFAQByIdService(id);
  const updatedFAQ = await faqService.updateFAQService(id, {
    isActive: !faq.isActive
  });
  
  res.json({
    success: true,
    data: updatedFAQ,
    message: `FAQ ${updatedFAQ.isActive ? 'activated' : 'deactivated'} successfully`
  });
});

// Get FAQ analytics
export const getFAQAnalytics = asyncHandler(async (req, res) => {
  const analytics = await faqService.getFAQAnalyticsService();
  
  res.json({
    success: true,
    data: analytics
  });
});