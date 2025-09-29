import ApiError from "../../shared/utils/ApiError.js";
import Blog from "./blog.model.js";

const NOW = () => new Date();

/**
 * List public blog posts (published & live)
 */
export const listBlogsService = async ({
  page = 1,
  limit = 10,
  q,
  tag,
  category,
  sort = "newest",
}) => {
  const skip = (page - 1) * limit;

  const filter = {
    isActive: true,
    status: "published",
    $or: [{ publishAt: null }, { publishAt: { $lte: NOW() } }],
  };

  if (q) filter.$text = { $search: q };
  if (tag) filter.tags = new RegExp(`^${tag}$`, "i");
  if (category) filter.category = new RegExp(`^${category}$`, "i");

  const sortMap = {
    newest: { publishAt: -1, createdAt: -1 },
    views: { views: -1 },
  };
  const sortBy = sortMap[sort] || sortMap.newest;

  const [items, total] = await Promise.all([
    Blog.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select("title slug excerpt coverImage tags category publishAt readingTime createdAt")
      .lean(),
    Blog.countDocuments(filter),
  ]);

  return {
    items,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Get blog post by slug (public)
 * - only published + publishAt <= now
 * - atomically increment views
 */
export const getBlogBySlugService = async (slug) => {
  const post = await Blog.findOneAndUpdate(
    {
      slug,
      isActive: true,
      status: "published",
      $or: [{ publishAt: null }, { publishAt: { $lte: NOW() } }],
    },
    { $inc: { views: 1 } },
    { new: true }
  ).lean();

  if (!post) throw new ApiError(404, "Blog post not found");

  return post;
};
