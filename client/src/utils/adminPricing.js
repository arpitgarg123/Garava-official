/**
 * Safe Pricing Display Utilities for Admin Dashboard
 * Handles paise-to-rupees conversion consistently
 */

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

/**
 * Safely displays price by checking if conversion from paise is needed
 * @param {number} amount - Price amount (could be in paise or rupees)
 * @param {boolean} forcePaiseConversion - Force conversion from paise
 * @returns {string} Formatted currency string
 */
export const safePriceDisplay = (amount, forcePaiseConversion = false) => {
  if (!amount && amount !== 0) return formatCurrency(0);
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle negative amounts - don't auto-convert negatives to avoid confusion
  if (numAmount < 0) {
    return formatCurrency(numAmount);
  }
  
  // If amount is suspiciously high (> 100,000), it's likely in paise
  // OR if forcePaiseConversion is true
  if (forcePaiseConversion || numAmount > 100000) {
    return formatCurrency(numAmount / 100);
  }
  
  return formatCurrency(numAmount);
};

/**
 * Admin-specific price formatter that handles backend inconsistencies
 * @param {number} amount - Price amount from admin API
 * @returns {string} Formatted currency string
 */
export const formatAdminPrice = (amount) => {
  // Backend should convert to rupees, but as safety check:
  // If the amount seems too high, it might still be in paise
  return safePriceDisplay(amount);
};

export default { formatCurrency, safePriceDisplay, formatAdminPrice };