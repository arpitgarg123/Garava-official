import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import * as service from "./cart.service.js";
import ApiError from "../../shared/utils/ApiError.js";
import { toRupees } from "../order/order.pricing.js";

/**
 * Convert cart prices from paise to rupees for frontend response
 */
const convertCartPricesToRupees = (cart) => {
  if (!cart) return cart;
  
  return {
    ...cart,
    items: cart.items?.map(item => ({
      ...item,
      unitPrice: toRupees(item.unitPrice || 0),
      mrp: toRupees(item.mrp || 0)
    })) || [],
    totalAmount: toRupees(cart.totalAmount || 0)
  };
};

export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const cart = await service.getCartService(userId);
  const cartWithRupees = convertCartPricesToRupees(cart);
  res.json({ success: true, cart: cartWithRupees });
});

export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const payload = req.body;
  const cart = await service.addToCartService(userId, payload);
  const cartWithRupees = convertCartPricesToRupees(cart);
  res.status(201).json({ success: true, cart: cartWithRupees });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const payload = req.body;
  const cart = await service.updateCartItemService(userId, payload);
  const cartWithRupees = convertCartPricesToRupees(cart);
  res.json({ success: true, cart: cartWithRupees });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { productId, variantId, variantSku } = req.query;
  if (!productId || !(variantId || variantSku)) throw new ApiError(400, "productId and variantId or variantSku required");
  const cart = await service.removeCartItemService(userId, { productId, variantId, variantSku });
  const cartWithRupees = convertCartPricesToRupees(cart);
  res.json({ success: true, cart: cartWithRupees });
});

export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const cart = await service.clearCartService(userId);
  const cartWithRupees = convertCartPricesToRupees(cart);
  res.json({ success: true, cart: cartWithRupees });
});
