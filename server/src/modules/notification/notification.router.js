import express from "express";
import * as notificationController from "./notification.controller.js";
import { authenticated } from "../../middlewares/authentication.js";
import { authorize } from "../../middlewares/authorize.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticated);

// Apply admin authorization to all routes
router.use(authorize(['admin', 'super_admin']));

/**  
 * @swagger
 * /api/admin/notifications/stats:
 *   get:
 *     summary: Get notification statistics
 *     tags: [Admin - Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/stats", notificationController.getNotificationStats);

/**
 * @swagger
 * /api/admin/notifications/unread-count:
 *   get:
 *     summary: Get unread notifications count
 *     tags: [Admin - Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved successfully
 */
router.get("/unread-count", notificationController.getUnreadCount);

/**
 * @swagger
 * /api/admin/notifications/read-bulk:
 *   patch:
 *     summary: Mark multiple notifications as read
 *     tags: [Admin - Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of notification IDs to mark as read
 *     responses:
 *       200:
 *         description: Notifications marked as read successfully
 */
router.patch("/read-bulk", notificationController.markNotificationsAsRead);

/**
 * @swagger
 * /api/admin/notifications:
 *   get:
 *     summary: Get notifications with filtering and pagination
 *     tags: [Admin - Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [out_of_stock, low_stock, order_placed, payment_failed, system]
 *         description: Filter by notification type
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *           enum: [low, medium, high, critical]
 *         description: Filter by severity level
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: boolean
 *         description: Filter by read status
 *       - in: query
 *         name: actionRequired
 *         schema:
 *           type: boolean
 *         description: Filter by action required status
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *         description: Filter by product ID
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *   post:
 *     summary: Create a manual notification
 *     tags: [Admin - Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - title
 *               - message
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [out_of_stock, low_stock, order_placed, payment_failed, system]
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               severity:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *                 default: medium
 *               productId:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Notification created successfully
 */
router
  .route("/")
  .get(notificationController.getNotifications)
  .post(notificationController.createNotification);

/**
 * @swagger
 * /api/admin/notifications/{id}:
 *   get:
 *     summary: Get notification by ID
 *     tags: [Admin - Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification retrieved successfully
 *       404:
 *         description: Notification not found
 *   delete:
 *     summary: Delete notification
 *     tags: [Admin - Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 */
router
  .route("/:id")
  .get(notificationController.getNotificationById)
  .delete(notificationController.deleteNotification);

/**
 * @swagger
 * /api/admin/notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Admin - Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 */
router.patch("/:id/read", notificationController.markNotificationAsRead);

/**
 * @swagger
 * /api/admin/notifications/{id}/action:
 *   patch:
 *     summary: Mark action taken on notification
 *     tags: [Admin - Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actionNotes:
 *                 type: string
 *                 description: Notes about the action taken
 *     responses:
 *       200:
 *         description: Action marked as taken
 *       404:
 *         description: Notification not found
 */
router.patch("/:id/action", notificationController.markActionTaken);

export default router;