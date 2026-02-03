import express from "express";
import { addProduct , updateProduct} from "../controllers/product.admin.controller.js";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";


const router = express.Router();



router.post(
  "/add",
  authMiddleware,
  allowRoles("superadmin", "productadmin"),
  upload.single("image"),
  addProduct
);
// ✅ EDIT PRODUCT (SIMPLE)
router.put(
  "/edit/:id",
  authMiddleware,
  allowRoles("superadmin", "productadmin"),
  upload.single("image"),
  updateProduct
);


export default router;

