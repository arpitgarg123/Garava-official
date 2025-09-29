/**
 * Frontend Pricing Utilities
 * Handles calculation of delivery charges, COD charges for display
 */


// Only format currency for display (assume rupees from backend)

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default formatCurrency;