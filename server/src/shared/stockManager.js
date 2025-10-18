/**
 * Centralized Stock Management System
 * Handles all stock-related operations with proper validation, atomic updates, and consistency
 */

import mongoose from "mongoose";
import Product from "../modules/product/product.model.js";
import ApiError from "./utils/ApiError.js";

/**
 * Stock validation results constants
 */
export const STOCK_STATUS = {
  AVAILABLE: 'available',
  INSUFFICIENT: 'insufficient', 
  OUT_OF_STOCK: 'out_of_stock',
  NOT_FOUND: 'not_found',
  INVALID: 'invalid'
};

/**
 * Get current stock information for a variant
 * @param {Object} params - { variantId, variantSku, productId }
 * @returns {Object} Stock information with current status
 */
export const getVariantStock = async ({ variantId, variantSku, productId }) => {
  try {
    let product, variant;

    // Find product and variant by multiple strategies
    if (variantId) {
      product = await Product.findOne({ "variants._id": variantId });
      if (product) {
        variant = product.variants.find(v => String(v._id) === String(variantId));
      }
    }

    if (!variant && variantSku) {
      // When multiple products have the same SKU, prefer ones with stock > 0
      const productsWithSku = await Product.find({ "variants.sku": variantSku }).sort({ "variants.stock": -1 });
      
      for (const prod of productsWithSku) {
        const var1 = prod.variants.find(v => String(v.sku) === String(variantSku));
        if (var1 && var1._id && var1.stock > 0) {
          product = prod;
          variant = var1;
          break;
        }
      }
      
      // If no variant with stock > 0 found, use the first available variant
      if (!variant && productsWithSku.length > 0) {
        for (const prod of productsWithSku) {
          const var1 = prod.variants.find(v => String(v.sku) === String(variantSku));
          if (var1 && var1._id) {
            product = prod;
            variant = var1;
            break;
          }
        }
      }
    }

    if (!variant && productId) {
      product = await Product.findById(productId);
      if (product && product.variants.length > 0) {
        variant = product.variants.find(v => v.isDefault) || product.variants[0];
      }
    }

    if (!product || !variant) {
      return {
        status: STOCK_STATUS.NOT_FOUND,
        stock: 0,
        available: false,
        message: 'Product variant not found'
      };
    }

    const stock = variant.stock || 0;
    let stockStatus = variant.stockStatus || 'out_of_stock';
    
    // Fix stock status inconsistency: if stock > 0 but status is out_of_stock, correct it
    if (stock > 0 && stockStatus === 'out_of_stock') {
      stockStatus = 'in_stock';
      // Update the database to fix the inconsistency
      try {
        await Product.findOneAndUpdate(
          { _id: product._id, "variants._id": variant._id },
          { $set: { "variants.$.stockStatus": 'in_stock' } }
        );
        console.log(`Fixed stock status for variant ${variant.sku}: ${stock} in stock`);
      } catch (updateError) {
        console.error('Failed to update stock status:', updateError);
      }
    }
    
    // Determine actual availability
    const isAvailable = stock > 0 && stockStatus !== 'out_of_stock' && variant.isActive !== false;
    
    return {
      status: isAvailable ? STOCK_STATUS.AVAILABLE : 
              stock === 0 ? STOCK_STATUS.OUT_OF_STOCK : STOCK_STATUS.INSUFFICIENT,
      stock,
      stockStatus,
      available: isAvailable,
      productId: product._id,
      variantId: variant._id,
      variantSku: variant.sku,
      message: isAvailable ? 'Available' : stock === 0 ? 'Out of stock' : 'Insufficient stock'
    };
  } catch (error) {
    console.error('Error getting variant stock:', error);
    return {
      status: STOCK_STATUS.INVALID,
      stock: 0,
      available: false,
      message: 'Error checking stock'
    };
  }
};

/**
 * Validate stock availability for multiple items
 * @param {Array} items - Array of { variantId, variantSku, quantity, productId }
 * @returns {Object} Validation result with issues array
 */
