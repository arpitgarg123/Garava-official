import ApiError from "../../shared/utils/ApiError.js";
import NewsEvents from "./newsevents.model.js";

const NOW = () => new Date();

/**
 * List public news & events (published & live)
 */
export const listNewsEventsService = async ({
  page = 1,
  limit = 10,
  type, // "event" or "media-coverage" 
  q,
  kind, // "Event" or "News" (for events only)
  city,
  year,
  outlet, // for media coverage
  sort = "newest",
}) => {
  const skip = (page - 1) * limit;

  const filter = {
    isActive: true,
    status: "published",
    $or: [{ publishAt: null }, { publishAt: { $lte: NOW() } }],
  };

  if (type) filter.type = type;
  if (q) filter.$text = { $search: q };
  if (kind) filter.kind = kind;
  if (city) filter.city = new RegExp(`^${city}$`, "i");
  if (outlet) filter.outlet = new RegExp(`^${outlet}$`, "i");
  if (year) {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
    filter.date = { $gte: startDate, $lte: endDate };
  }

  const sortMap = {
    newest: { date: -1, createdAt: -1 },
    oldest: { date: 1, createdAt: 1 },
    views: { views: -1 },
  };
  const sortBy = sortMap[sort] || sortMap.newest;

  const [items, total] = await Promise.all([
    NewsEvents.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select("title slug excerpt cover type kind date city location rsvpUrl outlet url views createdAt")
      .lean(),
    NewsEvents.countDocuments(filter),
  ]);

  return {
    items,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Get single news/event by slug
 */
export const getNewsEventBySlugService = async (slug) => {
  const item = await NewsEvents.findOne({ 
    slug, 
    isActive: true, 
    status: "published",
    $or: [{ publishAt: null }, { publishAt: { $lte: NOW() } }],
  })
    .populate("author", "name email")
    .lean();

  if (!item) {
    throw new ApiError(404, "News/Event not found");
  }

  // Increment views
  await NewsEvents.findByIdAndUpdate(item._id, { $inc: { views: 1 } });

  return item;
};

/**
 * Get events grouped by upcoming/past
 */
export const getEventsGroupedService = async ({
  page = 1,
  limit = 10,
  kind,
  city,
  q,
}) => {
  const now = NOW();
  const skip = (page - 1) * limit;

  const baseFilter = {
    isActive: true,
    status: "published",
    type: "event",
    $or: [{ publishAt: null }, { publishAt: { $lte: now } }],
  };

  if (q) baseFilter.$text = { $search: q };
  if (kind) baseFilter.kind = kind;
  if (city) baseFilter.city = new RegExp(`^${city}$`, "i");

  const [upcomingItems, pastItems, upcomingTotal, pastTotal] = await Promise.all([
    NewsEvents.find({ ...baseFilter, date: { $gte: now } })
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)
      .select("title slug excerpt cover kind date city location rsvpUrl views createdAt")
      .lean(),
    NewsEvents.find({ ...baseFilter, date: { $lt: now } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .select("title slug excerpt cover kind date city location rsvpUrl views createdAt")
      .lean(),
    NewsEvents.countDocuments({ ...baseFilter, date: { $gte: now } }),
    NewsEvents.countDocuments({ ...baseFilter, date: { $lt: now } }),
  ]);

  return {
    upcoming: {
      items: upcomingItems,
      pagination: { total: upcomingTotal, page, limit, totalPages: Math.ceil(upcomingTotal / limit) },
    },
    past: {
      items: pastItems,
      pagination: { total: pastTotal, page, limit, totalPages: Math.ceil(pastTotal / limit) },
    },
  };
};

/**
 * Get media coverage by year/outlet
 */
export const getMediaCoverageService = async ({
  page = 1,
  limit = 10,
  year,  
  outlet,
  q,
  sort = "newest",
}) => {
  const skip = (page - 1) * limit;

  const filter = {
    isActive: true,
    status: "published",
    type: "media-coverage",
    $or: [{ publishAt: null }, { publishAt: { $lte: NOW() } }],
  };

  if (q) filter.$text = { $search: q };
  if (outlet) filter.outlet = new RegExp(`^${outlet}$`, "i");
  if (year) {
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
    filter.date = { $gte: startDate, $lte: endDate };
  }

  const sortMap = {
    newest: { date: -1, createdAt: -1 },
    oldest: { date: 1, createdAt: 1 },
    views: { views: -1 },
  };
  const sortBy = sortMap[sort] || sortMap.newest;

  const [items, total] = await Promise.all([
    NewsEvents.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select("title slug excerpt cover outlet url date views createdAt")
      .lean(),
    NewsEvents.countDocuments(filter),
  ]);

  return {
    items,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Get filter options for UI
 */
export const getFilterOptionsService = async () => {
  const [cities, outlets, years, kinds] = await Promise.all([
    NewsEvents.distinct("city", { isActive: true, status: "published", type: "event" }),
    NewsEvents.distinct("outlet", { isActive: true, status: "published", type: "media-coverage" }),
    NewsEvents.aggregate([
      { $match: { isActive: true, status: "published" } },
      { $group: { _id: { $year: "$date" } } },
      { $sort: { _id: -1 } },
    ]),
    NewsEvents.distinct("kind", { isActive: true, status: "published", type: "event" }),
  ]);

  return {
    cities: cities.filter(Boolean).sort(),
    outlets: outlets.filter(Boolean).sort(),
    years: years.map(y => y._id).filter(Boolean),
    kinds: kinds.filter(Boolean).sort(),
  };
};