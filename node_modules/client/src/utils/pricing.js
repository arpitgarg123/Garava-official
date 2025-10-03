/**
 * Frontend Pricing Utilities
 * Handles calculation of delivery charges, COD charges for display
 */

// Constants for charges (must match backend)
export const CHARGES = {
  COD_HANDLING_FEE: 40,       // Rs 40
  DELIVERY_CHARGE: 70,        // Rs 70
  FREE_DELIVERY_THRESHOLD: 500, // Rs 500
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default formatCurrency;