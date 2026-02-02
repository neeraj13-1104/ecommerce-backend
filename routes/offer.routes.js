import express from "express";
import {
  createCategoryOffer,
  getActiveCategoryOffers,
  getCategoryOfferCount,
  deleteCategoryOffer
} from "../controllers/offer.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import upload from "../middleware/upload.js";


const router = express.Router();

/* ===== SUPER ADMIN ONLY ===== */
router.post(
  "/category/create",
  authMiddleware,
  allowRoles("superadmin"),
  upload.single("bannerImage"), // 🔥 THIS WAS MISSING
  createCategoryOffer
);

/* ===== FRONTEND ===== */
router.get("/category/active", getActiveCategoryOffers);
router.get("/category/count", getCategoryOfferCount);

router.delete("/category/:id", deleteCategoryOffer);



export default router;
