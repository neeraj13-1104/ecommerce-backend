import express from "express";
import carouselUpload from "../middleware/carouselUpload.js";
import {
  addCarousel,
  getCarousel,
  deleteCarousel,
} from "../controllers/carousel.controller.js";
import { allowRoles } from "../middleware/role.middleware.js";

import authMiddleware from "../middleware/auth.middleware.js";


const router = express.Router();


// FRONTEND
router.get("/", getCarousel);

// SUPERADMIN
router.post(
  "/add",
  authMiddleware,
  allowRoles("superadmin"),
  carouselUpload.single("image"),
  addCarousel
);

router.delete(
  "/:id",
  authMiddleware,
  allowRoles("superadmin"),
  deleteCarousel
);


export default router;
