import ApiError from "../../shared/utils/ApiError.js";
import mongoose from "mongoose";
import Cart from "./cart.model.js";
import Product from "../product/product.model.js";
import { toPaise, calcCartTotal } from "./cart.utils.js";
import { createOutOfStockNotificationService, createLowStockNotificationService } from "../notification/notification.service.js";
import { getVariantStock, STOCK_STATUS } from "../../shared/stockManager.js";

/**
 * Validate and fix cart items with incorrect variant IDs
 */
const validateAndFixCartItems = async (cart) => {
  let hasChanges = false; 
  
  for (const item of cart.items) {
    try {
      const product = await Product.findById(item.product);
      if (!product) continue;
      
      // Check if the current variantId is valid
      const validVariant = product.variants.find(v => String(v._id) === String(item.variantId));
      
      if (!validVariant && item.variantSku) {
        // Try to find by SKU and update the variantId
        const variantBySku = product.variants.find(v => String(v.sku) === String(item.variantSku));
        if (variantBySku) {
          console.log(`Cart: Fixed variant ID for SKU ${item.variantSku}`);
          item.variantId = variantBySku._id;
          hasChanges = true; 
        }   
      }
    } catch (error) {
      console.error('Error validating cart item:', error);
    }
  }
  
  if (hasChanges) {
    await cart.save();
  }
  
  return cart;
};

/**
 * Fetch (or create) cart for user (returns plain object)
 */
export const getCartService = async (userId) => {
  if (!userId) throw new ApiError(401, "Unauthorized");
  let cart = await Cart.findOne({ user: userId });
  if (!cart) return { user: userId, items: [], totalAmount: 0 };
  
  // Validate and fix cart items if needed
  await validateAndFixCartItems(cart);
  
  return cart.toObject();
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
  const product = await Product.findById(productId); // Remove .lean() to preserve _id fields
  if (!product) throw new ApiError(404, "Product not found");

  let variant = null;
  let variantObjectId = null;
  
  if (variantId) {
    if (!mongoose.isValidObjectId(variantId)) throw new ApiError(400, "Invalid variantId");
    variant = product.variants.find((v) => String(v._id) === String(variantId));
    variantObjectId = variantId;
  } else {
    variant = product.variants.find((v) => String(v.sku) === String(variantSku));
    // Get the ObjectId from the found variant
    variantObjectId = variant?._id;
  }
  
  if (!variant) throw new ApiError(404, "Variant not found");
  
  // Ensure we have a valid ObjectId for the variant
  if (!variantObjectId) {
    throw new ApiError(500, "Variant ID could not be determined");
  }

  // Validate stock using centralized system
  const stockInfo = await getVariantStock({
    variantId: variantObjectId,
    variantSku,
    productId
  });

  if (stockInfo.status === STOCK_STATUS.NOT_FOUND) {
    throw new ApiError(404, "Product variant not found");
  }

  if (!stockInfo.available || stockInfo.stock < qty) {
    // Create out-of-stock notification if needed
    if (stockInfo.stock === 0) {
      try {
        await createOutOfStockNotificationService(product, variant);
      } catch (notifError) {
        console.error('Failed to create out-of-stock notification:', notifError);
        // Don't fail the cart operation if notification fails
      }
    }
    
    throw new ApiError(400, `Insufficient stock. Available ${stockInfo.stock}`);
  }

  // Check for low stock and create notification
  const LOW_STOCK_THRESHOLD = 5;
  if (stockInfo.stock <= LOW_STOCK_THRESHOLD && stockInfo.stock > 0) {
    try {
      await createLowStockNotificationService(product, variant, LOW_STOCK_THRESHOLD);
    } catch (notifError) {
      console.error('Failed to create low stock notification:', notifError);
      // Don't fail the cart operation if notification fails
    }
  }

  // atomic-ish update approach: load cart doc, modify and save
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const existingIndex = cart.items.findIndex(
    (i) => String(i.product) === String(productId) && String(i.variantId) === String(variantObjectId)
  );

  if (existingIndex > -1) {
    // increase quantity after stock check (ensure total does not exceed stock)
    const existing = cart.items[existingIndex];
    const newQty = existing.quantity + qty;
    if (stockInfo.stock < newQty) throw new ApiError(400, `Insufficient stock for desired quantity. Available ${stockInfo.stock}`);
    existing.quantity = newQty;
    existing.unitPrice = toPaise(variant.price); // ensure paise
    existing.mrp = variant.mrp ? toPaise(variant.mrp) : 0;
    existing.outOfStock = stockInfo.stock <= 0;
  } else {
    cart.items.push({
      product: productId,
      variantId: variantObjectId,
      variantSku: variant.sku,
      quantity: qty,
      unitPrice: toPaise(variant.price),
      mrp: variant.mrp ? toPaise(variant.mrp) : 0,
      name: product.name,
      heroImage: product.heroImage?.url || null,
      outOfStock: stockInfo.stock <= 0,
    });
  }

  cart.totalAmount = calcCartTotal(cart.items);
  await cart.save();

  // After successful cart update, check if we need to create stock notifications
  try {
    // Get updated variant stock level from database to ensure accuracy
    const updatedProduct = await Product.findById(productId); // Remove .lean() here too
    if (updatedProduct) {
      const updatedVariant = updatedProduct.variants.find(v => 
        String(v._id) === String(variantObjectId)
      );
      
      if (updatedVariant) {
        // Calculate remaining stock after this cart operation (simulated)
        const remainingStock = updatedVariant.stock - qty;
        
        // Create out-of-stock notification if stock will be depleted
        if (remainingStock <= 0) {
          await createOutOfStockNotificationService(updatedProduct, updatedVariant);
        }
        // Create low stock notification if stock is getting low
        else if (remainingStock <= 5) {
          await createLowStockNotificationService(updatedProduct, updatedVariant, 5);
        }
      }
    }
  } catch (notifError) {
    console.error('Failed to create post-cart stock notifications:', notifError);
    // Don't fail the cart operation
  }

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
    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found during update");
    
    // Try to find variant by ID first, then fallback to SKU
    let variant = null;
    if (variantId) {
      variant = product.variants.find((v) => String(v._id) === String(variantId));
    }
    
    // If not found by ID, try to find by SKU
    if (!variant && variantSku) {
      variant = product.variants.find((v) => String(v.sku) === String(variantSku));
      
      // If found by SKU, update the cart item with correct variantId
      if (variant) {
        console.log('Cart: Fixing variant ID mismatch, updating to correct ID');
        item.variantId = variant._id;
      }
    }
    
    if (!variant) {
      throw new ApiError(404, `Variant not found. Product ${productId}, Variant ID: ${variantId}, SKU: ${variantSku}`);
    }

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
