import { Router } from "express";
import {
  listProducts,
  getProductBySlug,
  getProductBySku,
  checkPincode,
} from "./product.controller.js";

const router = Router();


router.get("/", listProducts); // GET /api/products
router.get("/:slug", getProductBySlug); // GET /api/products/:slug
router.get("/sku/:sku", getProductBySku); // GET /api/products/sku/:sku
router.post("/check-pincode", checkPincode); // POST /api/products/check-pincode

export default router;
