import express from "express";
import { signup, login ,   forgotPassword,
resetPassword , googleLogin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/google-login", googleLogin);

export default router;
