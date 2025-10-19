// src/modules/admin/product/product.admin.routes.js
import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  listProductsAdmin,
  addVariant,
  updateVariant, 
  patchStock,
} from "./product.admin.controller.js";
import { authenticated } from "../../../middlewares/authentication.js";
import { authorize } from "../../../middlewares/authorize.js";
import { uploadMiddleware } from "../../../shared/multer.js";


const router = express.Router();

// Protect all admin product routes
router.use(authenticated, authorize("admin"));

router.post(
  "/",
  uploadMiddleware.any(), // Accept any field names including dynamic colorVariant_X_heroImage/gallery
  createProduct
);
router.put(
  "/:id",
  uploadMiddleware.any(), // Accept any field names including dynamic colorVariant_X_heroImage/gallery
  updateProduct
);

router.get("/", listProductsAdmin);             // GET /api/admin/products
router.delete("/:id", deleteProduct);           // DELETE /api/admin/products/:id

// variants
router.post("/:id/variants", addVariant);               // POST /api/admin/products/:id/variants
router.put("/:id/variants/:variantId", updateVariant); // PUT /api/admin/products/:id/variants/:variantId

// stock
router.patch("/:id/stock", patchStock);                // PATCH /api/admin/products/:id/stock

export default router;
