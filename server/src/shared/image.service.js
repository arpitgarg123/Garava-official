// src/shared/image.service.js
import { deleteFromImageKit } from "./imagekit.js";
import { logger } from "./logger.js";

// best-effort delete; consider enqueuing this operation in a job queue (BullMQ) for reliability
export const safeDeleteImages = async (fileIds = []) => {
  const results = [];
  for (const fid of fileIds) {
    try {
      const ok = await deleteFromImageKit(fid);
      results.push({ fileId: fid, ok });
      if (!ok) {
        logger.warn("Failed to delete image from ImageKit", { fileId: fid });
      }
    } catch (err) {
      logger.error("safeDeleteImages failed", { fileId: fid, err });
      results.push({ fileId: fid, ok: false, err: err.message });
    }
  }
  return results;
};
