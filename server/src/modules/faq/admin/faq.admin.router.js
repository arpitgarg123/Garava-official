import express from 'express';
import * as faqAdminController from './faq.admin.controller.js';
import { authenticated } from '../../../middlewares/authentication.js';
import { authorize } from '../../../middlewares/authorize.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticated);
router.use(authorize(['admin']));

// CRUD operations
router.get('/', faqAdminController.getAllFAQs); 
router.post('/', faqAdminController.createFAQ);
router.get('/:id', faqAdminController.getFAQ);
router.put('/:id', faqAdminController.updateFAQ);
router.delete('/:id', faqAdminController.deleteFAQ);

// Bulk operations
router.post('/bulk', faqAdminController.bulkCreateFAQs);

// Toggle status
router.patch('/:id/toggle', faqAdminController.toggleFAQStatus);

// Analytics
router.get('/analytics', faqAdminController.getFAQAnalytics);

export default router;