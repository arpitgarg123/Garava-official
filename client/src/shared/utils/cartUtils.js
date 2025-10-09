/**
 * Cart utilities for handling product variants and cart operations
 */

/**
 * Get the best available variant from a product
 * @param {Object} product - The product object
 * @returns {Object|null} - The selected variant or null if none available
 */
export const getValidVariant = (product) => {
  if (!product || !product.variants || !Array.isArray(product.variants) || product.variants.length === 0) {
    return null;
  }

  // Priority order for variant selection:
  // 1. Default variant that is active
  // 2. First active variant
  // 3. Any variant (fallback)
  let variant = product.variants.find(v => v.isDefault && v.isActive !== false) ||
                product.variants.find(v => v.isActive !== false) ||
                product.variants[0];

  return variant || null;
};

/**
 * Validate if a variant is suitable for cart operations
 * @param {Object} variant - The variant object
 * @returns {Object} - Validation result with isValid and reason
 */
export const validateVariantForCart = (variant) => {
  if (!variant) {
    return { isValid: false, reason: 'No variant available' };
  }

  if (!variant._id && !variant.id && !variant.sku) {
    return { isValid: false, reason: 'Variant has no valid identifier' };
  }

  if (variant.stock <= 0 || variant.stockStatus === 'out_of_stock') {
    return { isValid: false, reason: 'Product is out of stock' };
  }

  if (variant.isActive === false) {
    return { isValid: false, reason: 'Product variant is not active' };
  }

  return { isValid: true, reason: 'Valid' };
};

/**
 * Create cart payload with proper validation
 * @param {Object} product - The product object
 * @param {number} quantity - Quantity to add (default: 1)
 * @returns {Object} - Cart payload or throws error
 */
export const createCartPayload = (product, quantity = 1) => {
  if (!product) {
    throw new Error('Product is required');
  }

  const productId = product._id || product.id;
  if (!productId) {
    throw new Error('Product ID is missing');
  }

  const variant = getValidVariant(product);
  if (!variant) {
    throw new Error('No valid product variant found');
  }

  const validation = validateVariantForCart(variant);
  if (!validation.isValid) {
    throw new Error(validation.reason);
  }

  const variantId = variant._id || variant.id;
  const variantSku = variant.sku;

  if (!variantId && !variantSku) {
    throw new Error('Variant must have either ID or SKU');
  }

  return {
    productId,
    variantId,
    variantSku,
    quantity: Math.max(1, parseInt(quantity) || 1)
  };
};

/**
 * Format price for display
 * @param {number} price - Price in rupees (backend sends values in rupees)
 * @param {string} currency - Currency symbol (default: ₹)
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, currency = '₹') => {
  if (!price || isNaN(price)) return `${currency}0.00`;
  // Round to avoid decimal precision issues and format with appropriate decimal places
  const roundedPrice = Math.round(price * 100) / 100;
  return `${currency}${roundedPrice.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

/**
 * Calculate cart total from items
 * @param {Array} items - Cart items array
 * @returns {number} - Total amount in rupees
 */
export const calculateCartTotal = (items) => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((total, item) => {
    const itemPrice = (item.unitPrice || 0) * (item.quantity || 0);
    return total + itemPrice;
  }, 0);
};

/**
 * Get cart item count
 * @param {Array} items - Cart items array
 * @returns {number} - Total number of items
 */
export const getCartItemCount = (items) => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((count, item) => count + (item.quantity || 0), 0);
};

/**
 * Check if product is already in cart
 * @param {Array} cartItems - Current cart items
 * @param {string} productId - Product ID to check
 * @param {string} variantId - Variant ID to check
 * @returns {Object|null} - Cart item if found, null otherwise
 */
export const findCartItem = (cartItems, productId, variantId) => {
  if (!Array.isArray(cartItems)) return null;
  return cartItems.find(item => 
    item.product === productId && item.variantId === variantId
  ) || null;
};