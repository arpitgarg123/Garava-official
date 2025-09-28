/**
 * Frontend Pricing Utilities
 * Handles calculation of delivery charges, COD charges for display
 */

// Constants for charges (in rupees for frontend display)
export const CHARGES = {
  COD_HANDLING_FEE: 40,        // Rs 40
  DELIVERY_CHARGE: 70,         // Rs 70
  FREE_DELIVERY_THRESHOLD: 500, // Rs 500
};

/**
 * Calculate delivery charges based on subtotal
 * @param {number} subtotalRupees - Subtotal in rupees
 * @returns {number} - Delivery charge in rupees
 */
export const calculateDeliveryCharge = (subtotalRupees) => {
  return subtotalRupees >= CHARGES.FREE_DELIVERY_THRESHOLD ? 0 : CHARGES.DELIVERY_CHARGE;
};

/**
 * Calculate COD handling charge
 * @param {string} paymentMethod - Payment method ('cod' or other)
 * @returns {number} - COD charge in rupees
 */
export const calculateCODCharge = (paymentMethod) => {
  return paymentMethod === 'cod' ? CHARGES.COD_HANDLING_FEE : 0;
};

/**
 * Calculate complete order pricing breakdown
 * @param {number} subtotalPaise - Items subtotal in paise
 * @param {string} paymentMethod - Payment method ('cod', 'phonepe', etc.)
 * @returns {Object} - Complete pricing breakdown in paise
 */
export const calculateOrderPricing = (subtotalPaise, paymentMethod = 'phonepe') => {
  const subtotalRupees = subtotalPaise / 100;
  const deliveryCharge = calculateDeliveryCharge(subtotalRupees);
  const codCharge = calculateCODCharge(paymentMethod);
  const taxTotal = 0; // Add tax calculation if needed
  const discountTotal = 0; // Add discount calculation if needed
  
  const grandTotal = subtotalPaise + (deliveryCharge * 100) + (codCharge * 100) + taxTotal - discountTotal;
  
  return {
    subtotal: subtotalPaise, // Return in paise for consistency
    deliveryCharge: deliveryCharge * 100, // Convert to paise
    codCharge: codCharge * 100, // Convert to paise
    taxTotal,
    discountTotal,
    grandTotal,
    breakdown: {
      isFreeDelivery: deliveryCharge === 0,
      freeDeliveryThreshold: CHARGES.FREE_DELIVERY_THRESHOLD,
      hasCODCharge: codCharge > 0,
      amountNeededForFreeDelivery: Math.max(0, (CHARGES.FREE_DELIVERY_THRESHOLD * 100) - subtotalPaise),
    }
  };
};

/**
 * Format currency for display from paise
 * @param {number} amountPaise - Amount in paise
 * @returns {string} - Formatted currency string
 */
export const formatCurrencyFromPaise = (amountPaise) => {
  const rupees = amountPaise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rupees);
};

/**
 * Format currency for display from rupees
 * @param {number} amount - Amount in rupees
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Get delivery message for user
 * @param {number} subtotalPaise - Current cart subtotal in paise
 * @returns {string} - Message about delivery charges
 */
export const getDeliveryMessage = (subtotalPaise) => {
  const subtotalRupees = subtotalPaise / 100;
  const amountNeeded = CHARGES.FREE_DELIVERY_THRESHOLD - subtotalRupees;
  
  if (subtotalRupees >= CHARGES.FREE_DELIVERY_THRESHOLD) {
    return "🎉 You qualify for free delivery!";
  } else {
    return `Add ${formatCurrency(amountNeeded)} more for free delivery`;
  }
};

export default {
  CHARGES,
  calculateDeliveryCharge,
  calculateCODCharge,
  calculateOrderPricing,
  formatCurrency,
  formatCurrencyFromPaise,
  getDeliveryMessage,
};