import express from "express";
import {
  getProductsForCart,
  getCategories,
  getProductById,
  deleteProductById,
  getProductDetail,
  // getProducts,  // ✅ Add this
} from "../controllers/product.controller.js";

const router = express.Router();
// 🔥 MAIN PRODUCT LIST (SEARCH + CATEGORY)
// router.get("/", getProducts);

router.get("/cart", getProductsForCart);

router.get("/categories", getCategories);
router.get("/:id", getProductById);
router.delete("/:id", deleteProductById); // 👈 DELETE


// GET /api/products/detail/:id
router.get("/detail/:id", getProductDetail);


export default router;
