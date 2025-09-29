import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import * as service from "./blog.service.js";

export const listBlogs = asyncHandler(async (req, res) => {
  const { page, limit, q, tag, category, sort } = req.query;
  const data = await service.listBlogsService({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    q,
    tag,
    category,
    sort,
  });
  res.json({ success: true, ...data });
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const post = await service.getBlogBySlugService(slug);
  res.json({ success: true, post });
});
