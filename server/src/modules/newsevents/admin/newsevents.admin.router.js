import { Router } from "express";
import { uploadMiddleware } from "../../../shared/multer.js";
import { authenticated } from "../../../middlewares/authentication.js";
import { authorize } from "../../../middlewares/authorize.js";
import { 
  createNewsEvent, 
  updateNewsEvent, 
  deleteNewsEvent, 
  listAllNewsEvents, 
  getNewsEventById,
  bulkUpdateStatus,
  getAdminStats
} from "./newsevents.admin.controller.js";

const router = Router();

// Apply authentication and admin authorization to all routes
router.use(authenticated);
router.use(authorize(["admin"]));

// Admin routes
router.get("/stats", getAdminStats);                    // GET /api/admin/newsevents/stats
router.get("/", listAllNewsEvents);                     // GET /api/admin/newsevents?page=1&limit=10&type=event&status=published
router.post("/", uploadMiddleware.fields([{ name: "cover", maxCount: 1 }]), createNewsEvent); // POST /api/admin/newsevents
router.get("/:id", getNewsEventById);                   // GET /api/admin/newsevents/:id
router.put("/:id", uploadMiddleware.fields([{ name: "cover", maxCount: 1 }]), updateNewsEvent); // PUT /api/admin/newsevents/:id
router.delete("/:id", deleteNewsEvent);                 // DELETE /api/admin/newsevents/:id
router.patch("/bulk-status", bulkUpdateStatus);         // PATCH /api/admin/newsevents/bulk-status

export default router;