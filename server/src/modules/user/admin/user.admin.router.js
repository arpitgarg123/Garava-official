import express from "express";
import { listCustomersAdmin, getCustomerStats, getCustomerById } from "./user.admin.controller.js";
import { authenticated } from "../../../middlewares/authentication.js";
import { authorize } from "../../../middlewares/authorize.js";

const router = express.Router();

// All routes require admin authentication
router.use(authenticated);
router.use(authorize('admin'));
// GET /api/admin/customers/stats - Get customer statistics
router.get("/stats", getCustomerStats);

// GET /api/admin/customers/:id - Get single customer
router.get("/:id", getCustomerById);

// GET /api/admin/customers - List all customers
router.get("/", listCustomersAdmin);

export default router;
