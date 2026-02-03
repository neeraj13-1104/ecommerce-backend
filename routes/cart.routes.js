import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
  applyOfferToProduct
} from "../controllers/cart.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.put("/update", authMiddleware, updateQuantity);
router.delete("/remove", authMiddleware, removeFromCart);

router.post("/apply-offer", authMiddleware, applyOfferToProduct);

export default router;
