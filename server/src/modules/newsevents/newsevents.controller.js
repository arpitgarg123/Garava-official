import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import * as service from "./newsevents.service.js";

export const listNewsEvents = asyncHandler(async (req, res) => {
  const { page, limit, type, q, kind, city, year, outlet, sort } = req.query;
  const data = await service.listNewsEventsService({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    type,
    q,
    kind,
    city,
    year: year ? parseInt(year, 10) : undefined,
    outlet,
    sort,
  });
  res.json({ success: true, ...data });
});

export const getNewsEventBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const item = await service.getNewsEventBySlugService(slug);
  res.json({ success: true, item });
});

export const getEventsGrouped = asyncHandler(async (req, res) => {
  const { page, limit, kind, city, q } = req.query;
  const data = await service.getEventsGroupedService({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    kind,
    city,
    q,
  });
  res.json({ success: true, ...data });
});

export const getMediaCoverage = asyncHandler(async (req, res) => {
  const { page, limit, year, outlet, q, sort } = req.query;
  const data = await service.getMediaCoverageService({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    year: year ? parseInt(year, 10) : undefined,
    outlet,
    q,
    sort,
  });
  res.json({ success: true, ...data });
});

export const getFilterOptions = asyncHandler(async (req, res) => {
  const options = await service.getFilterOptionsService();
  res.json({ success: true, options });
});