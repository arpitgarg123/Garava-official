import { Router } from 'express';
import { 
  getFeaturedPosts, 
  getAllPosts, 
  createPost, 
  updatePost, 
  deletePost, 
  togglePostStatus 
} from './instagram.controller.js';
import { authorize } from '../../middlewares/authorize.js';
import { authenticated } from '../../middlewares/authentication.js';
import { uploadMiddleware } from '../../shared/multer.js';

const router = Router();

// Public routes
router.get('/featured', getFeaturedPosts);

// Admin routes - require authentication
router.use(authenticated);
router.use(authorize('admin'));
router.get('/', getAllPosts);
router.post('/', uploadMiddleware.single('image'), createPost);
router.put('/:id', uploadMiddleware.single('image'), updatePost);
router.delete('/:id', deletePost);
router.patch('/:id/toggle', togglePostStatus);

export default router;