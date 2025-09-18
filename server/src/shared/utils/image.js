// src/shared/utils/image.utils.js
import sharp from "sharp";

/**
 * Optimize/resize image buffer.
 * - returns Buffer (JPEG) suitable for upload.
 * - safe: if sharp fails, returns original buffer.
 */
export const optimizeImage = async (buffer, { width = 1600, quality = 80 } = {}) => {
  try {
    const out = await sharp(buffer)
      .rotate() // respect orientation
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
    return out;
  } catch (err) {
    // If optimization fails, return original buffer — do not block upload.
    console.warn("optimizeImage failed, using original buffer:", err?.message || err);
    return buffer;
  }
};
