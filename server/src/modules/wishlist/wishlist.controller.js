import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import * as service from "./wishlist.service.js";

export const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const data = await service.getWishlistService(userId, { page, limit });
  res.json({ success: true, ...data });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { productId } = req.params;
  const doc = await service.addToWishlistService(userId, productId);
  res.status(201).json({ success: true, wishlist: doc });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { productId } = req.params;
  const result = await service.removeFromWishlistService(userId, productId);
  res.json({ success: true, ...result });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  const result = await service.toggleWishlistService(userId, productId);
  res.json({ success: true, ...result });
});
