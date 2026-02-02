import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  wishlistCount,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

// protected routes
router.post("/add", authMiddleware, addToWishlist);
router.delete("/remove/:productId", authMiddleware, removeFromWishlist);
router.get("/", authMiddleware, getWishlist);
router.get("/count", authMiddleware, wishlistCount);

export default router;
