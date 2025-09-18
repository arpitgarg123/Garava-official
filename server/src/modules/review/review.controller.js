import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import * as service from "./review.service.js";
import Review from "./review.model.js";

export const createOrUpdateReview = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { productId } = req.params;
  const { rating, title, body, photos } = req.body;
  // server side: determine if should auto-approve (e.g., small threshold) or verify purchase
  const review = await service.createOrUpdateReview(userId, productId, { rating, title, body, photos }, { autoApprove: true, verifyPurchase: false });
  res.status(201).json({ success: true, review });
});

export const listReviews = asyncHandler(async (req, res) => {
  const { productId } = req.query;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const sort = req.query.sort || "recent";
  const data = await service.listReviews({ productId, page, limit, sort, onlyApproved: true });
  res.json({ success: true, ...data });
});

export const updateReview = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const reviewId = req.params.reviewId;
  const updates = req.body;
  const review = await service.updateReviewService(userId, reviewId, updates);
  res.json({ success: true, review });
});

export const deleteReview = asyncHandler(async (req, res) => {
  await service.deleteReviewService(req.params.reviewId, req.user.id);
  res.json({ success: true, message: "Review deleted" });
});

export const voteHelpful = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { reviewId } = req.params;
  const { type } = req.body; // 'helpful'|'unhelpful'
  const result = await service.voteHelpfulService(userId, reviewId, type);
  res.json({ success: true, ...result });
});

// Admin endpoints
export const adminListReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const filter = {}; // add filters from query: product, flagged, isApproved=false
  const { product, flagged, isApproved } = req.query;
  if (product) filter.product = product;
  if (flagged) filter.flagged = flagged === "true";
  if (typeof isApproved !== "undefined") filter.isApproved = isApproved === "true";

  const skip = (page - 1) * limit;
  const [reviews, total] = await Promise.all([
    // admin sees all statuses
    Review.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("user", "name email").lean(),
    Review.countDocuments(filter)
  ]);

  res.json({ success: true, reviews, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }});
});

export const adminModerate = asyncHandler(async (req, res) => {
  const adminId = req.user?.id;
  const reviewId = req.params.reviewId;
  const payload = req.body; // { approve: true|false, flag: true|false, note: "..." }
  const review = await service.adminModerateReview(adminId, reviewId, payload);
  res.json({ success: true, review });
});
