import ApiError from "../../shared/utils/ApiError.js";
import Wishlist from "./wishlist.model.js";
import Product from "../product/product.model.js";
import mongoose from "mongoose";
import { toRupees } from "../order/order.pricing.js";

/**
 * Convert wishlist product prices from paise to rupees
 */
const convertWishlistProductPrices = (product) => {
  if (!product) return null;
  
  // Convert variant prices to rupees
  if (product.variants && Array.isArray(product.variants)) {
    product.variants = product.variants.map(variant => ({
      ...variant,
      price: variant.price ? toRupees(variant.price) : variant.price,
      mrp: variant.mrp ? toRupees(variant.mrp) : variant.mrp,
      salePrice: variant.salePrice ? toRupees(variant.salePrice) : variant.salePrice
    }));
  }
  
  return product;
};

/**
 * Get wishlist for user (paginated)
 * page, limit optional
 * returns { products: [populated product objects], pagination }
 */
export const getWishlistService = async (userId, { page = 1, limit = 50 } = {}) => {
  if (!userId) throw new ApiError(401, "Unauthorized");

  // Ensure we have integer pagination
  page = parseInt(page, 10) || 1;
  limit = Math.min(parseInt(limit, 10) || 50, 500);

  const skip = (page - 1) * limit;

  // find wishlist doc
  const wishlist = await Wishlist.findOne({ user: userId })
    .populate({
      path: "products.product",
      select: "name slug heroImage gallery variants type isActive status",
      options: { lean: true }
    })
    .lean();

  if (!wishlist) {
    return { products: [], pagination: { total: 0, page, limit, totalPages: 0 } };
  }

  const total = wishlist.products.length;
  const totalPages = Math.ceil(total / limit);
  // slice for pagination in memory (wishlist array is typically small). If large, consider normalized model per product entry.
  const items = wishlist.products
    .slice(skip, skip + limit)
    .map((p) => {
      return {
        productId: p.product?._id || null,
        addedAt: p.addedAt,
        product: convertWishlistProductPrices(p.product) || null,
      };
    });

  return {
    products: items,
    pagination: { total, page, limit, totalPages },
  };
};

/**
 * Add product to wishlist (idempotent)
 */
export const addToWishlistService = async (userId, productId) => {
  if (!userId) throw new ApiError(401, "Unauthorized");
  if (!productId || !mongoose.isValidObjectId(productId)) throw new ApiError(400, "Invalid productId");

  // Verify product exists & active
  const product = await Product.findById(productId).lean();
  if (!product || !product.isActive || product.status === "archived") {
    throw new ApiError(404, "Product not available");
  }

  // Upsert wishlist doc and push if not present
  const doc = await Wishlist.findOne({ user: userId });

  if (!doc) {
    const created = await Wishlist.create({ user: userId, products: [{ product: productId }] });
    return created.toObject();
  }

  const exists = doc.products.some((p) => String(p.product) === String(productId));
  if (exists) {
    return doc.toObject();
  }

  doc.products.push({ product: productId });
  await doc.save();
  return doc.toObject();
};

/**
 * Remove product from wishlist
 */
export const removeFromWishlistService = async (userId, productId) => {
  if (!userId) throw new ApiError(401, "Unauthorized");
  if (!productId || !mongoose.isValidObjectId(productId)) throw new ApiError(400, "Invalid productId");

  const doc = await Wishlist.findOne({ user: userId });
  if (!doc) return { removed: false }; // nothing to do

  const before = doc.products.length;
  doc.products = doc.products.filter((p) => String(p.product) !== String(productId));
  if (doc.products.length === before) {
    return { removed: false };
  }
  await doc.save();
  return { removed: true };
};

// Toggle product in wishlist: add if not present, remove if present

export const toggleWishlistService = async (userId, productId) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [{ product: productId }] });
    return { action: "added", wishlist };
  }

  const exists = wishlist.products.some((p) => String(p.product) === String(productId));
  if (exists) {
    wishlist.products = wishlist.products.filter(
      (p) => String(p.product) !== String(productId)
    );
    await wishlist.save();
    return { action: "removed", wishlist };
  } else {
    wishlist.products.push({ product: productId });
    await wishlist.save();
    return { action: "added", wishlist };
  }
};

