import express from "express";
import { addProduct } from "../controllers/product.admin.controller.js";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";


const router = express.Router();

// // router.get("/", getAllProducts); // GET /api/products



// // CATEGORIES
// // router.get("/categories", getCategories);





// // CATEGORY PRODUCTS
// // router.get("/category/:category", getProductsByCategory);






router.post(
  "/add",
  authMiddleware,
  allowRoles("superadmin", "productadmin"),
  upload.single("image"),
  addProduct
);






// // DELETE PRODUCT
// // router.delete(
// //   "/:id",
// //   authMiddleware,
// //   allowRoles("superadmin", "productadmin"),
// //   deleteProduct
// // );





export default router;

