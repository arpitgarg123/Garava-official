// src/modules/order/order.admin.routes.js
import express from "express";
import {
  listOrdersAdmin,
  getOrderByIdAdmin,
  updateOrderStatusAdmin,
  refundOrder,
  getDashboardStats,
} from "./order.admin.controller.js";
import { authorize } from "../../../middlewares/authorize.js";
import { authenticated } from "../../../middlewares/authentication.js";


const router = express.Router();

router.use(authenticated, authorize("admin"));

router.get("/stats", getDashboardStats);  // GET /api/admin/orders/stats
router.get("/", listOrdersAdmin);        // GET /api/admin/orders
router.get("/:id", getOrderByIdAdmin);  // GET /api/admin/orders/:id
router.patch("/:id/status", updateOrderStatusAdmin); // PATCH /api/admin/orders/:id/status
// e.g., src/modules/admin/order/order.admin.routes.js
router.post("/:orderId/refund", authenticated,refundOrder);


export default router;
