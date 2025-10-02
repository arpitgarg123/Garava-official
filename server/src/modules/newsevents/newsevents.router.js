import { Router } from "express";
import { 
  listNewsEvents, 
  getNewsEventBySlug, 
  getEventsGrouped, 
  getMediaCoverage, 
  getFilterOptions 
} from "./newsevents.controller.js";

const router = Router();

// Public routes
router.get("/", listNewsEvents);                    // GET /api/newsevents?type=event&kind=Event&city=Delhi&page=1&limit=10
router.get("/events/grouped", getEventsGrouped);    // GET /api/newsevents/events/grouped - for upcoming/past separation
router.get("/media-coverage", getMediaCoverage);    // GET /api/newsevents/media-coverage?outlet=Vogue&year=2025
router.get("/filter-options", getFilterOptions);    // GET /api/newsevents/filter-options - for dropdowns
router.get("/:slug", getNewsEventBySlug);          // GET /api/newsevents/:slug

export default router;