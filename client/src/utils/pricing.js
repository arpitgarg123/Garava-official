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
 * @param {number} subtotalRupees - Items subtotal in rupees
 * @param {string} paymentMethod - Payment method ('cod', 'phonepe', etc.)
 * @returns {Object} - Complete pricing breakdown
 */
export const calculateOrderPricing = (subtotalRupees, paymentMethod = 'phonepe') => {
  const deliveryCharge = calculateDeliveryCharge(subtotalRupees);
  const codCharge = calculateCODCharge(paymentMethod);
  const taxTotal = 0; // Add tax calculation if needed
  const discountTotal = 0; // Add discount calculation if needed
  
  const grandTotal = subtotalRupees + deliveryCharge + codCharge + taxTotal - discountTotal;
  
  return {
    subtotal: subtotalRupees,
    deliveryCharge,
    codCharge,
    taxTotal,
    discountTotal,
    grandTotal,
    breakdown: {
      isFreeDelivery: deliveryCharge === 0,
      freeDeliveryThreshold: CHARGES.FREE_DELIVERY_THRESHOLD,
      hasCODCharge: codCharge > 0,
      amountNeededForFreeDelivery: Math.max(0, CHARGES.FREE_DELIVERY_THRESHOLD - subtotalRupees),
    }
  };
};

/**
 * Format currency for display
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
 * @param {number} subtotalRupees - Current cart subtotal
 * @returns {string} - Message about delivery charges
 */
export const getDeliveryMessage = (subtotalRupees) => {
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
  getDeliveryMessage,
};