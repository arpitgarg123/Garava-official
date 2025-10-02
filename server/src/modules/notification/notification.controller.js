import {asyncHandler} from "../../shared/utils/asyncHandler.js";
import * as notificationService from "./notification.service.js";

/**
 * @desc    Get notifications with filtering and pagination
 * @route   GET /api/admin/notifications
 * @access  Admin
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    type,
    severity,
    isRead,
    actionRequired,
    productId
  } = req.query;

  // Convert string booleans to actual booleans
  const filters = {
    page: parseInt(page),
    limit: parseInt(limit),
    type,
    severity,
    productId
  };

  if (isRead !== undefined) {
    filters.isRead = isRead === 'true';
  }
  if (actionRequired !== undefined) {
    filters.actionRequired = actionRequired === 'true';
  }

  const result = await notificationService.getNotificationsService(filters);

  res.status(200).json({
    success: true,
    message: "Notifications retrieved successfully",
    data: result
  });
});

/**
 * @desc    Get notification by ID
 * @route   GET /api/admin/notifications/:id
 * @access  Admin
 */
export const getNotificationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await notificationService.getNotificationByIdService(id);

  res.status(200).json({
    success: true,
    message: "Notification retrieved successfully",
    data: { notification }
  });
});

/**
 * @desc    Mark notification as read
 * @route   PATCH /api/admin/notifications/:id/read
 * @access  Admin
 */
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await notificationService.markNotificationAsReadService(id);

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
    data: { notification }
  });
});

/**
 * @desc    Mark multiple notifications as read
 * @route   PATCH /api/admin/notifications/read-bulk
 * @access  Admin
 */
export const markNotificationsAsRead = asyncHandler(async (req, res) => {
  const { notificationIds } = req.body;

  if (!Array.isArray(notificationIds)) {
    return res.status(400).json({
      success: false,
      message: "notificationIds must be an array"
    });
  }

  const result = await notificationService.markNotificationsAsReadService(notificationIds);

  res.status(200).json({
    success: true,
    message: `Marked ${result.updated} notifications as read`,
    data: result
  });
});

/**
 * @desc    Mark action taken on notification
 * @route   PATCH /api/admin/notifications/:id/action
 * @access  Admin
 */
export const markActionTaken = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { actionNotes = '' } = req.body;
  const actionBy = req.user.id; // Assuming user is attached by auth middleware

  const notification = await notificationService.markActionTakenService(id, actionBy, actionNotes);

  res.status(200).json({
    success: true,
    message: "Action marked as taken",
    data: { notification }
  });
});

/**
 * @desc    Delete notification
 * @route   DELETE /api/admin/notifications/:id
 * @access  Admin
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await notificationService.deleteNotificationService(id);

  res.status(200).json({
    success: true,
    message: result.message
  });
});

/**
 * @desc    Get notification statistics
 * @route   GET /api/admin/notifications/stats
 * @access  Admin
 */
export const getNotificationStats = asyncHandler(async (req, res) => {
  const stats = await notificationService.getNotificationStatsService();

  res.status(200).json({
    success: true,
    message: "Notification statistics retrieved successfully",
    data: { stats }
  });
});

/**
 * @desc    Create manual notification (for testing/admin use)
 * @route   POST /api/admin/notifications
 * @access  Admin
 */
export const createNotification = asyncHandler(async (req, res) => {
  const notificationData = req.body;
  const notification = await notificationService.createNotificationService(notificationData);

  res.status(201).json({
    success: true,
    message: "Notification created successfully",
    data: { notification }
  });
});

/**
 * @desc    Get unread notifications count
 * @route   GET /api/admin/notifications/unread-count
 * @access  Admin
 */
export const getUnreadCount = asyncHandler(async (req, res) => {
  const result = await notificationService.getNotificationsService({
    isRead: false,
    limit: 1
  });

  res.status(200).json({
    success: true,
    data: { 
      unreadCount: result.pagination.total 
    }
  });
});