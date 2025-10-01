import ApiError from "../../../shared/utils/ApiError.js";
import Blog from "../blog.model.js";

const computeReadingTime = (content = "") => {
  const words = String(content).replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

/**
 * Create blog (admin)
 */
export const createBlogService = async (data, adminId) => {
  // ensure unique slug
  const exists = await Blog.findOne({ slug: data.slug });
  if (exists) throw new ApiError(409, "Slug already exists");

  const readingTime = computeReadingTime(data.content);

  const doc = await Blog.create({
    ...data,
    readingTime,
    author: adminId,
    updatedBy: adminId,
  });

  return doc;
};

/**
 * Update blog (admin)
 */
export const updateBlogService = async (id, updates, adminId) => {
  const post = await Blog.findById(id);
  if (!post) throw new ApiError(404, "Blog post not found");

  if (updates.slug && updates.slug !== post.slug) {
    const dup = await Blog.findOne({ slug: updates.slug });
    if (dup) throw new ApiError(409, "Slug already exists");
  }

  if (typeof updates.content === "string") {
    updates.readingTime = computeReadingTime(updates.content);
  }

  Object.assign(post, updates);
  post.updatedBy = adminId;
  await post.save();
  return post;
};

/**
 * Get blog by ID (admin)
 */
export const getBlogByIdService = async (id) => {
  const post = await Blog.findById(id).populate('author', 'name email').lean();
  if (!post) throw new ApiError(404, "Blog post not found");
  return post;
};

/**
 * Soft delete (archive)
 */
export const deleteBlogService = async (id) => {
  const post = await Blog.findById(id);
  if (!post) throw new ApiError(404, "Blog post not found");
  post.isActive = false;
  post.status = "archived";
  await post.save();
  return true;
};

/**
 * List for admin (include drafts, filters)
 */
export const listBlogsAdminService = async ({ page=1, limit=20, q, status, tag, category }) => {
  const skip = (page - 1) * limit;
  const filter = {};
  if (q) filter.$text = { $search: q };
  if (status) filter.status = status;
  if (tag) filter.tags = new RegExp(`^${tag}$`, "i");
  if (category) filter.category = new RegExp(`^${category}$`, "i");

  const [items, total] = await Promise.all([
    Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Blog.countDocuments(filter),
  ]);

  return { items, pagination: { total, page, limit, totalPages: Math.ceil(total/limit) } };
};

/**
 * Publish helpers
 */
export const setStatusService = async (id, { status, publishAt }) => {
  const post = await Blog.findById(id);
  if (!post) throw new ApiError(404, "Blog post not found");

  if (status) post.status = status;
  if (publishAt !== undefined) post.publishAt = publishAt ? new Date(publishAt) : null;

  await post.save();
  return post;
};