export const validateStockAvailability = async (items) => {
  const issues = [];
  const stockInfo = [];

  for (const item of items) {
    const stock = await getVariantStock({
      variantId: item.variantId,
      variantSku: item.variantSku,
      productId: item.productId
    });

    stockInfo.push({ ...item, stockInfo: stock });

    if (stock.status === STOCK_STATUS.NOT_FOUND) {
      issues.push({
        variantId: item.variantId,
        variantSku: item.variantSku,
        requestedQuantity: item.quantity,
        availableStock: 0,
        issue: 'Product variant not found'
      });
    } else if (!stock.available || stock.stock < item.quantity) {
      issues.push({
        variantId: stock.variantId,
        variantSku: stock.variantSku,
        requestedQuantity: item.quantity,
        availableStock: stock.stock,
        issue: stock.stock === 0 ? 'Out of stock' : 'Insufficient stock'
      });
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
    stockInfo
  };
};

/**
 * Reserve stock atomically for order creation
 * @param {Array} items - Array of { variantId, variantSku, quantity }
 * @param {Object} session - MongoDB session for transaction
 * @returns {Object} Reservation result
 */
export const reserveStock = async (items, session) => {
  const reservations = [];
  
  try {
    for (const item of items) {
      // Get current stock info
      const stockInfo = await getVariantStock({
        variantId: item.variantId,
        variantSku: item.variantSku
      });

      if (!stockInfo.available || stockInfo.stock < item.quantity) {
        throw new ApiError(400, 
          `Insufficient stock for ${stockInfo.variantSku}: requested ${item.quantity}, available ${stockInfo.stock}`
        );
      }

      // Atomic stock reservation
      const result = await Product.findOneAndUpdate(
        { 
          _id: stockInfo.productId, 
          "variants._id": stockInfo.variantId,
          "variants.stock": { $gte: item.quantity }
        },
        { 
          $inc: { "variants.$.stock": -item.quantity }
        },
        { session, new: true }
      );

      if (!result) {
        throw new ApiError(400, `Failed to reserve stock for ${stockInfo.variantSku}`);
      }

      // Update stock status separately if needed
      const updatedVariant = result.variants.find(v => String(v._id) === String(stockInfo.variantId));
      const newStockStatus = updatedVariant.stock > 0 ? "in_stock" : "out_of_stock";
      
      if (updatedVariant.stockStatus !== newStockStatus) {
        await Product.findOneAndUpdate(
          { _id: stockInfo.productId, "variants._id": stockInfo.variantId },
          { $set: { "variants.$.stockStatus": newStockStatus } },
          { session }
        );
      }

      reservations.push({
        productId: stockInfo.productId,
        variantId: stockInfo.variantId,
        variantSku: stockInfo.variantSku,
        quantity: item.quantity,
        previousStock: stockInfo.stock
      });
    }

    return {
      success: true,
      reservations
    };
  } catch (error) {
    // If any reservation fails, we should rollback in the transaction
    throw error;
  }
};

/**
 * Release reserved stock (for order cancellation)
 * @param {Array} items - Array of { variantId, variantSku, quantity }
 * @param {Object} session - MongoDB session for transaction
 * @returns {Object} Release result
 */
export const releaseStock = async (items, session) => {
  const releases = [];

  try {
    for (const item of items) {
      const stockInfo = await getVariantStock({
        variantId: item.variantId,
        variantSku: item.variantSku
      });

      if (stockInfo.status === STOCK_STATUS.NOT_FOUND) {
        console.warn(`Cannot release stock for unknown variant: ${item.variantSku}`);
        continue;
      }

      // Atomic stock release
      const result = await Product.findOneAndUpdate(
        { 
          _id: stockInfo.productId, 
          "variants._id": stockInfo.variantId
        },
        { 
          $inc: { "variants.$.stock": item.quantity },
          $set: { "variants.$.stockStatus": "in_stock" }
        },
        { session, new: true }
      );

      if (result) {
        releases.push({
          productId: stockInfo.productId,
          variantId: stockInfo.variantId,
          variantSku: stockInfo.variantSku,
          quantity: item.quantity
        });
      }
    }

    return {
      success: true,
      releases
    };
  } catch (error) {
    console.error('Error releasing stock:', error);
    throw error;
  }
};

/**
 * Update stock status based on current stock level
 * @param {String} productId 
 * @param {String} variantId 
 * @returns {Object} Update result
 */
export const updateStockStatus = async (productId, variantId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    const variant = product.variants.find(v => String(v._id) === String(variantId));
    if (!variant) {
      throw new ApiError(404, 'Variant not found');
    }

    const previousStock = variant.stock;
    const newStatus = variant.stock > 0 ? 'in_stock' : 'out_of_stock';
    
    if (variant.stockStatus !== newStatus) {
      await Product.findOneAndUpdate(
        { _id: productId, "variants._id": variantId },
        { $set: { "variants.$.stockStatus": newStatus } }
      );
    }

    // Create notifications for stock alerts
    try {
      const { createNotificationService } = await import('../modules/notification/notification.service.js');
      
      // Out of stock notification
      if (variant.stock === 0 && previousStock > 0) {
        await createNotificationService({
          type: 'out_of_stock',
          title: 'Product Out of Stock',
          message: `${product.name} - ${variant.sizeLabel || variant.sku} is now out of stock`,
          severity: 'high',
          productId: product._id,
          variantId: variant._id,
          metadata: {
            productName: product.name,
            variantSku: variant.sku,
            variantLabel: variant.sizeLabel,
            previousStock,
            currentStock: variant.stock
          }
        });
      }
      // Low stock notification (stock <= 10 but > 0)
      else if (variant.stock > 0 && variant.stock <= 10 && (previousStock > 10 || previousStock === 0)) {
        await createNotificationService({
          type: 'low_stock',
          title: 'Low Stock Alert',
          message: `${product.name} - ${variant.sizeLabel || variant.sku} has only ${variant.stock} units left`,
          severity: 'medium',
          productId: product._id,
          variantId: variant._id,
          metadata: {
            productName: product.name,
            variantSku: variant.sku,
            variantLabel: variant.sizeLabel,
            currentStock: variant.stock
          }
        });
      }
    } catch (notifError) {
      console.error("❌ Failed to create stock notification:", notifError.message || notifError);
    }

    return {
      success: true,
      previousStatus: variant.stockStatus,
      newStatus,
      stock: variant.stock
    };
  } catch (error) {
    console.error('Error updating stock status:', error);
    throw error;
  }
};

/**
 * Synchronize all variant stock statuses
 * @returns {Object} Sync result
 */
export const syncAllStockStatuses = async () => {
  try {
    const products = await Product.find({});
    let updatedCount = 0;

    for (const product of products) {
      let hasUpdates = false;
      
      for (const variant of product.variants) {
        const correctStatus = variant.stock > 0 ? 'in_stock' : 'out_of_stock';
        if (variant.stockStatus !== correctStatus) {
          variant.stockStatus = correctStatus;
          hasUpdates = true;
        }
      }

      if (hasUpdates) {
        await product.save();
        updatedCount++;
      }
    }

    return {
      success: true,
      updatedProducts: updatedCount
    };
  } catch (error) {
    console.error('Error syncing stock statuses:', error);
    throw error;
  }
};