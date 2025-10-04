// src/shared/utils/image.utils.js

/**
 * Image processing utility.
 * - Returns the original buffer without optimization
 * - Images are optimized by ImageKit service when uploaded
 */
export const optimizeImage = async (buffer, { width = 1600, quality = 80 } = {}) => {
  // Return original buffer - ImageKit handles optimization
  return buffer;
};
