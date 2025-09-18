import ApiError from "../../shared/utils/ApiError.js";
import Review from "./review.model.js";
import Product from "../product/product.model.js";
import Order from "../order/order.model.js";
import mongoose from "mongoose";

/**
 * Recompute aggregate rating for product
 */
export const recomputeProductRating = async (productId) => {
  const res = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId), isActive: true, isApproved: true } },
    { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } }
  ]);
  const agg = res[0] || { avg: 0, count: 0 };
  await Product.findByIdAndUpdate(productId, {
    avgRating: Math.round(agg.avg * 10) / 10 || 0,
    reviewCount: agg.count
  });
};
/**
 * Create or replace a user's review for a product (idempotent)
 * options: { autoApprove: boolean, verifyPurchase: boolean }
 */
export const createOrUpdateReview = async (userId, productId, { rating, title, body, photos }) => {
  if (!userId) throw new ApiError(401, "Unauthorized");
  if (!productId) throw new ApiError(400, "productId required");

  rating = Number(rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new ApiError(400, "rating must be integer 1..5");
  }

  const product = await Product.findById(productId).lean();
  if (!product) throw new ApiError(404, "Product not found");

  // ✅ Check verified purchase
  const purchased = await Order.exists({
    user: userId,
    status: "delivered",
    "items.product": productId
  });
  const verifiedPurchase = Boolean(purchased);

  const update = {
    rating,
    title: title?.trim?.() || "",
    body: body?.trim?.() || "",
    photos: photos || [],
    verifiedPurchase,
    isApproved: true, // 👈 auto-approved on creation
    isActive: true,
    updatedBy: userId,
  };

  const opts = { upsert: true, new: true, setDefaultsOnInsert: true };

  const review = await Review.findOneAndUpdate(
    { user: userId, product: productId },
    { $set: update, $setOnInsert: { createdBy: userId } },
    opts
  ).lean();

  // ✅ Always recompute rating (since reviews are instantly visible)
  await recomputeProductRating(productId);

  return review;
};

/**
 * Get reviews (public)
 * supports: productId, page, limit, sort ('recent'|'top'|'helpful'), onlyApproved
 */
export const listReviews = async ({ productId, page = 1, limit = 10, sort = "recent", onlyApproved = true }) => {
  const filter = { isActive: true };
  if (productId) filter.product = productId;
  if (onlyApproved) filter.isApproved = true;

  const skip = (page - 1) * limit;
  let sortOpt = { createdAt: -1 };
  if (sort === "top") sortOpt = { rating: -1, createdAt: -1 };
  if (sort === "helpful") sortOpt = { helpfulCount: -1, createdAt: -1 };

  const [reviews, total] = await Promise.all([
    Review.find(filter).sort(sortOpt).skip(skip).limit(limit).populate("user", "name").lean(),
    Review.countDocuments(filter)
  ]);

  return { reviews, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

/**
 * Update own review (partial)
 */
export const updateReviewService = async (userId, reviewId, updates) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, "Review not found");
  if (String(review.user) !== String(userId)) throw new ApiError(403, "Forbidden");

  const allowed = ["rating", "title", "body", "photos"];
  let changedApproval = false;
  for (const k of Object.keys(updates)) {
    if (!allowed.includes(k)) continue;
    review[k] = updates[k];
  }
  // edits need re-approval if you want moderation (optional)
  if (typeof updates.rating !== "undefined" || updates.title || updates.body) {
    // auto unapprove edit if moderation required
    // review.isApproved = false; // uncomment if edits require re-approval
    changedApproval = true;
  }
  review.updatedBy = userId;
  await review.save();

  if (review.isApproved) await recomputeProductRating(review.product);
  return review.toObject();
};

/**
 * Soft-delete review (user or admin)
 */
export const deleteReviewService = async (reviewId, adminId) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, "Review not found");

  review.isActive = false;   // 👈 soft delete
  review.updatedBy = adminId;
  await review.save();

  // Recompute ratings without this review
  await recomputeProductRating(review.product);

  return true;
};
/**
 * Mark helpful/unhelpful (simple counters, add anti-abuse later)
 */
export const voteHelpfulService = async (userId, reviewId, type = "helpful") => {
  // for production: keep a Vote collection to prevent duplicate votes per user
  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, "Review not found");

  if (type === "helpful") review.helpfulCount = (review.helpfulCount || 0) + 1;
  else review.unhelpfulCount = (review.unhelpfulCount || 0) + 1;

  await review.save();
  return { helpfulCount: review.helpfulCount, unhelpfulCount: review.unhelpfulCount };
};

/**
 * Admin: approve/deny or flag review
 */
export const adminModerateReview = async (adminId, reviewId, { approve, deny, flag, note }) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new ApiError(404, "Review not found");

  if (typeof approve !== "undefined") review.isApproved = Boolean(approve);
  if (typeof deny !== "undefined" && deny === true) review.isApproved = false;
  if (typeof flag !== "undefined") review.flagged = Boolean(flag);
  review.updatedBy = adminId;
  await review.save();

  // recompute product rating when approval changes
  await recomputeProductRating(review.product);
  return review.toObject();
};
