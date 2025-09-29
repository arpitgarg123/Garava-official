import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import * as service from "./blog.admin.service.js";
import ApiError from "../../../shared/utils/ApiError.js";
import { optimizeImage } from "../../../shared/utils/image.js";
import { uploadToImageKitWithRetry } from "../../../shared/imagekit.js";

export const createBlog = asyncHandler(async (req, res) => {
  const adminId = req.user.id;
  const body = req.body;

  // optional: parse tags JSON for multipart forms
  if (body.tags && typeof body.tags === "string") {
    try { body.tags = JSON.parse(body.tags); } catch {
      // allow CSV fallback
      body.tags = body.tags.split(",").map(s => s.trim()).filter(Boolean);
    }
  }

  // coverImage (single)
  let coverImage = undefined;
  const cover = req.files?.coverImage?.[0];
  if (cover) {
    const buffer = await optimizeImage(cover.buffer, { width: 1600 });
    const uploaded = await uploadToImageKitWithRetry({
      buffer,
      fileName: `blog_${Date.now()}_${cover.originalname}`,
      folder: "/blogs/cover",
    });
    coverImage = { url: uploaded.url, fileId: uploaded.fileId, alt: body.title || "" };
  }

  const doc = await service.createBlogService({ ...body, ...(coverImage && { coverImage }) }, adminId);
  res.status(201).json({ success: true, post: doc });
});

export const updateBlog = asyncHandler(async (req, res) => {
  const adminId = req.user.id;
  const id = req.params.id;
  const body = req.body;

  if (body.tags && typeof body.tags === "string") {
    try { body.tags = JSON.parse(body.tags); } catch {
      body.tags = body.tags.split(",").map(s => s.trim()).filter(Boolean);
    }
  }

  // optionally replace cover
  if (req.files?.coverImage?.[0]) {
    const file = req.files.coverImage[0];
    const buffer = await optimizeImage(file.buffer, { width: 1600 });
    const uploaded = await uploadToImageKitWithRetry({
      buffer,
      fileName: `blog_${Date.now()}_${file.originalname}`,
      folder: "/blogs/cover",
    });
    body.coverImage = { url: uploaded.url, fileId: uploaded.fileId, alt: body.title || "" };
  }

  const doc = await service.updateBlogService(id, body, adminId);
  res.json({ success: true, post: doc });
});

export const deleteBlog = asyncHandler(async (req, res) => {
  await service.deleteBlogService(req.params.id);
  res.json({ success: true, message: "Blog archived" });
});

export const listBlogsAdmin = asyncHandler(async (req, res) => {
  const { page, limit, q, status, tag, category } = req.query;
  const data = await service.listBlogsAdminService({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 20,
    q, status, tag, category
  });
  res.json({ success: true, ...data });
});

export const setStatus = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { status, publishAt } = req.body; // publishAt can be null to clear schedule
  if (status && !["draft","published","archived"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }
  const post = await service.setStatusService(id, { status, publishAt });
  res.json({ success: true, post });
});
