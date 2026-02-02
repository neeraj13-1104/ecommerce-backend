import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import { createProductAdmin } from "../controllers/admin.controller.js";

const router = express.Router();

// ONLY SUPER ADMIN
router.post(
  "/create-product-admin",
  authMiddleware,
  allowRoles("superadmin"),
  createProductAdmin
);

export default router;
