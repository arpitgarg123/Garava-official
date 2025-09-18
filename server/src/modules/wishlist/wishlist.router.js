import { Router } from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
} from "./wishlist.controller.js";
import { authenticated } from "../../middlewares/authentication.js";

const router = Router();
router.use(authenticated);

// GET /api/wishlist
router.get("/", getWishlist);

// POST /api/wishlist/:productId
router.post("/:productId", addToWishlist);

// DELETE /api/wishlist/:productId
router.delete("/:productId", removeFromWishlist);


router.post("/toggle/:productId", toggleWishlist);

export default router;
