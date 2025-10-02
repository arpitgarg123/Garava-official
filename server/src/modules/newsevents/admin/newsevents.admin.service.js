import ApiError from "../../../shared/utils/ApiError.js";
import NewsEvents from "../newsevents.model.js";

/**
 * List all news & events for admin (including drafts)
 */
export const listAllNewsEventsService = async ({
  page = 1,
  limit = 10,
  type,
  status,
  q,
  sort = "newest",
}) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (type) filter.type = type;
  if (status) filter.status = status;
  if (q) filter.$text = { $search: q };

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    date: { date: -1 },
    views: { views: -1 },
  };
  const sortBy = sortMap[sort] || sortMap.newest;

  const [items, total] = await Promise.all([
    NewsEvents.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .populate("author", "name email")
      .populate("updatedBy", "name email")
      .lean(),
    NewsEvents.countDocuments(filter),
  ]);

  return {
    items,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Get single news/event for admin (including drafts)
 */
export const getNewsEventByIdService = async (id) => {
  const item = await NewsEvents.findById(id)
    .populate("author", "name email")
    .populate("updatedBy", "name email")
    .lean();

  if (!item) {
    throw new ApiError(404, "News/Event not found");
  }

  return item;
};

/**
 * Create news/event (admin)
 */
export const createNewsEventService = async (data, adminId) => {
  // ensure unique slug
  const exists = await NewsEvents.findOne({ slug: data.slug });
  if (exists) throw new ApiError(409, "Slug already exists");

  const doc = await NewsEvents.create({
    ...data,
    author: adminId,
    updatedBy: adminId,
  });

  return doc;
};

/**
 * Update news/event (admin)
 */
export const updateNewsEventService = async (id, updates, adminId) => {
  const item = await NewsEvents.findById(id);
  if (!item) throw new ApiError(404, "News/Event not found");

  if (updates.slug && updates.slug !== item.slug) {
    const dup = await NewsEvents.findOne({ slug: updates.slug });
    if (dup) throw new ApiError(409, "Slug already exists");
  }

  Object.assign(item, updates);
  item.updatedBy = adminId;
  await item.save();
  return item;
};

/**
 * Delete news/event (admin)
 */
export const deleteNewsEventService = async (id) => {
  const item = await NewsEvents.findById(id);
  if (!item) throw new ApiError(404, "News/Event not found");

  await NewsEvents.findByIdAndDelete(id);
  return { message: "News/Event deleted successfully" };
};

/**
 * Bulk update status (admin)
 */
export const bulkUpdateStatusService = async (ids, status, adminId) => {
  const validStatuses = ["draft", "published", "archived"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const result = await NewsEvents.updateMany(
    { _id: { $in: ids } },
    { status, updatedBy: adminId }
  );

  return { 
    message: `${result.modifiedCount} items updated to ${status}`,
    modifiedCount: result.modifiedCount 
  };
};

/**
 * Get admin stats
 */
export const getAdminStatsService = async () => {
  const [
    totalItems,
    publishedItems,
    draftItems,
    archivedItems,
    eventItems,
    mediaCoverageItems,
    recentItems,
  ] = await Promise.all([
    NewsEvents.countDocuments(),
    NewsEvents.countDocuments({ status: "published" }),
    NewsEvents.countDocuments({ status: "draft" }),
    NewsEvents.countDocuments({ status: "archived" }),
    NewsEvents.countDocuments({ type: "event" }),
    NewsEvents.countDocuments({ type: "media-coverage" }),
    NewsEvents.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title type status createdAt")
      .lean(),
  ]);

  return {
    totals: {
      total: totalItems,
      published: publishedItems,
      draft: draftItems,
      archived: archivedItems,
      events: eventItems,
      mediaCoverage: mediaCoverageItems,
    },
    recent: recentItems,
  };
};