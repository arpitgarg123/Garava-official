// src/modules/admin/product/product.admin.controller.js
import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import ApiError from "../../../shared/utils/ApiError.js";
import * as service from "./product.admin.service.js";
import Product from "../../product/product.model.js";
import { optimizeImage } from "../../../shared/utils/image.js";
import { uploadToImageKitWithRetry, deleteFromImageKit } from "../../../shared/imagekit.js";

/**
 * Utility: parse JSON string fields coming from multipart/form-data.
 * - Accepts JSON string, CSV for simple arrays (collections), or already-parsed objects.
 * - Throws Error when parsing fails.
 */
function parseJsonField(val, name = "field") {
  if (val === undefined || val === null) return val;
  // already object/array
  if (typeof val !== "string") return val;

  const s = val.trim();
  if (s === "") return undefined;

  // common broken input from form editors
  if (s === "[object Object]") {
    throw new Error(`${name} appears to be an object but was sent incorrectly. Send valid JSON string.`);
  }

  // Try JSON.parse
  try {
    return JSON.parse(s);
  } catch (err) {
    // Try single-quote replacement for dev convenience
    try {
      const replaced = s.replace(/'/g, '"');
      return JSON.parse(replaced);
    } catch (err2) {
      // For collections allow CSV: "A, B, C"
      if (name === "collections" && s.includes(",")) {
        return s.split(",").map(x => x.trim()).filter(Boolean);
      }
      // try decodeURIComponent
      try {
        const decoded = decodeURIComponent(s);
        return JSON.parse(decoded);
      } catch (err3) {
        throw new Error(`Invalid JSON for ${name}`);
      }
    }
  }
}

/**
 * Helper: normalize raw req.body by parsing likely JSON fields
 */
function normalizeMultipartBody(raw) {
  const result = { ...raw };

  // fields that commonly come in as JSON strings in multipart
  const jsonFields = [
    "variants",
    "fragranceNotes",
    "shippingInfo",
    "giftWrap",
    "gallery",
    "heroImage",
    "relatedProducts",
    "upsellProducts",
    "collections"
  ];

  for (const k of jsonFields) {
    if (result[k] === undefined) continue;

    // empty string -> treat as not provided
    if (typeof result[k] === "string" && result[k].trim() === "") {
      result[k] = undefined;
      continue;
    }

    // parse or leave alone if already object/array
    try {
      result[k] = parseJsonField(result[k], k);
    } catch (err) {
      // rethrow with field context
      throw new ApiError(400, `Invalid JSON format for ${k}: ${err.message}`);
    }
  }

  return result;
}

/**
 * Admin: Create Product (supports multipart form-data uploads)
 * - Expects files: heroImage (1), gallery (multiple) as defined in routes
 * - Accepts JSON fields as strings (variants, fragranceNotes, shippingInfo, collections etc.)
 */
export const createProduct = asyncHandler(async (req, res) => {
  const adminId = req.user?.id;
  if (!adminId) throw new ApiError(401, "Unauthorized");

  // Normalize body (parse JSON-like strings)
  const raw = normalizeMultipartBody({ ...req.body });

  // Minimal validation
  if (!raw.name) throw new ApiError(400, "Product name is required");
  if (!raw.category) throw new ApiError(400, "Category is required");
  if (!Array.isArray(raw.variants) || raw.variants.length === 0) {
    throw new ApiError(400, "variants must be a non-empty array");
  }

  // Files from multer; your routes use field names heroImage and gallery
  const heroFile = req.files?.heroImage?.[0];
  const galleryFiles = req.files?.gallery || [];

  // Track uploaded fileIds for cleanup on error
  const uploadedFileIds = [];

  try {
    // Upload heroImage if provided
    let heroImage = raw.heroImage || undefined;
    if (heroFile) {
      const buf = await optimizeImage(heroFile.buffer, { width: 1600 });
      const fileName = `hero_${Date.now()}_${heroFile.originalname.replace(/\s+/g, "_")}`;
      const uploaded = await uploadToImageKitWithRetry({
        buffer: buf,
        fileName,
        folder: "/products/hero",
        mimetype: heroFile.mimetype,
      });
      heroImage = { url: uploaded.url, fileId: uploaded.fileId };
      uploadedFileIds.push(uploaded.fileId);
    }

    // Upload gallery files (append to any gallery items sent as JSON)
    const gallery = Array.isArray(raw.gallery) ? raw.gallery.slice() : [];
    for (const file of galleryFiles) {
      const buf = await optimizeImage(file.buffer, { width: 1600 });
      const fileName = `gallery_${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;
      const uploaded = await uploadToImageKitWithRetry({
        buffer: buf,
        fileName,
        folder: "/products/gallery",
        mimetype: file.mimetype,
      });
      gallery.push({ url: uploaded.url, fileId: uploaded.fileId });
      uploadedFileIds.push(uploaded.fileId);
    }

    const payload = {
      ...raw,
      heroImage: heroImage || undefined,
      gallery: gallery.length ? gallery : undefined,
    };

    const product = await service.createProductService(payload, adminId);
    return res.status(201).json({ success: true, product });
  } catch (err) {
    // best-effort cleanup of images uploaded during this request
    if (uploadedFileIds.length) {
      // don't block error propagation; attempt parallel deletes
      await Promise.allSettled(uploadedFileIds.map(fid => deleteFromImageKit(fid)));
    }
    throw err;
  }
});

/**
 * Admin: Update Product (supports replacing hero/gallery images)
 * - If a new heroImage is uploaded, old heroImage.fileId will be deleted (best-effort).
 * - If new gallery files are uploaded, the controller replaces gallery with provided new gallery (and deletes old gallery fileIds).
 * - If you want to merge gallery instead of replace, adjust logic below.
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const adminId = req.user?.id;
  const productId = req.params.id;
  if (!adminId) throw new ApiError(401, "Unauthorized");

  // Normalize body
  const raw = normalizeMultipartBody({ ...req.body });

  // Load existing product (needed if we will delete replaced images)
  const existing = await Product.findById(productId).lean();
  if (!existing) throw new ApiError(404, "Product not found");

  // Files
  const heroFile = req.files?.heroImage?.[0];
  const galleryFiles = req.files?.gallery || [];

  const uploadedFileIds = [];
  const toDeleteFileIds = []; // fileIds to delete from ImageKit (old assets)

  try {
    // Handle hero replacement
    let heroImage = raw.heroImage !== undefined ? raw.heroImage : existing.heroImage;
    if (heroFile) {
      // upload new hero
      const buf = await optimizeImage(heroFile.buffer, { width: 1600 });
      const fileName = `hero_${Date.now()}_${heroFile.originalname.replace(/\s+/g, "_")}`;
      const uploaded = await uploadToImageKitWithRetry({
        buffer: buf,
        fileName,
        folder: "/products/hero",
        mimetype: heroFile.mimetype,
      });
      heroImage = { url: uploaded.url, fileId: uploaded.fileId };
      uploadedFileIds.push(uploaded.fileId);

      // schedule old hero deletion (if exists)
      if (existing.heroImage && existing.heroImage.fileId) {
        toDeleteFileIds.push(existing.heroImage.fileId);
      }
    }

    // Handle gallery replacement: if user sent gallery JSON array in body, keep those and append uploaded gallery files.
    // If none provided and no new files, keep existing gallery unchanged.
    let gallery = Array.isArray(raw.gallery) ? raw.gallery.slice() : (existing.gallery ? existing.gallery.slice() : []);

    // If user intentionally sends empty string or explicit null for gallery we treat it as replace with [] only when they provided something.
    // Append newly uploaded files to gallery
    if (galleryFiles.length) {
      // If gallery was from existing and user provided new files, we will replace existing gallery entirely (delete old ones).
      if (existing.gallery && existing.gallery.length) {
        existing.gallery.forEach(g => { if (g && g.fileId) toDeleteFileIds.push(g.fileId); });
        gallery = []; // start fresh
      }
      for (const file of galleryFiles) {
        const buf = await optimizeImage(file.buffer, { width: 1600 });
        const fileName = `gallery_${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;
        const uploaded = await uploadToImageKitWithRetry({
          buffer: buf,
          fileName,
          folder: "/products/gallery",
          mimetype: file.mimetype,
        });
        gallery.push({ url: uploaded.url, fileId: uploaded.fileId });
        uploadedFileIds.push(uploaded.fileId);
      }
    }

    // If raw.gallery was explicitly provided as an empty array (client wants to remove gallery),
    // we should delete old gallery fileIds
    if (Array.isArray(raw.gallery) && raw.gallery.length === 0 && existing.gallery && existing.gallery.length) {
      existing.gallery.forEach(g => { if (g && g.fileId) toDeleteFileIds.push(g.fileId); });
      gallery = [];
    }

    // Build update payload
    const updates = { ...raw, heroImage, gallery };

    const product = await service.updateProductService(productId, updates, adminId);

    // After successful update, attempt deletion of old fileIds (best-effort)
    if (toDeleteFileIds.length) {
      // don't await for synchronous response, but attempt deletion in background (we can await but handle rejection)
      await Promise.allSettled(toDeleteFileIds.map(fid => deleteFromImageKit(fid)));
    }

    return res.json({ success: true, product });
  } catch (err) {
    // cleanup any newly uploaded files if update failed
    if (uploadedFileIds.length) {
      await Promise.allSettled(uploadedFileIds.map(fid => deleteFromImageKit(fid)));
    }
    throw err;
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await service.deleteProductService(req.params.id);
  res.json({ success: true, message: "Product archived" });
});

export const listProductsAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const { q, status, category } = req.query;
  const result = await service.listProductsAdminService({ page, limit, q, status, category });
  res.json({ success: true, ...result });
});

export const addVariant = asyncHandler(async (req, res) => {
  // parse variant JSON if sent as string
  let payload = req.body;
  if (payload && typeof payload === "string") {
    try { payload = JSON.parse(payload); } catch (e) { /* keep as-is */ }
  }
  const product = await service.addVariantService(req.params.id, payload);
  res.status(201).json({ success: true, product });
});

export const updateVariant = asyncHandler(async (req, res) => {
  const product = await service.updateVariantService(req.params.id, req.params.variantId, req.body);
  res.json({ success: true, product });
});

export const patchStock = asyncHandler(async (req, res) => {
  const payload = req.body;
  if (!payload.variantSku) throw new ApiError(400, "variantSku required");
  const product = await service.patchStockService(req.params.id, payload);
  res.json({ success: true, product });
});
