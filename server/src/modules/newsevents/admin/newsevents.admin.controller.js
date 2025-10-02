import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import * as service from "./newsevents.admin.service.js";
import ApiError from "../../../shared/utils/ApiError.js";
import { optimizeImage } from "../../../shared/utils/image.js";
import { uploadToImageKitWithRetry } from "../../../shared/imagekit.js";

export const createNewsEvent = asyncHandler(async (req, res) => {
  const adminId = req.user.id;
  const body = req.body;

  // cover image (single)
  let cover = undefined;
  const coverFile = req.files?.cover?.[0];
  if (coverFile) {
    const buffer = await optimizeImage(coverFile.buffer, { width: 1600 });
    const uploaded = await uploadToImageKitWithRetry({
      buffer,
      fileName: `newsevents_${Date.now()}_${coverFile.originalname}`,
      folder: "/newsevents/cover",
    });
    cover = { url: uploaded.url, fileId: uploaded.fileId, alt: body.title || "" };
  }

  const doc = await service.createNewsEventService({ ...body, ...(cover && { cover }) }, adminId);
  res.status(201).json({ success: true, item: doc });
});

export const updateNewsEvent = asyncHandler(async (req, res) => {
  const adminId = req.user.id;
  const id = req.params.id;
  const body = req.body;

  // optionally replace cover
  if (req.files?.cover?.[0]) {
    const file = req.files.cover[0];
    const buffer = await optimizeImage(file.buffer, { width: 1600 });
    const uploaded = await uploadToImageKitWithRetry({
      buffer,
      fileName: `newsevents_${Date.now()}_${file.originalname}`,
      folder: "/newsevents/cover",
    });
    body.cover = { url: uploaded.url, fileId: uploaded.fileId, alt: body.title || "" };
  }

  const doc = await service.updateNewsEventService(id, body, adminId);
  res.json({ success: true, item: doc });
});

export const deleteNewsEvent = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const result = await service.deleteNewsEventService(id);
  res.json({ success: true, ...result });
});

export const listAllNewsEvents = asyncHandler(async (req, res) => {
  const { page, limit, type, status, q, sort } = req.query;
  const data = await service.listAllNewsEventsService({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    type,
    status,
    q,
    sort,
  });
  res.json({ success: true, ...data });
});

export const getNewsEventById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await service.getNewsEventByIdService(id);
  res.json({ success: true, item });
});

export const bulkUpdateStatus = asyncHandler(async (req, res) => {
  const adminId = req.user.id;
  const { ids, status } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Invalid ids array");
  }

  const result = await service.bulkUpdateStatusService(ids, status, adminId);
  res.json({ success: true, ...result });
});

export const getAdminStats = asyncHandler(async (req, res) => {
  const stats = await service.getAdminStatsService();
  res.json({ success: true, ...stats });
});