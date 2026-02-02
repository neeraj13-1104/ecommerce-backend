import express from "express";
import { getAllUsers, adminLogin } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getAllUsers); // GET /api/users
// ADMIN LOGIN
router.post("/admin/login", adminLogin);


export default router;
