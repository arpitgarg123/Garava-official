import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import * as service from "./cart.service.js";
import ApiError from "../../shared/utils/ApiError.js";

export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const cart = await service.getCartService(userId);
  res.json({ success: true, cart });
});

export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const payload = req.body;
  const cart = await service.addToCartService(userId, payload);
  res.status(201).json({ success: true, cart });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const payload = req.body;
  const cart = await service.updateCartItemService(userId, payload);
  res.json({ success: true, cart });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { productId, variantId, variantSku } = req.query;
  if (!productId || !(variantId || variantSku)) throw new ApiError(400, "productId and variantId or variantSku required");
  const cart = await service.removeCartItemService(userId, { productId, variantId, variantSku });
  res.json({ success: true, cart });
});

export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const cart = await service.clearCartService(userId);
  res.json({ success: true, cart });
});
