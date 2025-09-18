import ApiError from "../../shared/utils/ApiError.js";
import mongoose from "mongoose";
import Cart from "./cart.model.js";
import Product from "../product/product.model.js";
import { toPaise, calcCartTotal } from "./cart.utils.js";

/**
 * Fetch (or create) cart for user (returns plain object)
 */
export const getCartService = async (userId) => {
  if (!userId) throw new ApiError(401, "Unauthorized");
  let cart = await Cart.findOne({ user: userId }).lean();
  if (!cart) return { user: userId, items: [], totalAmount: 0 };
  return cart;
};

/**
 * Add product variant to cart (or increase quantity)
 * payload: { productId, variantId, variantSku, quantity }
 */
export const addToCartService = async (userId, payload) => {
  if (!userId) throw new ApiError(401, "Unauthorized");
  const { productId, variantId, variantSku, quantity } = payload || {};

  if (!productId || !(variantId || variantSku)) throw new ApiError(400, "productId and variantId or variantSku required");
  const qty = Number(quantity || 1);
  if (!Number.isInteger(qty) || qty <= 0) throw new ApiError(400, "quantity must be a positive integer");

  // validate product + variant
  const product = await Product.findById(productId).lean();
  if (!product) throw new ApiError(404, "Product not found");

  let variant = null;
  if (variantId) {
    if (!mongoose.isValidObjectId(variantId)) throw new ApiError(400, "Invalid variantId");
    variant = product.variants.find((v) => String(v._id) === String(variantId));
  } else {
    variant = product.variants.find((v) => String(v.sku) === String(variantSku));
  }
  if (!variant) throw new ApiError(404, "Variant not found");

  // check stock (note: cart doesn't reserve stock; do reservation at checkout)
  if (variant.stock < qty) throw new ApiError(400, `Insufficient stock. Available ${variant.stock}`);

  // atomic-ish update approach: load cart doc, modify and save
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const existingIndex = cart.items.findIndex(
    (i) => String(i.product) === String(productId) && String(i.variantId) === String(variant._id)
  );

  if (existingIndex > -1) {
    // increase quantity after stock check (ensure total does not exceed stock)
    const existing = cart.items[existingIndex];
    const newQty = existing.quantity + qty;
    if (variant.stock < newQty) throw new ApiError(400, `Insufficient stock for desired quantity. Available ${variant.stock}`);
    existing.quantity = newQty;
    existing.unitPrice = toPaise(variant.price); // ensure paise
    existing.mrp = variant.mrp ? toPaise(variant.mrp) : 0;
    existing.outOfStock = variant.stock <= 0;
  } else {
    cart.items.push({
      product: productId,
      variantId: variant._id,
      variantSku: variant.sku,
      quantity: qty,
      unitPrice: toPaise(variant.price),
      mrp: variant.mrp ? toPaise(variant.mrp) : 0,
      name: product.name,
      heroImage: product.heroImage?.url || null,
      outOfStock: variant.stock <= 0,
    });
  }

  cart.totalAmount = calcCartTotal(cart.items);
  await cart.save();
  return cart.toObject();
};

/**
 * Update cart item: set quantity or remove
 * payload: { productId, variantId, variantSku, quantity }
 */
export const updateCartItemService = async (userId, payload) => {
  if (!userId) throw new ApiError(401, "Unauthorized");
  const { productId, variantId, variantSku, quantity } = payload || {};
  if (!productId || !(variantId || variantSku)) throw new ApiError(400, "productId and variantId or variantSku required");

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, "Cart not found");

  const idx = cart.items.findIndex(
    (i) => String(i.product) === String(productId) && (variantId ? String(i.variantId) === String(variantId) : String(i.variantSku) === String(variantSku))
  );
  if (idx === -1) throw new ApiError(404, "Item not in cart");

  const item = cart.items[idx];

  if (quantity === undefined || quantity === null) throw new ApiError(400, "quantity is required");
  const q = Number(quantity);
  if (!Number.isInteger(q) || q < 0) throw new ApiError(400, "quantity must be integer >= 0");

  if (q === 0) {
    // remove item
    cart.items.splice(idx, 1);
  } else {
    // validate stock against product variant latest data
    const product = await Product.findById(productId).lean();
    if (!product) throw new ApiError(404, "Product not found during update");
    const variant = product.variants.find((v) => (variantId ? String(v._id) === String(variantId) : String(v.sku) === String(variantSku)));
    if (!variant) throw new ApiError(404, "Variant not found during update");

    if (variant.stock < q) throw new ApiError(400, `Insufficient stock. Available ${variant.stock}`);
    item.quantity = q;
    item.unitPrice = toPaise(variant.price);
    item.mrp = variant.mrp ? toPaise(variant.mrp) : 0;
    item.outOfStock = variant.stock <= 0;
  }

  cart.totalAmount = calcCartTotal(cart.items);
  await cart.save();
  return cart.toObject();
};

/**
 * Remove single item (by query)
 * { productId, variantIdOrSku }
 */
export const removeCartItemService = async (userId, { productId, variantId, variantSku }) => {
  if (!userId) throw new ApiError(401, "Unauthorized");
  if (!productId || !(variantId || variantSku)) throw new ApiError(400, "productId and variantId or variantSku required");

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, "Cart not found");

  cart.items = cart.items.filter(
    (i) => !(String(i.product) === String(productId) && (variantId ? String(i.variantId) === String(variantId) : String(i.variantSku) === String(variantSku)))
  );

  cart.totalAmount = calcCartTotal(cart.items);
  await cart.save();
  return cart.toObject();
};

/**
 * Clear the entire cart
 */
export const clearCartService = async (userId) => {
  if (!userId) throw new ApiError(401, "Unauthorized");
  const cart = await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [], totalAmount: 0 } }, { new: true });
  if (!cart) {
    // return empty representation
    return { user: userId, items: [], totalAmount: 0 };
  }
  return cart.toObject();
};
