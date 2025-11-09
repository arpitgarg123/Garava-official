/**
 * Image Validation Utilities
 * Shared utilities for validating and filtering product images across the application
 */

/**
 * Check if a URL is a valid image URL based on format
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if URL appears valid
 */
export const isValidImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    // Check if it's a valid URL format
    const urlObj = new URL(url, window.location.origin);
    const pathname = urlObj.pathname.toLowerCase();
    
    // Check for valid image extensions
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const hasValidExtension = validExtensions.some(ext => pathname.endsWith(ext));
    
    // Check for known CDN domains (ImageKit, Cloudinary, etc.)
    const knownCDNs = ['imagekit.io', 'cloudinary.com', 'cloudflare.com'];
    const isKnownCDN = knownCDNs.some(cdn => urlObj.hostname.includes(cdn));
    
    return hasValidExtension || isKnownCDN;
  } catch (e) {
    return false;
  }
};

/**
 * Validate if an image URL actually loads
 * @param {string} url - The image URL to test
 * @param {number} timeout - Timeout in milliseconds (default: 5000)
 * @returns {Promise<boolean>} - Resolves to true if image loads successfully
 */
export const validateImage = (url, timeout = 5000) => {
  return new Promise((resolve) => {
    // First check URL format
    if (!isValidImageUrl(url)) {
      resolve(false);
      return;
    }
    
    const img = new Image();
    let timeoutId;
    
    img.onload = () => {
      clearTimeout(timeoutId);
      resolve(true);
    };
    
    img.onerror = () => {
      clearTimeout(timeoutId);
      resolve(false);
    };
    
    // Set timeout
    timeoutId = setTimeout(() => {
      img.src = ''; // Cancel loading
      resolve(false);
    }, timeout);
    
    img.src = url;
  });
};

/**
 * Validate multiple images concurrently
 * @param {string[]} urls - Array of image URLs to validate
 * @param {number} timeout - Timeout per image in milliseconds
 * @returns {Promise<string[]>} - Array of valid image URLs
 */
export const validateImages = async (urls, timeout = 5000) => {
  if (!Array.isArray(urls) || urls.length === 0) {
    return [];
  }
  
  const validationResults = await Promise.all(
    urls.map(url => validateImage(url, timeout))
  );
  
  return urls.filter((_, index) => validationResults[index]);
};

/**
 * Extract and normalize image URL from various formats
 * @param {string|object} imageData - Image data (string URL or object with url property)
 * @returns {string|null} - Normalized URL or null
 */
export const extractImageUrl = (imageData) => {
  if (!imageData) return null;
  
  if (typeof imageData === 'string') {
    return imageData;
  }
  
  if (typeof imageData === 'object' && imageData.url) {
    return imageData.url;
  }
  
  return null;
};

/**
 * Get product image with fallback options
 * @param {object} product - Product object
 * @param {string} fallback - Fallback image URL (default: '/placeholder.webp')
 * @returns {string} - Image URL
 */
export const getProductImage = (product, fallback = '/placeholder.webp') => {
  if (!product) return fallback;
  
  // Try heroImage first
  const heroImage = extractImageUrl(product.heroImage);
  if (heroImage) return heroImage;
  
  // Try first gallery image
  if (product.gallery && Array.isArray(product.gallery) && product.gallery.length > 0) {
    const galleryImage = extractImageUrl(product.gallery[0]);
    if (galleryImage) return galleryImage;
  }
  
  // Try images array (legacy)
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const legacyImage = extractImageUrl(product.images[0]);
    if (legacyImage) return legacyImage;
  }
  
  return fallback;
};

/**
 * Get all product images (hero + gallery) with deduplication
 * @param {object} product - Product object
 * @returns {string[]} - Array of unique image URLs
 */
export const getAllProductImages = (product) => {
  if (!product) return [];
  
  const images = [];
  const seen = new Set();
  
  // Add hero image
  const heroImage = extractImageUrl(product.heroImage);
  if (heroImage && !seen.has(heroImage)) {
    images.push(heroImage);
    seen.add(heroImage);
  }
  
  // Add gallery images
  if (product.gallery && Array.isArray(product.gallery)) {
    product.gallery.forEach(img => {
      const url = extractImageUrl(img);
      if (url && !seen.has(url)) {
        images.push(url);
        seen.add(url);
      }
    });
  }
  
  // Add legacy images if no other images found
  if (images.length === 0 && product.images && Array.isArray(product.images)) {
    product.images.forEach(img => {
      const url = extractImageUrl(img);
      if (url && !seen.has(url)) {
        images.push(url);
        seen.add(url);
      }
    });
  }
  
  return images;
};
