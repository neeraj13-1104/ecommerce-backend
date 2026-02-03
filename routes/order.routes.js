import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import {
  placeOrder,
  getUserOrders,
  getAllOrdersAdmin,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/place", authMiddleware, placeOrder);
router.get("/my-orders", authMiddleware, getUserOrders);

router.put(
  "/cancel/:orderId",
  authMiddleware,
  allowRoles("superadmin"),
  cancelOrder,
);
router.get(
  "/admin/all",
  authMiddleware,
  allowRoles("superadmin"),
  getAllOrdersAdmin,
);
router.put(
  "/admin/status/:orderId",
  authMiddleware,
  allowRoles("superadmin"),
  updateOrderStatus,
);

export default router;
