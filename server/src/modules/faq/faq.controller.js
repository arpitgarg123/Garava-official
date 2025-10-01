import { asyncHandler } from '../../shared/utils/asyncHandler.js';
import * as faqService from './faq.service.js';

// Public API for chatbot
export const searchFAQs = asyncHandler(async (req, res) => {
  const { q: query, category } = req.query;
  
  const result = await faqService.getChatbotFAQsService(query, category);
  
  res.json({
    success: true,
    data: result.faqs,
    total: result.total
  });
});

// Record FAQ match for analytics
export const recordMatch = asyncHandler(async (req, res) => {
  const { id } = req.params; 
  
  await faqService.recordFAQMatchService(id);
  
  res.json({
    success: true,
    message: 'Match recorded successfully'
  });
});

// Vote on FAQ helpfulness
export const voteFAQ = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { helpful } = req.body;
  
  const faq = await faqService.voteFAQService(id, helpful);
  
  res.json({
    success: true,
    data: faq
  });
});

// Get FAQ categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await faqService.getFAQCategoriesService();
  
  res.json({
    success: true,
    data: categories
  });
});