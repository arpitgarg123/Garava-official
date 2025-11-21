import User from "../user.model.js";
import Order from "../../order/order.model.js";
import Newsletter from "../../newsletter/newsletter.model.js";
import ApiError from "../../../shared/utils/ApiError.js";

/**
 * Get list of customers with order statistics
 */
export const listCustomersAdminService = async ({ page = 1, limit = 20, search, orderCountMin, orderCountMax, newsletter }) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 20;
  const skip = (pageNum - 1) * limitNum;

  // Build match filter - exclude admins
  const matchFilter = { role: { $ne: 'admin' } };
  
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    matchFilter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { phone: searchRegex }
    ];
  }

  // Build aggregation pipeline
  const pipeline = [
    { $match: matchFilter },
    // Lookup orders
    {
      $lookup: {
        from: 'orders',
        localField: '_id',
        foreignField: 'user',
        as: 'orders'
      }
    },
    // Lookup newsletter
    {
      $lookup: {
        from: 'newsletters',
        localField: 'email',
        foreignField: 'email',
        as: 'newsletter'
      }
    },
    // Add computed fields
    {
      $addFields: {
        totalOrders: { $size: '$orders' },
        totalSpent: { $sum: '$orders.grandTotal' },
        lastOrderDate: { $max: '$orders.createdAt' },
        isNewsletterSubscriber: { 
          $cond: [
            { $gt: [{ $size: '$newsletter' }, 0] },
            true,
            false
          ]
        }
      }
    }
  ];

  // Add order count filter
  if (orderCountMin !== undefined || orderCountMax !== undefined) {
    const orderCountFilter = {};
    if (orderCountMin !== undefined) orderCountFilter.$gte = parseInt(orderCountMin);
    if (orderCountMax !== undefined) orderCountFilter.$lte = parseInt(orderCountMax);
    pipeline.push({ $match: { totalOrders: orderCountFilter } });
  }

  // Add newsletter filter
  if (newsletter !== undefined) {
    const newsletterValue = newsletter === 'true' || newsletter === true;
    pipeline.push({ $match: { isNewsletterSubscriber: newsletterValue } });
  }

  // Add projection to exclude sensitive data
  pipeline.push({
    $project: {
      password: 0,
      refreshTokens: 0,
      orders: 0,
      newsletter: 0,
      googleId: 0
    }
  });

  // Add sort (newest first)
  pipeline.push({ $sort: { createdAt: -1 } });

  // Execute aggregation with pagination
  const [customers, totalResult] = await Promise.all([
    User.aggregate([...pipeline, { $skip: skip }, { $limit: limitNum }]),
    User.aggregate([...pipeline, { $count: 'total' }])
  ]);

  const total = totalResult[0]?.total || 0;

  return {
    customers,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    }
  };
};

/**
 * Get customer statistics for dashboard
 */
export const getCustomerStatsService = async () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalCustomers, newThisMonth, activeCustomers, newsletterCount] = await Promise.all([
    User.countDocuments({ role: { $ne: 'admin' } }),
    User.countDocuments({ role: { $ne: 'admin' }, createdAt: { $gte: startOfMonth } }),
    Order.distinct('user', { createdAt: { $gte: thirtyDaysAgo } }).then(users => users.length),
    Newsletter.countDocuments({ status: 'subscribed' })
  ]);

  return {
    totalCustomers,
    newThisMonth,
    activeCustomers,
    newsletterSubscribers: newsletterCount
  };
};

/**
 * Get single customer details with full order history
 */
export const getCustomerByIdAdminService = async (customerId) => {
  const customer = await User.findOne({ _id: customerId, role: { $ne: 'admin' } })
    .select('-password -refreshTokens')
    .lean();

  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  // Get customer orders
  const orders = await Order.find({ user: customerId })
    .populate('items.product', 'name slug heroImage')
    .sort({ createdAt: -1 })
    .lean();

  // Get newsletter status
  const newsletter = await Newsletter.findOne({ email: customer.email }).lean();

  // Calculate stats
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.grandTotal || 0), 0);
  const lastOrderDate = orders[0]?.createdAt || null;

  return {
    ...customer,
    totalOrders,
    totalSpent,
    lastOrderDate,
    isNewsletterSubscriber: !!newsletter,
    orders
  };
};
