import { Router } from "express";
import { subscribe, unsubscribe, listSubscribers } from "./newsletter.controller.js";
import { authenticated } from "../../middlewares/authentication.js";
import { authorize } from "../../middlewares/authorize.js";

const router = Router();

// Public routes
router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);

// Admin route
router.get("/admin", authenticated, authorize("admin"), listSubscribers);

export default router;
