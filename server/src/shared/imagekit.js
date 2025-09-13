import ImageKit from "imagekit";
import mime from "mime-types"; // npm install mime-types
import { logger } from "./logger.js";

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Upload buffer to ImageKit with retries + dynamic mimetype
 */
export const uploadToImageKit = async ({ buffer, fileName, folder = "/products", mimetype = "image/jpeg" }) => {
  const base64 = buffer.toString("base64");
  try {
    const result = await imagekit.upload({
      file: `data:${mimetype};base64,${base64}`,
      fileName,
      folder,
    });
    return { url: result.url, fileId: result.fileId };
  } catch (err) {
    logger.error("ImageKit upload failed", { fileName, folder, err: err.message });
    throw err;
  }
};

/**
 * Retry wrapper for upload (exponential backoff)
 */
export const uploadToImageKitWithRetry = async (opts, attempts = 3, delayMs = 500) => {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await uploadToImageKit(opts);
    } catch (err) {
      lastErr = err;
      await new Promise(r => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw lastErr;
};

export const deleteFromImageKit = async (fileId) => {
  if (!fileId) return false;
  try {
    await imagekit.deleteFile(fileId);
    return true;
  } catch (err) {
    logger.warn("ImageKit delete error", { fileId, err: err.message });
    return false; // don’t crash main flow
  }
};
