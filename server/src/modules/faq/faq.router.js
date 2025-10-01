import express from 'express';
import * as faqController from './faq.controller.js';

const router = express.Router();

// Public routes for chatbot
router.get('/search', faqController.searchFAQs);
router.get('/categories', faqController.getCategories);
router.post('/:id/match', faqController.recordMatch);
router.post('/:id/vote', faqController.voteFAQ);

export default router;