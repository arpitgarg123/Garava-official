import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "./cart.controller.js";
import { authenticated } from "../../middlewares/authentication.js";

const router = Router();

router.use(authenticated);

router.get("/", getCart);                 // GET /api/cart
router.post("/", addToCart);              // POST /api/cart
router.put("/", updateCartItem);          // PUT /api/cart
// remove single item (query params)
router.delete("/item", removeCartItem);   // DELETE /api/cart/item?productId=..&variantSku=..
// clear all
router.delete("/", clearCart);            // DELETE /api/cart

export default router;
