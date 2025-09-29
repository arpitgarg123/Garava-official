import { Router } from "express";
import { listBlogs, getBlogBySlug } from "./blog.controller.js";

const router = Router();

router.get("/", listBlogs);         // GET /api/blog?tag=&q=&page=&limit=&sort=
router.get("/:slug", getBlogBySlug);// GET /api/blog/:slug

export default router;
