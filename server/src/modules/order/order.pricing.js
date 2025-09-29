/**
 * Order Pricing Utilities
 * Handles calculation of delivery charges, COD charges, and other fees
 */

// Constants for charges (in rupees for consistency)
export const CHARGES_RUPEES = {
  COD_HANDLING_FEE: 40,       // Rs 40
  DELIVERY_CHARGE: 70,        // Rs 70
  FREE_DELIVERY_THRESHOLD: 500, // Rs 500
};

// Constants for charges (in paise for precision) - DEPRECATED but kept for compatibility
export const CHARGES = {
  COD_HANDLING_FEE: 4000,      // Rs 40 in paise
  DELIVERY_CHARGE: 7000,       // Rs 70 in paise
  FREE_DELIVERY_THRESHOLD: 50000, // Rs 500 in paise
};

/**
 * Calculate delivery charges based on subtotal (rupees)
 * @param {number} subtotalRupees - Subtotal in rupees
 * @returns {number} - Delivery charge in rupees
 */
export const calculateDeliveryChargeRupees = (subtotalRupees) => {
  return subtotalRupees >= CHARGES_RUPEES.FREE_DELIVERY_THRESHOLD ? 0 : CHARGES_RUPEES.DELIVERY_CHARGE;
};

/**
 * Calculate COD handling charge (rupees)
 * @param {string} paymentMethod - Payment method ('cod' or other)
 * @returns {number} - COD charge in rupees
 */
export const calculateCODChargeRupees = (paymentMethod) => {
  return paymentMethod === 'cod' ? CHARGES_RUPEES.COD_HANDLING_FEE : 0;
};

/**
 * Calculate complete order pricing breakdown (rupees)
 * @param {number} subtotalRupees - Items subtotal in rupees
 * @param {string} paymentMethod - Payment method ('cod', 'phonepe', etc.)
 * @returns {Object} - Complete pricing breakdown in rupees
 */
export const calculateOrderPricingRupees = (subtotalRupees, paymentMethod) => {
  const deliveryCharge = calculateDeliveryChargeRupees(subtotalRupees);
  const codCharge = calculateCODChargeRupees(paymentMethod);
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
      freeDeliveryThreshold: CHARGES_RUPEES.FREE_DELIVERY_THRESHOLD,
      hasCODCharge: codCharge > 0,
    }
  };
};

/**
 * Calculate delivery charges based on subtotal
 * @param {number} subtotalPaise - Subtotal in paise
 * @returns {number} - Delivery charge in paise
 */
export const calculateDeliveryCharge = (subtotalPaise) => {
  return subtotalPaise >= CHARGES.FREE_DELIVERY_THRESHOLD ? 0 : CHARGES.DELIVERY_CHARGE;
};

/**
 * Calculate COD handling charge
 * @param {string} paymentMethod - Payment method ('cod' or other)
 * @returns {number} - COD charge in paise
 */
export const calculateCODCharge = (paymentMethod) => {
  return paymentMethod === 'cod' ? CHARGES.COD_HANDLING_FEE : 0;
};

/**
 * Calculate complete order pricing breakdown
 * @param {number} subtotalPaise - Items subtotal in paise
 * @param {string} paymentMethod - Payment method ('cod', 'phonepe', etc.)
 * @returns {Object} - Complete pricing breakdown
 */
export const calculateOrderPricing = (subtotalPaise, paymentMethod) => {
  const deliveryCharge = calculateDeliveryCharge(subtotalPaise);
  const codCharge = calculateCODCharge(paymentMethod);
  const taxTotal = 0; // Add tax calculation if needed
  const discountTotal = 0; // Add discount calculation if needed
  
  const grandTotal = subtotalPaise + deliveryCharge + codCharge + taxTotal - discountTotal;
  
  return {
    subtotal: subtotalPaise,
    deliveryCharge,
    codCharge,
    taxTotal,
    discountTotal,
    grandTotal,
    breakdown: {
      isFreeDelivery: deliveryCharge === 0,
      freeDeliveryThreshold: CHARGES.FREE_DELIVERY_THRESHOLD,
      hasCODCharge: codCharge > 0,
    }
  };
};

/**
 * Convert paise to rupees for display
 * @param {number} paise - Amount in paise
 * @returns {number} - Amount in rupees
 */
export const toRupees = (paise) => {
  return Math.round(paise) / 100;
};

/**
 * Convert rupees to paise for calculations
 * @param {number} rupees - Amount in rupees
 * @returns {number} - Amount in paise
 */
export const toPaise = (rupees) => {
  return Math.round(rupees * 100);
};

/**
 * Format currency for display
 * @param {number} paise - Amount in paise
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (paise) => {
  const rupees = toRupees(paise);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rupees);
};

export default {
  CHARGES,
  calculateDeliveryCharge,
  calculateCODCharge,
  calculateOrderPricing,
  toRupees,
  toPaise,
  formatCurrency,
};