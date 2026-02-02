import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import {
  createOrder,
  getUserOrders,
  getAllOrdersForAdmin,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = express.Router();

// USER: Create Order
router.post("/", authMiddleware, createOrder);

// USER: Get own orders
router.get("/my-orders", authMiddleware, getUserOrders);

// SUPERADMIN: Get all orders
router.get("/admin/all", authMiddleware, allowRoles("superadmin"), getAllOrdersForAdmin);

// SUPERADMIN: Update order status
router.put("/admin/:orderId/status", authMiddleware, allowRoles("superadmin"), updateOrderStatus);

export default router;
