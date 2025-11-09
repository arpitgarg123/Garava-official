import express from "express";
import { authenticated } from "../../../middlewares/authentication.js";
import { authorize } from "../../../middlewares/authorize.js";
import { uploadMiddleware, documentUploadMiddleware } from "../../../shared/multer.js";

import {
  createBlog,
  updateBlog,
  deleteBlog,
  listBlogsAdmin,
  getBlogByIdAdmin,
  setStatus,
  analyzeDocument,
} from "./blog.admin.controller.js";

const router = express.Router();

router.use(authenticated, authorize("admin"));

// multipart: coverImage (1)
router.post(
  "/",
  uploadMiddleware.fields([{ name: "coverImage", maxCount: 1 }]),
  createBlog
);

router.put(
  "/:id",
  uploadMiddleware.fields([{ name: "coverImage", maxCount: 1 }]),
  updateBlog
);

router.get("/", listBlogsAdmin);
router.get("/:id", getBlogByIdAdmin);
router.delete("/:id", deleteBlog);

// status / schedule
router.patch("/:id/status", setStatus);

// document analysis for auto-fill
router.post(
  "/analyze-document",
  documentUploadMiddleware.single("document"),
  analyzeDocument
);

export default router;
