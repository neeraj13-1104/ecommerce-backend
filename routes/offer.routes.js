import express from "express";
import {
  createCategoryOffer,
  getActiveCategoryOffers,
  getCategoryOfferCount,
  deleteCategoryOffer,
  getProductsByCategoryOffer
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
router.get("/active", getActiveCategoryOffers);
router.get("/category/count", getCategoryOfferCount);

router.delete("/category/:id", deleteCategoryOffer);



router.get(
  "/category-offer/:offerId/products",
  getProductsByCategoryOffer
);


export default router;
