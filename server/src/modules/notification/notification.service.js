import Notification from "./notification.model.js";
import ApiError from "../../shared/utils/ApiError.js";
import mongoose from "mongoose";

/**
 * Create a new notification
 */
export const createNotificationService = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    return notification.toObject();
  } catch (error) {
    throw new ApiError(500, `Failed to create notification: ${error.message}`);
  }
};

/**
 * Get notifications with filtering and pagination
 */
export const getNotificationsService = async ({
  page = 1,
  limit = 20,
  type,
  severity,
  isRead,
  actionRequired,
  productId
} = {}) => {
  try {
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = {};
    if (type) filter.type = type;
    if (severity) filter.severity = severity;
    if (typeof isRead === 'boolean') filter.isRead = isRead;
    if (typeof actionRequired === 'boolean') filter.actionRequired = actionRequired;
    if (productId && mongoose.isValidObjectId(productId)) filter.productId = productId;

    // Execute query with population
    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('productId', 'name slug heroImage')
        .populate('userId', 'firstName lastName email')
        .populate('actionBy', 'firstName lastName')
        .lean(),
      Notification.countDocuments(filter)
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  } catch (error) {
    throw new ApiError(500, `Failed to fetch notifications: ${error.message}`);
  }
};

/**
 * Get notification by ID
 */
export const getNotificationByIdService = async (notificationId) => {
  try {
    if (!mongoose.isValidObjectId(notificationId)) {
      throw new ApiError(400, "Invalid notification ID");
    }

    const notification = await Notification.findById(notificationId)
      .populate('productId', 'name slug heroImage variants')
      .populate('userId', 'firstName lastName email')
      .populate('actionBy', 'firstName lastName')
      .lean();

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    return notification;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Failed to fetch notification: ${error.message}`);
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsReadService = async (notificationId) => {
  try {
    if (!mongoose.isValidObjectId(notificationId)) {
      throw new ApiError(400, "Invalid notification ID");
    }

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { 
        isRead: true
      },
      { new: true }
    ).lean();

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    return notification;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Failed to mark notification as read: ${error.message}`);
  }
};

/**
 * Mark notifications as read in bulk
 */
export const markNotificationsAsReadService = async (notificationIds) => {
  try {
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      throw new ApiError(400, "Invalid notification IDs array");
    }

    // Validate all IDs
    const validIds = notificationIds.filter(id => mongoose.isValidObjectId(id));
    if (validIds.length === 0) {
      throw new ApiError(400, "No valid notification IDs provided");
    }

    const result = await Notification.updateMany(
      { _id: { $in: validIds } },
      { isRead: true }
    );

    return {
      updated: result.modifiedCount,
      total: validIds.length
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Failed to mark notifications as read: ${error.message}`);
  }
};

/**
 * Mark action taken on notification
 */
export const markActionTakenService = async (notificationId, actionBy, actionNotes = '') => {
  try {
    if (!mongoose.isValidObjectId(notificationId)) {
      throw new ApiError(400, "Invalid notification ID");
    }
    if (!mongoose.isValidObjectId(actionBy)) {
      throw new ApiError(400, "Invalid actionBy user ID");
    }

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      {
        actionTaken: true,
        actionBy,
        actionAt: new Date(),
        actionNotes: actionNotes.trim(),
        isRead: true // Mark as read when action is taken
      },
      { new: true }
    ).lean();

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    return notification;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Failed to mark action taken: ${error.message}`);
  }
};

/**
 * Delete notification
 */
export const deleteNotificationService = async (notificationId) => {
  try {
    if (!mongoose.isValidObjectId(notificationId)) {
      throw new ApiError(400, "Invalid notification ID");
    }

    const notification = await Notification.findByIdAndDelete(notificationId).lean();

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    return { message: "Notification deleted successfully" };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, `Failed to delete notification: ${error.message}`);
  }
};

/**
 * Get notification statistics
 */
export const getNotificationStatsService = async () => {
  try {
    const stats = await Notification.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: { $sum: { $cond: [{ $eq: ["$isRead", false] }, 1, 0] } },
          actionRequired: { $sum: { $cond: [{ $eq: ["$actionRequired", true] }, 1, 0] } },
          critical: { $sum: { $cond: [{ $eq: ["$severity", "critical"] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ["$severity", "high"] }, 1, 0] } },
          outOfStock: { $sum: { $cond: [{ $eq: ["$type", "out_of_stock"] }, 1, 0] } },
          lowStock: { $sum: { $cond: [{ $eq: ["$type", "low_stock"] }, 1, 0] } }
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      unread: 0,
      actionRequired: 0,
      critical: 0,
      high: 0,
      outOfStock: 0,
      lowStock: 0
    };
  } catch (error) {
    throw new ApiError(500, `Failed to fetch notification statistics: ${error.message}`);
  }
};

/**
 * Create out-of-stock notification
 */
export const createOutOfStockNotificationService = async (productData, variantData) => {
  try {
    // Check if notification already exists for this product/variant
    const existingNotification = await Notification.findOne({
      type: "out_of_stock",
      productId: productData._id,
      variantId: variantData._id,
      actionTaken: false
    }).lean();

    if (existingNotification) {
      // Update existing notification with latest info
      return await Notification.findByIdAndUpdate(
        existingNotification._id,
        {
          message: `${productData.name} (${variantData.sizeLabel}) is still out of stock`,
          metadata: {
            ...existingNotification.metadata,
            stockLevel: variantData.stock || 0,
            lastUpdated: new Date()
          }
        },
        { new: true }
      ).lean();
    }

    // Create new notification
    return await Notification.createOutOfStockNotification(productData, variantData);
  } catch (error) {
    throw new ApiError(500, `Failed to create out-of-stock notification: ${error.message}`);
  }
};

/**
 * Create low stock notification
 */
export const createLowStockNotificationService = async (productData, variantData, threshold = 5) => {
  try {
    // Only create if stock is actually low
    if (variantData.stock > threshold) {
      return null;
    }

    // Check if notification already exists for this product/variant
    const existingNotification = await Notification.findOne({
      type: "low_stock",
      productId: productData._id,
      variantId: variantData._id,
      actionTaken: false
    }).lean();

    if (existingNotification) {
      // Update existing notification
      return await Notification.findByIdAndUpdate(
        existingNotification._id,
        {
          message: `${productData.name} (${variantData.sizeLabel}) has only ${variantData.stock} items left`,
          metadata: {
            ...existingNotification.metadata,
            stockLevel: variantData.stock,
            lastUpdated: new Date()
          }
        },
        { new: true }
      ).lean();
    }

    // Create new notification
    return await Notification.createLowStockNotification(productData, variantData, threshold);
  } catch (error) {
    throw new ApiError(500, `Failed to create low stock notification: ${error.message}`);
  }
};