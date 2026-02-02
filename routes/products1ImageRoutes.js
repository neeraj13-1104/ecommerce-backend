import express from "express";
import { downloadProductImages } from "../controllers/products1ImageController.js";

const router = express.Router();

router.post("/download-images", downloadProductImages);

export default router;
