import { Router } from "express";
import {
  createOrUpdateReview,
  listReviews,
  updateReview,
  deleteReview,
  voteHelpful,
  adminListReviews,
  adminModerate
} from "./review.controller.js";
import { authenticated } from "../../middlewares/authentication.js";
import { authorize } from "../../middlewares/authorize.js";

const router = Router();

// Public listing
router.get("/", listReviews);

// Auth required for user actions
router.post("/:productId", authenticated, createOrUpdateReview); 
router.put("/:reviewId", authenticated, updateReview);
router.post("/:reviewId/vote", authenticated, voteHelpful);

// Admin
router.get("/admin", authenticated, authorize("admin"), adminListReviews);
router.post("/admin/:reviewId/moderate", authenticated, authorize("admin"), adminModerate);
router.delete("/:reviewId", authenticated, authorize("admin"), deleteReview);

export default router;
